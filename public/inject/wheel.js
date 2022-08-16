/**
 * 独轮车
 * 只在b站直播间生效
 * @author 澄茜早睡早起
 */

/**
 * 校验是否是直播间
 */
if (location.pathname.match(/\/[0-9]+.*/)) {
    console.log('Loading Wheel')
    /**
     * 获取房间号
     */
    const WHEEL_ROOMID = location.pathname.replace(/\?.*/, '').replace('/', '')
    /**
     * 弹幕API
     */
    const WHEEL_API = 'https://api.live.bilibili.com/msg/send'
    /**
     * 独轮车线程
     */
    var WHEEL_PROCESS = null
    /**
     * 创建DOM
     */
    const WHEEL_WRAPPER = document.createElement('div')
    const WHEEL_BUTTON = document.createElement('img')
    /**
     * 独轮车配置
     */
    const WHEEL_CONFIG = {
        //选项是否加载
        WHEEL_LOADED: false,
        //状态
        WHEEL_RUNNING: false,
        //频率
        WHEEL_INTERVAL: 7000,
        //启动图片
        WHEEL_START_IMG: '',
        //暂停图片
        WHEEL_PAUSE_IMG: ''
    }

    /**
     * 独轮车数据
     */
    const WHEEL_DATA = {
        bubble: 5,
        //内容
        msg: '',
        //弹幕颜色
        color: 9920249,
        //弹幕模式
        mode: 4,
        //字体大小
        fontsize: 25,
        //随机数
        rnd: null,
        //房间号
        roomid: WHEEL_ROOMID,
        //csrf
        csrf: null,
        //csrf
        csrf_token: null
    }

    /**
     * 读取csrf
     * @returns {{string|null}} 当前登录用户的csrf或者null 
     */

    const getCSRF = () => {
        let cookies = document.cookie.split(';')
        for (let i = 0; i < cookies.length; i++) {
            let kv = cookies[i].trim().split('=')
            if (kv[0] == 'bili_jct') return kv[1]
        }
        return null
    }

    /**
     * 将数据转为FormData
     * @param {objcet} data 数据 
     * @returns {FormData}
     */
    const toFormData = data => {
        let formData = new FormData()
        for (let i in data) formData.append(i, data[i])
        return formData
    }
    /**
     * 通过xhr请求发送弹幕
     */
    const send = () => {
        WHEEL_DATA.rnd = new Date().getTime().toString().substring(0, 10)
        WHEEL_DATA.csrf = WHEEL_DATA.csrf_token = getCSRF()
        let xhr = new XMLHttpRequest()
        xhr.withCredentials = true
        xhr.open('post', WHEEL_API)
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) if (xhr.status === 200) {
                let res = JSON.parse(xhr.response)
                console.log(res)
            }
        }
        xhr.send(toFormData(WHEEL_DATA))
    }

    /**
     * 独轮车开关
     */
    const toggle = () => {
        if (WHEEL_CONFIG.WHEEL_LOADED) {
            if (WHEEL_CONFIG.WHEEL_RUNNING)
                window.clearInterval(WHEEL_PROCESS)
            else {
                send()
                WHEEL_PROCESS = window.setInterval(send, WHEEL_CONFIG.WHEEL_INTERVAL)
            }
            WHEEL_CONFIG.WHEEL_RUNNING = !WHEEL_CONFIG.WHEEL_RUNNING
        }
    }

    /**
     * 为独轮车按钮绑定开关
     */
    WHEEL_BUTTON.onclick = () => {
        toggle()
        WHEEL_BUTTON.src = WHEEL_CONFIG.WHEEL_RUNNING ? WHEEL_CONFIG.WHEEL_START_IMG : WHEEL_CONFIG.WHEEL_PAUSE_IMG
    }
    /**
     * 设置样式并添加到document中
     */
    WHEEL_BUTTON.style.cursor = 'pointer'
    WHEEL_BUTTON.style.display = 'inline-block'
    WHEEL_BUTTON.width = WHEEL_BUTTON.height = 100
    WHEEL_WRAPPER.style.position = 'fixed'
    WHEEL_WRAPPER.style.zIndex = 2000
    WHEEL_WRAPPER.style.right = '50px'
    WHEEL_WRAPPER.style.top = '400px'
    WHEEL_WRAPPER.style.textAlign = 'center'
    WHEEL_WRAPPER.width = 100
    WHEEL_WRAPPER.height = 150
    WHEEL_WRAPPER.append(WHEEL_BUTTON)
    document.body.append(WHEEL_WRAPPER)
    /**
     * 调用background的getOption服务获取选项
     */
    chrome.runtime.sendMessage({service:'getOption',params:{}}, res => {
        if (res.code == 0) {
            let options = res.data
            WHEEL_DATA.msg = options.wheelText
            WHEEL_CONFIG.WHEEL_INTERVAL = options.wheelInterval
            WHEEL_CONFIG.WHEEL_START_IMG = options.wheelStartImg
            WHEEL_CONFIG.WHEEL_PAUSE_IMG = options.wheelPauseImg
            WHEEL_CONFIG.WHEEL_LOADED = true
            WHEEL_BUTTON.src = WHEEL_CONFIG.WHEEL_RUNNING ? WHEEL_CONFIG.WHEEL_START_IMG : WHEEL_CONFIG.WHEEL_PAUSE_IMG
        } else {
            console.log(res.message)
        }
    })
}