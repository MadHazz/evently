import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from './../src/app.module';

describe('EventController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let orgId: string;
  let testEmail = `event-tester-${Date.now()}@example.com`;
  let orgSlug = `event-org-${Date.now()}`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // Register user
    let res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: testEmail, password: 'password123' });

    accessToken = res.body.accessToken;

    // Create org
    res = await request(app.getHttpServer())
      .post('/org')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Event Testing Org', slug: orgSlug });

    orgId = res.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/event (POST) - success', async () => {
    const res = await request(app.getHttpServer())
      .post('/event')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        orgId,
        title: 'Test Event',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Test Event');
  });

  it('/event (GET) - lists published events', async () => {
    const res = await request(app.getHttpServer()).get('/event').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    // At least the one we just created
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });
});
