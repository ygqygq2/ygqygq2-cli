const fs = require('fs');
const request = require('request') // 导入爬虫模块
const {getAll} = require('./rc') // 拿到我们所有的config参数
const downLoadGit = require('download-git-repo') // 导入git下载模板插件
const {DOWNLOAD} = require('./constants') // 导入本地缓存区地址

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
// 获取所有分支
const tagList = async () => {
    // 获取所有config配置
    let config = await getAll()
    // 动态配置模板下载地址
    let api = `https://api.github.com/repos/${config.github.registry}/${config.github.repo}/branches`
    return await fetch(api)
}
// 获取所有仓库
const repoList = async () => {
    // 获取所有config配置
    const config = await getAll()
    // 动态配置模板下载地址
    const api = `https://api.github.com/${config.github.type}/${config.github.registry}/repos`
    return await fetch(api)
}

// 使用 git 下载到本地存为模板，以分支名命名目录名
const downloadLocal = async (branch) => {
    const conf = await getAll()
    const registry = conf.github.registry
    const repo = conf.github.repo
    const api = `${registry}/${repo}#${branch}`
    const destDir = DOWNLOAD + '/' + branch

    try {
        fs.accessSync(destDir, fs.constants.R_OK | fs.constants.W_OK);
        fs.rmSync(destDir, { recursive: true })
    } catch (err) {
        console.error(err);
    }

    return downLoadGit(api, destDir, {clone: true}, function (err) {
        console.log(err ? err : 'Success')
    })
}

module.exports = {
    repoList,
    tagList,
    downloadLocal
}
