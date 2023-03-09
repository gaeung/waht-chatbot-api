const request = require('supertest');

const { createApp } = require('../app');
const appDataSource = require('../models/dataSource');
const discordUserFixture = require('./fixtures/discordUser-fixture');
const testDiscordUserData = require('./data/discordUsers');
const alchemyModule = require('../utils/alchemy');

jest.mock('../utils/alchemy');

describe('CHECK TEST', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await discordUserFixture.createDiscordUsers(
      testDiscordUserData.discordUsers
    );
  });

  afterAll(async () => {
    await appDataSource.query(`TRUNCATE Discord_User`);
    await appDataSource.query(`TRUNCATE Discord_NFT`);

    await appDataSource.destroy();
  });

  describe(`GET: Check the user's chatbot usage history`, () => {
    test('SUCCESS: USER CHECKED', async () => {
      const response = await request(app)
        .get('/check')
        .query({ id: 'testDiscordId1' });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ message: 'User checked' });
    });

    test('FAILED: MISSING DISCORD ID', async () => {
      const response = await request(app).get('/check');

      expect(response.status).toEqual(400);
      expect(response.body).toEqual('KEY_ERROR');
    });

    test('FAILED: NEED TO CREATE USER', async () => {
      const response = await request(app)
        .get('/check')
        .query({ id: 'testDiscordId10' });

      expect(response.status).toEqual(401);
      expect(response.body).toEqual({ message: 'Need to create user' });
    });
  });

  describe('POST: Discord User registration and get NFTs', () => {
    test('SUCCESS: USER CREATED', async () => {
      alchemyModule.getNFTs.mockResolvedValue({
        ownedNfts: [
          {
            contract: { address: 'testdAddress1' },
            tokenId: 1,
          },
          {
            contract: { address: 'testdAddress2' },
            tokenId: 1,
          },
          {
            contract: { address: 'testdAddress3' },
            tokenId: 1,
          },
        ],
        totalCount: 3,
      });

      const response = await request(app)
        .post('/check')
        .query({ id: 'testDiscordId0' })
        .send({ walletAddress: 'testDiscordWalletAddress0' });

      expect(response.status).toEqual(201);
      expect(response.body).toEqual({ message: 'Discord User Created!' });
    });

    test('FAILED: MISSING DISCORD ID', async () => {
      const response = await request(app).post('/check');

      expect(response.status).toEqual(400);
      expect(response.body).toEqual('KEY_ERROR');
    });

    test('FAILED: MISSING WALLET ADDRESS', async () => {
      const response = await request(app)
        .post('/check')
        .query({ id: 'testDiscordId1' });

      expect(response.status).toEqual(400);
      expect(response.body).toEqual('KEY_ERROR');
    });
  });

  describe(`PATCH: Update the user's NFT record.`, () => {
    test('SUCCESS: NFT RECODE UPDATED', async () => {
      alchemyModule.getNFTs.mockResolvedValue({
        ownedNfts: [
          {
            contract: { address: 'testdAddress1' },
            tokenId: 2,
          },
          {
            contract: { address: 'testdAddress2' },
            tokenId: 2,
          },
          {
            contract: { address: 'testdAddress3' },
            tokenId: 1,
          },
        ],
        totalCount: 3,
      });

      const response = await request(app)
        .patch('/check')
        .query({ id: 'testDiscordId0' })
        .send({ walletAddress: 'testDiscordWalletAddress0' });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ message: 'Discord User Updated!' });
    });

    test('FAILED: MISSING DISCORD ID', async () => {
      const response = await request(app).post('/check');

      expect(response.status).toEqual(400);
      expect(response.body).toEqual('KEY_ERROR');
    });
  });
});
