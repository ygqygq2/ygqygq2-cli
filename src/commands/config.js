// 专门管理.ygqygq2clirc文件(在当前的用户目录下)

const {get, set, remove, getAll} = require('../utils/rc')
const config = async (action, k, v) => {
    switch (action) {
        case 'get':
            if (k) {
                let key = await get(k)
                console.log(key)
            } else {
                let obj = await getAll()// 没有键值取全部
                Object.keys(obj).forEach(key => {
                    console.log(`${key}=${obj[key]}`)
                })
            }
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
