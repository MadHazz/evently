import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let testEmail = `test-${Date.now()}@example.com`;
  let testPassword = 'password123';
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST) - success', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: testEmail, password: testPassword })
      .expect(201);

    expect(res.body).toHaveProperty('accessToken');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe(testEmail);
  });

  it('/auth/register (POST) - conflict', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: testEmail, password: testPassword })
      .expect(409);
  });

  it('/auth/login (POST) - success', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword })
      .expect(201);

    expect(res.body).toHaveProperty('accessToken');
    accessToken = res.body.accessToken;
  });

  it('/auth/login (POST) - fail', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testEmail, password: 'wrongpassword' })
      .expect(401);
  });

  it('/auth/me (GET) - unauthorized', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
  });

  it('/auth/me (GET) - authorized', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.email).toBe(testEmail);
  });
});
