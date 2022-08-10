export class Time {
    hour = 0
    min = 0
    sec = 0
    constructor(secs) {
        secs = Math.floor(secs)
        if (secs >= 60) {
            this.min = Math.floor(secs / 60)
            this.sec = secs % 60
        } else {
            this.sec = secs
        }
        if (this.min >= 60) {
            this.min = this.min % 60
            this.hour = Math.floor(this.min / 60)
        }
    }
    toString() {
        let hFormat = ''
        let mFormat = ''
        let sFormat = ''
        if (this.hour > 0) { hFormat = this.hour < 10 ? '0' + this.hour : this.hour }
        mFormat = this.min < 10 ? ('0' + this.min) : this.min
        sFormat = this.sec < 10 ? ('0' + this.sec) : this.sec
        return `${hFormat != '' ? hFormat + ':' : ''}${mFormat}:${sFormat}`
    }
}

export const PAGESIZE = 30

const API = {
    djPrograms: 'https://netease-cloud-music-api-orpin-pi.vercel.app/dj/program',
    songUrlPattern: 'https://music.163.com/song/media/outer/url?id=#{id}.mp3'
}

class music {
    id
    name
    description
    duration
    cover
    src
    constructor(o) {
        this.id = o.mainSong.id
        this.name = o.mainSong.name
        this.description = o.description
        this.duration = o.duration
        this.cover = o.coverUrl
        this.src = API.songUrlPattern.replace('#{id}', o.mainSong.id);
    }
}

export const loadMusics = (playlistRid, curPage, callback) => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var res = JSON.parse(xhr.responseText)
                if (res.code != 400) {
                    let result = {}
                    result.count = res.count
                    result.musics = [{}]
                    for (let i = 0; i < res.programs.length; i++) {
                        if (i != 0)
                            result.musics.push(new music(res.programs[i]))
                        else
                            result.musics[0] = new music(res.programs[i])
                    }
                    callback(result)
                }
            }
        }
    }
    xhr.open('GET', `${API.djPrograms}?rid=${playlistRid}&limit=${PAGESIZE}&offset=${curPage * PAGESIZE}`);
    xhr.send();
}

export const progressTimeFormat = (canplay,current, duration) => {
    if (canplay) {
        let cur = new Time(current), dur = new Time(duration)
        return cur.toString() + '/' + dur.toString()
    }
    else return '00:00/00:00'
}