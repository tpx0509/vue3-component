import { withInstall } from '@wencha/utils/with-install';
import _swipeItem from './src/swipe-item.vue';


const SwipeItem = withInstall(_swipeItem)


export default SwipeItem

// 这里添加的类型，可以在模板中被解析，会有提示
declare module 'vue' {
   export interface GlobalComponents {
       wcSwipeItem : typeof SwipeItem
   }
}