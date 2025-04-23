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
