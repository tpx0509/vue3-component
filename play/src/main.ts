import { createApp } from 'vue'
import router from './router'

import Icon from '@wencha/components/icon'
import Tree from '@wencha/components/tree'
import VirtualList from '@wencha/components/virtual-list'
import Swipe from '@wencha/components/swipe'
import SwipeItem from '@wencha/components/swipe-item'
import '@wencha/theme-chalk/src/icon.scss'
import '@wencha/theme-chalk/index.scss'
import './style.css'
import App from './App.vue'

const app = createApp(App)

const components = [
     Icon,Tree,VirtualList,Swipe,SwipeItem
]

components.forEach(component => app.use(component))

app.use(router).mount('#app')
