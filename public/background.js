/**
 * 插件的Service_work
 * 用于给其他组件提供服务
 * @author 澄茜早睡早起
 */

/**
 * 默认选项
 */
const DefaultOption = {
    //标签页标题
    title: '新标签页',
    //背景颜色
    backgroundColor: '#FFFFFF',
    //前景色
    color: '#E799B0',
    //电台节目rid
    playList: '959370203',
    //搜索引擎id
    searchTool: 0,
    //图标
    icon: '/assets/icon.png',
    //光标附加图片
    cursor: '/assets/cursor.png',
    //光标附加图片大小
    cursorSize: 30,
    //进度条图标
    progressIcon: '/assets/progress.png',
    //独轮车内容
    wheelText: '嘉然最強！嘉然最強！嘉然最強！嘉然最強！',
    //独轮车启动图片
    wheelStartImg: chrome.runtime.getURL('/assets/dacall.gif'),
    //独轮车停止图片
    wheelPauseImg: chrome.runtime.getURL('/assets/dacall.png'),
    //独轮车频率(ms)
    wheelInterval: 7000
}
/**
 * 服务
 */
const Services = {
    /**
     * 设置选项
     * @param {{options:object}} params 参数
     * @param {function} callback 回调函数
     */
    setOption: (params, callback) => {
        chrome.storage.local.set({ Options: params.options }, callback(success(null, '选项设置成功')))
    },
    /**
     * 获取选项
     * @param {{}} params 参数
     * @param {function} callback 回调函数
     */
    getOption: (params, callback) => {
        var copy = {}
        for (let i in DefaultOption)
            copy[i] = DefaultOption[i]
        chrome.storage.local.get('Options', res => {
            let data = res.Options
            if (data != null) {
                for (let i in data)
                    copy[i] = data[i]
            }
            callback(success(copy, '选项获取成功'))
        })
    },
    /**
     * 重置选项
     * @param {{}} params 参数
     * @param {function} callback 回调函数
     */
    clearOption: (params, callback) => {
        chrome.storage.local.set({ Options: null }, callback(success(DefaultOption, '选项重置成功')))
    },
    /**
     * 获得书签
     * @param {{}} params 参数
     * @param {function} callback 回调函数 
     */
    getBookmarks: (params,callback)=>{
        chrome.bookmarks.getTree().then(res=>{
            if(res.length<=0)callback(error(404,'书签获取失败'))
            else{
                let roots=res[0]
                if(roots.children.length<=0)callback(error(404,'书签获取失败'))
                else{
                    let root=roots.children[0]
                    callback(success(root.children,'书签获取成功'))
                }
            }
        })
    },
    /**
     * 添加/修改书签
     * @param {{id?:string,title?:string,url?:string}} params 参数
     * @param {function} callback 回调函数
     */
    setBookmark: (params,callback)=>{
        if(params.id!=null){
            let changes={}
            if(params.title!=null)changes.title=params.title
            if(params.url!=null)changes.url=params.url
            chrome.bookmarks.update(params.id,changes,res=>callback(success(res,'书签修改成功 ')))
        }
        else{
            if(params.title==null||params.url==null||params.title.trim()==''||params.url.trim()=='')callback(error(500,'标题或url不能为空'))
            else{
                chrome.bookmarks.getTree().then(res=>{
                    if(res.length<=0)callback(error(404,'书签文件夹访问失败'))
                    else{
                        let roots=res[0]
                        if(roots.children.length<=0)callback(error(404,'书签文件夹访问失败'))
                        else{
                            let root=roots.children[0]
                            chrome.bookmarks.create({parentId:root.id,title:params.title,url:params.url},res=>callback(success(res,'书签添加成功')))
                        }
                    }
                })
                
            }
        }
    },
    /**
     * 删除书签
     * @param {{id:string}} params 参数
     * @param {function} callback 回调函数 
     */
    removeBookmark: (params,callback)=>{
        chrome.bookmarks.remove(params.id,res=>callback(success(res,'书签删除成功')))
    },
    /**
     * 获取指定url的Favicon
     * @param {{url:string}} params 参数
     * @param {function} callback 回调函数 
     */ 
    getFavicon: (params,callback)=>{
        var u
        try{
            u=new URL(params.url)
        }catch{
            callback(error(404,'获取失败'))
        }
        callback(success(`${u.protocol}//${u.host}/favicon.ico`,'获取成功'))
    }
}
/**
 * 服务调用成功后返回的数据
 * @param {object} data 返回数据 
 * @param {string} message 信息 
 * @returns {{code:Number,data:object,message:string}}
 */
const success = (data, message) => { return { code: 0, data: data, message: message } }
/**
 * 服务调用失败后返回的数据
 * @param {number} code 返回代码
 * @param {string} message 信息
 * @returns {{code:Number,data:object,message:string}}
 */
const error = (code, message) => { return { code: code, data: null, message: message } }
/**
 * 与外部通信的监听器
 */
chrome.runtime.onMessage.addListener((req, sender, res) => {
    if (req != null) {
        let service = req.service
        let params = req.params
        if (Services[service] == null || typeof (Services[service]) != 'function')
            res(error(404, `Service ${service} Not Found`))
        else
            Services[service](params, res)
        return true
    }
})