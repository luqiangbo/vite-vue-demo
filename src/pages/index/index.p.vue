<script setup>
import ChartMap from '@/components/chartMap.vue'

onMounted(async () => {
  init()
})

const init = () => {}
</script>

<template>
  <div class="page page-home overflow-hidden">
    <el-card class="p-3 mb-3 w-full">
      <ChartMap></ChartMap>
    </el-card>
  </div>
</template>

<style scoped></style>
