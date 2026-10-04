import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PROFILE } from '@/lib/data';
import { RateLimiter, validateContact } from '@/lib/contact';
export const runtime = 'nodejs';
const limiter = new RateLimiter();
const respond = (message: string, status: number) =>
  NextResponse.json({ message }, { status, headers: { 'Cache-Control': 'no-store' } });
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  let expected: string;
  try {
    expected = process.env.SITE_URL ? new URL(process.env.SITE_URL).origin : request.nextUrl.origin;
  } catch {
    return respond('Contact is temporarily unavailable. Please use the email link.', 503);
  }
  if (!origin || origin !== expected)
    return respond('Please send your message from this website.', 403);
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))
    return respond('Please submit a valid contact form.', 415);
  const key =
    process.env.TRUST_PROXY === 'true'
      ? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim().slice(0, 80) || 'direct'
      : 'direct';
  if (!limiter.consume(key))
    return respond('Too many messages. Please try again in 10 minutes or use the email link.', 429);
  if (Number(request.headers.get('content-length') ?? 0) > 20000)
    return respond('Your message is too long.', 413);
  let value: unknown;
  try {
    // Enforce the byte limit even when Content-Length is absent or inaccurate.
    const reader = request.body?.getReader();
    if (!reader) return respond('Please complete the form.', 400);
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const result = await reader.read();
      if (result.done) break;
      length += result.value.byteLength;
      if (length > 20000) {
        await reader.cancel();
        return respond('Your message is too long.', 413);
      }
      chunks.push(result.value);
    }
    const body = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.length;
    }
    value = JSON.parse(new TextDecoder().decode(body));
  } catch {
    return respond('Please submit a valid contact form.', 400);
  }
  const data = validateContact(value);
  if (!data)
    return respond(
      'Please enter a name, a valid email, and a message of 10–5,000 characters.',
      400,
    );
  if (data.website) return respond('Unable to submit this form. Please use the email link.', 400);
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_PORT, SMTP_SECURE } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM)
    return respond(
      'The contact form is not connected yet. Please email ' + PROFILE.email + '.',
      503,
    );
  const port = Number(SMTP_PORT || 465);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    return respond('Contact is temporarily unavailable. Please use the email link.', 503);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: SMTP_SECURE ? SMTP_SECURE === 'true' : port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  try {
    const result = await transporter.sendMail({
      from: SMTP_FROM,
      to: process.env.CONTACT_TO || PROFILE.email,
      replyTo: { name: data.name, address: data.email },
      subject: `Portfolio enquiry from ${data.name}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
    });
    if (!result.accepted?.length)
      return respond('Your message could not be delivered. Please use the email link.', 502);
    return respond('Message sent. Thank you for getting in touch!', 200);
  } catch {
    return respond('Your message could not be sent. Please try again or use the email link.', 502);
  } finally {
    transporter.close();
  }
}
