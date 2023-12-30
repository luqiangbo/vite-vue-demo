<script setup>
import _ from 'lodash-es'
import { useRouter } from 'vue-router'

import { useAdminStore } from '@/store/admin'
import { useGoodStore } from '@/store/good'

const adminStore = useAdminStore()
const goodStore = useGoodStore()
import { fetchClinicUserAuth, fetchClinicAreaAll } from '@/api/clinic'
const router = useRouter()

onBeforeMount(async () => {
  init()
})

const init = () => {
  //
  console.log('init layout')
  onfetchClinicUserAuth()
}

const onfetchClinicUserAuth = async () => {
  const [res, err] = await fetchClinicUserAuth()
  if (err) {
    onLogout()
    return
  }
  adminStore.shop_id = res.shop_id
  adminStore.authority = res.authority
  onFetchAreaList()
}

const onMenuOpen = (e) => {
  // console.log('onMenuOpen', e)
}
const onMenuSelect = (path) => {
  console.log('onMenuSelect', path)
  adminStore.routerActive = path
  router.push({
    path,
  })
}

const onCommand = (key) => {
  console.log({ key })
  if (key === 'logout') {
    onLogout()
    return
  }
}

const onLogout = () => {
  adminStore.token = ''
  adminStore.shop_id = ''
  adminStore.authority = ''
  router.push({
    path: '/login',
  })
}

// 获取地区code
const onFetchAreaList = async () => {
  const [res, err] = await fetchClinicAreaAll()
  if (err) return
  goodStore.areaAll = res.list
}

const onHome = () => {
  router.push({
    path: '/',
  })
}
</script>

<template>
  <div class="page-layout">
    <div class="page-layout-navbar">
      <div class="page-layout-navbar-main">
        <div class="main-logo" @click="onHome">
          <svg-icon iconName="icon-logo" color="#4792e6" class-name="text-4xl"></svg-icon>
          <div class="main-logo-title">美好口腔</div>
        </div>
        <div class="main-personal">
          <el-dropdown @command="onCommand">
            <el-avatar :size="40" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <div class="page-layout-left">
      <div class="page-layout-left-main" :style="{ backgroundColor: '#efefef' }">
        <el-menu
          active-text-color="#437cfb"
          background-color="#efefef"
          text-color="#3a3a3a"
          :default-active="adminStore.routerActive"
          @open="onMenuOpen"
          @select="onMenuSelect"
        >
          <div v-for="u in goodStore.routers" :key="u.key" :index="u.key">
            <el-menu-item-group v-if="u?.children" :title="u.title">
              <el-menu-item v-for="h in u.children" :key="h.key" :index="h.key">
                <svg-icon
                  :iconName="'icon-' + h.icon"
                  :color="adminStore.routerActive === h.key ? '#437cfb' : '#3a3a3a'"
                  class-name="text-xl"
                />
                <div class="pl-2">
                  {{ h.title }}
                </div>
              </el-menu-item>
            </el-menu-item-group>
          </div>
        </el-menu>
      </div>
    </div>
    <div class="page-layout-left-hide"></div>
    <div class="page-layout-right">
      <router-view />
    </div>
  </div>
</template>

<style></style>
