<template>
  <div ref="root" :class="bem()">
    <div
      :class="bem('wrapper')"
      :style="trackStyle"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
      @touchcancel="touchEnd"
      ref="wrapper"
    >
      <slot></slot>
      <!-- <slot name="indicator">
        <div :class="bem('indicator-container')">
          <span :class="bem('indicator-item')"></span>
          <span :class="bem('indicator-item')"></span>
          <span :class="bem('indicator-item')"></span>
        </div>
      </slot> -->
    </div>
  </div>
</template>
<script lang="ts" setup>
import { isHidden } from "@wencha/utils/dom";
import { computed, onMounted, ref, watchEffect,provide, nextTick, reactive, watch, CSSProperties } from "vue";
import { useChildren } from "@wencha/use/useRelation";
import { useTouch } from "./composables/use-touch";
import { swipeProps,name,bem,SWIPE_KEY, SwipeState } from "./swipe";
import { doubleRaf } from "@wencha/utils/animate";

const props = defineProps(swipeProps);
const emits = defineEmits({
   change : (active:number) => {}
})
defineOptions({name});


const root = ref<HTMLElement>();
const state = reactive<SwipeState>({
   rect:null,
   width:0,
   height:0,
   offset:0,
   active:0,
   swiping:false
})


const touch = useTouch();

const { children,linkChildren } = useChildren(SWIPE_KEY)

const count = computed(() => children.length)

const size = computed(() => state[props.vertical ? 'height' : 'width'])

// (5+3)%3
const activeIndicator = computed(() => (state.active + count.value) % count.value)

const isCorrectDirection = computed(() => {
  const expect = props.vertical ? 'vertical': 'horizontal';
  return touch.direction.value === expect;
})

const trackSize = computed(() => count.value * size.value)

const trackStyle = computed(() => {
  const style:CSSProperties = {
    transitionDuration : `${state.swiping ? 0 : props.duration}ms`,
    transform: `translate${props.vertical ? 'Y' : 'X'}(${state.offset}px)`
  }
  if(size.value) {
     const mainAxis = props.vertical ? 'height' : 'width';
     const crossAxis = props.vertical ? 'width' : 'height';
     style[mainAxis] = `${trackSize.value}px`;
     style[crossAxis] = props[crossAxis] ? `${props[crossAxis]}px` : ''
  }
  return style
});

linkChildren({
   count,
   size,
   props,
   activeIndicator,
})


const wrapper = ref();
const offSetXRef = ref(0);




const delta = computed(() => {
  return props.vertical ? touch.deltaY.value : touch.deltaX.value;
});

const wWidth = window.innerWidth;
const currentIndexRef = ref(0);
const durationRef = ref(0); // 动画持续时间
let touchStartTime: number;
const total = 3;


provide('swipe',currentIndexRef)

const touchStart = (e: TouchEvent) => {
  stopAutoPlay();
  durationRef.value = 0; // 重置动画时长
  touch.start(e);
  touchStartTime = Date.now();
};
const touchMove = (e: TouchEvent) => {
  touch.move(e);
  offSetXRef.value = -(currentIndexRef.value * moveDistance.value) + delta.value;
};
const touchEnd = (e: TouchEvent) => {
  let duration = Date.now() - touchStartTime;
  let speed = delta.value / duration;
  if (shouldSwipe(speed, delta.value)) {
    durationRef.value = 0.3;
    if (delta.value >= 0) {
      // 后退
      currentIndexRef.value = Math.max(currentIndexRef.value - 1, 0);
    } else {
      currentIndexRef.value = currentIndexRef.value + 1
    }
    offSetXRef.value = -currentIndexRef.value * moveDistance.value;
  } else {
    durationRef.value = 0.3;
    offSetXRef.value = -currentIndexRef.value * moveDistance.value;
  }
  props.autoPlay && autoPlay();
};
const moveDistance = computed(() => {
  return props.vertical ? 300 : wWidth;
});
// 滑动速度够快或者滑动尺度够长
const shouldSwipe = (speed: number, distance: number) => {
  return Math.abs(speed) > 0.25 || distance >= wWidth / 2;
};


