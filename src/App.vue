<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'dayjs/locale/zh-cn'
</script>

<template>
  <el-config-provider :locale="zhCn" :z-index="3000">
    <RouterView />
  </el-config-provider>
</template>

<style scoped></style>
