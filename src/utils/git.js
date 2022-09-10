const request = require('request') // 导入爬虫模块
const {getAll} = require('./rc') // 拿到我们所有的config参数
const downLoadGit = require('download-git-repo') // 导入git下载模板插件
const {DOWNLOAD} = require('./constants') // 导入本地缓存区地址

console.log(DOWNLOAD)

// 封装一个请求方法
let fetch = async (url) => {
    // 封装一个promise
    return new Promise((resolve, reject) => {
        let config = {
            url,
            method: 'get',
            headers: {
                'user-agent': '' // 下载git的资源必须加这个参数，这个是git的规定
            }
        }
        // 参数是固定的，根据request模块文档来的
        request(config, (err, response, body) => {
            if (err) {
                reject(err)
            }
            resolve(JSON.parse(body)) // 返回的是一个字符串类型，需要转成json
        })

    })
}
// 配置下载版本号列表
const repoList = async () => {
    // 获取所有config配置
    let config = await getAll()
    // 动态配置模板下载地址
    let api = `https://api.github.com/repos/${config.github.registry}/${config.github.repo}/branches`
    console.log(api)
    return await fetch(api)
}
// 配置下载地址列表
const tagList = async (projectName) => {
    // 获取所有config配置
    let config = await getAll()
    // 动态配置模板下载地址
    let api = `https://api.github.com/${config.github.type}/${config.github.registry}/repos`
    return await fetch(api)
}

// 封装git下载方法，有两个参数，从哪下载，存放到哪
const download = async (src, dest) => {
    return new Promise((resolve, reject) => {
        downLoadGit(src, dest, (err) => {
            if (err) {
                reject(err)
            }
            resolve()
        })
    })
}
// 封装git下载到本地方法，需要两个参数，一个是项目名，一个是版本号
const downloadLocal = async (project, version) => {
    let conf = await getAll()
    let api = `${conf.registry}/${project}`
    if (version) {
        api += `#${version}` // 如果有版本号，以哈希的方式拼上版本号
    }
    return await download(api, DOWNLOAD + '/' + project) // 下载地址，存放地址和文件名
}
module.exports = {
    repoList,
    tagList,
    download,
    downloadLocal
}