/**
 * 为鼠标光标添加一个追随小图标
 * @author 澄茜早睡早起
 */

/**附加图片的DOM */
const CURSOR=document.createElement('img')
/**设置样式 */
CURSOR.style.position='fixed'
CURSOR.style.zIndex=99999
CURSOR.id='DianaSaikyou-Inject-Cursor'
/**加入DOM到页面中 */
document.body.appendChild(CURSOR)
/**设置跟随事件 */
window.addEventListener('mousemove',event=>{
    var cursorDom=document.getElementById('DianaSaikyou-Inject-Cursor')
    cursorDom.style.left=event.clientX+20+'px'
    cursorDom.style.top=event.clientY+'px'
})

/**加载选项 */
chrome.runtime.sendMessage({service:'getOption',params:{}}, res => {
    var cursorDom=document.getElementById('DianaSaikyou-Inject-Cursor')
    if (res.code == 0) {
        cursorDom.style.width=`${res.data.cursorSize}px`
        cursorDom.style.height=`${res.data.cursorSize}px`
        cursorDom.src=res.data.cursor.match(/\/assets\/.*/)?chrome.runtime.getURL(res.data.cursor):res.data.cursor
    } else {
        cursorDom.style.width='30px'
        cursorDom.style.height='30px'
        cursorDom.src=chrome.runtime.getURL('/assets/cursor.png')
        console.log(res.message)
    }
})