
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
            if(res!=null)console.log(res.message)
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
    }
}