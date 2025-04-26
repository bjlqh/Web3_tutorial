
/* function deployFunction() {
    console.log("this a deploy function")
}
module.exports.default = deployFunction */

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
    //部署合约
    await deploy("FundMe", {
        from: firstAccount,
        args: [300],
        log: true
    })
}

module.exports.tags = ["all", "fundMe"]
