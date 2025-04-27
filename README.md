
# 第4课 hardhat 开发合约
It runs as either an in-process or stand-alone daemon, servicing JSON-RPC and WebSocket requests.

in-process:只要发交易，网络就存在。不发交易就不存在。(暂时存在)

stand-alone:本地独立运行的网络。提供JSON-RPC and WebSocket。
这样就可以通过metamask给你本地的独立网络发送交易。
只是单纯测试合约，那么就用in-process。如果要使用第三方合约，比如chainlink的合约，那么就可以把合约部署到以太坊sepolia上，而不去使用stand-alone独立测试网络

导入hardhat框架

require("@nomicfoundation/hardhat-toolbox");  完全是hardhat所用到的文件，大多数的配置信息都会添加到这个文件当中
const { ethers } = require("hardhat");


1:30:42 - 1:37:28

合约编译：
>npx hardhat compile

合约部署：
>npx hardhat run script/deployFundMe.js --network sepolia


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

在hardhat.config.js中
导入
require("dotenv")


4.11 env-enc
导入加密env-enc
require("@chainlink/env-enc").config();


对环境变量进行加密
>npm install --save-dev @chainlink/env-enc
>npx env-enc set-pw   输入密码：enc
>npx env-enc set[变量名]

contract has been deployed successfully, contract address is + 0x6435D29f1A7785d20F207cB96b63c7C8B9cde7e6


4.12 hardhat verify
https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify

在etherscan.io中设置apiKey

在控制台执行:
>npx hardhat verify --network sepolia 0x6435D29f1A7785d20F207cB96b63c7C8B9cde7e6 "10"

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
init 2 accounts
fund contract with first account
check balance of contract
fund contract with second account
check balance of contract
check mapping fundersToAmount

>npx hardhat run script/deployFundMe.js --network sepolia

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

导入task
const { task } = require("hardhat/config");

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


部署、验证：
>npx hardhat deploy-fundme --network sepolia
交互：
>npx hardhat interact-fundme --network sepolia --addr [合约地址]

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

>npx hardhat

6.为了和合约交互，写了js脚本 deployFundMe

7.部署不同的环境
进行网络配置，敏感信息加密

8.如何自定义task
把脚本中的逻辑拆分成2个

# 第5课 hardhat 合约测试
1.了解 mocha chai



到test目录下，创建js测试脚本
const { assert } = require("chai")

it("测试描述", async function(){ })


2.hardhat deploy插件
导入hardhat-deploy
require("hardhat-deploy")


>npm install -D hardhat-deploy

通过这种方式部署成功以后，那么就可以在test这个文件夹下用复用我们写的这个部署逻辑
    //在所有it之前执行
    beforeEach(async function (params) {
        await deployments.fixture(["all"])
    })

3.测试脚本
fundme.test.js
能够部署脚本，并且验证构造函数的sender, 验证喂价合约的地址
>npx hardhat test


4.mock合约

https://ethereum.org/zh/developers/tutorials/how-to-mock-solidity-contracts-for-testing/
对合约进行模拟，本质上是创建一个与该合约行为类似的副本，但开发者可以轻易控制这个副本。

测试FundMe合约里更多的函数。
获取ethUsdDataFeed预言机合约的价格，才能测试fund函数。
利用mock创建一个假的DataFeed.

在mock文件夹中引入这个合约
/chainlink/contracts/src/v0.8/shared/mocks/MockV3Aggregator.sol

在deploy文件夹下创建
00-deploy-mock.js  用了创建部署mock合约，给出假的价格
01-deploy-fund-me.js 部署fundme合约，再根据当前网络环境判断是否进行mock。
如果是本地环境就使用mock合约提供价格，如果是sepolia则使用以太坊提供的价格。

创建helper-hardhat-config.js
将常量进行配置

本地部署
>npx hardhat deploy

sepolia环境部署
>npx hardhat deploy --network sepolia

>npx hardhat deploy --network sepolia --reset

--reset 的作用
忽略部署缓存：
默认情况下，Hardhat 会记录已执行的部署脚本（存储在 .deployments 目录中），下次部署时跳过已完成的脚本。

添加 --reset 后，会清除这些记录，强制所有脚本重新运行。
重新部署所有合约：
即使合约代码未更改，也会重新部署到区块链，生成新的合约地址。
适用于需要重置测试环境或验证部署流程完整性的场景。

5.FundMe单元测试
1:09:50
引入工具
const { assert, expect } = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")
fundme.test.js

1:33:39 getfund