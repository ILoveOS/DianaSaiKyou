const DefaultOption={
    title: '新标签页',
    backgroundColor: '#FFFFFF',
    color: '#E799B0',
    playList:'959370203',
    searchTool:0,
    icon:'/assets/icon.png',
    progressIcon:'/assets/progress.png',
    wheelText:'',
    wheelStartImg:chrome.runtime.getURL('/assets/dacall.gif'),
    wheelPauseImg:chrome.runtime.getURL('/assets/dacall.png'),
    wheelInterval:7000
}
const Services={
    setStorage:(params,callback)=>{
        let obj={}
        obj[params.key]=params.value
        chrome.storage.local.set(obj,callback(success(null,'存储设置成功')))
    },
    getStorage:(params,callback)=>{
        chrome.storage.local.get(params.key,res=>{
            callback(success(res[params.key],'存储获取成功'))
        })
    },
    setOption:(params,callback)=>{
        chrome.storage.local.set({Options:params.options},callback(success(null,'选项设置成功')))
    },
    getOption:(params,callback)=>{
        var copy={}
        for(let i in DefaultOption)
            copy[i]=DefaultOption[i]
        chrome.storage.local.get('Options',res=>{
            let data=res.Options
            if(data!=null){
                for(let i in data)
                    copy[i]=data[i]
            }
            callback(success(copy,'选项获取成功'))
        })
    },
    clearOption:(params,callback)=>{
        chrome.storage.local.set({Options:null},callback(success(DefaultOption,'选项重置成功')))
    },
}
const success=(data,message)=>{return {code:0,data:data,message:message}}
const error=(code,message)=>{return {code:code,data:null,message:message}}
chrome.runtime.onMessage.addListener((req,sender,res)=>{
    let service=req.service
    let params=req.params
    if(Services[service]==null||typeof(Services[service])!='function')
        res(error(404,`Service ${service} Not Found`))
    else
        Services[service](params,res)
    return true
})