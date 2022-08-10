if (location.pathname.match(/\/[0-9]+.*/)) {
    console.log('Loading Wheel')
    const WHEEL_ROOMID = location.pathname.replace(/\?.*/, '').replace('/', '')

    const WHEEL_API = 'https://api.live.bilibili.com/msg/send'

    var WHEEL_PROCESS = null

    const WHEEL_WRAPPER = document.createElement('div')

    const WHEEL_BUTTON = document.createElement('img')

    const WHEEL_CONFIG = {
        WHEEL_LOADED: false,
        WHEEL_RUNNING: false,
        WHEEL_INTERVAL: 7000,
        WHEEL_START_IMG: '',
        WHEEL_PAUSE_IMG: ''
    }

    const WHEEL_DATA = {
        bubble: 5,
        msg: '',
        color: 9920249,
        mode: 4,
        fontsize: 25,
        rnd: null,
        roomid: WHEEL_ROOMID,
        csrf: null,
        csrf_token: null
    }

    const getCSRF = () => {
        let cookies = document.cookie.split(';')
        for (let i = 0; i < cookies.length; i++) {
            let kv = cookies[i].trim().split('=')
            if (kv[0] == 'bili_jct') return kv[1]
        }
        return null
    }

    const toFormData = data => {
        let formData = new FormData()
        for (let i in data) formData.append(i, data[i])
        return formData
    }

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

    WHEEL_BUTTON.onclick = () => {
        toggle()
        WHEEL_BUTTON.src = WHEEL_CONFIG.WHEEL_RUNNING ? WHEEL_CONFIG.WHEEL_START_IMG : WHEEL_CONFIG.WHEEL_PAUSE_IMG
    }

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
    chrome.runtime.sendMessage(chrome.storage.local.get('Options', res => {
        let options = res['Options']
        WHEEL_DATA.msg = options.wheelText
        WHEEL_CONFIG.WHEEL_INTERVAL = options.wheelInterval
        WHEEL_CONFIG.WHEEL_START_IMG = options.wheelStartImg
        WHEEL_CONFIG.WHEEL_PAUSE_IMG = options.wheelPauseImg
        WHEEL_CONFIG.WHEEL_LOADED = true
        WHEEL_BUTTON.src = WHEEL_CONFIG.WHEEL_RUNNING ? WHEEL_CONFIG.WHEEL_START_IMG : WHEEL_CONFIG.WHEEL_PAUSE_IMG
    }))
}