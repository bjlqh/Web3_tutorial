const { ethers, deployments, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name) //当不是本地网络的时候
? describe.skip:
describe("staging test fundme contract", async function () {
    let fundMe
    let firstAccount

    /**
     * 基本功能已经在单元测试覆盖掉了。
     */
    beforeEach(async function () {
        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount

        //deployments可以获取所有我们部署过的合约
        const fundMeDeployment = await deployments.get("FundMe")
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
    })

    // test fund and getFund successfully
    it("test fund and getFund successfully", async function () {
        await fundMe.fund({ value: ethers.parseEther("0.5") })
        //使用promise来模拟等待的时间
        await new Promise(resolve => setTimeout(resolve, 181 * 1000))

        //make sure we can get receipt！
        const getFundTx = await fundMe.getFund()
        const getFundReceipt = await getFundTx.wait()

        expect(getFundReceipt)
            .to.be.emit(fundMe, "FundWithdrawByOwner")
            .withArgs(ethers.parseEther("0.5"))

    })


    // test fund and refund successfully
    it("fund and refund successfully", async function () {
        //make sure target not reached
        await fundMe.fund({ value: ethers.parseEther("0.1") })
        //make sure window closed
        await new Promise(resolve => setTimeout(resolve, 181 * 1000))

        //make sure we can get receipt！
        const refundTx = await fundMe.refund()
        const refundTxReceipt = await refundTx.wait()

        expect(refundTxReceipt)
            .to.be.emit(fundMe, "RefundByFunder")
            .withArgs(firstAccount, ethers.parseEther("0.1"))
    })

})