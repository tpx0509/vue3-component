import { withInstall } from '@wencha/utils/with-install';
import _CountDown from './src/CountDown';


const CountDown = withInstall(_CountDown)


export default CountDown

// 这里添加的类型，可以在模板中被解析，会有提示
declare module 'vue' {
   export interface GlobalComponents {
       wcCountDown : typeof CountDown
   }
}