import { createNameSpace } from '@wencha/utils/create';
import { ExtractPropTypes, InjectionKey } from 'vue';
import { SwipeProvide } from './types';

export let swipeProps = {
  vertical : {
      type : Boolean,
      default : false
  },
  autoPlay: {
     type : Boolean,
     defaul: true
  }
} as const

export type SwipeProps = ExtractPropTypes<typeof swipeProps>

export const [name, bem] = createNameSpace("swipe");

export const SWIPE_KEY:InjectionKey<SwipeProvide> = Symbol(name)