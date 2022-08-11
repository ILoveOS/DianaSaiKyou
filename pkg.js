/**
 * release打包
 * @author 澄茜早睡早起
 */

/**引入fs和archiver */
const fs=require('fs')
const archiver=require('archiver')

/**build后生成的文件夹路径 */
const buildPath='dist'
/**package信息 */
var pkg=JSON.parse(fs.readFileSync('package.json'))
/**打包文件名 */
var pkgName=`${pkg.name}-${pkg.version.replaceAll('.','-')}.zip`

var output=fs.createWriteStream(`${__dirname}/${pkgName}`)

var arch=archiver('zip',{
    zlib:{level:9}
})
/**设置监听器 */

arch.on('close',()=>{console.log(`文件大小:${arch.pointer()}Bytes`)})
arch.on('end',()=>{console.log(`版本号为${pkg.version}的release:${pkgName}打包完成！`)})
arch.on('error',err=>{console.error('打包失败!');console.error(err);if(fs.existsSync(`${__dirname}/${pkgName}`))fs.rmSync(`${__dirname}/${pkgName}`)})
/**压缩 */
arch.pipe(output)
arch.directory(buildPath,false)
arch.finalize()