
const { DECIMAL, INITIAL_ANSWER, developmentChains } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {

    if (developmentChains.includes(network.name)) {
        const { firstAccount } = await getNamedAccounts()
        const { deploy } = deployments
        //部署mock合约
        await deploy("MockV3Aggregator", {
            from: firstAccount,
            args: [DECIMAL, INITIAL_ANSWER],    //通证兑USD精确到8位小数, 通证兑ETH是10^18。假设eth的价格是3000USD
            log: true
        })
    } else {
        console.log("enviroment is not local. mock contract deployment skipped...");
    }

}

module.exports.tags = ["all", "mock"]