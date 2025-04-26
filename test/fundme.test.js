const { ethers, deployments, getNamedAccounts } = require("hardhat")
const { assert } = require("chai")

describe("test fundme contract", async function () {
    let fundMe
    let firstAccount
    //在所有it之前执行
    beforeEach(async function (params) {
        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        //deployments可以获取所有我们部署过的合约
        const fundMeDeployment = await deployments.get("FundMe")
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
    })

    //测试构造函数，在合约部署好以后，owner没有被设置好
    it("test if the owner is msg.sender", async function () {
        /* //获取合约发送人
        const [firstAccount] = await ethers.getSigners()      //返回的是signer对象集合
        const fundmeFactory = await ethers.getContractFactory("FundMe")
        const fundMe = await fundmeFactory.deploy(100) */

        await fundMe.waitForDeployment()
        //assert.equal((await fundMe.owner()), firstAccount.address)
        assert.equal((await fundMe.owner()), firstAccount)
    })

    it("test if the dataFeed is assigned correctly", async function () {
        /* //获取合约发送人
        const fundmeFactory = await ethers.getContractFactory("FundMe")
        const fundMe = await fundmeFactory.deploy(100)*/
        
        await fundMe.waitForDeployment() 
        assert.equal((await fundMe.dataFeed()), "0x694AA1769357215DE4FAC081bf1f309aDC325306")
    })
})