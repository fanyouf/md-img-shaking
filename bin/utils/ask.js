const inquirer = require('inquirer')

async function askMarkdown(mdFiles) {
    var promps = [
        {
            type: 'checkbox',
            name: 'yourSelect',
            message: '请选择要分析的markdown文件:',
            choices: mdFiles,
            default: ['全部'],
            validate: function (input) {
                if (input.length == 0) {
                    return '至少要选中一项'
                }
                return true
            }
        }
    ]
    let { yourSelect } = await ask(promps)

    if (yourSelect.includes('全部')) {
        yourSelect = mdFiles.filter(it => it != '全部' && typeof it ==='string')
    }
    // console.log( yourSelect )
    return yourSelect
}
async function askToDoWithImg() {
    const choices = [
        "移动这些图片",
        "不移动，只显示这些图片信息",
        "不移动，将图片信息导出到文件"
    ]
    promps = [
        {
            type: 'rawlist',
            message: '请选择操作:',
            name: 'choice',
            choices
        }
    ]

    let { choice } = await ask(promps)
    return choices.indexOf(choice)
}

async function askToMove() {
    promps = [
            {
            type: 'confirm',
            name: 'isMove',
            message: '你需要把它们拷贝出来吗？',
        }
    ]

    let { isMove } = await ask(promps)
    return isMove
}

function ask(promps) {
    return new Promise((resolve, reject) => {
        inquirer.prompt(promps).then(answer => {
            resolve(answer)
        })
    })
}

module.exports = { askMarkdown, askToMove,askToDoWithImg }