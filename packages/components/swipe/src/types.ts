import { ComputedRef } from "vue"
import { SwipeProps } from "./swipe"

export type SwipeProvide = {
   props : SwipeProps;
   size : ComputedRef<number>;
   count : ComputedRef<number>;
   activeIndicator : ComputedRef<number>;
}