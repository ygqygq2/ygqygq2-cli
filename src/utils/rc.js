// 导入RC配置文件，DEFAULT默认配置
const {RC, DEFAULTS} = require('./constants')
// 导入key/valut和对象转换方法
const {encode, decode} = require('ini')
// 导入node默认包util的promise化方法
const {promisify} = require('util')
// 导入node默认包fs的读文件方法fs
const fs = require('fs')
// 定义方法,promisify可以把这个方法编程promise方法
const exists = promisify(fs.exists)
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// 定义几个公共的工具方法
const get = async (k) => {
    let has = await exists(RC) // 判断文件是否存在
    let opts //定义一个变量用来存获取到的文件
    if (has) {
        opts = await readFile(RC, 'utf8')
        opts = decode(opts) // 用ini的decode方法解下码，将key/valut转为对象
        return opts[k]
    }
    return ''
}
const set = async (k, v) => {
    let has = await exists(RC) // 判断文件是否存在
    let opts //定义一个变量用来存获取到的文件
    if (has) {
        opts = await readFile(RC, 'utf8')
        opts = decode(opts) // 用ini的decode方法解下码，将key/valut转为对象
        Object.assign(opts, {[k]: v})
    } else {
        opts = Object.assign(DEFAULTS, {[k]: v})
    }
    await writeFile(RC, encode(opts), 'utf-8')
}
const remove = async (k) => {
    let has = await exists(RC) // 判断文件是否存在
    let opts //定义一个变量用来存获取到的文件
    if (has) {
        opts = await readFile(RC, 'utf8')
        opts = decode(opts) // 用ini的decode方法解下码，将key/valut转为对象
        delete opts[k]
        await writeFile(RC, encode(opts), 'utf8')
    }
}
const getAll = async () => {
    let opts //定义一个变量用来存获取到的文件
    opts = await readFile(RC, 'utf8')
    opts = decode(opts) // 用ini的decode方法解下码，将key/valut转为对象
    console.log(opts)
    return opts
}
module.exports = {
    get,
    set,
    remove,
    getAll
}
