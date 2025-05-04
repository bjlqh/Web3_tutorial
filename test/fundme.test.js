const { ethers, deployments, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")
const { developmentChains } = require("../helper-hardhat-config")


!developmentChains.includes(network.name) //当是本地网络的时候
? describe.skip
:describe("unit test fundme contract", async function () {
    let fundMe
    let fundMeSecondAccount
    let firstAccount
    let secondAccount
    let mockV3Aggregator

    //在所有it之前执行
    beforeEach(async function () {
        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        secondAccount = (await getNamedAccounts()).secondAccount

        //deployments可以获取所有我们部署过的合约
        const fundMeDeployment = await deployments.get("FundMe")
        mockV3Aggregator = await deployments.get("MockV3Aggregator")
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
        fundMeSecondAccount = await ethers.getContract("FundMe", secondAccount)
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
            await expect(fundMe.fund({ value: ethers.parseEther("0.1") }))
                .to.be.revertedWith("window is closed")
        }
    )

    it("window open ,value is less than minimum, fund failed", async function () {
        //value is greater minimum value
        await expect(fundMe.fund({ value: ethers.parseEther("0.01") }))
            .to.be.revertedWith("Send more ETH")
    })

    it("window open ,value greater then minimum value, fund success",
        async function () {
            //value is greater minimum value
            await fundMe.fund({ value: ethers.parseEther("0.1") })
            //如何验证这个测试执行成功呢？根据fund逻辑发现只需要检查funderToAmount里面的值有没有更新
            const balance = await fundMe.funderToAmount(firstAccount)
            await expect(balance).to.equal(ethers.parseEther("0.1"))
        }
    )

    //unit test for getFund
    //onlyOwner windowClose target reached


    it("onlyOwner is not, window close, target reached, getFund failed",
        async function () {
            //make sure the target is reached
            await fundMe.fund({ value: ethers.parseEther("1") })

            //make sure the window is closed
            await helpers.time.increase(200)
            await helpers.mine()

            //secondAccount getFund
            await expect(fundMeSecondAccount.getFund())
                .to.be.revertedWith("this function can only be called by owner")
        })


    it("window open, target reached, getFund failed", async function () {
        await fundMe.fund({ value: ethers.parseEther("1") })
        expect(fundMe.getFund())
            .to.be.revertedWith("window is not closed")
    })

    it("window open, target not reached, getFund failed", async function () {

        await fundMe.fund({ value: ethers.parseEther("0.1") })

        await helpers.time.increase(200)
        await helpers.mine()

        await expect(fundMe.getFund())
            .to.be.revertedWith("Target is not reached")
    })


    it("window closed, target not reached, getFund failed", async function () {
        await fundMe.fund({ value: ethers.parseEther("0.1") })

        await helpers.time.increase(200)
        await helpers.mine()
        await expect(fundMe.getFund())
            .to.be.revertedWith("Target is not reached")
    })

    /**
     * fund的金额满足要求，窗口已经关闭，此时getFund成功
     * 如何判断成功，发送一个event
     */
    it("window closed, target reached, getFund success", async function () {
        await fundMe.fund({ value: ethers.parseEther("1") })

        await helpers.time.increase(200)
        await helpers.mine()

        await expect(fundMe.getFund())
            .to.emit(fundMe, "FundWithdrawByOwner")
            .withArgs(ethers.parseEther("1"))
    })

    //unit refund
    //window closed, target not reached, funder has balance

    it("window open, target not reached, funder has balance", async function () {
        await fundMe.fund({ value: ethers.parseEther("0.1") })
        
        await expect(fundMe.refund())
            .to.be.revertedWith("window is not closed")
    })

    it("window closed, target reached, funder has balance", async function () {
        await fundMe.fund({ value: ethers.parseEther("1") })

        await helpers.time.increase(200)
        await helpers.mine()
        
        await expect(fundMe.refund())
            .to.be.revertedWith("Target is reached")
    })

    it("window closed, target not reached, funder has not balance", async function () {
        await fundMe.fund({ value: ethers.parseEther("0.1") })

        await helpers.time.increase(200)
        await helpers.mine()
        
        await expect(fundMeSecondAccount.refund())
            .to.be.revertedWith("there is no fund for you")
    })


    it("window closed, target not reached, funder has balance", async function () {
        await fundMe.fund({ value: ethers.parseEther("0.1") })

        await helpers.time.increase(200)
        await helpers.mine()
        
        await expect(fundMe.refund())
            .to.emit(fundMe, "RefundByFunder")
            .withArgs(firstAccount, ethers.parseEther("0.1"))
    })
    
})