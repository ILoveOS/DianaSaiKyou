<template>
    <div class="text-center">
        <div class="grid mt-3" style="display:inline-block;max-width:640px; max-height:300px;overflow-y:auto">
            <div class="card shadow-sm mt-3"
                style="width:76px;height:100px;display:inline-block;margin-left:10px;margin-right:10px"
                v-for="(item, i) in bookmarks" :key="i">
                <a :href="item.url" style="text-decoration:none" target="blank">
                    <img width="56" height="56" style="border-radius:50%;margin-top:10px" :src="item.icon"
                        @error="defaultBookmarkIcon">
                    <div class="card-body"
                        style="overflow:hidden;text-overflow: ellipsis;white-space:nowrap;padding-top:4px;padding-bottom:0;padding-left:3px;padding-right:3px">
                        <span class="card-text" style="font-size:4px;">
                            {{ item.title }}
                        </span>
                    </div>
                </a>
            </div>
            <nav class="mt-2">
                <ul class="pagination justify-content-center">
                    <li class="page-item" @click="this.curPage = this.curPage <= 0 ? this.pages - 1 : this.curPage - 1">
                        <a class="page-link" href="#">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    <li class="page-item" 
                        @click="this.curPage = i - 1" 
                        v-for="i in pages"
                        :key="i"
                        >
                        <a class="page-link" href="#">{{ i }}</a>
                    </li>
                    <li class="page-item" @click="this.curPage = (this.curPage + 1) % this.pages">
                        <a class="page-link" href="#">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>
<script>
export default {
    name: 'BookMark',
    data() {
        return {
            all: [],
            total: 0,
            curPage: 0,
            pages: 0,
            pageSize: 12
        }
    },
    methods: {
        defaultBookmarkIcon(e) {
            e.srcElement.src = '/assets/icon.png'
        }
    },
    computed: {
        bookmarks() {
            let result = [];
            let offset = this.curPage * this.pageSize
            for (let i = offset; i < this.total && i < offset + this.pageSize; i++) {
                result.push(this.all[i])
            }
            return result
        }
    },
    mounted() {
        Services.getBookmarks(res => {
            this.all = res
            this.total = this.all.length
            this.pages = Math.ceil(this.total / this.pageSize)
            this.pages = this.pages == 0 ? 1 : this.pages
            for (let i = 0; i < this.all.length; i++) {
                Services.getFavicon(this.all[i].url, res => {
                    if (res != null)
                        this.all[i].icon = res
                    else
                        this.all[i].icon = '/assets/icon.png'
                })
            }
        })
    }
}
import { Services } from '@/util/service';
</script>