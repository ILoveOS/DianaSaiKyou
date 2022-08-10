<template>
<div id="tab-main" :style="{'--color':Options.color,'--backgroundColor':Options.backgroundColor}">
<title>{{Options.title}}</title>
<SearchBar :_searchTool="Options.searchTool"></SearchBar>
<MusicPlayer :_playList="Options.playList"></MusicPlayer>
</div>
</template>
<script>
import {Services} from './util/service'
import SearchBar from './components/tab/SearchBar.vue'
import MusicPlayer from './components/tab/MusicPlayer.vue';
export default{
    name: "TabVue",
    data() {
        return {
            Options: {}
        };
    },
    mounted() {
        this.getOption();
    },
    methods: {
        getOption() {
            Services.getOption(res => {
                this.Options=res
            });
        }
    },
    components: { SearchBar, MusicPlayer }
}
</script>
<style>
html,
body,#tab,#tab-main{
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

.progress-bar{
    background-color: var(--color) !important;

}

img{
    background-color: transparent !important;
}

.bi,.progress{
    cursor: pointer !important;
}

input[type='range']{
    -webkit-appearance: none;
    height: 3px;
    background-color: var(--color) !important;
}

input[type='range']::-webkit-slider-thumb{
    -webkit-appearance: none;
    height:16px;
    width: 16px;
    border-radius: 50%;
    border: solid 1px var(--color);
    background-color: var(--color) !important;
}
</style>