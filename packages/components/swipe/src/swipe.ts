import { createNameSpace } from '@wencha/utils/create';
import { ExtractPropTypes, InjectionKey } from 'vue';
import { SwipeProvide } from './types';

export type SwipeState = {
  rect: { width: number; height: number } | null;
  width: number;
  height: number;
  offset: number;
  active: number;
  swiping: boolean;
}


export let swipeProps = {
  width: {
    type : [Number,String]
  },
  height: {
    type : [Number,String]
  },
  vertical : {
      type : Boolean,
      default : false
  },
  autoPlay: {
     type : [Number,String],
     default: 0
  },
  duration:{
    type : Number,
    default: 500
  },
  // 初始位置索引值
  initialSwipe:{
    type:[Number,String],
    default:0
  },
  loop:{
    type : Boolean,
    default : true
  }
}
export type SwipeProps = ExtractPropTypes<typeof swipeProps>

export const [name, bem] = createNameSpace("swipe");

export const SWIPE_KEY:InjectionKey<SwipeProvide> = Symbol(name)