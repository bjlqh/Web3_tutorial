
# 第4课 hardhat 开发合约
It runs as either an in-process or stand-alone daemon, servicing JSON-RPC and WebSocket requests.

in-process:只要发交易，网络就存在。不发交易就不存在。(暂时存在)

stand-alone:本地独立运行的网络。提供JSON-RPC and WebSocket。
这样就可以通过metamask给你本地的独立网络发送交易。
只是单纯测试合约，那么就用in-process。如果要使用第三方合约，比如chainlink的合约，那么就可以把合约部署到以太坊sepolia上，而不去使用stand-alone独立测试网络

导入hardhat框架
```
require("@nomicfoundation/hardhat-toolbox");  完全是hardhat所用到的文件，大多数的配置信息都会添加到这个文件当中
const { ethers } = require("hardhat");
```


1:30:42 - 1:37:28

合约编译：
>npx hardhat compile

合约部署：
>npx hardhat run script/deployFundMe.js --network sepolia


contract has been deployed successfully, contract address is + 0x17E82C1d1eE727BafE515917629aff04211B868a

验证：
Using programmatically
```
await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: args,
    });
```

4.10 env
设置环境变量

在项目中安装 dotenv
>npm install --save-dev dotenv

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
```
const { task } = require("hardhat/config");
```

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
```
const { task } = require("hardhat/config");

task("deploy-fundme").setAction(async (taskArgs, hre) => { })

module.exports = {}
```

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

在 Hardhat 的单元测试中，describe 是 Mocha 测试框架 提供的核心函数，用于 组织和分组测试用例。
describe 的作用
结构化测试：将多个相关测试用例（it 块）分组，提升代码可读性。
逻辑分层：支持嵌套使用，模拟模块化测试（如按合约、按函数分组）。
钩子函数：可在 describe 块内使用 beforeEach、afterEach 等钩子，统一管理测试前置/后置操作。
```
const { expect } = require("chai");
const { ethers } = require("hardhat");

// 外层 describe：测试 FundMe 合约
describe("FundMe 合约测试", function () {
  let fundMe;
  let owner, user;

  // 钩子函数：在每个测试用例前部署合约
  beforeEach(async function () {
    const FundMe = await ethers.getContractFactory("FundMe");
    fundMe = await FundMe.deploy();
    [owner, user] = await ethers.getSigners();
  });

  // 测试组 1：存款功能
  describe("存款功能", function () {
    it("应允许用户存款并更新余额", async function () {
      await fundMe.connect(user).deposit({ value: 100 });
      expect(await fundMe.getBalance(user.address)).to.equal(100);
    });

    it("存款金额为 0 时应回滚", async function () {
      await expect(fundMe.deposit({ value: 0 })).to.be.revertedWith("金额必须大于 0");
    });
  });

  // 测试组 2：取款功能
  describe("取款功能", function () {
    it("仅所有者可以取款", async function () {
      await expect(fundMe.connect(user).withdraw()).to.be.revertedWith("非所有者");
    });
  });
});
```

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
fundme.test.js
引入工具
```
const { assert, expect } = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")
```

1:33:39 getfund

引入hardhat-ethers
>npm install --save-dev @nomicfoundation/hardhat-ethers ethers hardhat-deploy hardhat-deploy-ethers

如果报版本冲突，那么就先卸载当前版本，再重装
>npm uninstall hardhat-deploy hardhat-deploy-ethers

require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-deploy-ethers");

emit event
是用于 记录和通知区块链上特定动作或状态变化 的核心机制。

定义事件：在合约顶部使用 event EventName(参数) 声明。
触发事件：在函数逻辑中使用 emit EventName(参数)。
监听验证：在前端监听或在测试中使用 .to.emit(合约名， EventName) 断言。

6.FundMe 集成测试
比如说集成真实环境中的喂价合约。

使用promise来模拟等待的时间
make sure we can get receipt！
```
const getFundTx = await fundMe.getFund()
const getFundReceipt = await getFundTx.wait()
```

developmentChains.includes(network.name) ? 单元测试:集成测试

unit test:
!developmentChains.includes(network.name) ? describe.skip : 单元测试代码

staging test:
developmentChains.includes(network.name) ? describe.skip : 集成测试代码

当执行npx hardhat test --network sepolia时就可以根据配置要求去执行相应的代码

7.gas-reporter 和 solidity-coverage
安装
>npm install -D hardhat-gas-reporter
执行
>npx hardhat test

gas-reporter: 测试每一个函数都消耗多少gas
**特别注意：如果没有在测试函数前加await的话，是不会打印该函数的gas。


solidity-coverage: 已有的测试它覆盖了多少代码
hardhat已经帮我预装好了，不需要安装

执行
>npx hardhat coverage
