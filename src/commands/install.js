const fs = require('fs');
const {RC} = require('../utils/constants')
const ora = require('ora') // 导入命令行动画插件
const {tagList, downloadLocal} = require('../utils/git') // 导入地址方法和版本号方法和下载git模板到本地方法
const inquirer = require('inquirer') // 导入用户选择模板插件

const setConfig = async () => {
    fs.access(RC, function (err) {
        // 如果不存在
        if (err) {
            fs.copyFile(`${__dirname}/../../.ygqygq2clirc`, RC, function (err) {
                if (err) console.log(err)
                else console.log('copy file .ygqygq2clirc succeed');
            })
        }
    });

}

const install = async () => {
    // 复制配置文件到用户目录
    setConfig()
    // 下载模板 选择模板使用
    //创建命令行动画
    let loading = ora('fetching template......')
    //运行动画
    loading.start()
    // 通过配置文件，获取模板信息（有哪些模板）
    let list = await tagList()
    //关闭动画
    loading.succeed()
    list = list.map(({name}) => name) // 只要name属性
    // console.log(list) // 出来的是模板数组
    // inquirer.prompt方法返回的是一个promise
    let answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'project',
            choices: list,
            questions: 'please choice template(请选择模板)'
        }
    ])

    // 项目名字
    let project = answer.project

    // 调用下载到本地方法，下载文件
    //创建命令行动画
    loading = ora('fetching project(下载工程中)......')
    //运行动画
    loading.start()
    await downloadLocal(project)
    //关闭动画
    loading.succeed()
}

module.exports = install;