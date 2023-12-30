<script setup>
import dayjs from 'dayjs'

import { useInterval } from '@vueuse/core'
import { dayDurationHhmm } from './utils.js'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const top = ref(0)
const counterTime = ref('00:00')

const counter = useInterval(1 * 1000)
watch(counter, (newValue, oldValue) => {
  if (dayjs().second() === 0) {
    onUpdateTop()
  }
})

onMounted(() => {
  init()
})

const init = () => {
  onUpdateTop()
}

const onUpdateTop = () => {
  const diff = dayDurationHhmm('09:00', dayjs().format('HH:mm'))
  if (diff > 0) {
    top.value = (diff > 12 * 60 ? 12 * 60 : diff) * 2
  } else {
    top.value = 0
  }
  counterTime.value = dayjs().format('HH:mm')
}
</script>

<template>
  <div class="counter" :style="{ top: `${top}px` }">
    <el-tag effect="dark" size="small" type="danger">{{ counterTime }}</el-tag>
  </div>
  <div class="time-layout">
    <div v-for="(u, i) in userStore.timeList" :key="i" class="item-y">
      <div
        v-for="(h, j) in userStore.timeType === 'week' ? userStore.weekList : userStore.doctorList"
        :key="j"
        class="item-x"
      >
        <div v-for="b in userStore.timeDetailList" :key="b" class="item-x-li"></div>
      </div>
    </div>
  </div>
</template>
