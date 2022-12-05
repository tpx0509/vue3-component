import { withInstall } from '@wencha/utils/with-install';
import _virtualList from './src/virtualList';


const VirtualList = withInstall(_virtualList)


export default VirtualList

// 这里添加的类型，可以在模板中被解析，会有提示
declare module 'vue' {
   export interface GlobalComponents {
       wxVirtualList : typeof VirtualList
   }
}