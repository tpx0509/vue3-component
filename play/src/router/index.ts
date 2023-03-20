import { createRouter,createWebHistory,RouteRecordRaw } from 'vue-router';

let baseUrl = '';


let routes:Array<RouteRecordRaw> = [
    {
      path : '/swipe',
      name : 'swipe',
      component : () =>  import(/* webpackChunkName: "swipe" */'../views/swipe.vue')
    },
    {
      path : '',
      name : 'home',
      component : () =>  import(/* webpackChunkName: "index" */'../views/index.vue')
    }
]
let router = createRouter({
   history : createWebHistory(baseUrl),
   routes
})

router.beforeEach((to,form,next) => {
  next()
})

export default router