hardhat network  
It runs as either an in-process or stand-alone daemon, servicing JSON-RPC and WebSocket requests.

in-process:只要发交易，网络就存在。不发交易就不存在。(暂时存在)

stand-alone:本地独立运行的网络。提供JSON-RPC and WebSocket。
这样就可以通过metamask给你本地的独立网络发送交易。
只是单纯测试合约，那么就用in-process。如果要使用第三方合约，比如chainlink的合约，那么就可以把合约部署到以太坊sepolia上，而不去使用stand-alone独立测试网络


1:30:42 - 1:37:28

合约编译：
npx hardhat compile

合约部署：
npx hardhat run script/deployFundMe.js --network sepolia


contract has been deployed successfully, contract address is + 0x17E82C1d1eE727BafE515917629aff04211B868a

验证：
Using programmatically
await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: args,
    });


4.10 env
设置环境变量

在项目中安装 dotenv
npm install --save-dev dotenv

在hardhat.config.js中require("dotenv")


4.11 env-enc
对环境变量进行加密
npm install --save-dev @chainlink/env-enc
npx env-enc set-pw   输入密码：enc
npx env-enc set[变量名]

contract has been deployed successfully, contract address is + 0x6435D29f1A7785d20F207cB96b63c7C8B9cde7e6


4.12 hardhat verify
https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify

在etherscan.io中设置apiKey

在控制台执行:
npx hardhat verify --network sepolia 0x6435D29f1A7785d20F207cB96b63c7C8B9cde7e6 "10"

返回:
Successfully submitted source code for contract
contracts/FundMe.sol:FundMe at 0x6435D29f1A7785d20F207cB96b63c7C8B9cde7e6
for verification on the block explorer. Waiting for verification result...

Successfully verified contract FundMe on the block explorer.
https://sepolia.etherscan.io/address/0x6435D29f1A7785d20F207cB96b63c7C8B9cde7e6#code

什么时候部署在本地，什么时候部署在sepolia上面？
如果部署在本地，就跳过合约验证逻辑。
查看当前合约的chainId是什么 chainlist.org
sepolia chainid = 11155111



4.13 小结

4.14 合约交互脚本
想要查看某个合约的函数，想要查看合约某个变量值
// init 2 accounts
// fund contract with first account
// check balance of contract
// fund contract with second account
// check balance of contract
// check mapping fundersToAmount

npx hardhat run script/deployFundMe.js --network sepolia
contract deploying
contract has been deployed successfully, contract address is + 0xf896a1695D06aEbbd5B87E89CA543e9C698715F3
waiting for 5 confirmations
The contract 0xf896a1695D06aEbbd5B87E89CA543e9C698715F3 has already been verified on the block explorer. If you're trying to verify a partially verified contract, please use the --force flag.
https://sepolia.etherscan.io/address/0xf896a1695D06aEbbd5B87E89CA543e9C698715F3#code

Balance of the contract is 100000000000000000
Balance of the contract is 200000000000000000
Balance of first account 0x94e36d6D669b44701982838F54365936d9404217 is 100000000000000000
Balance of second account 0x4Da27Cb8517Ddd24Fe8488Df937338E5136DA45e is 100000000000000000


4.15 Hardhat Task
在hardhat中，你做的所有事情都可以被定义为一个task

>npx hardhat help

AVAILABLE TASKS:

  check                 Check whatever you need
  clean                 Clears the cache and deletes all artifacts
  compile               Compiles the entire project, building all artifacts
  console               Opens a hardhat console
  coverage              Generates a code coverage report for tests
  flatten               Flattens and prints contracts and their dependencies. If no file is passed, all the contracts in the project will be flattened.
  gas-reporter:merge 
  help                  Prints this message
  node                  Starts a JSON-RPC server on top of Hardhat Network
  run                   Runs a user-defined script after compiling the project
  test                  Runs mocha tests
  typechain             Generate Typechain typings for compiled contracts
  verify                Verifies a contract on Etherscan or Sourcify


AVAILABLE TASK SCOPES:

  ignition              Deploy your smart contracts using Hardhat Ignition
  vars                  Manage your configuration variables

To get help for a specific task run: npx hardhat help [SCOPE] <TASK>


//这就是一个task最简单的结构
const { task } = require("hardhat/config");

task("deploy-fundme").setAction(async (taskArgs, hre) => { })

module.exports = {}


部署、验证：npx hardhat deploy-fundme --network sepolia
交互：npx hardhat interact-fundme --network sepolia --addr [合约地址]

4.16 总结
1.安装nodejs
先安装nvm，在通过nvm安装不同版本的nodejs

2.安装vscode

3.安装git

4.创建npm项目
4.1安装nvm
4.2安装nodejs
4.3 npm install,npm init


5.创建harthat项目
npm install hardhat[@版本] --save-dev(只有在开发环境中使用)
将合约写到hardhat中

npx hardhat

6.为了和合约交互，写了js脚本 deployFundMe

7.部署不同的环境
进行网络配置，敏感信息加密

8.如何自定义task
把脚本中的逻辑拆分成2个