import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import _ from 'lodash-es'

import { fetchOrderList, fetchOrderEdit } from '@/api'
import { updateLayout, paging } from '@/pages/home/components/utils.js'
import { timeDetailList, timeList, orderStatusList } from '@/utils/data.js'

export const useUserStore = defineStore({
  id: 'user', // id必填，且需要唯一
  state: () => {
    return {
      name: '张三',
      orderStatusList,
      layout: [],
      orderList: [],
      isShowFilter: false,
      timeType: 'week', // date:日看板  week:周看板
      dateActive: dayjs().format('YYYY-MM-DD'),
      weekList: [],
      doctorList: [],
      doctorObj: {}, // 医生列表
      doctorPageSize: 5,
      doctorPageActive: 1,
      timeDetailList,
      timeList,
      isShowSick: false,
      isShowSickType: 'add',
      isShowSickId: 0,
      isShowSickData: {},
      isShowOrder: false,
      isShowOrderType: 'add',
      isShowOrderDetail: {},
      isShowTheme: false,
      orderProjectList: [],
      filterStatusList: orderStatusList.map((u) => u.key),
      filterStatusAll: true,
      filterDoctorList: [],
      filterDoctorAll: true,
      createSick: null,
    }
  },
  actions: {
    updateName(name) {
      this.name = name
    },
    updateTimeType() {
      const timeType = this.timeType
      this.layout = []
      console.log('切换')
      if (timeType === 'week') {
        this.colNum = 7
      } else {
        this.updateDoctorList()
        this.colNum = this.doctorList.length
      }
      this.onFetchOrderList()
    },
    updateShowFilter() {
      this.isShowFilter = !this.isShowFilter
    },
    updateWeekList(data) {
      this.weekList = data
    },
    updateDoctorList() {
      const list = paging(this.doctorObj.major_doctor, this.doctorPageSize, this.doctorPageActive)
      this.doctorList = list
      this.filterDoctorList = list.map((u) => u.key)
    },
    updateDoctorObj(data) {
      this.doctorObj = { ...data, major_doctor: [...data.major_doctor, { key: '0', value: '未指定医生' }] }
    },
    updateOrderList(data) {
      this.orderList = data
    },
    updateDateActive(data) {
      this.dateActive = data
    },
    updateIsShowTheme(data) {
      this.isShowTheme = data
    },
    updateCreateSick(data) {
      this.createSick = data
    },
    updateIsShowSick(data, type) {
      this.isShowSick = data
      if (type) {
        this.isShowSickType = type
      }
    },
    updateIsShowOrder(isShow, type, detail) {
      if (type) {
        this.isShowOrderType = type
        this.isShowOrderDetail = detail
      } else {
        this.isShowOrderType = 'add'
        this.isShowOrderDetail = {}
        this.createSick = null
      }
      this.isShowOrder = isShow
    },
    updateOrderProjectList(data) {
      this.orderProjectList = data
    },
    async onFetchOrderList() {
      const req = {}
      if (this.timeType === 'week') {
        req.start_date = this.weekList[0].ymd
        req.end_date = this.weekList[6].ymd
      } else {
        req.start_date = this.dateActive
        req.end_date = this.dateActive
        req.order_doctor_id = this.doctorList.map((u) => u.key).join(',')
      }
      const [res, err] = await fetchOrderList(req)
      if (err) return
      const orderList = []
      const doctorList = []
      res.list.forEach((u) => {
        const {
          id,
          type,
          order_doctor_id,
          order_doctor_name,
          doctor_name,
          patient_id,
          type_text,
          order_date,
          order_start_time,
          order_end_time,
        } = u
        const item = {
          ...u,
          order_id: id,
          order_status: type,
          sick_id: patient_id,
          sick_type: type_text,
          start_time: `${order_date} ${order_start_time || '09:00'}`,
          end_time: `${order_date} ${order_end_time || '10:00'}`,
          doctor_id: order_doctor_id,
          doctor_sort: order_doctor_id,
          // order_project_string: order_project_text.map((u) => u).join(','),
        }
        doctorList.push({ key: order_doctor_id, value: order_doctor_name || '未指定' })
        orderList.push(item)
      })
      if (this.timeType === 'week') {
        const listUniq = _.uniqBy(doctorList, 'key')
        console.log('abcdd', { listUniq })

        this.filterDoctorList = listUniq.map((u) => u.key)
        this.doctorList = _.sortBy(listUniq, (u) => -u.key)
      }
      updateLayout(orderList)
    },
    async onFetchOrderEdit(req) {
      req.id = req.order_id
      const [res, err] = await fetchOrderEdit(req)
      // if (err) return
      this.onFetchOrderList()
    },
  },
})
