import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContact, RateLimiter } from '../src/lib/contact.ts';
const valid = {
  name: 'Test Person',
  email: 'visitor@example.com',
  message: 'A sample portfolio enquiry.',
  website: '',
};
test('accepts and trims a valid message', () =>
  assert.deepEqual(validateContact({ ...valid, name: ' Test Person ' }), valid));
test('rejects malformed input, header injection, and invalid email', () => {
  for (const input of [
    null,
    [],
    {},
    { ...valid, email: 'bad' },
    { ...valid, name: 'Test\r\nBcc: attacker@example.com' },
    { ...valid, email: 'a@example.com\r\nBcc: b@example.com' },
    { ...valid, message: 'short' },
    { ...valid, message: 'a'.repeat(5001) },
    { ...valid, name: 42 },
  ])
    assert.equal(validateContact(input), null);
});
test('preserves honeypot for explicit route rejection', () =>
  assert.equal(validateContact({ ...valid, website: 'spam.example' })?.website, 'spam.example'));
test('limits bursts, expires entries, and bounds memory', () => {
  const limit = new RateLimiter(2, 1000, 2);
  assert.equal(limit.consume('a', 0), true);
  assert.equal(limit.consume('a', 1), true);
  assert.equal(limit.consume('a', 2), false);
  assert.equal(limit.consume('b', 2), true);
  assert.equal(limit.consume('c', 3), false);
  assert.equal(limit.consume('c', 1002), true);
  assert.equal(limit.consume('a', 1002), true);
});
