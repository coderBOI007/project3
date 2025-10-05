const request = require('supertest');
const app = require('../app');
const User = require('./models/User');

describe('Authentication', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('should sign up a new user', async () => {
    const response = await request(app)
      .post('/signup')
      .send({
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123'
      })
      .expect(302);

    const user = await User.findOne({ username: 'testuser' });
    expect(user).not.toBeNull();
    expect(user.username).toBe('testuser');
  });

  test('should login existing user', async () => {
    await request(app)
      .post('/signup')
      .send({
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123'
      });

    const response = await request(app)
      .post('/login')
      .send({
        username: 'testuser',
        password: 'password123'
      })
      .expect(302);

    expect(response.header.location).toBe('/tasks');
  });
});