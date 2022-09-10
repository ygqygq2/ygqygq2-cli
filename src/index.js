const {betterRequire} = require('./utils/common') // 导入公共方法封装文件
const {resolve} = require('path') // 导入nodejs自带的路径插件

// 命令行的命令拿到后，这里是主流程控制
let apply = (action, ...args) => {
  betterRequire(resolve(__dirname, `commands/${action}`))(...args)
}
module.exports = apply