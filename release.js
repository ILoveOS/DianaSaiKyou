/**引入jsonfile模块 */
const fs=require('fs')

/**
 * 从file中读取json数据
 * @param {string} file 文件 
 */
const readJsonSync=file=>{
    return JSON.parse(fs.readFileSync(file))
}

/**
 * 将object写入json文件
 * @param {string} file 文件 
 * @param {any} obj 要写入的object
 */
const writeJsonSync=(file,obj)=>{
    let json=JSON.stringify(obj,null,2)
    fs.writeFileSync(file,json)
}

/**
 * 写入版本号
 * @param {stirng} version 版本号 
 */
const writeVersion=version=>{
    var manifest=readJsonSync('./public/manifest.json')
    var repo=readJsonSync('./public/repo.json')
    var pkg=readJsonSync('./package.json')
    var pkgLock=readJsonSync('./package-lock.json')
    repo.version=`v${version}`
    manifest.version=version
    pkg.version=version
    pkgLock.version=version
    writeJsonSync('./public/manifest.json',manifest)
    writeJsonSync('./public/repo.json',repo)
    writeJsonSync('./package.json',pkg)
    writeJsonSync('./package-lock.json',pkgLock)
}
/**
 * 大版本更新
 */
const major=()=>{
    var mip=readJsonSync('./package.json').version.split('.')
    var newVersion=`${Number(mip[0])+1}.0.0`
    writeVersion(newVersion)
    return newVersion
}
/**
 * 小版本更新
 */
const minor=()=>{
    var mip=readJsonSync('./package.json').version.split('.')
    var newVersion=`${mip[0]}.${Number(mip[1])+1}.0`
    writeVersion(newVersion)
    return newVersion
}
/**
 * 补丁
 */
const patch=()=>{
    var mip=readJsonSync('./package.json').version.split('.')
    var newVersion=`${mip[0]}.${mip[1]}.${Number(mip[2])+1}`
    writeVersion(newVersion)
    return newVersion
}

let command=process.argv[2]
switch(command){
    case 'major':{
        console.log(`正在生成大版本更新:${major()}`)
        break
    }
    case 'minor':{
        console.log(`正在生成小版本更新:${minor()}`)
        break
    }
    case 'patch':{
        console.log(`正在生成补丁更新:${patch()}`)
        break
    }
    default:{
        console.error(`未知的命令:${command}. <Usage> node release major|minor|patch`)
        break
    }
}
