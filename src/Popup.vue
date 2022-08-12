<!--弹出页，显示插件信息-->
<template>
    <!--绑定选项中的color和backgourndColor到css中-->
    <div class="text-center" :style="{ '--color': Options.color, '--backgroundColor': Options.backgroundColor }"
        style="padding-left: 40px;padding-right:40px;width: 300px;">
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
        <div v-if="hasNewVersion">
            <a href="#" @click="goLatestRelease" style="font-size:10px">
                <i class="bi bi-exclamation-circle-fill"></i>
                <span>有新版本:{{latestVersionName}}</span>
            </a><br>
            <span class="text-muted" style="font-size:6px">{{latestVersionDate.toLocaleString()}}</span>
        </div>
        
    </div>
    <!--cursor跟随图片-->
    <img style="position:fixed;z-index: 99999;" :width="Options.cursorSize" :height="Options.cursorSize"
        :src="Options.cursor" id="CURSOR">
</template>
<script>
import { Services } from './util/service';
import { Octokit } from 'octokit';
export default {
    name: 'PopupVue',
    data() {
        return {
            /**
             * 调用chromeAPI获取插件manifest信息
             */
            manifest: chrome.runtime.getManifest(),
            Options: {},
            /**
             * 本地repo信息
             */
            repo: {},
            /**
             * 远程release信息
             */
            latestVersion:'',
            latestVersionName:'',
            latestVersionUrl:'',
            latestVersionDate:{}
        }
    },
    computed:{
        /**
         * 版本比较
         */
        hasNewVersion(){
            if(this.latestVersion==null||this.repo.version==null)return false
            else{
                var s1=this.latestVersion.substring(1,this.latestVersion.length).split('.')
                var s2=this.repo.version.substring(1,this.repo.version.length).split('.')
                /**逐个比较major minor和patch版本 */
                for(let i=0;i<3;i++){
                    if(s1[i]!=s2[i]){
                        return Number(s1[i])>Number(s2[i])
                    }
                }
                return false
            }
        }
    },
    mounted() {
        this.getOption()
        /**
         * 加载本地repo信息
         * 同时检查github上的远程版本
         */
        fetch('/repo.json').then(res => res.json()).then(res => {
            this.repo = res
            const octokit = new Octokit()
            octokit.request('GET /repos/{owner}/{repo}/releases/latest',{
                owner:this.repo.owner,
                repo:this.repo.repo
            }).then(res=>{
                if(res.status==200){
                    this.latestVersion=res.data.tag_name
                    this.latestVersionName=res.data.name
                    this.latestVersionUrl=res.data.html_url
                    this.latestVersionDate=new Date(res.data.published_at)
                }else{
                    console.error('版本检查失败!')
                }
            }).catch(()=>{console.error('版本检查失败!')})
        })

        /**设置cursor跟随事件 */
        window.onmousemove = (event) => {
            document.getElementById('CURSOR').style.left = event.clientX + 20 + 'px'
            document.getElementById('CURSOR').style.top = event.clientY + 'px'
        }
    },
    methods: {
        /**
         * 加载配置
         */
        getOption() {
            Services.getOption(res => {
                this.Options = res
            });
        },
        /**
         * 打开homepage
         */
        goHomePage() {
            chrome.tabs.create({ url: this.manifest.homepage_url, selected: true }, () => { })
        },
        /**
         * 打开github地址
         */
        goGithub() {
            chrome.tabs.create({ url: this.repo.url, selected: true }, () => { })
        },
        /**
         * 前往下载最新版本
         */
        goLatestRelease(){
            chrome.tabs.create({ url: this.latestVersionUrl, selected: true }, () => { })
        }
    }
}
</script>
<style>
html,
body,
#popup {
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