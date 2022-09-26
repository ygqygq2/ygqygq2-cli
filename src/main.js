const program = require('commander');
const {VERSION} = require('./utils/constants') // 导入版本号
const main = require('./index') // 导入功能文件
const actionMap = {
    install: {
        alias: "i", // 缩写
        description: "install template", // 描述
        examples: [
            // 例子
            "ygqygq2-cli i",
            "ygqygq2-cli install",
        ],
    },
    create: {
        alias: 'c',
        description: 'create project',
        examples: [
            'ygqygq2-cli create <projectName>',
            'ygqygq2-cli c <projectName>'
        ]
    },
    config: {
        alias: "c",
        description: "config .ygqygq2clirc", // 插件的描述文件，后面用到再创建
        examples: [
            "ygqygq2-cli config set <key> <value>", // 设置key和value
            "ygqygq2-cli config get <key>",
            "ygqygq2-cli config remove <key>",
        ],
    },
    // 最后一些必须写*，表示其他的找不到指令了
    "*": {
        alias: '',
        description: "not found",
        examples: [],
    },
};

// 在循环生成配置时
Object.keys(actionMap).forEach(action => {
    // 遍历对象，action为键值对的key
    program
        .command(action) //指令
        .alias(actionMap[action].alias)
        .description(actionMap[action].description) //描述
        .action(function (cmd, options) {
            //判断当前操作
            main(action, ...process.argv.slice(3))
        });
})

function help() {
    console.log("Examples 以下是使用例子");
    Object.keys(actionMap).forEach((action) => {
        // 遍历对象，action为键值对的key
        actionMap[action].examples.forEach(example => {
            // 打印使用方法例子
            console.log('  - ' + example)
        });
    });
}

program.on("-h", help);
program.on("--help", help);
program.version(VERSION, '-v --version').parse(process.argv)
