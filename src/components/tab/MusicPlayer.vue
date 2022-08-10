<template>
    <div style="position:fixed;width: 100%; bottom: 20px;" class="text-center">
        <img width="80" height="80" :src="musics[idx].cover" @error="defaultMusicCover">
        <h4>{{ musics[idx].name }}</h4>
        <span class="text-muted">{{ progressText() }}</span>
        <video id="player" hidden :src="musics[idx].src" @canplay="init" @timeupdate="update" @ended="next"></video>
        <div id="progress" @click="seek" class="progress" style="height: 10px; overflow: visible;">
            <div class="progress-bar" role="progressbar" :style="{ width: `${current / player.duration * 100}%` }"
                :aria-valuenow="current" aria-valuemin="0" :aria-valuemax="player.duration"></div>
            <img :src="$parent.Options.progressIcon" width="30" height="30"
                style="z-index: 9999;margin-left: -15px;margin-top: -10px;" @error="defaultProgressIcon">
        </div>
        <input type="range" min="0" max="1" step="0.05" v-model="player.volume">
        <div style="font-size: 36px; vertical-align: middle;">
            <i class="bi bi-skip-start-fill" @click="pre"></i>
            <i class="bi bi-play-fill" @click="play" :style="{ display: playing ? 'none' : 'inline' }"></i>
            <i class="bi bi-pause-fill" @click="pause" :style="{ display: playing ? 'inline' : 'none' }"></i>
            <i class="bi bi-skip-end-fill" @click="next"></i>
            <div class="btn-group dropup" style="position: fixed; right: 0;">
                <i class="bi bi-list dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"></i>
                <ul class="dropdown-menu" style="max-height: 500px;overflow-y: scroll;">
                    <li v-for="(item, idx) in musics" :key="idx" style="cursor: pointer;border:1px solid"
                        @click="this.idx = idx" class="container">
                        <table class="table" style="vertical-align: middle;">
                            <td style="width: 30px;">
                                <img :src="item.cover" @error="defaultMusicCover" width="30" height="30">
                            </td>
                            <td scope="col">
                                <span>{{ item.name }}</span><br>
                                <span class="text-muted">
                                    {{ time(item.duration) }}
                                </span>
                            </td>
                        </table>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import { PAGESIZE, loadMusics, progressTimeFormat, Time } from '../../util/music'
export default {
    name: 'MusicPlayer',
    props: ['_playList'],
    data() {
        return {
            player: {},
            musics: [{}],
            idx: 0,
            count: 0,
            curPage: 0,
            current: 0,
            canplay: false,
            playing: false,
            loaded: false
        }
    },
    watch: {
        _playList(newVal, oldVal) {
            loadMusics(newVal, this.curPage, result => {
                this.musics = result.musics
                this.count = result.count
                this.loaded = true
            })
        },
        idx(newVal, oldVal) {
            this.canplay = false
        }
    },
    methods: {
        time(s) {
            return new Time(Math.floor(s / 1000)).toString()
        },
        progressText() {
            return progressTimeFormat(this.canplay, this.current, this.player.duration)
        },
        defaultProgressIcon(e) {
            console.log(e)
            var ele = e.srcElement
            ele.src = '/assets/progress.png'
            ele.onerror = null
        },
        play() {
            if (this.canplay) {
                this.player.play()
                this.playing = true
            }
        },
        pause() {
            this.playing = false
            this.player.pause()
        },
        next() {
            if (this.loaded) {
                if (this.idx + 1 >= this.musics.length) {
                    this.curPage = (this.curPage+1) % Math.ceil(this.count / PAGESIZE)
                    this.loaded = false
                    loadMusics(this._playList, this.curPage, result => {
                        this.idx = 0
                        this.musics = result.musics
                        this.loaded = true
                    })
                } else this.idx = this.idx + 1
            }
        },
        pre() {
            if (this.loaded) {
                if (this.idx - 1 < 0) {
                    this.curPage = (this.curPage - 1 < 0) ? Math.ceil(this.count / PAGESIZE) - 1 : this.curPage - 1
                    this.loaded = false
                    loadMusics(this._playList, this.curPage, result => {
                        let pSize = this.count - this.curPage * PAGESIZE
                        pSize = pSize >= 30 ? 30 : pSize
                        this.idx = pSize - 1
                        this.musics = result.musics
                        this.loaded = true
                    })
                }
                else this.idx = this.idx - 1
            }
        },
        init() {
            this.canplay = true
            if (this.playing) this.play()
        },
        update() {
            if (this.canplay)
                this.current = this.player.currentTime
        },
        seek(e) {
            if (this.canplay) {
                this.canplay = false
                let seekPos = e.offsetX / document.getElementById('progress').clientWidth
                this.player.currentTime = seekPos * this.player.duration
                this.current = this.player.currentTime
            }
        },
        defaultMusicCover(e){
            var ele=e.srcElement
            ele.src='/assets/musiccover.png'
            ele.onerror=null
        }
    },
    mounted() {
        this.player = document.getElementById('player')
        loadMusics(this._playList, this.curPage, result => {
            this.musics = result.musics
            this.count = result.count
            this.loaded = true
        })
    }
}
</script>