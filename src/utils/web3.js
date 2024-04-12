const { Web3 } = require('web3');

const { ethereumNodeUrl } = require('../config');

// Create a web3 instance
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumNodeUrl));
const chainId = web3.eth.getChainId();

/**
 * Get network id
 */
const getChainId = async () => {
    try {
        const chainId = await web3.eth.getChainId();
        return chainId;
    } catch (error) {
        throw error;
    }
}

/**
 * Get Ethereum urlExplorer
 */
const getUrlExplorer = async () => {
    const protocol = 'https'
    const explorer = 'etherscan.io';
    const chainId = await getChainId();

    switch (chainId) {
        case 1: return `${protocol}://${explorer}`;
            break;
        case 4: return `${protocol}://rinkeby.${explorer}`
            break;
        case 137: return `${protocol}://polygonscan.com`
            break;
        default:
            return `${protocol}://${explorer}`;
    }
}

/**
 * Get last block number
 */
const getLastBlockNumber = async () => {
    return web3.eth.getBlockNumber();
}


/**
 * Check if this network is a tesnet
 */
const isTestnet = async () => {
    try {
        const chainId = await getChainId();
        switch (parseInt(chainId)) {
            case 80001:
                console.log('Mumbai');
                return true;
            case 300:
                console.log('Sepolia testnet');
                return true;
            case 84532:
                console.log('Base Sepolia');
                return true;
            case 11155420:
                console.log('Op Sepolia');
                return true;
            default:
                return false;
        }
    } catch (error) {
        console.error('Error:', error);
        // Handle error
        return false;
    }
}

module.exports = {
    web3,
    getChainId,
    getUrlExplorer,
    getLastBlockNumber,
    isTestnet,
}