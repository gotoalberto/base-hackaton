const { ECDSAProvider } = require('@zerodev/sdk')
const { LocalAccountSigner } = require("@alchemy/aa-core")
const { encodeFunctionData, parseAbi, createPublicClient, http } = require('viem')
const { polygon } = require('viem/chains')

const { contractAddress, tokenId, ethereumNodeUrl, projectId } = require('../config');

const contractABI = parseAbi([
    'function mint(address _to) public',
    'function safeTransferFrom(address from, address to, uint256 tokenId, uint256 amount, bytes _data) public',
    // 'function balanceOf(address owner) external view returns (uint256 balance)'
    'function balanceOf(address owner, uint256 tokenId) external view returns (uint256 balance)'
]);

// const contractAddressSampleNFT = "0x34bE7f35132E97915633BC1fc020364EA5134863";

/**
 * 
 * @param {string} toAddress 
 * @returns return tx hash
 */
module.exports.sendAccountAbstractionSafeTransferFrom = async (toAddress) => {

    // The "owner" of the AA wallet, which in this case is a private key
    const owner = LocalAccountSigner.privateKeyToAccountSigner(process.env.PRIVATE_KEY);

    const publicClient = createPublicClient({
        chain: polygon,
        // the API is rate limited and for demo purposes only
        // in production, replace this with your own node provider (e.g. Infura/Alchemy)
        transport: http(ethereumNodeUrl),
      })

    // Create the AA wallet
    const ecdsaProvider = await ECDSAProvider.init({
        projectId,
        owner,
    })

    console.log(owner.owner.address);
    console.log(toAddress)
    console.log(tokenId)
    

    // Mint the NFT
    // const { hash } = await ecdsaProvider.sendUserOperation({
    //     target: contractAddressSampleNFT,
    //     data: encodeFunctionData({
    //     abi: contractABI,
    //     functionName: 'mint',
    //     args: [toAddress],
    //     }),
    // });

    // call safeTransferFrom ERC-1155
    const { hash } = await ecdsaProvider.sendUserOperation({
        target: contractAddress,
        data: encodeFunctionData({
        abi: contractABI,
        functionName: 'safeTransferFrom',
        args: [owner.owner.address, toAddress, tokenId, 1, '0x'],
        }),
    })

    await ecdsaProvider.waitForUserOperationTransaction(hash);


    // Check how many NFTs we have
    // const balanceOf = await publicClient.readContract({
    //     address: contractAddressSampleNFT,
    //     abi: contractABI,
    //     functionName: 'balanceOf',
    //     args: [toAddress],
    // });
    // console.log(`NFT balance: ${balanceOf}`);

    // // Check how many NFTs we have
    const balanceOf = await publicClient.readContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'balanceOf',
        args: [toAddress, tokenId],
    })
    console.log(`NFT balance: ${balanceOf}`);

    return hash;

}