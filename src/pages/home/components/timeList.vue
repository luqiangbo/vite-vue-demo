<template>
  <div class="time-list">
    <div v-for="u in userStore.timeList" :key="u.key" class="time-list-item">
      <div class="left">{{ u.key }}</div>
      <div class="right">
        <div v-for="h in u.value" :key="h" class="right-item">{{ h }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/user'
const userStore = useUserStore()
</script>
