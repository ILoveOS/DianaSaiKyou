<template>
    <div class="text-center">
        <div class="container-fluid" style="width: 65%;">
        <img :src="$parent.Options.icon" @error="defaultIcon" width="100" height="100" class="mt-5">
        <h3 class="mt-3">{{time}}</h3>
        <div class="input-group mt-4">
            <select class="form-select" v-model="searchTool" style="max-width: 10%;">
                <option value="0">百度</option>
                <option value="1">Google</option>
                <option value="2">Bing</option>
            </select>
            <input class="form-control" @keypress="enterSearch" v-model="searchKey">
            <button class="btn btn-success" @click="search">
                <i class="bi bi-search"></i>搜索
            </button>
        </div>
        </div>
    </div>
</template>
<script>
const SearchTools=[
    {
        url:'https://www.baidu.com/s',
        param:'wd'
    },{
        url:'https://www.google.com/search',
        param:'q'
    },{
        url:'https://cn.bing.com/search',
        param:'q'
    }
]
export default {
    name: 'SearchBar',
    props:['_searchTool'],
    data(){
        return{
            searchKey:'',
            searchTool:0,
            time:new Date().toLocaleString()
        }
    },
    watch:{
        _searchTool(newVal,oldVal){
            this.searchTool=newVal
        }
    },
    mounted(){
        window.setInterval(()=>this.time=new Date().toLocaleString())
    },
    methods:{
        search(){
            var tool=SearchTools[this.searchTool]
            var href=`${tool.url}?${tool.param}=${this.searchKey}`
            window.open(href,'blank')
        },
        enterSearch(e){
            if(e.keyCode==13)this.search()
        },
        defaultIcon(e){
            var ele=e.srcElement
            ele.src='/assets/icon.png'
            ele.onerror=null
        }
    }
}
</script>