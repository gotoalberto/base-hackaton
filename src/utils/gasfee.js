const { etherScanUrlAPI } = require('../config');
const fetch = require('node-fetch');
const { isTestnet } = require('../utils/web3');

/**
 * Giving a baseFee and a priority in Gweis calculates max fee per gas.
 * @param {int} suggestedBaseFee 
 * @param {int} priority 
 * @returns 
 */
module.exports.calculateMaxFeePerGas = async (web3, priority) => {
  const block = await web3.eth.getBlock('latest');

  if (block.baseFeePerGas === undefined) {
    throw "EIP-1559 not supported in this block";
  }

  const baseFee = Number(block.baseFeePerGas);
  let priorityMultiplier;
  switch (priority.toLowerCase()) {
    case 'fast':
      priorityMultiplier = 1.5;
      break;
    case 'standard':
      priorityMultiplier = 1;
      break;
    case 'slow':
      priorityMultiplier = 0.5;
      break;
    default:
      throw new Error('Invalid priority values');
  }

  let maxPriorityFeePerGas = Math.floor(baseFee * priorityMultiplier);
  let maxFeePerGas = baseFee + maxPriorityFeePerGas;
  
  const testnet = await isTestnet();
  if (testnet) {
    // Mainnet returns baseFee in weis
    // Mumbai, Sepolia, and Base Sepolia returns baseFee in Gwei
    maxPriorityFeePerGas = web3.utils.toWei(maxPriorityFeePerGas, 'gwei');
    maxFeePerGas = web3.utils.toWei(maxFeePerGas, 'gwei');
  }

  return {
    maxPriorityFeePerGas,
    maxFeePerGas
  };
}

/**
 * 
 * @param {object} web3 
 * @returns object { maxFeePerGas, maxPriorityFeePerGas }
 */
module.exports.getGasTracker = async (web3) => {

    let settings = { method: "Get" };

    return fetch(etherScanUrlAPI, settings)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(json => {
      if (json && json.errors) {
        throw new Error(json.errors.map(error => error.message));
      } else if (json && json.result) {
        const etherGasPriceValue = json.result['proposeGasPrice'];
        //const suggestedBaseFee = json.result['suggestBaseFee'];
        return etherGasPriceValue;
      } else {
        return web3.utils.toWei(200, "gwei"); // default value

      }
    });

}