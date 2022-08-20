<!--音乐播放器-->
<template>
    <div style="position:fixed;width: 100%; bottom: 20px;" class="text-center">
        <!--音乐的Cover图片-->
        <img :class="{ placeholder: !loaded }" width="80" height="80"
            :src="musics[idx].cover == null ? '/assets/musiccover.png' : musics[idx].cover">
        <div>
            <!--名字-->
            <h4 :class="{ placeholder: !loaded }">{{ musics[idx].name == null ? 'Loading' : musics[idx].name }}</h4>
            <br v-if="!loaded">
            <!--HH:MM:SS/HH:MM:SS格式的进度-->
            <span class="text-muted" :class="{ placeholder: !loaded }">{{ progressText() }}</span>
        </div>
        <!--播放器-->
        <video id="player" hidden :src="musics[idx].src" @canplay="init" @timeupdate="update" @ended="next"></video>
        <!--进度条-->
        <div id="progress" @click="seek" class="progress" style="height: 10px; overflow: visible;">
            <div class="progress-bar" role="progressbar" :style="{ width: `${current / player.duration * 100}%` }"
                :aria-valuenow="current" aria-valuemin="0" :aria-valuemax="player.duration"></div>
            <!--进度条前面的图标-->
            <img :src="$parent.Options.progressIcon" width="30" height="30"
                style="z-index: 9999;margin-left: -15px;margin-top: -10px;" @error="defaultProgressIcon">
        </div>
        <!--工具栏-->
        <div style="font-size: 36px; vertical-align: middle;">
            <!--音量-->
            <div style="position:fixed;left: 20px;font-size: 14px; margin-top: 16px; vertical-align: middle;">
                音量
                <input type="range" min="0" max="100" step="1" v-model="volume">
                <span class="range-value">{{ volume }}</span>
            </div>
            <!--上一首-->
            <i class="bi bi-skip-start-fill" @click="pre"></i>
            <!--播放-->
            <i class="bi bi-play-fill" @click="play" :style="{ display: playing ? 'none' : 'inline' }"></i>
            <!--暂停-->
            <i class="bi bi-pause-fill" @click="pause" :style="{ display: playing ? 'inline' : 'none' }"></i>
            <!--下一首-->
            <i class="bi bi-skip-end-fill" @click="next"></i>
            <!--播放列表-->
            <div class="btn-group dropup" style="position: fixed; right: 0;">
                <i class="bi bi-list dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"></i>
                <ul class="dropdown-menu" style="max-height: 500px;overflow-y: scroll;">
                    <li v-for="(item, idx) in musics" :key="idx" style="cursor: pointer;border:1px solid"
                        @click="this.idx = idx" class="container">
                        <table class="table" style="vertical-align: middle;">
                            <td style="width: 30px;">
                                <img :class="{ placeholder: !loaded }"
                                    :src="item.cover == null ? '/assets/musiccover.png' : item.cover" width="30"
                                    height="30">
                            </td>
                            <td scope="col">
                                <span :class="{ placeholder: !loaded }">{{ item.name == null ? 'Loading...' :
                                        item.name
                                }}</span><br>
                                <span class="text-muted" :class="{ placeholder: !loaded }">
                                    {{ item.duration == null ? 'Loading...' : time(item.duration) }}
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
            //播放器
            player: {},
            //播放列表
            musics: [{}],
            //当前音乐
            idx: 0,
            //电台节目音乐总数
            count: 0,
            //当前页
            curPage: 0,
            //播放进度
            current: 0,
            //player是否加载完成
            canplay: false,
            //播放状态
            playing: false,
            //musics是否加载完成
            loaded: false,
            volume: 100
        }
    },
    watch: {
        /**
         * 当_playList选项加载/修改后重新加载musics
         * @param {number} newVal 新值 
         * @param {number} oldVal 
         */
        _playList(newVal, oldVal) {
            loadMusics(newVal, this.curPage, result => {
                this.musics = result.musics
                this.count = result.count
                this.loaded = true
            })
        },
        /**
         * 当idx修改后重新加载player
         * @param {number} newVal 
         * @param {number} oldVal 
         */
        idx(newVal, oldVal) {
            this.canplay = false
        },
        volume(newVal, oldVal) {
            this.player.volume = newVal / 100
        }
    },
    methods: {
        /**
         * 将秒数转化为HH:MM:SS格式
         * @param {number} s 秒数
         */
        time(s) {
            return new Time(Math.floor(s / 1000)).toString()
        },
        /**
         * HH:MM:SS/HH:MM:SS格式的播放进度
         */
        progressText() {
            return progressTimeFormat(this.canplay, this.current, this.player.duration)
        },
        /**
         * 默认进度条图片
         * @param {Event} e 
         */
        defaultProgressIcon(e) {
            console.log(e)
            var ele = e.srcElement
            ele.src = '/assets/progress.png'
            ele.onerror = null
        },
        /**
         * 播放
         */
        play() {
            if (this.canplay) {
                this.player.play()
                this.playing = true
            }
        },
        /**
         * 暂停
         */
        pause() {
            this.playing = false
            this.player.pause()
        },
        /**
         * 下一首
         */
        next() {
            if (this.loaded) {
                if (this.idx + 1 >= this.musics.length) {
                    this.curPage = (this.curPage + 1) % Math.ceil(this.count / PAGESIZE)
                    this.loaded = false
                    loadMusics(this._playList, this.curPage, result => {
                        this.idx = 0
                        this.musics = result.musics
                        this.loaded = true
                    })
                } else this.idx = this.idx + 1
            }
        },
        /**
         * 上一首
         */
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
        /**
         * player加载完成后设置属性
         */
        init() {
            this.canplay = true
            if (this.playing) this.play()
        },
        /**
         * 更新进度
         */
        update() {
            this.current = this.player.currentTime
        },
        /**
         * 修改进度
         * @param {event} e 
         */
        seek(e) {
            if (this.canplay) {
                this.canplay = false
                let seekPos = e.offsetX / document.getElementById('progress').clientWidth
                this.player.currentTime = seekPos * this.player.duration
                this.current = this.player.currentTime
            }
        }
    },
    mounted() {
        /**
         * 设置player
         */
        this.player = document.getElementById('player')
    }
}
</script>