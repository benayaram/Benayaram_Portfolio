// Exercises the real HTTP route against a local SMTP sink; no external mail.
import net from 'node:net';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const messages = [];
const sockets = new Set();
const smtp = net.createServer((socket) => {
  sockets.add(socket);
  socket.on('close', () => sockets.delete(socket));
  socket.write('220 localhost test SMTP\r\n');
  let buffer = '',
    data = false,
    message = '';
  socket.on('data', (chunk) => {
    buffer += chunk.toString();
    let index;
    while ((index = buffer.indexOf('\r\n')) >= 0) {
      const line = buffer.slice(0, index);
      buffer = buffer.slice(index + 2);
      if (data) {
        if (line === '.') {
          messages.push(message);
          message = '';
          data = false;
          socket.write('250 Message accepted\r\n');
        } else message += line + '\r\n';
        continue;
      }
      if (/^EHLO|^HELO/.test(line)) socket.write('250-localhost\r\n250 AUTH PLAIN\r\n');
      else if (/^AUTH/.test(line)) socket.write('235 Authenticated\r\n');
      else if (/^MAIL|^RCPT|^RSET/.test(line)) socket.write('250 OK\r\n');
      else if (/^DATA/.test(line)) {
        data = true;
        socket.write('354 End with dot\r\n');
      } else if (/^QUIT/.test(line)) {
        socket.end('221 Bye\r\n');
      } else socket.write('250 OK\r\n');
    }
  });
});
await new Promise((resolve) => smtp.listen(2526, '127.0.0.1', resolve));
const origin = 'http://127.0.0.1:3101';
const app = spawn(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3101'],
  {
    env: {
      ...process.env,
      SITE_URL: origin,
      SMTP_HOST: '127.0.0.1',
      SMTP_PORT: '2526',
      SMTP_SECURE: 'false',
      SMTP_USER: 'local-test',
      SMTP_PASS: 'local-test',
      SMTP_FROM: 'portfolio@example.test',
      CONTACT_TO: 'recipient@example.test',
      TRUST_PROXY: 'true',
    },
    stdio: 'inherit',
    windowsHide: true,
  },
);
const post = (body, extra = {}) =>
  fetch(origin + '/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: origin,
      'X-Forwarded-For': '127.0.0.1',
      ...extra,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
    signal: AbortSignal.timeout(20000),
  });
const valid = {
  name: 'Local QA',
  email: 'visitor@example.test',
  message: 'This is a local test. No external recipient.',
  website: '',
};
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(origin, { signal: AbortSignal.timeout(1500) })).ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  assert.ok(ready, 'Test app starts');
  console.log('Local test app ready');
  assert.equal((await post(valid, { Origin: 'https://untrusted.example' })).status, 403);
  assert.equal((await post(valid, { 'Content-Type': 'text/plain' })).status, 415);
  assert.equal((await post({ ...valid, email: 'bad' })).status, 400);
  assert.equal((await post({ ...valid, website: 'spam.example' })).status, 400);
  assert.equal((await post('{bad json')).status, 400);
  assert.equal((await post(valid)).status, 200);
  assert.equal(messages.length, 1);
  assert.match(messages[0], /Reply-To: Local QA <visitor@example.test>/);
  assert.match(messages[0], /To: recipient@example.test/);
  assert.match(messages[0], /No external recipient/);
  assert.equal((await post({ ...valid, message: 'x'.repeat(21000) })).status, 413);
  assert.equal((await post(valid)).status, 429);
  console.log(
    'PASS: actual Nodemailer delivery to local SMTP sink, correct Reply-To, origin enforcement, JSON validation, honeypot, body limit, and rate limiting.',
  );
} finally {
  app.kill();
  sockets.forEach((socket) => socket.destroy());
  await new Promise((resolve) => smtp.close(resolve));
}
