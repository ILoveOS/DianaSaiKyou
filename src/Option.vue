<template>
    <title>设置</title>
    <div id="option-main" class="text-center"
        :style="{ '--color': Options.color, '--backgroundColor': Options.backgroundColor }">
        <div class="pt-3 pb-3" style="width:30%;display: inline-block;">
            <h5>设置</h5>
            <div class="mt-4 mb-4" v-for="(item, idx) in Options" :key="idx">
                <span>{{ OptionNames[idx] }}</span>
                <input v-if="OptionTypes[idx] != 'select' && OptionTypes[idx] != 'img' && OptionTypes[idx] != 'textarea'"
                    class="form-control" :class="{ 'form-control-color': OptionTypes[idx] == 'color' }"
                    :type="OptionTypes[idx]" v-model="Options[idx]">
                <select v-if="OptionTypes[idx] == 'select'" class="form-select" v-model="Options[idx]">
                    <option v-for="(op, i) in OptionSelects[idx]" :value="i" :key="i">
                        {{ op }}
                    </option>
                </select>
                <div v-if="OptionTypes[idx] == 'img'">
                    <input hidden :id="idx" type="file" @change="upload(idx)">
                    <img :src="Options[idx]" @click="select(idx)" width="50" height="50">
                </div>
                <textarea class="form-control" maxlength="40" v-if="OptionTypes[idx] == 'textarea'"
                    v-model="Options[idx]">
            </textarea>
            </div>
            <button @click="setOption" class="btn btn-primary" style="margin-right:20px">保存</button>
            <button @click="clearOption" class="btn btn-danger" style="margin-left:20px">重置</button>
        </div>
    </div>
</template>
<script>
import { Services } from './util/service'

export default {
    name: 'OptionVue',
    data() {
        return {
            Options: {},
            OptionNames: {
                title: '标签页标题',
                color: '前景色',
                backgroundColor: '背景色',
                searchTool: '默认搜索引擎',
                icon: '图标',
                progressIcon: '进度条图标',
                playList: '播单rid',
                wheelText: '独轮车内容',
                wheelStartImg: '独轮车启动图标',
                wheelPauseImg: '独轮车停止图标',
                wheelInterval: '独轮车间隔(毫秒)'
            },
            OptionTypes: {
                title: 'text',
                color: 'color',
                backgroundColor: 'color',
                searchTool: 'select',
                icon: 'img',
                progressIcon: 'img',
                playList: 'text',
                wheelText: 'textarea',
                wheelStartImg: 'img',
                wheelPauseImg: 'img',
                wheelInterval: 'number'
            },
            OptionSelects: {
                searchTool: ['百度', 'Google', 'Bing']
            }
        }
    },
    mounted() {
        this.getOption()
    },
    methods: {
        getOption() {
            Services.getOption(res => {
                this.Options = res
            })
        },
        clearOption() {
            Services.clearOption(res => {
                this.Options = res
                alert('重置选项成功')
            })
        },
        setOption() {
            Services.setOption(this.Options, res => { alert('选项保存完成') })
        },
        select(id) {
            document.getElementById(id).click()
        },
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
html,
body{
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
}

#option{
    height: auto;
}

* {
    color: var(--color) !important;
    border-color: var(--color) !important;
    background-color: var(--backgroundColor) !important;
    outline-color: var(--color) !important;
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

img {
    background-color: transparent !important;
}
</style>