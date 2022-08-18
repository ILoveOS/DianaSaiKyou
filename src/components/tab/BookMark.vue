<template>
    <!--书签编辑器遮罩层-->
    <div class="text-center" style="background-color: var(--backgroundColor) !important;
        width: 100%;
        height: 100%;
        z-index: 66666;position: fixed;top:0" :style="{ display: editorVisable ? 'block' : 'none' }">
        <div class="modal-dialog text-center">
            <!--书签编辑器-->
            <div class="modal-content rounded-5 shadow" style="max-width:330px;display: inline-block;
                background-color: var(--color) !important;
                color: var(--backgroundColor) !important;
                border-color: var(--backgroundColor) !important;">
                <div class="modal-header p-5 pb-4 border-bottom-0">
                    <h2 class="fw-bold mb-0">编辑书签</h2>
                    <button type="button" class="btn-close" @click="closeEditor"></button>
                </div>
                <div class="modal-body p-5 pt-0"> 
                    <!--标题-->
                    <div class="input-group mb-3">
                        <span class="input-group-text">标题</span>
                        <input type="text" class="form-control" placeholder="标题" v-model="editorData.title">
                    </div>
                    <!--url-->
                    <div class="input-group mb-3">
                        <span class="input-group-text">Url</span>
                        <input type="url" class="form-control" placeholder="Url" v-model="editorData.url">
                    </div>
                    <!--保存按钮-->
                    <button class="w-100 mb-2 btn btn-primary" @click="save">保存</button>
                </div>
            </div>
        </div>
    </div>
    <div class="text-center">
        <!--书签列表-->
        <div class="grid mt-3" style="display:inline-block;max-width:640px; height:240px;overflow-y:auto">
            <!--书签条目-->
            <div class="card shadow-sm mt-3"
                style="width:76px;height:100px;display:inline-block;margin-left:10px;margin-right:10px"
                v-for="(item, i) in bookmarks" :key="i" @mouseenter="this.toolVisable[i] = true"
                @mouseleave="this.toolVisable[i] = false">
                <a :href="item.url" style="text-decoration:none" target="blank">
                    <!--图标-->
                    <img width="56" height="56" style="border-radius:50%;margin-top:10px" :src="item.icon"
                        @error="defaultBookmarkIcon">
                    <!--标题-->
                    <div class="card-body"
                        style="overflow:hidden;text-overflow: ellipsis;white-space:nowrap;padding-top:4px;padding-bottom:0;padding-left:3px;padding-right:3px">
                        <span class="card-text" style="font-size:4px;">
                            {{ item.title }}
                        </span>
                    </div>
                </a>
                <!--编辑和删除按钮-->
                <div class="mt-2" :style="{ display: toolVisable[i] ? 'inline' : 'none' }">
                    <i style="float: left;" class="bi bi-trash-fill" @click="del(item.id)"></i>
                    <i style="float: right;" class="bi bi-pencil-fill" @click="showEditor(item)"></i>
                </div>
            </div>
            <!--添加书签栏-->
            <div @click="showEditor(null, null)" class="card shadow-sm mt-3"
                style="width:76px;height:100px;display:inline-block;margin-left:10px;margin-right:10px">
                <a style="text-decoration:none" target="blank">
                    <!--图标-->
                    <i style="font-size:46px" class="bi bi-plus"></i>
                    <!--标题-->
                    <div class="card-body"
                        style="overflow:hidden;text-overflow: ellipsis;white-space:nowrap;padding-top:4px;padding-bottom:0;padding-left:3px;padding-right:3px">
                        <span class="card-text" style="font-size:4px;">
                            添加书签
                        </span>
                    </div>
                </a>
            </div>
        </div>
        <!--分页选择器-->
        <nav class="mt-2" v-if="pages > 1">
            <ul class="pagination justify-content-center">
                <li class="page-item" @click="this.curPage = this.curPage <= 0 ? this.pages - 1 : this.curPage - 1">
                    <a class="page-link" href="#">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li class="page-item" @click="this.curPage = i - 1" v-for="i in pages"
                    :class="{ active: curPage == i - 1 }" :key="i">
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
</template>
<script>
import { Services } from '@/util/service';
export default {
    name: 'BookMark',
    data() {
        return {
            //书签工具按钮的Visable
            toolVisable: {},
            //所有书签
            all: [],
            //书签总数
            total: 0,
            //当前页
            curPage: 0,
            //总页数
            pages: 0,
            //页大小
            pageSize: 11,
            //当前显示书签
            bookmarks: [],
            //书签编辑器Visable
            editorVisable: false,
            //书签编辑器数据
            editorData: { id: null, title: '', url: '' }
        }
    },
    watch: {
        /**
         * bookmarks随curPage变化而刷新
         * @param {number} newVal 
         * @param {number} oldVal 
         */
        curPage(newVal, oldVal) {
            this.bookmarks = []
            let offset = newVal * this.pageSize
            for (let i = offset; i < this.total && i < offset + this.pageSize; i++) {
                Services.getFavicon(this.all[i].url, res => {
                    if (res != null)
                        this.all[i].icon = res
                    else
                        this.all[i].icon = ''
                    this.bookmarks.push(this.all[i])
                })
            }
        }
    },
    methods: {
        /**默认书签图标 */
        defaultBookmarkIcon(e) {
            e.srcElement.src = this.$parent.Options.icon
        },
        /**
         * 加载书签
         */
        loadBookmarks() {
            Services.getBookmarks(res => {
                this.bookmarks = []
                this.all = res
                this.total = this.all.length
                this.pages = Math.ceil(this.total / this.pageSize)
                this.pages = this.pages == 0 ? 1 : this.pages
                let offset = this.curPage * this.pageSize
                for (let i = offset; i < this.total && i < offset + this.pageSize; i++) {
                    Services.getFavicon(this.all[i].url, res => {
                        if (res != null)
                            this.all[i].icon = res
                        else
                            this.all[i].icon = ''
                        this.bookmarks.push(this.all[i])
                    })
                }
            })
        },
        /**
         * 删除书签
         * @param {string} id 书签id
         */
        del(id) {
            if (confirm('你确定要删除该书签吗'))
                Services.removeBookmark(id, res => {
                    this.loadBookmarks()
                    alert('删除书签成功')
                })
        },
        /**
         * 显示书签编辑器
         * @param {{id:number,title:string,url:string}|null} item 书签条目
         */
        showEditor(item) {
            if (item != null) {
                this.editorData = item
            }
            else this.editorData = {id: null, title: '', url: '' }
            this.editorVisable = true
        },
        /**
         * 关闭书签编辑器
         */
        closeEditor() {
            this.editorData = { id: null, title: '', url: '' }
            this.editorVisable = false
        },
        /**
         * 保存书签
         */
        save() {
            Services.setBookmark(this.editorData.id, this.editorData.title, this.editorData.url, res => {
                this.loadBookmarks()
                alert('书签编辑成功!')
                this.closeEditor()
            })
        }
    },
    mounted() {
        /**
         * 读取所有的书签并计算分页以及获取图标
         */
        this.loadBookmarks()
    }
}
</script>