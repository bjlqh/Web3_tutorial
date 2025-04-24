JS知识

require("@chainlink/env-enc").config();
require("./tasks/deploy-fundme");
js导入，什么时候需要加.config()，什么时候不加

##总结：
需要 .config()：当模块设计要求显式初始化（如环境变量加载）。
不需要 .config()：当模块导出的是直接可用的对象/函数。
通过模块的 设计意图 和 导出结构 即可快速判断是否需要调用 .config()。