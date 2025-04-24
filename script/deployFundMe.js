//1.import ethers这个包是用于和evm chain上的合约进行交互，并且部署合约的第三方包.
//一般来说部署合约的时候会涉及两个包，一个叫web3.js, 一个叫ethers.js。在hardhat中我们用的ethers.js
//ethers里面ContractFactory连接一个合约，部署一个合约。

//2.create main function
//3.execute main function

const { ethers } = require("hardhat");

const lockTime = 300;

async function main() {
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
    }else {
        console.log("verfication skipped...");
    }

    // init 2 accounts
    const [firstAccount, secondAccount] = await ethers.getSigners();

    // fund contract with first account
    const fundTx = await fundMe.fund({value: ethers.parseEther("0.1")});
    await fundTx.wait();

    // check balance of contract
    const balanceOfContract = await ethers.provider.getBalance(fundMe.target);
    console.log(`Balance of the contract is ${balanceOfContract}`);

    // fund contract with second account
    const fundTxWithSecondAccount = await fundMe.connect(secondAccount).fund({value: ethers.parseEther("0.1")});
    await fundTxWithSecondAccount.wait();

    // check balance of contract
    const balanceOfContractAfterSecondFund = await ethers.provider.getBalance(fundMe.target);
    console.log(`Balance of the contract is ${balanceOfContractAfterSecondFund}`);

    // check mapping fundersToAmount
    const firstAccountBalanceInFundMe = await fundMe.funderToAmount(firstAccount.address);
    const secondAccountBalanceInFundMe = await fundMe.funderToAmount(secondAccount.address);
    console.log(`Balance of first account ${firstAccount.address} is ${firstAccountBalanceInFundMe}`);
    console.log(`Balance of second account ${secondAccount.address} is ${secondAccountBalanceInFundMe}`);

}

main().then().catch((error) => {
    console.error(error);
    process.exit(1);
});

async function verifyFundMe(fundMeAddr, args) {

    //hre:hardhat-env进行时环境
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: args,
    });

}