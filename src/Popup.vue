<template>
    <div class="text-center" :style="{'--color':Options.color,'--backgroundColor':Options.backgroundColor}"  style="padding-left: 80px;padding-right:80px">
        <img width="128" height="128" :src="manifest.icons[128]">
        <h4>{{ manifest.name }}</h4>
        <span class="text-muted" style="font-size: 8px;">{{ manifest.description }}</span><br>
        <span style="font-size:10px">版本:{{ manifest.version }}</span><br>
        <span style="font-size:10px"><a @click="goHomePage" href="#">{{ manifest.author }}</a></span><br>
        <i class="bi bi-github" @click="goGithub" style="cursor: pointer;font-size: 20px;"></i>
    </div>
</template>
<script>
import { Services } from './util/service';
export default {
    name: 'PopupVue',
    data() {
        return {
            manifest: chrome.runtime.getManifest(),
            Options:{},
            rep:{}
        }
    },
    mounted() {
        this.getOption()
        fetch('/rep.json').then(res=>res.json()).then(res=>{
            this.rep=res
        })
    },
    methods:{
        getOption() {
            Services.getOption(res => {
                this.Options=res
            });
        },
        goHomePage(){
            chrome.tabs.create({url:this.manifest.homepage_url,selected:true},()=>{})
        },
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