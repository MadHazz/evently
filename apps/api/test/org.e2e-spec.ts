import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from './../src/app.module';

describe('OrgController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let testEmail = `org-tester-${Date.now()}@example.com`;
  let orgSlug = `test-org-${Date.now()}`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // Register and login to get token
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: testEmail, password: 'password123' });

    accessToken = res.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/org (POST) - unauthorized', async () => {
    await request(app.getHttpServer())
      .post('/org')
      .send({ name: 'Test Org', slug: orgSlug })
      .expect(401);
  });

  it('/org (POST) - success', async () => {
    const res = await request(app.getHttpServer())
      .post('/org')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Test Org', slug: orgSlug })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.slug).toBe(orgSlug);
  });

  it('/org (POST) - conflict slug', async () => {
    await request(app.getHttpServer())
      .post('/org')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Another Org', slug: orgSlug })
      .expect(409);
  });

  it('/org (GET) - success', async () => {
    const res = await request(app.getHttpServer())
      .get('/org')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0]).toHaveProperty('slug', orgSlug);
    expect(res.body[0].members[0]).toHaveProperty('role', 'OWNER');
  });
});
