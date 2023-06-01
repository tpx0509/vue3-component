<template>
  <div :class="bem()" ref="swipeItem">
      <slot></slot>
  </div>
</template>
<script lang="ts" setup>
import { createNameSpace } from '@wencha/utils/create';
import { inject, onMounted,reactive,ref, watch } from 'vue'
import { useParent } from "@wencha/use/useRelation";
import { SWIPE_KEY } from '../../swipe/src/swipe';

let  [name,bem] = createNameSpace('swipe-item')


defineOptions({name : 'wc-swipe-item'});

const state = reactive({
   offset: 0,
   inited: false,
   mounted: false
})

const { parent,index } = useParent(SWIPE_KEY)


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