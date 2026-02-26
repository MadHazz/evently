import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from './../src/app.module';

describe('CheckinController (e2e)', () => {
  let app: INestApplication;
  let ownerToken: string;
  let guestToken: string;
  let orgId: string;
  let eventId: string;
  let ticketTypeId: string;
  let ticketQrCode: string;

  let ownerEmail = `owner-${Date.now()}@example.com`;
  let guestEmail = `guest-${Date.now()}@example.com`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // Setup Owner
    let res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: ownerEmail, password: 'password123' });
    ownerToken = res.body.accessToken;

    // Setup random user (guest)
    res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: guestEmail, password: 'password123' });
    guestToken = res.body.accessToken;

    // Owner creates an Org
    res = await request(app.getHttpServer())
      .post('/org')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Checkin Org', slug: `checkin-org-${Date.now()}` });
    orgId = res.body.id;

    // Owner creates an Event
    res = await request(app.getHttpServer())
      .post('/event')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        orgId,
        title: 'Checkin Test Event',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
      });
    eventId = res.body.id;

    // Owner created a TicketType
    res = await request(app.getHttpServer())
      .post('/ticket/type')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        eventId,
        name: 'General',
        price: 0,
        quantity: 10,
      });
    ticketTypeId = res.body.id;

    // Guest buys a ticket
    res = await request(app.getHttpServer())
      .post('/ticket/order')
      .set('Authorization', `Bearer ${guestToken}`)
      .send({
        eventId,
        ticketTypeId,
        quantity: 1,
        customerEmail: guestEmail,
      });

    // Retrieve the ticket UUID
    res = await request(app.getHttpServer())
      .get('/ticket/order/my-orders')
      .set('Authorization', `Bearer ${guestToken}`);

    ticketQrCode = res.body[0].tickets[0].qrCode;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/checkin/scan (POST) - unauthorized scanning (Not org member)', async () => {
    await request(app.getHttpServer())
      .post('/checkin/scan')
      .set('Authorization', `Bearer ${guestToken}`)
      .send({
        qrCode: ticketQrCode,
        eventId,
      })
      .expect(403);
  });

  it('/checkin/scan (POST) - successful scan by authorized owner', async () => {
    const res = await request(app.getHttpServer())
      .post('/checkin/scan')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        qrCode: ticketQrCode,
        eventId,
      })
      .expect(201); // Nest defaults to 201 for POST

    expect(res.body.success).toBe(true);
    expect(res.body.ticket.status).toBe('USED');
  });

  it('/checkin/scan (POST) - fail on already scanned ticket', async () => {
    await request(app.getHttpServer())
      .post('/checkin/scan')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        qrCode: ticketQrCode,
        eventId,
      })
      .expect(400); // Bad request because it's USED
  });

  it('/checkin/scan (POST) - fail on nonexistent ticket', async () => {
    const { randomUUID } = require('crypto');
    await request(app.getHttpServer())
      .post('/checkin/scan')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        qrCode: randomUUID(), // Valid v4 format
        eventId,
      })
      .expect(404);
  });
});
