import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from './../src/app.module';

describe('TicketController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let orgId: string;
  let eventId: string;
  let ticketTypeId: string;
  let testEmail = `ticket-tester-${Date.now()}@example.com`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // Setup base entities
    let res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: testEmail, password: 'password123' });
    
    accessToken = res.body.accessToken;

    res = await request(app.getHttpServer())
      .post('/org')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Ticket Testing Org', slug: `ticket-org-${Date.now()}` });
    
    orgId = res.body.id;

    res = await request(app.getHttpServer())
      .post('/event')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        orgId,
        title: 'Ticket Test Event',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
      });
      
    eventId = res.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ticket/type (POST) - success', async () => {
    const res = await request(app.getHttpServer())
      .post('/ticket/type')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        eventId,
        name: 'General Admission',
        description: 'Standard Entry',
        price: 50,
        quantity: 10,
      })
      .expect(201);
    
    expect(res.body).toHaveProperty('id');
    expect(res.body.quantity).toBe(10);
    ticketTypeId = res.body.id;
  });

  it('/ticket/order (POST) - order 2 tickets', async () => {
    const res = await request(app.getHttpServer())
      .post('/ticket/order')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        eventId,
        ticketTypeId,
        quantity: 2,
        customerEmail: testEmail,
      })
      .expect(201);
      
    // Total should be 2 * 50 = 100
    expect(Number(res.body.totalAmount)).toBe(100);
    expect(res.body).toHaveProperty('id');
  });

  it('/ticket/order (POST) - over inventory', async () => {
    await request(app.getHttpServer())
      .post('/ticket/order')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        eventId,
        ticketTypeId,
        quantity: 15,
        customerEmail: testEmail,
      })
      .expect(400); // Bad Request (not enough tickets)
  });

  it('/ticket/order/my-orders (GET) - retrieve orders', async () => {
    const res = await request(app.getHttpServer())
      .get('/ticket/order/my-orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].tickets).toHaveLength(2); // From the previous step
  });
});
