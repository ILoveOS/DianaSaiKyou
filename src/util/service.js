
/**
 * 对background.js中的服务进行包装供src中的组件使用
 * @author 澄茜早睡早起
 */

/**
 * 调用background.js中的service
 * @param {string} service 服务名
 * @param {object} params 参数
 * @param {function} callback 回调函数
 */
const callService=(service,params,callback)=>{
    chrome.runtime.sendMessage({
        service:service,
        params:params
    },res=>{
        if(res!=null&&res.code!=null&&res.code==0){
            callback(res.data)
        }else{
            if(res!=null)alert(res.message)
        }
    })
}

/**
 * 对外的服务包装接口
 */
export const Services={
    /**
     * 设置选项
     * @param {object} options 选项 
     * @param {function} callback 回调函数 
     */
    setOption(options,callback){
        callService('setOption',{options:options},res=>callback(res))
    },
    /**
     * 获取选项
     * @param {function} callback 回调函数 
     */
    getOption(callback){
        callService('getOption',{},res=>callback(res))
    },
    /**
     * 重置选项
     * @param {funtion} callback 回调函数 
     */
    clearOption(callback){
        callService('clearOption',{},res=>callback(res))
    },
    /**
     * 获得书签
     * @param {function} callback 回调函数 
     */
    getBookmarks(callback){
        callService('getBookmarks',{},res=>callback(res))
    },
    /**
     * 添加/修改书签
     * @param {string | null} id 书签id,为null时表示新增
     * @param {string} title 书签标题
     * @param {string} url 书签链接
     * @param {function} callback 回调函数
     */
    setBookmark(id,title,url,callback){
        callService('setBookmark',{id:id,title:title,url:url},res=>callback(res))
    },
    /**
     * 删除书签
     * @param {string} id 书签id 
     * @param {function} callback 回调函数
     */
    removeBookmark(id,callback){
        callService('removeBookmark',{id:id},res=>callback(res))
    },
    /**
     * 获取指定url的favicon
     * @param {string} url
     * @param {function} callback 回调函数
     */
    getFavicon(url,callback){
        callService('getFavicon',{url:url},res=>callback(res))
    }
}