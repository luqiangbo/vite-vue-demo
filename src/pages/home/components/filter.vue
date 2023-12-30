<script setup>
import { ref, watch } from 'vue'
import _ from 'lodash-es'
import dayjs from 'dayjs'

import { useUserStore } from '@/store/user'
import { getWeekDays, dayOne, dayYmd } from './utils.js'

const userStore = useUserStore()
const timeDay = ref('')
const timeWeek = ref('')
const orderType = ref('1')
const orderCollapse = ref(['1', '2'])
const checkAllOrder = ref(true)
const checkAllDoctor = ref(true)
const isShow = ref(true)

watch(
  timeDay,
  _.debounce((newValue, oldValue) => {
    console.log(newValue)
    userStore.updateDateActive(dayOne(newValue))
    userStore.onFetchOrderList()
  }, 300),
)

watch(
  timeWeek,
  _.debounce((newValue, oldValue) => {
    console.log(newValue)
    userStore.updateWeekList(getWeekDays(dayYmd(newValue)))
    userStore.onFetchOrderList()
  }, 300),
)

const onCheckAllStatus = (bool) => {
  const list = bool ? userStore.orderStatusList.map((u) => u.key) : []
  userStore.filterStatusList = list
}

const onCheckAllDoctor = (bool) => {
  const list = bool ? userStore.doctorList.map((u) => u.key) : []
  userStore.filterDoctorList = list
}

const onCheckListStatus = (list) => {
  userStore.filterStatusList = list
  userStore.filterStatusAll = userStore.orderStatusList.length === list.length
}

const onCheckListDoctor = (list) => {
  userStore.filterDoctorList = list
  userStore.filterDoctorAll = userStore.doctorList.length === list.length
}

const onClickTab = () => {}

const onClose = () => {
  userStore.updateShowFilter()
}

const onClickRegainDate = () => {
  timeDay.value = dayjs().startOf('day')
}

const onClickRegainWeek = () => {
  timeWeek.value = dayjs().startOf('day')
}
</script>

<template>
  <div class="page-home-filter-hide" v-if="userStore.isShowFilter"></div>
  <div class="page-home-filter" v-if="userStore.isShowFilter">
    <!-- <el-drawer v-model="isShow" :with-header="false" direction="ltr" @close="onClose"> -->
    <el-tabs type="border-card" v-model="orderType" @tab-click="onClickTab" class="filter-tabs">
      <el-tab-pane label="预约看板" name="1">
        <div class="filter-date">
          <el-date-picker
            v-if="userStore.timeType === 'date'"
            v-model="timeDay"
            type="date"
            popper-class="my-datepicker"
            :teleported="false"
            pickerVisible="true"
          ></el-date-picker>
          <el-date-picker
            v-if="userStore.timeType === 'week'"
            v-model="timeWeek"
            type="week"
            format="ww"
            pickerVisible="true"
            popper-class="my-datepicker"
            :teleported="false"
          ></el-date-picker>
        </div>
        <div class="regain-main">
          <el-button v-if="userStore.timeType === 'date'" @click="onClickRegainDate"> 回到今天 </el-button>
          <el-button v-if="userStore.timeType === 'week'" @click="onClickRegainWeek"> 回到本周 </el-button>
        </div>
        <div class="check-main">
          <el-collapse v-model="orderCollapse">
            <el-collapse-item title="预约状态" name="1">
              <div class="check-list">
                <el-checkbox v-model="userStore.filterStatusAll" @change="onCheckAllStatus">全选</el-checkbox>
                <el-checkbox-group v-model="userStore.filterStatusList" @change="onCheckListStatus">
                  <el-checkbox v-for="u in userStore.orderStatusList" :key="u.key" :label="u.key">{{
                    u.value
                  }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-collapse-item>
            <el-collapse-item title="医生筛选" name="2">
              <div class="check-list">
                <el-checkbox v-model="userStore.filterDoctorAll" @change="onCheckAllDoctor"> 全选 </el-checkbox>
                <el-checkbox-group v-model="userStore.filterDoctorList" @change="onCheckListDoctor">
                  <el-checkbox v-for="u in userStore.doctorList" :key="u.key" :label="u.key">
                    {{ u.value }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-tab-pane>
      <el-tab-pane label="预约列表" name="2">
        <el-card v-for="u in userStore.orderList" :key="u.id" style="margin-bottom: 10px">
          <div>{{ u.patient_name }} {{ u.gender_text }}</div>
          <div>{{ u.order_project_string }}</div>
          <div>状态:{{ u.order_value }}</div>
          <div>开始时间:{{ u.start_time }}</div>
          <div>结束时间:{{ u.end_time }}</div>
          <div>病例号:{{ u.patient_id }}</div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <!-- </el-drawer> -->
  </div>
</template>
