<template>
  <div :class="bem()">
    <div
      :class="bem('wrapper')"
      :style="wrapperStyle"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
      @touchcancel="touchEnd"
      ref="wrapper"
    >
      <slot></slot>
      <slot name="indicator">
        <div :class="bem('indicator-container')">
          <span :class="bem('indicator-item')"></span>
          <span :class="bem('indicator-item')"></span>
          <span :class="bem('indicator-item')"></span>
        </div>
      </slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref, watchEffect,provide } from "vue";
import { useChildren } from "../../../use/useRelation";
import { useTouch } from "./composables/use-touch";
import { swipeProps,name,bem,SWIPE_KEY } from "./swipe";

defineOptions({name});


const { children,linkChildren } = useChildren(SWIPE_KEY)
const wrapper = ref();
const offSetXRef = ref(0);
const wrapperStyle = computed(() => {
  return {
    transform: `translate${props.vertical ? "Y" : "X"}(${offSetXRef.value}px)`,
    transitionTimingFunction: `ease-out`,
    transitionDuration: `${durationRef.value}s`,
    width: `${props.vertical ? 375 : window.innerWidth * 3}px`,
    // height : `${props.vertical ? 900 : 300 }px`
  };
});

const props = defineProps(swipeProps);

const delta = computed(() => {
  return props.vertical ? touch.deltaY.value : touch.deltaX.value;
});

const wWidth = window.innerWidth;
const currentIndexRef = ref(0);
const durationRef = ref(0); // 动画持续时间
let touchStartTime: number;
const total = 3;
const touch = useTouch();

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
    console.log("delta.value", delta.value);
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

const shouldSwipe = (speed: number, distance: number) => {
  return Math.abs(speed) > 0.25 || distance >= wWidth / 2;
};

let looper: number | undefined = undefined;
const autoPlay = () => {
  stopAutoPlay();
  looper = setInterval(() => {
    durationRef.value = 0.3;
    currentIndexRef.value =
      currentIndexRef.value === total - 1 ? 0 : currentIndexRef.value + 1;
    offSetXRef.value = -currentIndexRef.value * moveDistance.value;
  }, 3000);
};
const stopAutoPlay = () => clearInterval(looper);
onMounted(() => {
  watchEffect(() => {
    if (props.autoPlay) {
      autoPlay();
    }
  });
});
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
