# JS知识

## npm install
npm install --save-dev	npm install -D	添加开发依赖 安装在devDependencies
npm install --save	    npm install -S	添加生产依赖（默认行为）
npm install --global	npm install -g	全局安装包

## js导入，什么时候需要加.config()，什么时候不加
require("@chainlink/env-enc").config();
require("./tasks/deploy-fundme");


### 总结：
需要 .config()：当模块设计要求显式初始化（如环境变量加载）。
不需要 .config()：当模块导出的是直接可用的对象/函数。
通过模块的 设计意图 和 导出结构 即可快速判断是否需要调用 .config()。


## 变量导入，导出

### 导出文件中配置
配置
const x = 8

导出
module.exports = {}

### 导入文件中配置
const { x } = require("导出文件")


### 函数导出的方式

function deployFunction() {
    console.log("this a deploy function")
}
module.exports.default = deployFunction

匿名函数
module.exports = (async (hre) => {
    const getNamedAccounts = hre.getNamedAccounts
    const deployments = hre.deployments
    console.log("this is a deploy function")
})


