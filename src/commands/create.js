const download = require('download-git-repo')
const handlebars = require('handlebars')
const fs = require('fs')
const fse = require('fs-extra')
const inquirer = require('inquirer')
const path = require('path')
const ora = require('ora');
const chalk = require('chalk');
const {copy, exists} = require('../utils/copy');

const configList = (project) => {
    return [
        {
            path: 'README.md',
            data: {
                project
            }
        }, {
            path: 'project.json',
            data: {
                project
            }
        }, {
            path: 'package.json',
            data: {
                project
            }
        }
    ]
}
const create1 = (name) => {
    const list = configList(name)
    if (!fs.existsSync(name)) {
        const spinner = ora('正在创建模板');
        const projectName = path.join(process.cwd(), name)
        spinner.start();
        exists('./template', projectName, copy, function (err) {
            if (err) {
                return console.error(error)
            }
            spinner.succeed();
            list.forEach(item => {
                const templatePath = path.join(__dirname, '../../template', item.path)
                const targetPath = path.join(process.cwd(), name, item.path)
                const templateData = fs.readFileSync(templatePath).toString();
                const generateData = handlebars.compile(templateData)(item.data);
                fs.writeFileSync(targetPath, generateData)
            });
            console.log(chalk.green('Successfully created project ' + name));
            console.log(chalk.green('Get start width the following commands'));
            console.log('cd ' + name);
            console.log('npm install');
            console.log('npm run serve');
        })
    } else {
        console.log(symbols.error, chalk.red('项目已存在'))
    }
}
const xxx = async () => {
    const list = await fse.readdir('./template')
    // list = path.map(({name})=>name)
    console.log(list)
    let answer = await inquirer.prompt([
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
    console.log(templateName)
    const list = configList(name)
    const spinner = ora('正在创建模板');
    const projectName = path.join(process.cwd(), name, templateName)
    console.log(projectName)
    spinner.start();
    // 过滤函数
    const filterFuc = (src, dest) => {
        if (src.indexOf('node_modules') > -1) {
            return false;
        }
        return true;
    }
    fse.copy(`./template/${templateName}`, projectName, {filter: filterFuc}, (err) => {
        if (err) return console.error(err)
        spinner.succeed();
    })
}

module.exports = create