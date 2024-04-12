const express = require('express');
const router = express.Router();
const {
    safeMint
} = require('../services/nftService');
const { web3 } = require('../utils/web3');

/**
 * @swagger
 * tags:
 *   name: NFT
 *   description: NFT description
 *   image: NFT image
 */

/**
 * @swagger
 * /api/mint:
 *   post:
 *     summary: 
 *     description: Mint a NFT
 *     tags: [NFT]
 *     parameters:
 *       - name: contractAddress
 *         description: address of contract
 *         in: path
 *         required: true
 *         type: string
 *       - name: toAddress
 *         description: destination address
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *      - application/json
 *     responses:
 *       201:
 *         description: NFT Minted
 *         content:
 *           application/json:
 *            example: {"tx": "0x094df67c4e0bf79f00a236c549edcc7866fa21a8e3979394d0ce2ecbd4f8b5ed" }
 */
router.post('/mint', async (req, res) => {
    const { data } = req.body;
    const contractAddress = data?.contractAddress;
    const toAddress = data?.toAddress;

    // Check if contractAddress and toAddress are provided
    if (!contractAddress || !toAddress) {
        return res.status(400).json({ error: 'Both contractAddress and toAddress are required.' });
    }
    
    try {
        const tx = await safeMint(web3, contractAddress, toAddress);
        res.status(201).json({ toAddress, contractAddress, tx });
    } catch(error) {
        res.status(400).json({ error });
    }
});

module.exports = router;