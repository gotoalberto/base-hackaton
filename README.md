# Airdrop NFT API

Demo to mint NFT contracts on Polygon L2 `matic` and `mumbai` testnet.

## Install 

```
npm i
```

## Setup

```
PORT=5001

# Basic Auth
USERNAME=username
PASSWORD=password

# Account 1
PRIVATE_KEY=PRIVATE_KEY_WITH_0x

# Polygonscan gas tracker
ETHERSCAN_URL_API="https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=API_KEY"

# Network
ETH_NODE=https://polygon-mumbai.g.alchemy.com/v2/ALCHEMY_API

# EIP1559 priority
PRIORITY_MULTIPLIER_FEE=fast
```

## Test

```
npm run test
```

## Run

```
npm run start
```

## Contracts

https://github.com/bitsoex/hardhat-airdrop-nft-erc721

## API definition

- Swagger API doc http://localhost:5001/api-docs/.
- Wiki and curl samples: https-github.com-bitsoex-hardhat-airdrop-api/wiki.
- Postman import json: https://drive.google.com/file/d/1Ob5X57V0p0MGOtj23HVXfgbt5BjWwat3/view?usp=drive_link.

## Contracts Mumbai

### Implementation ABI:
- NFT Demo https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=0x08993c2fbf000a3f2b80f75a916ca0632448a34f

### Proxy
- NFT Demo https://mumbai.polygonscan.com/token/0xf1407b584ba61d8530f4fada369d1dd609753a59#code