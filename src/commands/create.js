const fse = require('fs-extra');
const inquirer = require('inquirer');
const path = require('path');
const ora = require('ora');
const handlebars = require('handlebars');
const {DOWNLOAD} = require('../utils/constants'); // 导入本地缓存区地址

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
    return answer.template;
}

const transformTemplate = (srcFilePath, destFilePath, params) => {
    fse.readFile(srcFilePath, 'utf-8', (err, data) => {
        if (err) console.log(err);
        const template = handlebars.compile(data);
        const result = template(params);
        fse.writeFile(destFilePath, result);
    });
};

// 读取模板文件
const readFileList = (dir, filesList = []) => {
    const files = fse.readdirSync(dir);
    // console.log(files);
    files.forEach((item, index) => {
        var fullPath = path.join(dir, item);
        const stat = fse.statSync(fullPath);
        if (stat.isDirectory()) {
            readFileList(path.join(dir, item), filesList);  //递归读取文件
        } else {
            filesList.push(fullPath);
        }
    });
    return filesList;
};

const create = async (name) => {
    const templateName = await xxx();
    const spinner = ora('正在创建模板');
    const projectName = path.join(process.cwd(), name)
    spinner.start();
    console.log(projectName);

    // 拷贝文件
    fse.copy(`${DOWNLOAD}/${templateName}`, projectName, (err) => {
        if (err) return console.error(err)
        spinner.succeed();

        // 读取模板文件转换成代码文件
        const templateRoot = path.join(DOWNLOAD, templateName, "template");
        const filesList = readFileList(templateRoot);

        filesList.forEach((item, index) => {
            const destFilePath = item.replace(templateRoot, projectName);
            transformTemplate(item, destFilePath, {name});
        });

        fse.removeSync(path.join(projectName, 'template'));
    })

}

module.exports = create;
