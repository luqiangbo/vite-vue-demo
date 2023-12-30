import { createApp } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import store from './store'
import router from './router'
import SvgIcon from './components/SvgIcon/SvgIcon.vue'
import './assets/iconfont/iconfont.js'
import './styles/tailwind.css'
import './styles/global.less'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('SvgIcon', SvgIcon)
app.use(store)
app.use(router)
app.mount('#app')
