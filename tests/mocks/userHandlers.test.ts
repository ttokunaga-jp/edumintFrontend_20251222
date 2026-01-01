import { server } from '@/mocks/server';

// The server is already started in vitest.setup.ts

test('GET /users/:userId returns mocked user with id param', async () => {
  // Use the full URL that axios would use
  const res = await fetch('http://localhost:3000/api/users/user-001');
  const json = await res.json();
  expect(json).toHaveProperty('id', 'user-001');
});

test('GET /user/profile/:userId also returns mocked user', async () => {
  const res = await fetch('http://localhost:3000/api/user/profile/user-999');
  const json = await res.json();
  expect(json).toHaveProperty('id', 'user-999');
});
