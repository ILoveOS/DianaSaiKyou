/**
 * 用于MusicPlayer的工具类
 * @author 澄茜早睡早起
 */

import { weapiParam } from "./weapi"

/**
 * 时间类
 */
export class Time {
    hour = 0
    min = 0
    sec = 0
    /**
     * 根据秒数构造Time对象
     * @param {number} secs 秒
     */
    constructor(secs) {
        secs = Math.floor(secs)
        this.sec=secs%60
        this.min = Math.floor(secs / 60)
        this.hour = Math.floor(this.min / 60)
        this.min = this.min % 60
    }
    /**
     * HH:MM:SS格式
     * @returns {string} 
     */
    toString() {
        if(this.hour>0)return `${this.hour<10?'0':''}${this.hour}:${this.min<10?'0':''}${this.min}:${this.sec<10?'0':''}${this.sec}`
        else return `${this.min<10?'0':''}${this.min}:${this.sec<10?'0':''}${this.sec}`
    }
}

/**
 * 页大小
 */
export const PAGESIZE = 30
/**
 * 网易云api
 */
const API = {
    djPrograms: 'https://music.163.com/weapi/dj/program/byradio',
    songUrlPattern: 'https://music.163.com/song/media/outer/url?id=#{id}.mp3'
}
/**
 * 音乐类
 */
class Music {
    id
    name
    description
    duration
    cover
    src
    /**
     * 根据api返回的数据构造Music对象
     * @param {{mainSong:{id:number,name:string},description:string,duration:number,coverUrl:string}} o 
     */
    constructor(o) {
        this.id = o.mainSong.id
        this.name = o.mainSong.name
        this.description = o.description
        this.duration = o.duration
        this.cover = o.coverUrl
        this.src = API.songUrlPattern.replace('#{id}', o.mainSong.id);
    }
}
/**
 * 加载音乐
 * @param {number} playlistRid 电台节目的rid 
 * @param {number} curPage 页号
 * @param {function} callback 回调函数
 */
export const loadMusics = (playlistRid, curPage, callback) => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var res = JSON.parse(xhr.responseText)
                if (res.code != 400 &&res.programs!=null) {
                    let result = {}
                    result.count = res.count
                    result.musics = [{}]
                    for (let i = 0; i < res.programs.length; i++) {
                        if (i != 0)
                            result.musics.push(new Music(res.programs[i]))
                        else
                            result.musics[0] = new Music(res.programs[i])
                    }
                    callback(result)
                }
            }
        }
    }
    var data={
        radioId: playlistRid,
        limit: PAGESIZE,
        offset: curPage*PAGESIZE,
    }
    xhr.open('POST',API.djPrograms)
    xhr.setRequestHeader('crypto','weapi')
    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
    xhr.send(weapiParam(data))
}
/**
 * 将播放进度转化为HH:MM:SS/HH:MM:SS格式的字符串
 * @param {boolean} canplay 
 * @param {number} current 
 * @param {number} duration 
 * @returns {string|'00:00/00:00'}
 */
export const progressTimeFormat = (canplay,current, duration) => {
    if (canplay) return new Time(current).toString() + '/' + Time(duration).toString()
    else return '00:00/00:00'
}