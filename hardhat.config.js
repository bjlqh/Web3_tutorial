/**
 * 完全是hardhat所用到的文件，大多数的配置信息都会添加到这个文件当中
 */
require("@nomicfoundation/hardhat-toolbox");
//require("dotenv").config();        //package.json里面引入之后，在这里引入hardhat就可以用环境变量了
require("@chainlink/env-enc").config();
require("./tasks")
require("hardhat-deploy")   //引入hardhat-deploy

//hardhat-ethers
require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-deploy-ethers");

const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1
const ETHERSCAN_APIKEY = process.env.ETHERSCAN_APIKEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",    //默认缺省
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,             //sepolia服务提供商:Alchemy, Infure, QuickNode
      accounts: [PRIVATE_KEY, PRIVATE_KEY_1],       //metamask钱包私钥
      chainId: 11155111
    }
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_APIKEY     //etherscan.io apiKey
    }
  },
  namedAccounts: {
    firstAccount: {
      default: 0
    },
    secondAccount: {
      default: 1
    }
  },
  mocha: {
    timeout: 400000
  },
  gasReporter: {
    enabled: true
  }

};
