import { withInstall } from '@wencha/utils/with-install';
import _Icon from './src/icon.vue';

const Icon = withInstall(_Icon)

export default Icon

export * from './src/icon'


// 这里添加的类型，可以在模板中被解析，会有提示
declare module 'vue' {
     export interface GlobalComponents { // 接口可以自动合并
         wcIcon : typeof Icon
     }
}

