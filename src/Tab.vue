<!--新标签页-->
<template>
    <!--绑定选项中的color和backgourndColor到css中-->
    <div id="tab-main" :style="{ '--color': Options.color, '--backgroundColor': Options.backgroundColor }">
        <!--标题-->
        <title>{{ Options.title }}</title>
        <!--搜索框-->
        <SearchBar :_searchTool="Options.searchTool"></SearchBar>
        <!--音乐播放器，可以加载网易云电台播单-->
        <MusicPlayer :_playList="Options.playList"></MusicPlayer>
    </div>
</template>
<script>
import { Services } from './util/service'
import SearchBar from './components/tab/SearchBar.vue'
import MusicPlayer from './components/tab/MusicPlayer.vue';
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
    components: { SearchBar, MusicPlayer }
}
</script>
<style>
html,
body,
#tab,
#tab-main {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}

* {
    color: var(--color) !important;
    border-color: var(--color) !important;
    background-color: var(--backgroundColor) !important;
    outline-color: var(--color) !important;
}

.progress-bar {
    background-color: var(--color) !important;

}

img {
    background-color: transparent !important;
}

.bi,
.progress {
    cursor: pointer !important;
}

input[type='range'] {
    -webkit-appearance: none;
    height: 3px;
    background-color: var(--color) !important;
}

input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    border: solid 1px var(--color);
    background-color: var(--color) !important;
}
</style>