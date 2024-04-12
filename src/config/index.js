const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT ? process.env.PORT : 3000,
  username: process.env.USERNAME ? process.env.USERNAME : 'username',
  password: process.env.PASSWORD ? process.env.PASSWORD : 'password',
  nftContractAddress: process.env.NFT_CONTRACT_ADDRESS,
  ethereumNodeUrl: process.env.ETH_NODE,
  priorityMultiplierFee: process.env.PRIORITY_MULTIPLIER_FEE,
  etherScanUrlAPI: process.env.ETHERSCAN_URL_API
}