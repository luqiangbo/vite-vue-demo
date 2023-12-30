<script setup>
import ComShowUpdateOrder from './showUpdateOrder.vue'
import { useUserStore } from '@/store/user'
const userStore = useUserStore()
</script>

<template>
  <div v-if="userStore.isShowOrder" class="page-home-edit-hide"></div>
  <div v-if="userStore.isShowOrder" class="page-home-edit">
    <com-show-update-order></com-show-update-order>
  </div>
</template>
