<script setup>
import { Expand, Fold } from '@element-plus/icons-vue'
import { GridLayout, GridItem } from 'vue3-grid-layout-next'
import _ from 'lodash-es'
import dayjs from 'dayjs'

import { order2xywhWeek, order2xywhDate, COLUMN_X, getWeekDays, orderListTrim, onMoveResize } from './utils.js'
import ComTimeList from './timeList.vue'
import ComTimeLayout from './timeLayout.vue'
import ComShowUpdateTheme from './showUpdateTheme.vue'
import ComShowPopover from './showPopover.vue'
import { useUserStore } from '@/store/user'
const userStore = useUserStore()

watch(
  () => userStore.doctorPageActive,
  _.debounce((newValue) => {
    console.log('分页')
    userStore.updateDoctorList()
    userStore.onFetchOrderList()
  }, 300),
)

watch(
  () => userStore.timeType,
  _.debounce((newValue) => {}, 300),
)

onMounted(async () => {
  init()
})

const init = () => {
  // 周
  userStore.updateWeekList(getWeekDays())
}

// 移动后
const onMoved = (id, x, y) => {
  // onMoveResize('moved', id)
}

// 移动时
const onMove = _.debounce((id, x, y) => {
  // console.log('onMove', { id, x, y })
  onMoveResize('move', id, x, y)
}, 1000)

const onResize = (id, h, w, hpx, wpx) => {
  onMoveResize('resize', id)
}

const getColNum = () => {
  let res
  if (userStore.timeType === 'week') {
    res = 7 * COLUMN_X
  } else {
    res = userStore.doctorList.length * COLUMN_X
  }
  return res
}

const isShowOrder = (data) => {
  const { doctor_id, type } = data
  const res = userStore.filterDoctorList.indexOf(doctor_id) !== -1 && userStore.filterStatusList.indexOf(type) !== -1
  return res
}

const getTotal = () => {
  const list = userStore.doctorObj?.major_doctor || []
  return list.length
}

const onSizeChage = (a) => {
  console.log({ a })
}

const isNow = (md) => {
  const nowMd = dayjs().format('MM-DD')
  return md === nowMd
}

const onGetDoctorOrder = (key) => {
  const layout = userStore.layout
  let number = 0
  if (layout.length) {
    number = _.size(
      _.filter(layout, (u) => {
        return u.data.doctor_id === key
      }),
    )
  }
  return number
}
</script>

<template>
  <div class="page-home-panel">
    <el-affix :offset="55">
      <div class="header">
        <div class="header-action">
          <div>
            <!-- <div v-if="userStore.timeType === 'week'">周</div>
            <div v-if="userStore.timeType === 'date'">日</div> -->
          </div>
          <div>
            <!-- <el-button @click="onClickAdd"> 测试 </el-button> -->
            <!-- <el-button @click="onClickUpdateOrder"> 保存 </el-button> -->
            <!-- <el-button @click="userStore.updateIsShowTheme(true)"> 主题配色 </el-button> -->
            <!-- <el-button @click="userStore.updateIsShowSick(true, 'add')"> 新增客户 </el-button> -->
            <el-button @click="userStore.updateIsShowOrder(true, 'add')"> 新增预约 </el-button>
          </div>
          <div>
            <el-radio-group v-model="userStore.timeType" @change="userStore.updateTimeType()">
              <el-radio-button label="date" :border="true"> 日 </el-radio-button>
              <el-radio-button label="week" :border="true"> 周 </el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="header-col">
          <div class="lr header-left">
            <el-button :icon="userStore.isShowFilter ? Expand : Fold" @click="userStore.updateShowFilter" />
          </div>
          <div v-if="userStore.timeType === 'week'" class="center">
            <div v-for="u in userStore.weekList" :key="u.key" class="center-item">
              <div>{{ u.value }} <el-tag v-if="isNow(u.md)" effect="dark" size="small">今</el-tag></div>
              <div>{{ u.md }}[{{ u.number }}]</div>
            </div>
          </div>
          <div v-if="userStore.timeType === 'date'" class="center">
            <div v-for="u in userStore.doctorList" :key="u.key" class="center-item">
              <div>{{ u.value }}[{{ onGetDoctorOrder(u.key) }}]</div>
            </div>
          </div>
          <div class="lr header-right">
            <div v-if="userStore.timeType === 'date'">
              <el-pagination
                v-model:current-page="userStore.doctorPageActive"
                small
                background
                layout="prev, next"
                :page-size="userStore.doctorPageSize"
                :total="getTotal()"
              />
            </div>
          </div>
        </div>
      </div>
    </el-affix>
    <div class="main">
      <div class="body">
        <div class="lf">
          <com-time-list></com-time-list>
        </div>
        <div class="body-good">
          <ComTimeLayout></ComTimeLayout>
          <div :key="getColNum()" class="grid">
            <grid-layout
              v-if="userStore.layout.length"
              v-model:layout="userStore.layout"
              :margin="[0, 0]"
              :col-num="getColNum()"
              :row-height="30"
              :is-draggable="true"
              :is-resizable="true"
              :responsive="false"
              :vertical-compact="false"
              :prevent-collision="true"
              :use-css-transforms="true"
            >
              <grid-item
                v-for="item in userStore.layout"
                v-show="isShowOrder(item.data)"
                :key="item.i"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                :max-w="item.w"
                :min-w="item.w"
                @moved="onMoved"
                @move="onMove"
                @resized="onResize"
              >
                <ComShowPopover :data="item.data"></ComShowPopover>
              </grid-item>
            </grid-layout>
          </div>
        </div>
        <div class="lf reset">
          <com-time-list></com-time-list>
        </div>
      </div>
    </div>

    <com-show-update-theme v-if="userStore.isShowTheme"></com-show-update-theme>
  </div>
</template>

<style lang="less"></style>
