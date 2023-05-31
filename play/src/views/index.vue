<script setup lang="ts">
import { AccessibilitySharp } from "@vicons/ionicons5";
import { Key, TreeOption } from "@wencha/components/tree/src/tree";
import { ref } from "vue";
function createData(level = 4, parentKey = ""): any {
  if (!level) return [];
  const arr = new Array(20 - level).fill(0);
  return arr.map((_, idx: number) => {
    const key = parentKey + level + idx;
    return {
      name: createLabel(level), // 显示的内容
      id: key, // 为了唯一性
      children: createData(level - 1, key), // 孩子
    };
  });
}
function createLabel(level: number): string {
  if (level === 4) return "道生一";
  if (level === 3) return "一生二";
  if (level === 2) return "二生三";
  if (level === 1) return "三生万物";
  return "";
}
const data = ref(createData());

function createAsyncData() {
  const arr = new Array(2).fill(0);
  return arr.map((_, idx: number) => {
    const key = idx+new Date().getTime();
    return {
      label: '异步数据第一层', // 显示的内容
      key, 
      children: [], // 孩子默认为空
      isLeaf : false // 异步加载
    };
  });
}
function createAsyncLabel(label?:string|number) {
   if(label === '异步数据第一层') return '异步数据第二层';
   if(label === '异步数据第二层') return '异步数据第三层';
   if(label === '异步数据第三层') return '异步数据第四层';
   if(label === '异步数据第四层') return '异步数据第五层';
   if(label === '异步数据第五层') return '异步数据第六层';
   if(label === '异步数据第六层') return '异步数据第一层';
}

function loadData(node:TreeOption) {
   // tree组件内部需要将即将展开的节点传递给我
    return new Promise<TreeOption[]>((resolve) => {
       setTimeout(() => {
          resolve(
             // 这个数据会作为当前展开node的children属性
            [{
              label : createAsyncLabel(node.label),
              key : node.key + new Date().toString(),
              isLeaf : false
            }]
          )
       },2000)
    })
}
let data2 = ref(createAsyncData())

const selectedKeysRef = ref<Key[]>(['40','41'])

const control = ref()
const start = () => control.value.start()
const pause = () => control.value.pause()
const reset = () => control.value.reset()
</script>

<template>
  <!-- <wc-icon :color="'red'" :size="50">
    <AccessibilitySharp></AccessibilitySharp>
 </wc-icon>
  <wc-icon :color="'blue'" :size="50">
    <AccessibilitySharp></AccessibilitySharp>
 </wc-icon> -->
  <div class="tree-container">
    <!-- <wc-tree
      :data="data"
      label-field="name"
      key-field="id"
      v-model:selectedKeys="selectedKeysRef"
      :mutiple="true"
      :default-expanded-keys="['40', '4030', '403020']"
    >
      <template #default="{node}">
        {{node.label}}-{{node.key}}
      </template>
    </wc-tree> -->

    <!-- <wc-tree :data="data2" :onLoad="loadData"></wc-tree> -->
    <wc-count-down :time='1000*60*60' ></wc-count-down>
    <div>
      <wc-count-down :auto-start="false" ref='control' :time='1000*5' milliseconds format='mm:ss:SS'></wc-count-down>
      <button @click="start">开始</button>
      <button @click="pause">停止</button>
      <button @click="reset">重置</button>
    </div>
    <div>
      <wc-count-down :time='1000*5' format='mm:ss'></wc-count-down>
    </div>
    <div>
      <wc-count-down :time='30 * 60 * 60 * 1000'>
        <template #default="currentTime">
          <span class="block">{{ currentTime.hours }}</span>
          <span class="colon">:</span>
          <span class="block">{{ currentTime.minutes }}</span>
          <span class="colon">:</span>
          <span class="block">{{ currentTime.seconds }}</span>
        </template>
      </wc-count-down>
    </div>
   
  </div>
</template>

<style scoped lang="scss">
  .tree-container {
     display: flex;
     div {
       flex:1;
     }
  }
   .colon {
    display: inline-block;
    margin: 0 4px;
    color: red;
  }

  .block {
    display: inline-block;
    width: 22px;
    color: #fff;
    font-size: 12px;
    text-align: center;
    background-color: red;
    border-radius: 4px;
  }

</style>
