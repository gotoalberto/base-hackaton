const swaggerJSDoc = require('swagger-jsdoc');
const packageJson = require('../../package.json');

const version = `${packageJson.version}`;
const swaggerDefinition = {
  definition: {
    openapi: '0.1.0',
    info: {
      title: 'Airdrop NFT API',
      version,
      description: 'Airdrop NFT API to mint and get NFTs',
    },
  },
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.js'],
  };

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
