const fs = require('fs');
const contractAbi = JSON.parse(fs.readFileSync("resources/721_abi.json"));
const { createLock } = require('../utils/simple_lock');
const { calculateMaxFeePerGas } = require('../utils/gasfee');
const { priorityMultiplierFee } = require('../config');


// define nonce outside function to persist value
let nonce = 0;
// create lock for send tx
const lock = createLock("send");

/**
 * Check if an address is valid
 * @param {address} address 
 */
function checkValidEthereumAddress(address) {
    // Ethereum addresses are hexadecimal values, 40 characters long
    const regex = /^(0x)?[0-9a-fA-F]{40}$/;
    if (!regex.test(address)) {
        throw new Error(`Invalid Ethereum address ${address}`);
    }
}

/**
 * Check if an address is not owner of contractAddress
 * @param {object} contract 
 * @param {address} toAddress 
 */
async function checkIsNotOwner(contract, toAddress) {
    const balanceOf = await contract
        .methods.balanceOf(toAddress)
        .call().then(balanceOf => {
            return parseInt(balanceOf);
        });
    if (balanceOf != 0) {
        throw new Error(`The address ${toAddress} has already one NFT.`);
    }
}

/**
 * Returns the token `balanceOf` from a given ERC-721 contract address from `tokenContractAddress`.
 * @param  {} web3 the web3 instance.
 * @param  {} tokenContractAddress ERC-721 contract address.
 * @param  {} address address
 */
module.exports.balanceOf = (web3, tokenContractAddress, address) => {
    return new web3.eth.Contract(contractAbi, tokenContractAddress)
    .methods.balanceOf(address)
    .call().then(amount => {
        return partInt(amount);
    });
}


/**
 * Returns the token `ownerOf` from a given ERC-721 contract address from `tokenContractAddress`.
 * @param  {} web3 the web3 instance.
 * @param  {} tokenContractAddress ERC-721 contract address.
 * @param  {} tokenId uint256
 */
module.exports.ownerOf = (web3, tokenContractAddress, tokenId) => {
    return new web3.eth.Contract(contractAbi, tokenContractAddress)
    .methods.ownerOf(parseInt(tokenId))
    .call().then(owner => {
        return owner;
    });
}

/**
 * Returns the token `balanceOf` from a given ERC-721 contract address from `tokenContractAddress`.
 * @param  {} web3 the web3 instance.
 * @param  {} tokenContractAddress ERC-721 contract address.
 */
module.exports.nextTokenId = (web3, tokenContractAddress) => {
    return new web3.eth.Contract(contractAbi, tokenContractAddress)
    .methods.nextTokenId()
    .call().then(nextTokenId => {
        return parseInt(nextTokenId);

    });
}

/**
 * Returns the token `uri` from a given ERC-721 contract address from `tokenContractAddress`.
 * @param  {} web3 the web3 instance.
 * @param  {} tokenContractAddress ERC-721 contract address.
 * @param  {} tokenId token Id.
 */
module.exports.getTokenURI = (web3, tokenContractAddress, tokenId) => {
    return new web3.eth.Contract(contractAbi, tokenContractAddress).methods.tokenURI(tokenId).
        call().then(name => {
            return name;
        });
}

/**
 * Call safeMint ERC-721 method
 * 
 * @param {object} web3
 * @param {string} contractAddress 
 * @param {string} toAddress
 */
module.exports.safeMint = async (web3, contractAddress, toAddress) => {
    try {
        console.log("Lock tx mint.")
        await lock.acquire();
        const signer = web3.eth.accounts.privateKeyToAccount(
            process.env.PRIVATE_KEY
        );
        checkValidEthereumAddress(contractAddress);
        checkValidEthereumAddress(toAddress);        
        web3.eth.accounts.wallet.add(signer);
        const contract = new web3.eth.Contract(contractAbi, contractAddress, { from: signer.address });
        if (process.env.CHECK_UNIQUE_ADDRESS) {
            await checkIsNotOwner(contract, toAddress);
        }
        const method = contract.methods.safeMint(toAddress);
        const gas = await method.estimateGas({ from: signer });
        const { maxFeePerGas, maxPriorityFeePerGas } = await calculateMaxFeePerGas(web3, priorityMultiplierFee);
        const tx = await method.send({
            from: signer.address,
            maxFeePerGas,
            maxPriorityFeePerGas,
            gas,
        });
        return tx.transactionHash;
    } catch(error){
        console.error(error.message);
        throw error.message;
    } finally {
        lock.release();
        console.log("Unlock tx mint.");
        web3.eth.accounts.wallet.pop();
    }
}