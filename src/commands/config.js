// 专门管理.ygqygq2clirc文件(在当前的用户目录下)
const fs = require("fs");
const {RC} = require('../utils/constants')
const {get, set, remove, getAll} = require('../utils/rc')

// 输出所有的配置
const printAllConfig = () => {
    // eslint-disable-next-line no-case-declarations
    const data = fs.readFileSync(RC);
    console.log(data.toString());
}

const config = async (action, k, v) => {
    switch (action) {
        case 'get':
            // get 后接了参数
            if (k) {
                let key = await get(k)
                console.log(key)
            } else {
                let obj = await getAll()// 没有键值取全部
                console.log(obj)
                Object.keys(obj).forEach(key => {
                    console.log(`${key}=${obj[key]}`)
                })
            }
            break
        case 'list':
            // 输出所有的配置
            printAllConfig()
            break
        case 'set':
            await set(k, v)
            break
        case 'remove':
            await remove(k)
            break
        default:
            break;
    }
}

module.exports = config
