const { getNFTs } = require('../utils/alchemy');
const { Alchemy, Network } = require('alchemy-sdk');

jest.mock('alchemy-sdk');

describe('ALCHEMY.JS TEST', () => {
  test('SUCCESS: RETURN CORRECT NFTs', async () => {
    const mockGetNftsForUser = jest.fn().mockResolvedValue(mockNfts);

    Alchemy.mockImplementation(() => {
      return {
        nft: {
          getNftsForOwner: mockGetNftsForUser,
        },
      };
    });

    const walletAddress = '0x0123456789012345678901234567890123456789';
    const nfts = await getNFTs(walletAddress);

    expect(Alchemy).toHaveBeenCalledWith({
      apiKey: process.env.ALCHEMY_API_KEY,
      network: Network.ETH_MAINNET,
    });

    expect(mockGetNftsForUser).toHaveBeenCalledWith(walletAddress);
    expect(nfts).toEqual(mockNfts);
  });

  test('SUCCESS: RETURN EMPTY NFTs ARRAY WHEN NO NFT EXISTS', async () => {
    const mockGetNftsForUser = jest.fn().mockResolvedValue([]);

    Alchemy.mockImplementation(() => {
      return {
        nft: {
          getNftsForOwner: mockGetNftsForUser,
        },
      };
    });

    const walletAddress = '0x0123456789012345678901234567890123456789';
    const nfts = await getNFTs(walletAddress);

    expect(Alchemy).toHaveBeenCalledWith({
      apiKey: process.env.ALCHEMY_API_KEY,
      network: Network.ETH_MAINNET,
    });

    expect(mockGetNftsForUser).toHaveBeenCalledWith(walletAddress);
    expect(nfts).toEqual([]);
  });

  test('FAILED: MISSING WALLET ADDRESS', async () => {
    await expect(getNFTs()).rejects.toThrow('Invalid Wallet Address');
  });

  test('FAILED: INVALID WALLET ADDRESS', async () => {
    const invalidWalletAddress = 'invalid_wallet_address';

    await expect(getNFTs(invalidWalletAddress)).rejects.toThrowError(
      'Invalid Wallet Address'
    );
  });
});

const mockNfts = {
  ownedNfts: [
    {
      contract: {
        address: 'testAddress1',
        name: 'testContractName1',
      },
      tokenId: '1',
    },
    {
      contract: {
        address: 'testAddress2',
        name: 'testContractName2',
      },
      tokenId: '2',
    },
  ],
  totalCount: 2,
};