const move = ({
  pace = 0,
  offset = 0,
  emitChange,
} : {  
  pace ?:number,
  offset ?:number,
  emitChange ?: boolean
}) => {
  if(count.value <= 1) {
    return;
  }
  const { active } = state;
  const targetActive = getTargetActive(pace)
  const targetOffset = getTargetOffset(targetActive,offset)

  console.log('pace,targetActive',pace,targetActive)
  state.active = targetActive;
  state.offset = targetOffset

  if(emitChange && targetActive !== active) { 
     emits('change',activeIndicator.value)
  }
}

const minOffset = computed(() => { 
  if(state.rect) { 
    const base = props.vertical ? state.rect.height : state.rect.width;
    return base - size.value * count.value; 
  }
  return 0
})

const maxCount = computed(() => Math.ceil(Math.abs(minOffset.value)/size.value))

const clamp = (num:number,min:number,max:number):number => Math.min(Math.max(num,min),max)

const getTargetActive = (pace:number) => { 
  const { active } = state
  if( pace ) {
    if(props.loop) {
      return clamp(active+pace,-1,count.value)
    }else { 
      return clamp(active+pace,0,maxCount.value)
    }
  }
  return active
}

const getTargetOffset = (targetActive:number,offset=0) => { 
   let currentPosition = targetActive * size.value
   if(!props.loop) { 
     currentPosition = Math.min(currentPosition,-minOffset.value)
   }
   let targetOffset = offset - currentPosition
   if(!props.loop) { 
    targetOffset =  clamp(targetOffset,minOffset.value,0)
   }
   return targetOffset
}

const correctPosition = () => {
   state.swiping = true;
   if(state.active <= -1) {
     console.log('loop模式',state.active)
     move({ pace : count.value })
   } else if(state.active > count.value ) {
    console.log('loop模式',state.active)
     move({ pace: -count.value })
   }
}

// swipe to next item
const next = () => {
  correctPosition()
  touch.reset()
  doubleRaf(() => {
     state.swiping = false;
     move({
       pace:1,
       emitChange:true
     })
  })
}


let autoplayTimer: number | undefined = undefined;
const autoPlay = () => {
  stopAutoPlay();
  if(props.autoPlay > 0 && count.value > 1) {
    autoplayTimer = setTimeout(() => {
      next()
      autoPlay()
    }, +props.autoPlay);  
  }
};

const stopAutoPlay = () => clearTimeout(autoplayTimer);

function initialize(active = +props.initialSwipe) { 
   if(!root.value) return;
   const cb = () => {
    if(!isHidden(root)){  
      const rect = {
        width : root.value!.offsetWidth,
        height: root.value!.offsetHeight
      }
      state.rect = rect
      state.width = +(props.width ?? rect.width)
      state.height = +(props.height ?? rect.height)
      console.log('state',state)
    }
    if(count.value) {
      active = Math.min(count.value - 1,active)
    }
    state.active = active
    // state.swiping = true // 先去掉看看会咋样
    autoPlay()
   }
   // issue: https://github.com/youzan/vant/issues/10052
   if(isHidden(root)) {
     nextTick().then(cb)
   } else {
     cb()
   }
}
watch(() => props.autoPlay,autoPlay)
onMounted(initialize);
</script>
<style lang="scss" scoped>
@use '../../../theme-chalk/src/mixins/mixins.scss' as *;
@include b(swipe) {
  position: relative;
  width: 100%;
  overflow: hidden;
  cursor: grab;
  user-select: none;
  @include e(wrapper) {
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
  }
  @include e(indicator-container) {
    position: absolute;
    left: 50%;
    bottom: 10px;
    display: flex;
    transform: translate(-50%);
  }
  @include e(indicator-item) {
    width: 10px;
    height: 10px;
    background-color: #cccccc;
    &.active {
      background-color: #ffffff;
    }
  }
}
</style>
