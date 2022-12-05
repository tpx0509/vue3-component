<template>
  <i :class="bem()" :style="style">
    <slot></slot>
  </i>
</template>
<script lang="ts" setup>
import { createNameSpace } from "@wencha/utils/create";
import { computed } from "vue";
import { iconProps } from "./icon";
const bem = createNameSpace("icon");

defineOptions({
  name: "wc-icon",
});

const props = defineProps(iconProps);

const style = computed(() => {
  if (!props.color && !props.size) return {};
  return {
    ...(props.size ? { "font-size": props.size + "px" } : {}),
    ...(props.color ? { color: props.color } : {}),
  };
});
</script>
<style lang="scss" scoped></style>
