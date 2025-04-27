const { ethers, deployments, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")

describe("test fundme contract", async function () {
    let fundMe
    let firstAccount
    let mockV3Aggregator

    //在所有it之前执行
    beforeEach(async function () {
        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        //deployments可以获取所有我们部署过的合约
        const fundMeDeployment = await deployments.get("FundMe")
        mockV3Aggregator = await deployments.get("MockV3Aggregator")
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
    })

    //测试构造函数，在合约部署好以后，owner没有被设置好
    it("test if the owner is msg.sender", async function () {
        //获取合约发送人
        // const [firstAccount] = await ethers.getSigners()      //返回的是signer对象集合
        // const fundmeFactory = await ethers.getContractFactory("FundMe")
        // const fundMe = await fundmeFactory.deploy(100)

        await fundMe.waitForDeployment()
        //assert.equal((await fundMe.owner()), firstAccount.address)
        assert.equal((await fundMe.owner()), firstAccount)
    })

    it("test if the dataFeed is assigned correctly", async function () {
        /* //获取合约发送人
        const fundmeFactory = await ethers.getContractFactory("FundMe")
        const fundMe = await fundmeFactory.deploy(100)*/
        
        await fundMe.waitForDeployment() 
        assert.equal((await fundMe.dataFeed()), mockV3Aggregator.address)
    })

    //fund, getFund, reFound
    //unit test for fund
    //window open ,value greater then minimum value, funder balance
    it("window close ,value greater then minimum value, fund failed", 
        async function () {
            //时间增长200s
            //当合约中存在基于时间的逻辑时（如倒计时、限时活动等），你需要用这种方式 加速测试进程。
            await helpers.time.increase(200)
            //模拟挖矿
            //在本地测试网络（如 Hardhat）中，区块不会自动生成。若测试中需要等待区块生成（例如测试交易确认），手动 mine() 可以 立即推进链状态，避免异步操作超时。
            await helpers.mine()

            //value is greater minimum value
            expect(fundMe.fund({value: ethers.parseEther("0.1")}))
                .to.be.revertedWith("window is closed")
        }
    )

    it("window open ,value is less than minimum, fund failed", async function () {
            //value is greater minimum value
            expect(fundMe.fund({value: ethers.parseEther("0.01")}))
                .to.be.revertedWith("Send more ETH")
    })

    it("window open ,value greater then minimum value, fund success", 
        async function () {
            //value is greater minimum value
            await fundMe.fund({value: ethers.parseEther("0.1")})
            //如何验证这个测试执行成功呢？根据fund逻辑发现只需要检查funderToAmount里面的值有没有更新
            const balance = await fundMe.funderToAmount(firstAccount)
            expect(balance).to.equal(ethers.parseEther("0.1"))
        }
    )

    //unit test for getFund
    

})