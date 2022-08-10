
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

export const Services={
    setOption(options,callback){
        callService('setOption',{options:options},res=>callback(res))
    },
    getOption(callback){
        callService('getOption',{},res=>callback(res))
    },
    clearOption(callback){
        callService('clearOption',{},res=>callback(res))
    }
}