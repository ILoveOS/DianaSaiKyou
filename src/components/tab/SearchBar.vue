<!--搜索栏-->
<template>
    <div class="text-center">
        <div class="container-fluid" style="width: 65%;">
        <!--图标-->
        <img :src="$parent.Options.icon" @error="defaultIcon" width="100" height="100" class="mt-2">
        <div class="input-group mt-2">
            <!--搜索引擎-->
            <select class="form-select" v-model="searchTool" style="max-width: 11%;">
                <option value="0">百度</option>
                <option value="1">Google</option>
                <option value="2">Bing</option>
            </select>
            <!--输入栏-->
            <input class="form-control" @keypress="enterSearch" v-model="searchKey">
            <!--确认按钮-->
            <button class="btn btn-success" @click="search">
                <i class="bi bi-search"></i>搜索
            </button>
        </div>
        </div>
    </div>
</template>
<script>
/**
 * 搜索引擎api信息
 */
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
            /**搜索内容 */
            searchKey:'',
            /**搜索引擎序号 */
            searchTool:0,
            /**时间 */
            time:new Date().toLocaleString()
        }
    },
    watch:{
        /**当_searchTool修改时相应地修改自身的searchTool */
        _searchTool(newVal,oldVal){
            this.searchTool=newVal
        }
    },
    mounted(){
        /**时间更新器 */
        window.setInterval(()=>this.time=new Date().toLocaleString())
    },
    methods:{
        /**
         * 搜索
         */
        search(){
            var tool=SearchTools[this.searchTool]
            var href=`${tool.url}?${tool.param}=${this.searchKey}`
            window.open(href,'_blank')
        },
        /**
         * enter键按下后搜索
         * @param {event} e 
         */
        enterSearch(e){
            if(e.keyCode==13)this.search()
        },
        /**
         * 默认图标
         * @param {event} e 
         */
        defaultIcon(e){
            var ele=e.srcElement
            ele.src='/assets/icon.png'
            ele.onerror=null
        }
    }
}
</script>