const ora = require('ora') // 导入命令行动画插件
const {repoList, tagList, downloadLocal} = require('../utils/git') // 导入地址方法和版本号方法和下载git模板到本地方法
const inquirer = require('inquirer') // 导入用户选择模板插件

const install = async () => {
    // 下载模板 选择模板使用
    //创建命令行动画
    let loading = ora('fetching template......')
    //运行动画
    loading.start()
    // 通过配置文件，获取模板信息（有哪些模板）
    let list = await repoList()
    //关闭动画
    loading.succeed()
    console.log(list)
    list = list.map(({name}) => name) // 只要name属性
    console.log(list) // 出来的是模板数组
    // inquirer.prompt方法返回的是一个promise
    let answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'project',
            choices: list,
            questions: 'please choice template(请选择模板)'
        }
    ])

    console.log(answer.project)
    // 项目名字
    let project = answer.project

    // 获取当前项目版本号tag
    //创建命令行动画
    loading = ora('fetching branches(根据分支区分不同模板)......')
    //运行动画
    loading.start()
    // 获取当前项目版本号
    let tagLists = await tagList(project)
    //关闭动画
    loading.succeed()
    tagLists = tagLists.map(({name}) => name)
    let tag;
    if (tagLists.length > 0) {
        answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'tag',
                choices: tagLists,
                questions: 'please choice branch(请选择分支)'
            }
        ])
        tag = answer.tag
    } else {
        tag = ''
    }
    // 调用下载到本地方法，下载文件
    //创建命令行动画
    loading = ora('fetching project(下载工程中)......')
    //运行动画
    loading.start()
    await downloadLocal(project, tag)
    console.log('下载功能')
    //关闭动画
    loading.succeed()
}

module.exports = install;