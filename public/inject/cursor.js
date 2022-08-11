/**
 * 为鼠标光标添加一个追随小图标
 * @author 澄茜早睡早起
 */

/**附加图片的DOM */
const CURSOR=document.createElement('img')
/**设置样式 */
CURSOR.style.position='fixed'
CURSOR.style.zIndex=99999
/**加入DOM到页面中 */
document.body.appendChild(CURSOR)

/**设置跟随事件 */
window.onmousemove=(event)=>{
    CURSOR.style.left=event.clientX+20+'px'
    CURSOR.style.top=event.clientY+'px'
}

/**加载选项 */
chrome.runtime.sendMessage({service:'getOption',params:{}}, res => {
    if (res.code == 0) {
        CURSOR.style.width=`${res.data.cursorSize}px`
        CURSOR.style.height=`${res.data.cursorSize}px`
        CURSOR.src=res.data.cursor.match(/\/assets\/.*/)?chrome.runtime.getURL(res.data.cursor):res.data.cursor
    } else {
        CURSOR.style.width='30px'
        CURSOR.style.height='30px'
        CURSOR.src=chrome.runtime.getURL('/assets/cursor.png')
        console.log(res.message)
    }
})