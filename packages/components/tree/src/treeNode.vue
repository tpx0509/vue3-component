<template>
    <div :class="[bem(),bem({
       selected : isSelected
    })]" :style="{ 'paddingLeft' : node.level * 20 + 'px' }">
        <span 
        v-if="!node.isLeaf"
        :class="[bem('icon',{
            expanded : isExpanded && !node.isLeaf
        })]" 
        @click="clickCurrentNode" 
        >
          <wc-icon :size="15">
              <ReloadCircleOutline class="rotate-trans" v-if="isLoading"></ReloadCircleOutline>
              <Switcher v-else></Switcher>
          </wc-icon>
        </span>
        <span :class="bem('label')" @click="selectCurrentNode"><treeNodeContent :node="node"></treeNodeContent></span>
    </div>
</template>
<script lang="ts" setup>
  import { createNameSpace } from '@wencha/utils/create';
  import {  treeNodeProps,treeNodeEmits, treeInjectKey } from './tree'
  import Switcher from './icon/switcher'
  import treeNodeContent from './tree-node-content';
  import {ReloadCircleOutline} from '@vicons/ionicons5'
  import { computed, inject } from 'vue';
  let bem = createNameSpace('tree-node')
  const props = defineProps(treeNodeProps)
  const emit = defineEmits(treeNodeEmits)
  function clickCurrentNode() {
    emit('toggle',props.node)
  }

  const isLoading = computed(() => {
     return props.loadingKeys?.has(props.node.key)
  })

  const isSelected = computed(() => {
     return props.selectedKeys.includes(props.node.key)
  })

  function selectCurrentNode() {
     emit('select',props.node)
  }
  const treeContext = inject(treeInjectKey)
</script>
<style lang="scss" scoped>
    .wc-tree-node {
      line-height: 1.5;
       &__icon {
         cursor: pointer;
         display: inline-block;
         transform: rotate(0deg);
         transition: transform 0.2s ease-in;
         &--expanded {
             
            transform: rotate(90deg);
         }
       }
       &__label {
          font-size: 14px;
          color : #333333;
       }
       &--selected &__label{
         color : red;
       }
    }
    .rotate-trans {
        animation: rotate 1s linear infinite;
    }

    @keyframes rotate {
       0% {
          transform: rotate(0);
       }
       100% {
         transform: rotate(360deg);
       }
    }
</style>