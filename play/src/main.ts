import { createApp } from 'vue'
import Icon from '@wencha/components/icon'
import '@wencha/theme-chalk/src/icon.scss'
import '@wencha/theme-chalk/index.scss'
import Tree from '@wencha/components/tree';
import VirtualList from '@wencha/components/virtual-list'
import './style.css'
import App from './App.vue'

const app = createApp(App)

const components = [
     Icon,Tree,VirtualList
]

components.forEach(component => app.use(component))

app.mount('#app')
