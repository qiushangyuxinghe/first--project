import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import '@/api/mock.js'
import api from '@/api/api'
import {useAllDataStore} from '@/stores'
function isRoute(to){
  let res = router.getRoutes();
  let resFil = res.filter((item)=>item.path === to.path);
  return resFil.length>0
}
router.beforeEach((to,from)=>{
  if(to.path !== '/login' && !store.state.token)
  {
    return {name:"login"}
  }
  if(!isRoute(to)){
    return {name:"404"}
  }
})
const pinia = createPinia()
const app = createApp(App)
app.config.globalProperties.$api = api
app.use(pinia)
const store = useAllDataStore()
store.addMenu(router,"refresh")
app.use(router)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.mount('#app')
