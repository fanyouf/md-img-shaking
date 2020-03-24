#!/usr/bin/env node
var program = require('commander');

const path = require('path');
const fs = require('fs');

const chalk = require('chalk');
const figlet = require('figlet');

const { askMarkdown, askToMove, askToDoWithImg } = require('./utils/ask')
const { readAllMarkDown,
  getAllImg,
  unUsed,
  moveTo,
  isExist,
  getAllImgInfo } = require('./utils')

let curPath = process.cwd()
let allMarkdownFiles = readAllMarkDown(curPath).map(item => path.join(curPath, item))
let mdFiles = []
if (allMarkdownFiles.length === 0) {
  console.log('当前目录下没有.md文件。程序退出')
} else {
  mdFiles = ['全部',  ...allMarkdownFiles]
}

console.log(
  chalk.yellow(
    figlet.textSync('md-img-shaking', { horizontalLayout: 'full' })
  )
);

program
  .action(async () => {
    let yourSelect = await askMarkdown(mdFiles)

    if (yourSelect.length < 0) {
      return;
    }

    let { result, imgsFilePath, images } = getAllImgInfo(yourSelect)
    // console.log(result)
    console.log("帮你扫描了"+chalk.green(yourSelect.length)+"份markdown文件，其中用到了"+chalk.green(images.length)+"张图片");
    
    

    if (images.length === 0) {
      console.log(chalk.green(`在${yourSelect.length}份markdown文件中并没有引入任何相对路径的图片`));
      return
    }
    console.log(chalk.green(`引用了${images.length}张图片，来自${imgsFilePath.length}个目录:`));
    imgsFilePath.forEach((it, idx) => {
      console.log(chalk.green(` 目录${idx + 1}: ${it}`));
    })

    let allImage = getAllImg(imgsFilePath.map(item => path.join(curPath, item)))

    let unUsedImages = (unUsed(allImage, images))   
    console.log()
    console.log('结果：')

    let checkResult = isExist(result) 
    Object.keys(checkResult).forEach(obj=>{
      
      console.log(`"${path.basename(obj)}" 中有 [${checkResult[obj].length}] 张图引用错误`)
      checkResult[obj].forEach((f,idx) => {
        console.log(`   ${idx+1} `,f)
      })
    })

    if (unUsedImages.length) {
      console.log(chalk.red(`有${unUsedImages.length}张图片没有使用`));
      let answers = await askToDoWithImg()
      // 0: "移动这些图片",
      // 1: "不移动，只显示这些图片信息",
      // 2: "不移动，将图片信息导出到文件"
      let = folderPath = 'unusedImage' + Date.now()
   

      if (answers == 0) {
        moveTo(unUsedImages, path.join(curPath, folderPath))
        console.log(chalk.green(`${unUsedImages.length}张图片并移动到了${folderPath}目录下`));
      } else if (answers == 1) {
        unUsedImages.forEach((it, idx) => {
          console.log(chalk.green(`${idx + 1}: ${it}`));
        })
      } else if (answers == 2) {
        let filepath = path.join(curPath, folderPath + '.json')
        fs.writeFileSync(filepath, JSON.stringify(unUsedImages))
        console.log(chalk.green(`${unUsedImages.length}张图片保存在了${filepath}下`));
      }
    } else {

      console.log(chalk.yellowBright(`    你的markdown文件中引用的图片目录是整洁的 `));
    }
  })
program.parse(process.argv);

