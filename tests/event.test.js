const request = require('supertest');

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

describe('EVENT TEST', () => {
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

  describe('GET: Retrieve a list of events that the user can participate in based on their NFT', () => {
    test('SUCCESS: GET EVENT LIST', async () => {
      const response = await request(app)
        .get('/events/list')
        .query({ id: 'testDiscordId1', timestamp: '2020-01-01 00:00:00' });

      expect(response.status).toEqual(200);
      expect(response.body.data).toEqual(eventList);
    });

    test('FAILED: MISSING DISCORD ID', async () => {
      const response = await request(app).get('/events/list');

      expect(response.status).toEqual(400);
      expect(response.body).toEqual('KEY_ERROR');
    });

    test('FAILED: USER DOES NOT OWN ANY NFTS', async () => {
      const response = await request(app)
        .get('/events/list')
        .query({ id: 'testDiscordId3', timestamp: '2020-01-01 00:00:00' });

      expect(response.status).toEqual(404);
      expect(response.body).toEqual('NOT_FOUND');
    });

    test('FAILED: THERE ARE NO EVENT THAT THE USER CAN ATTEND', async () => {
      const response = await request(app)
        .get('/events/list')
        .query({ id: 'testDiscordId9', timestamp: '2020-01-01 00:00:00' });

      expect(response.status).toEqual(404);
      expect(response.body).toEqual('NOT_FOUND');
    });
  });

  describe('GET: Event details', () => {
    test('SUCCESS: GET EVENT DETAIL', async () => {
      const response = await request(app)
        .get('/events/detail')
        .query({ id: 'testDiscordId1', eventId: 1 });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(eventDetail);
    });

    test('FAILED: MISSING EVENT ID', async () => {
      const response = await request(app)
        .get('/events/detail')
        .query({ id: 'testDiscordId1' });

      expect(response.status).toEqual(400);
      expect(response.body).toEqual('KEY_ERROR');
    });

    test('FAILED: WRONG EVENT ID', async () => {
      const response = await request(app)
        .get('/events/detail')
        .query({ id: 'testDiscordId1', eventId: 11 });

      expect(response.status).toEqual(404);
      expect(response.body).toEqual('NOT_FOUND');
    });
  });
});

const eventList = [
  {
    host_name: 'testUser1',
    event_id: '1',
    event_name: 'testEventName1',
    start_time: '2024-01-01 00:00:00',
    end_time: '2024-01-01 12:00:00',
    spots_available: '4',
  },
];

const eventDetail = {
  result: [
    {
      event_name: 'testEventName1',
      host_name: 'testUser1',
      place: 'testPlace',
      images: "['testIamge1', 'testImage2', 'testImage3']",
      description: 'testDescription',
      custom_info:
        "[{ title: 'testTitle1', body: 'testBody1' }, { title: 'testTitle2', body: 'testBody2' }]",
      start_time: '2024-01-01 00:00:00',
      end_time: '2024-01-01 12:00:00',
    },
  ],
  check: false,
};
