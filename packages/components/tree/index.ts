import { withInstall } from '@wencha/utils/with-install';
import _tree from './src/tree.vue';


const Tree = withInstall(_tree)


export default Tree

// 这里添加的类型，可以在模板中被解析，会有提示
declare module 'vue' {
   export interface GlobalComponents {
       wcTree : typeof Tree
   }
}