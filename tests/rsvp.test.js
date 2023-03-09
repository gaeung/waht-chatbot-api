const request = require('supertest');
const moment = require('moment');

const { createApp } = require('../app');
const appDataSource = require('../models/dataSource');
const userFixture = require('./fixtures/user-fixture');
const discordUserFixture = require('./fixtures/discordUser-fixture');
const discordNFTFixture = require('./fixtures/discordNFT-fixture');
const eventFixture = require('./fixtures/event-fixture');
const rsvpFixture = require('./fixtures/rsvp-fixture');
const testUserData = require('./data/users');
const testDiscordUserData = require('./data/discordUsers');
const testDiscrdNFTData = require('./data/discordNFTs');
const testEventData = require('./data/events');
const testRsvpData = require('./data/rsvps');

describe('RSVP TEST', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await userFixture.createUsers(testUserData.users);
    await discordUserFixture.createDiscordUsers(
      testDiscordUserData.discordUsers
    );
    await discordNFTFixture.createDiscordNFTs(testDiscrdNFTData.discordNFTs);
    await eventFixture.createEvents(testEventData.events);
    await rsvpFixture.createRsvps(testRsvpData.rsvps);
  });

  afterAll(async () => {
    await appDataSource.query(`TRUNCATE User`);
    await appDataSource.query(`TRUNCATE Discord_User`);
    await appDataSource.query(`TRUNCATE Discord_NFT`);
    await appDataSource.query(`TRUNCATE Event`);
    await appDataSource.query(`TRUNCATE RSVP`);

    await appDataSource.destroy();
  });

  describe(`GET: A list of events that the user has RSVP'd to`, () => {
    test('SUCCESS: GET RSVP LIST', async () => {
      const response = await request(app)
        .get('/rsvp/list')
        .query({ id: 'testDiscordId2', timestamp: '2020-01-01 00:00:00' });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(rsvpList);
    });

    test('FAILED: MISSING DISCORD ID', async () => {
      const response = await request(app).get('/rsvp/list');

      expect(response.status).toEqual(400);
      expect(response.body).toEqual('KEY_ERROR');
    });

    test('FAILED: NO RSVP LIST', async () => {
      const response = await request(app)
        .get('/rsvp/list')
        .query({ id: 'testDiscordId1', timestamp: '2020-01-01 00:00:00' });

      expect(response.status).toEqual(404);
      expect(response.body).toEqual('NOT_FOUND');
    });
  });

  describe(`GET: Retrieve the QR code for an event that the user has RSVP'd to`, () => {
    test('SUCCESS: GET QR CODE', async () => {
      const response = await request(app)
        .get('/rsvp')
        .query({ id: 'testDiscordId2', eventId: 2 });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(qrcode);
    });

    test('FAILED: MISSING DISCORD ID', async () => {
      const response = await request(app).get('/rsvp');

      expect(response.status).toEqual(400);
      expect(response.body).toEqual('KEY_ERROR');
    });
  });

  describe('POST: RSVP to an event', () => {
    test('SUCCESS: RSVP to an event', async () => {
      const response = await request(app)
        .post('/rsvp')
        .query({ id: 'testDiscordId1', eventId: 3 });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ message: 'posted' });
    });

    test('FAILED: MISSING DISCORD ID', async () => {
      const response = await request(app).post('/rsvp');

      expect(response.status).toEqual(400);
      expect(response.body).toEqual('KEY_ERROR');
    });

    test('FAILED: MISSING EVENT ID', async () => {
      const response = await request(app)
        .post('/rsvp')
        .query({ id: 'testDiscordId2' });

      expect(response.status).toEqual(400);
      expect(response.body).toEqual('KEY_ERROR');
    });
  });

  describe('DELETE: Cancel an RSVP', () => {
    test('SUCCESS: Cancel and RSVP', async () => {
      const response = await request(app)
        .delete('/rsvp')
        .query({ id: 'testDiscordId1', eventId: 3 });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ message: 'deleted' });
    });

    test('FAILED: MISSING DISCORD ID', async () => {
      const response = await request(app).delete('/rsvp');

      expect(response.status).toEqual(400);
      expect(response.body).toEqual('KEY_ERROR');
    });

    test('FAILED: MISSING EVENT ID', async () => {
      const response = await request(app)
        .delete('/rsvp')
        .query({ id: 'testDiscordId2' });

      expect(response.status).toEqual(400);
      expect(response.body).toEqual('KEY_ERROR');
    });
  });
});

const rsvpList = {
  list: [
    {
      event_id: '2',
      event_name: 'testEventName2',
      start_time: '2024-02-02 00:00:00',
      end_time: '2024-02-02 12:00:00',
    },
  ],
};

const qrcode = {
  qrKey: {
    smartContractAddress: 'testSmartContractAddress2',
    id: '2',
    walletAddress: 'testDiscordWalletAddress2',
    timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
  },
};
