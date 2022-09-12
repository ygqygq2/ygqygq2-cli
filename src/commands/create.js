const handlebars = require('handlebars')
const fs = require('fs')
const fse = require('fs-extra')
const inquirer = require('inquirer')
const path = require('path')
const ora = require('ora');
const {copy, exists} = require('../utils/copy');
const {DOWNLOAD} = require('../utils/constants') // 导入本地缓存区地址
const {success, error} = require('../utils/message')

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
                return console.error(err)
            }
            spinner.succeed();
            list.forEach(item => {
                const templatePath = path.join(__dirname, '../../template', item.path)
                const targetPath = path.join(process.cwd(), name, item.path)
                const templateData = fs.readFileSync(templatePath).toString();
                const generateData = handlebars.compile(templateData)(item.data);
                fs.writeFileSync(targetPath, generateData)
            });
            success('Successfully created project ' + name);
            success('Get start width the following commands');
            console.log('cd ' + name);
            console.log('npm install');
            console.log('npm run serve');
        })
    } else {
        console.log(error('项目已存在'))
    }
}

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
    const projectName = path.join(process.cwd(), name, templateName)
    spinner.start();
    // 过滤函数
    const filterFuc = (src, dest) => {
        if (src.indexOf('node_modules') > -1) {
            return false;
        }
        return true;
    }
    fse.copy(`${DOWNLOAD}/${templateName}`, projectName, {filter: filterFuc}, (err) => {
        if (err) return console.error(err)
        spinner.succeed();
    })
}

module.exports = create
