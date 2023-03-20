<template>
  <div :class="bem()" ref="swipeItem">
      <slot></slot>
  </div>
</template>
<script lang="ts" setup>
import { createNameSpace } from '@wencha/utils/create';
import { inject, onMounted,ref, watch } from 'vue'

const [name,bem] = createNameSpace('swipe-item')

const swipeData:any = inject('swipe')

console.log('swipeData',swipeData)

watch(() => swipeData.value,(value) => {
   console.log('value',value)
})

defineOptions({
  name: "wc-swipe-item",
});

let swipeItem = ref<HTMLElement|null>(null)
onMounted(() => {
  swipeItem.value!.style.width = window.innerWidth+'px'
})
</script>
<style lang="scss" scoped>
@use '../../../theme-chalk/src/mixins/mixins.scss' as *;
  @include b(swipe-item) {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>