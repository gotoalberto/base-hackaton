const express = require("express");
const basicAuth = require('express-basic-auth');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');
const packageJson = require('../package.json');
const { port, username, password } = require('./config');
const { getChainId } = require('./utils/web3');

// Routes
const nftRoutes = require('./routes/nftRoutes');

// Configure endpoint for readiness
const app = express();

/**
 * @swagger
 * definitions:
 *   Login:
 *     required:
 *       - username
 *       - password
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *       path:
 *         type: string
 */
const users = {};
users[username] = password;

app.use(express.json());
app.use(basicAuth({
    users,
    challenge: true,
    unauthorizedResponse: 'Unauthorized',
}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', nftRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get chain Id
 *     description: Retrieve the current chain Id
 *     produces:
 *       - text/html
 *     responses:
 *       200:
 *         description: Chain Id
 *         content:
 *           text/html:
 *             example: Server is running on netId 80001.
 */
app.get('/', async (req, res) => {
    try {
        const chainId = await getChainId();
        res.status(200).send(`Server is running on netId ${chainId}.`);
    } catch(e) {
        res.status(400).send(e.message);
    }
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Start message
const startMessage = `Airdrop NFT API \`${packageJson.version}\` was started.`;
console.log(startMessage);