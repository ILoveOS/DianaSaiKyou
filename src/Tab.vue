<!--新标签页-->
<template>
    <div id="tab-main">
        <!--标题-->
        <title>{{ Options.title }}</title>
        <!--选项按钮-->
        <a target="blank" href="/option.html" style="font-size:32px; position:fixed; top:20px;right:20px">
            <i class="bi bi-gear-fill"></i>
        </a>
        <!--搜索框-->
        <SearchBar :_searchTool="Options.searchTool"></SearchBar>
        <!--书签-->
        <BookMark></BookMark>
        <!--音乐播放器，可以加载网易云电台播单-->
        <MusicPlayer :_playList="Options.playList" :_playMode="Options.playMode"></MusicPlayer>
    </div>
    <!--cursor跟随图片-->
    <img style="position:fixed;z-index: 99999;" :width="Options.cursorSize" :height="Options.cursorSize"
        :src="Options.cursor" id="CURSOR">
</template>
<script>
import { Services } from './util/service'
import SearchBar from './components/tab/SearchBar.vue'
import MusicPlayer from './components/tab/MusicPlayer.vue';
import BookMark from './components/tab/BookMark.vue';
export default {
    name: "TabVue",
    data() {
        return {
            //选项
            Options: {}
        };
    },
    mounted() {
        this.getOption();
        /**设置cursor跟随事件 */
        window.addEventListener('mousemove', event => {
            document.getElementById('CURSOR').style.left = event.clientX + 20 + 'px'
            document.getElementById('CURSOR').style.top = event.clientY + 'px'
        })
    },
    watch: {
        'Options.color'(newVal, oldVal) {
            document.documentElement.style.setProperty('--color', newVal)
        },
        'Options.backgroundColor'(newVal, oldVal) {
            document.documentElement.style.setProperty('--backgroundColor', newVal)
        }
    },
    methods: {
        /**
         * 调用Services.getOption获取storage中的选项
         */
        getOption() {
            Services.getOption(res => {
                this.Options = res
            });
        }
    },
    components: { SearchBar, MusicPlayer, BookMark }
}
</script>
<style>
.progress-bar {
    background-color: var(--color) !important;
    border-radius: var(--bs-progress-border-radius) !important; 
}
.progress{
    border: 2px solid var(--color) !important;
}
.bi,
.progress {
    cursor: pointer !important;
}
</style>