<!--弹出页，显示插件信息-->
<template>
    <!--绑定选项中的color和backgourndColor到css中-->
    <div class="text-center" :style="{'--color':Options.color,'--backgroundColor':Options.backgroundColor}"  style="padding-left: 80px;padding-right:80px">
        <!--图标-->
        <img width="128" height="128" :src="manifest.icons[128]">
        <!--插件名-->
        <h4>{{ manifest.name }}</h4>
        <!--插件描述-->
        <span class="text-muted" style="font-size: 8px;">{{ manifest.description }}</span><br>
        <!--插件版本-->
        <span style="font-size:10px">版本:{{ manifest.version }}</span><br>
        <!--作者-->
        <span style="font-size:10px"><a @click="goHomePage" href="#">{{ manifest.author }}</a></span><br>
        <!--github-->
        <i class="bi bi-github" @click="goGithub" style="cursor: pointer;font-size: 20px;"></i>
    </div>
</template>
<script>
import { Services } from './util/service';
export default {
    name: 'PopupVue',
    data() {
        return {
            /**
             * 调用chromeAPI获取插件manifest信息
             */
            manifest: chrome.runtime.getManifest(),
            Options:{},
            /**
             * github的repo信息
             */
            rep:{}
        }
    },
    mounted() {
        this.getOption()
        /**
         * 加载github的repo信息
         */
        fetch('/rep.json').then(res=>res.json()).then(res=>{
            this.rep=res
        })
    },
    methods:{
        /**
         * 加载配置
         */
        getOption() {
            Services.getOption(res => {
                this.Options=res
            });
        },
        /**
         * 打开homepage
         */
        goHomePage(){
            chrome.tabs.create({url:this.manifest.homepage_url,selected:true},()=>{})
        },
        /**
         * 打开github地址
         */
        goGithub(){
            chrome.tabs.create({url:this.rep.url,selected:true},()=>{})
        }
    }
}
</script>
<style>
html,
body,#popup{
    width: 100%;
    height: auto;
    margin: 0;
    padding: 0;
}

* {
    color: var(--color) !important;
    border-color: var(--color) !important;
    background-color: var(--backgroundColor) !important;
    outline-color: var(--color) !important;
}

</style>