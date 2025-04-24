const { task } = require("hardhat/config");

const lockTime = 1200;

task("deploy-fundme", "deploy and verify fundme contract")
    .setAction(async (taskArgs, hre) => {
        //create factory. await是等待getContractFactory这个操作完成，再进行下一个步
        const fundMeFactory = await ethers.getContractFactory("FundMe");
        console.log(`contract deploying`);

        //deploy contract from factory.
        //这个deploy只是去发送deploy的操作，并不保证deploy已经完成。相当于metamask中，点击【部署】然后metamask弹出【comfirm】再点确认。并不保证写在区块链上
        const fundMe = await fundMeFactory.deploy(lockTime);

        //等它入块：等它被所有节点验证完，最终被写入区块链
        await fundMe.waitForDeployment();
        console.log(`contract has been deployed successfully, contract address is + ${fundMe.target}`);

        //获取chainId是测试环境，并且etherscan中apikey存在
        if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_APIKEY) {
            //verify FundMe
            console.log("waiting for 5 confirmations");
            await fundMe.deploymentTransaction().wait(5); // 等待 5 个区块确认
            verifyFundMe(fundMe.target, [lockTime]);
        } else {
            console.log("verfication skipped...");
        }
    })

module.exports = {}

async function verifyFundMe(fundMeAddr, args) {

    //hre:hardhat-env进行时环境
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: args,
    });
}