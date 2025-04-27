
/* function deployFunction() {
    console.log("this a deploy function")
}
module.exports.default = deployFunction */

const { network } = require("hardhat");
const { developmentChains, networkConfig, LOCK_TIME, CONFIRMATIONS }
    = require("../helper-hardhat-config")

//匿名函数的方式导出
/* module.exports = async (hre) => {
    const getNamedAccounts = hre.getNamedAccounts
    const deployments = hre.deployments
    console.log("this is a deploy function")
} */


module.exports = async ({ getNamedAccounts, deployments }) => {
    const { firstAccount } = await getNamedAccounts()
    //const deploy = deployments.deploy
    const { deploy } = deployments      //如果变量名和属性名一致，可以这样写

    let dataFeedAddr
    let confirmations
    //判断当前网络环境
    if (developmentChains.includes(network.name)) {
        const mockV3Aggregator = await deployments.get("MockV3Aggregator")
        dataFeedAddr = mockV3Aggregator.address
        confirmations = 0;
    } else {
        //不是mock的网络环境,就获取具体哪个链的地址
        dataFeedAddr = networkConfig[network.config.chainId].ethUsdDataFeed
        confirmations = CONFIRMATIONS
    }


    //部署合约
    const fundMe = await deploy("FundMe", {
        from: firstAccount,
        args: [LOCK_TIME, dataFeedAddr],
        log: true,
        waitConfirmations: confirmations
    })

    //合约验证
    if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_APIKEY) {
        await hre.run("verify:verify", {
            address: fundMe.address,
            constructorArguments: [LOCK_TIME, dataFeedAddr],
        });
    } else {
        console.log("network is not sepolia. verfication skipped...");
    }
}

module.exports.tags = ["all", "fundMe"]
