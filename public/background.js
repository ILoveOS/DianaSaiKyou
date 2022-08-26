/**
 * 插件的Service_work
 * 给其他组件提供服务
 * 同时后台周期性查询是否新动态并提醒
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
    //播放模式(0:列表循环,1:单曲循环,2:随机播放)
    playMode:0,
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
    wheelInterval: 7000,
    //动态推送UID
    dynUid: '672328094',
    //动态推送查询频率
    dynQueryInterval: 1,
}
const WebApis = { QueryDynamic: 'https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history' }
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
    getBookmarks: (params, callback) => {
        chrome.bookmarks.getTree().then(res => {
            if (res.length <= 0) callback(error(404, '书签获取失败'))
            else {
                let roots = res[0]
                if (roots.children.length <= 0) callback(error(404, '书签获取失败'))
                else {
                    let root = roots.children[0]
                    callback(success(root.children, '书签获取成功'))
                }
            }
        })
    },
    /**
     * 添加/修改书签
     * @param {{id?:string,title?:string,url?:string}} params 参数
     * @param {function} callback 回调函数
     */
    setBookmark: (params, callback) => {
        if (params.id != null) {
            let changes = {}
            if (params.title != null) changes.title = params.title
            if (params.url != null) changes.url = params.url
            chrome.bookmarks.update(params.id, changes, res => callback(success(res, '书签修改成功 ')))
        }
        else {
            if (params.title == null || params.url == null || params.title.trim() == '' || params.url.trim() == '') callback(error(500, '标题或url不能为空'))
            else {
                chrome.bookmarks.getTree().then(res => {
                    if (res.length <= 0) callback(error(404, '书签文件夹访问失败'))
                    else {
                        let roots = res[0]
                        if (roots.children.length <= 0) callback(error(404, '书签文件夹访问失败'))
                        else {
                            let root = roots.children[0]
                            chrome.bookmarks.create({ parentId: root.id, title: params.title, url: params.url }, res => callback(success(res, '书签添加成功')))
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
    removeBookmark: (params, callback) => {
        chrome.bookmarks.remove(params.id, res => callback(success(res, '书签删除成功')))
    },
    /**
     * 获取指定url的Favicon
     * @param {{url:string}} params 参数
     * @param {function} callback 回调函数 
     */
    getFavicon: (params, callback) => {
        var u
        try {
            u = new URL(params.url)
        } catch {
            callback(error(404, '获取失败'))
        }
        callback(success(`${u.protocol}//${u.host}/favicon.ico`, '获取成功'))
    }
}
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
/**
 * 查询最新动态
 * @param {string} uid 
 * @param {function} callback 
 */
const getLatestDynamic = (uid, callback) => {
    chrome.storage.local.get(`LatestDynamicTime_${uid}`, res => {
        let latestDynamicTime = res[`LatestDynamicTime_${uid}`]
        fetch(`${WebApis.QueryDynamic}?host_uid=${uid}`).then(res => res.json()).then(res => {
            if (res.code == 0) {
                var dynamics = res.data.cards
                var latests = []
                if (latestDynamicTime != null) {
                    console.log(`Query Dynamics After ${new Date(latestDynamicTime * 1000).toLocaleString()}`)
                    for (let i = 0; i < dynamics.length; i++) {
                        let dyn = JSON.parse(dynamics[i].card)
                        dyn.dyn_id = dynamics[i].desc.dynamic_id_str
                        dyn.timestamp = dynamics[i].desc.timestamp
                        if(dyn.timestamp > latestDynamicTime) latests.push(dyn)
                        else break
                    }
                }
                if (dynamics.length > 0) {
                    let save = {}
                    save[`LatestDynamicTime_${uid}`] = dynamics[0].desc.timestamp
                    chrome.storage.local.set(save, () => { })
                }
                callback(success(latests, '获取成功'))
            } else {
                callback(error(res.code, res.message))
            }
        }).catch(err => {
            callback(error(500, err))
        })
    })
}

/**
 * 推送动态
 * @param {{item:{content?:string,description?:string},desc?:string,aid?:number,user?:{head_url?:string,name?:string,face?:string,uname?:string},owner?:{face:string,name:string},timestamp:number,dyn_id:string,origin?:object}} dynamic 
 */
const NotifyDynamic = dynamic => {
    let t = '1秒前'
    if (dynamic.timestamp != null) {
        t = Math.floor(new Date().getTime() / 1000) - dynamic.timestamp
        if (t > 60) {
            if (t > 3600) {
                if(t>3600*24)t=`${Math.floor(t/(3600*24))}天前`
                else t = `${Math.floor(t / 3600)}小时前`
            }
            else t = `${Math.floor(t / 60)}分钟前`
        } else t = `${t}秒前`
    }
    if (dynamic.dyn_id != null) {
        let id,content,face,title
        /**投稿动态 */
        if(dynamic.aid!=null){
            content=dynamic.desc
            face=dynamic.owner.face
            title=`${dynamic.owner.name}发布了投稿`
            id=`VIDEO${dynamic.aid}`
        }else{
            id=`DYNAMIC${dynamic.dyn_id}`
            let name
            /**日常动态 */
            if(dynamic.item.category=='daily'){
                content=dynamic.item.description 
                face=dynamic.user.head_url
                name=dynamic.user.name
            }
            /**非日常动态 */
            else {
                content=dynamic.item.content
                face=dynamic.user.face
                name=dynamic.user.uname
            }
            /**转发动态 */
            if(dynamic.origin!=null){
                title=`${name}转发了一条动态`
            }
            /**普通动态 */
            else{
                title=`${name}发布了动态`
            }
        }
        chrome.notifications.create(id, {
            type: 'basic',
            iconUrl: face,
            title: title,
            message: content,
            contextMessage: t
        }, i => console.log(`动态推送通知${i}已发布`))
    }
}

/**
 * 设置点击进入动态链接
 */
chrome.notifications.onClicked.addListener((dyn_id) => {
    let url=null
    if(dyn_id.startsWith('VIDEO')){
        url=`https://www.bilibili.com/video/av${dyn_id.replace('VIDEO','')}`
    }
    else if(dyn_id.startsWith('DYNAMIC')){
        url=`https://t.bilibili.com/${dyn_id.replace('DYNAMIC','')}`
    }
    if(url!=null)chrome.tabs.create({
        url:url 
    })
})

/**
 * 设置查询计时器事件
 */
chrome.alarms.onAlarm.addListener(e => {
    Services.getOption({}, res => {
        var dynUid = DefaultOption.dynUid
        if (res.code == 0) dynUid = res.data.dynUid
        getLatestDynamic(dynUid, res => {
            if (res.code == 0) {
                for (let i = 0; i < res.data.length; i++) {
                    NotifyDynamic(res.data[i])
                }
            }
            else console.error(res.message)
        })
    })
})

/**
 * 循环查询新动态
 */
Services.getOption({}, res => {
    var dynQueryInterval = DefaultOption.dynQueryInterval, dynUid = DefaultOption.dynUid
    if (res.code == 0) { dynQueryInterval = res.data.dynQueryInterval; dynUid = res.data.dynUid }
    getLatestDynamic(dynUid, res => {
        if (res.code == 0) for (let i = 0; i < res.data.length; i++)NotifyDynamic(res.data[i])
        else console.error(res.message)
    })
    chrome.alarms.create('DynamicQueryor', { periodInMinutes: dynQueryInterval })
})