// 存放用户所需要的常量
const {version} = require("../../package.json"); //导入package.json的版本号
const VERSION = version; //导出

// 通过node方法找到用户根目录，由于macos和windows要取的值不一样，要判断一下(windows统一叫win32)
const HOME = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME']
const RC = `${HOME}/.ygqygq2clirc`
// RC配置下载模板的地方，给github的api用来拉项目[github的vue模板地址](https://api.github.com/orgs/vuejs-templates/repos)
const DEFAULTS = {
    registry: 'ygqygq2', // 希望仓库从哪来
    type: 'users' // 表示定义在个人目录（users）下还是用户目录（orgs）下
}

// 下载目录
const DOWNLOAD = `${HOME}/.template`
module.exports = {
    VERSION,
    RC,
    DEFAULTS,
    DOWNLOAD
}