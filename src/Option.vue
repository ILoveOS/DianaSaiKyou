<!--设置页-->
<template>
    <!--标题-->
    <title>设置</title>
    <div id="option-main" class="text-center">
        <div class="pt-3 pb-3" style="width:30%;display: inline-block;">
            <h5>设置</h5>
            <!--加载option中的每一项并根据其类型加载到相应的表单组件中-->
            <div class="mt-4 mb-4" v-for="(item, idx) in Options" :key="idx">
                <!--选项名-->
                <span>{{ OptionNames[idx] }}</span>
                <!--普通的input-->
                <input
                    v-if="OptionTypes[idx] != 'select' && OptionTypes[idx] != 'img' && OptionTypes[idx] != 'textarea' && OptionTypes[idx]!='range'"
                    class="form-control" :class="{ 'form-control-color': OptionTypes[idx] == 'color' }"
                    :type="OptionTypes[idx]" v-model="Options[idx]">
                <!--Select-->
                <select v-if="OptionTypes[idx] == 'select'" class="form-select" v-model="Options[idx]">
                    <option v-for="(op, i) in OptionSelects[idx]" :value="i" :key="i">
                        {{op}}
                    </option>
                </select>
                <!--图片-->
                <div v-if="OptionTypes[idx] == 'img'">
                    <input hidden :id="idx" type="file" @change="upload(idx)" accept="image/*">
                    <img :src="Options[idx]" @click="select(idx)" width="50" height="50">
                </div>
                <!--textarea-->
                <textarea class="form-control" maxlength="40" v-if="OptionTypes[idx] == 'textarea'"
                    v-model="Options[idx]">
                </textarea>
                <!--range-->
                <div v-if="OptionTypes[idx]=='range'">
                    <input type="range" class="form-control" :min="OptionRanges[idx].min" :max="OptionRanges[idx].max" v-model="Options[idx]">
                    <span class="range-value">{{Options[idx]}}</span>
                </div>
            </div>
            <!--保存和重置按钮-->
            <button @click="setOption" class="btn btn-primary" style="margin-right:20px">保存</button>
            <button @click="clearOption" class="btn btn-danger" style="margin-left:20px">重置</button>
        </div>
    </div>
    <!--cursor跟随图片-->
    <img style="position:fixed;z-index: 99999;" :width="Options.cursorSize" :height="Options.cursorSize"
        :src="Options.cursor" id="CURSOR">
</template>
<script>
import { Services } from './util/service'

export default {
    name: 'OptionVue',
    data() {
        return {
            /**
             * 选项
             */
            Options: {},
            /**
             * 选项名
             */
            OptionNames: {
                title: '标签页标题',
                color: '前景色',
                backgroundColor: '背景色',
                searchTool: '默认搜索引擎',
                icon: '图标',
                cursor: '光标附加图片',
                cursorSize: '光标附加图片大小',
                progressIcon: '进度条图标',
                playList: '播单rid',
                playMode: '播放模式',
                wheelText: '独轮车内容',
                wheelStartImg: '独轮车启动中图标',
                wheelPauseImg: '独轮车停止状态图标',
                wheelInterval: '独轮车间隔(毫秒)',
                dynUid: '动态推送Uid',
                dynQueryInterval: '动态推送查询间隔(分钟)'
            },
            /**
             * 选项类型
             */
            OptionTypes: {
                title: 'text',
                color: 'color',
                backgroundColor: 'color',
                searchTool: 'select',
                icon: 'img',
                cursor: 'img',
                cursorSize: 'range',
                progressIcon: 'img',
                playList: 'text',
                playMode: 'select',
                wheelText: 'textarea',
                wheelStartImg: 'img',
                wheelPauseImg: 'img',
                wheelInterval: 'range',
                dynUid:'text',
                dynQueryInterval: 'range'
            },
            /**
             * select值
             */
            OptionSelects: {
                searchTool: ['百度', 'Google', 'Bing'],
                playMode:['顺序播放','单曲循环','随机播放']
            },
            OptionRanges:{
                cursorSize:{min:20,max:80},
                wheelInterval:{min:6000,max:20000},
                dynQueryInterval:{min:1,max:10}
            }
        }
    },
    watch:{
        'Options.color'(newVal,oldVal){
            document.documentElement.style.setProperty('--color',newVal)
        },
        'Options.backgroundColor'(newVal,oldVal){
            document.documentElement.style.setProperty('--backgroundColor',newVal)
        }
    },
    mounted() {
        this.getOption()
        /**设置cursor跟随事件 */
        window.addEventListener('mousemove', event => {
            document.getElementById('CURSOR').style.left = event.clientX + 20 + 'px'
            document.getElementById('CURSOR').style.top = event.clientY + 'px'
        })
    },
    methods: {
        /**
         * 加载选项
         */
        getOption() {
            Services.getOption(res => {
                this.Options = res
            })
        },
        /**
         * 重置选项
         */
        clearOption() {
            Services.clearOption(res => {
                this.Options = res
                alert('重置选项成功')
            })
        },
        /**
         * 设置选项
         */
        setOption() {
            Services.setOption(this.Options, res => { alert('选项保存完成') })
        },
        /**
         * 打开指定DOM的文件选择器
         * @param {string} id domid 
         */
        select(id) {
            document.getElementById(id).click()
        },
        /**
         * 上传图片
         * @param {string} id domid 
         */
        upload(id) {
            var f = document.getElementById(id).files[0]
            var fr = new FileReader()
            fr.onload = (e) => {
                this.Options[id] = e.target.result
            }
            fr.readAsDataURL(f)
        }
    }
}
</script>
<style>
#option {
    height: auto;
}

input[type='color'] {
    padding: 0 !important;
    border: none !important;
    width: 100% !important;
}

::-webkit-color-swatch-wrapper {
    border: none !important;
}

::-webkit-color-swatch {
    border-color: var(--color) !important;
}
.btn-danger{
    background-color: var(--color) !important;
    color: var(--backgroundColor) !important;
}
</style>