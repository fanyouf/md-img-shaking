
const fs = require('fs')
const path = require('path')
function isRelatvie(p){
    if(p.startsWith('http')){
        return false
    }
    if(path.isAbsolute(p)){
        return false
    }
    return true
}
module.exports = {
    unUsed(allImage,useImage){
        return allImage.filter(img => !useImage.includes(img))
    },
    moveTo(filePathArr,dirname){
        fs.mkdirSync(dirname);
        filePathArr.forEach(file=>{

            let newPathFile = path.join(dirname, path.basename(file))
            fs.renameSync(file,newPathFile)
        })
    },
    readAllMarkDown:function(rootDir){
        return fs.readdirSync(rootDir).filter(fileName=>fileName.endsWith('.md'))
    },

    getAllImg:function(assetsPaths){
        let result = []
        assetsPaths.forEach(assetsPath => {
            // console.log(assetsPath)
            if(!fs.existsSync(assetsPath)) {
                return 
            }
            let rs = fs.readdirSync(assetsPath).filter(it=>{
                return isRelatvie(it)
            }).map(it=>path.join(assetsPath,it))
            // console.log(rs)
            result = result.concat( rs)
        })
        return result
    },
    
    getAllImgInfo:function(mkFiles){
        let result = {}
        let imgsFilePath = new Set()
        let images = new Set()
        // let filePath = mkFiles[0]
        mkFiles.forEach(filePath=>{
            let fileContent = fs.readFileSync(filePath,'utf8');
            fileContent.replace(/\!\[(.*)\]\((.*)\)/g,(str,$1,$2)=>{
                // console.log($1,$2)
                if( result[filePath]){
                    result[filePath].push({'name':$1,'path':path.join(path.dirname(filePath),$2)})
                } else {
                    result[filePath] = [{'name':$1,'path':path.join(path.dirname(filePath),$2)}]

                }
                images.add( path.join(path.dirname(filePath),$2) )
                imgsFilePath.add(path.dirname($2) )
            })
            // console.log(result)
        })
        return {result,imgsFilePath:[ ...imgsFilePath],images:[ ...images]} ;
    },
    isExist(result){
       let  files = Object.keys(result)
       let imgs = Object.values(result)
        let obj = {
        }
        files.forEach((file,idx)=>{
            imgs[idx].forEach(({path,name})=>{
                if( isRelatvie(path) && !fs.existsSync(path)) {
                    obj[file] ?  obj[file].push( path ) : (obj[file] = [path])
                }
            })

        })
        return obj
    }
}