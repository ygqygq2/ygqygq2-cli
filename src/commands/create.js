const fse = require('fs-extra')
const inquirer = require('inquirer')
const path = require('path')
const ora = require('ora');
const {DOWNLOAD} = require('../utils/constants') // 导入本地缓存区地址

const xxx = async () => {
    const list = await fse.readdir(DOWNLOAD)
    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'template',
            choices: list,
            questions: 'please choice template'
        }
    ])
    return answer.template
}

const create = async (name) => {
    const templateName = await xxx();
    const spinner = ora('正在创建模板');
    const projectName = path.join(process.cwd(), name)
    spinner.start();
    // 过滤函数
    const filterFuc = (src, dest) => {
        if (src.indexOf('node_modules') > -1) {
            return false;
        }
        return true;
    }
    console.log(projectName)
    fse.copy(`${DOWNLOAD}/${templateName}`, projectName, {filter: filterFuc}, (err) => {
        if (err) return console.error(err)
        spinner.succeed();
    })
}

module.exports = create
