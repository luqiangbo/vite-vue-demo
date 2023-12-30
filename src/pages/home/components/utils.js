import _ from 'lodash-es'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import duration from 'dayjs/plugin/duration'
import weekday from 'dayjs/plugin/weekday'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isoWeek from 'dayjs/plugin/isoWeek'

import { useUserStore } from '@/store/user'
import { genderStatusList, weekList } from '@/utils/data.js'
import { trims_order } from './test.js'

dayjs.extend(utc)
dayjs.extend(isoWeek)
dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.extend(weekday)
dayjs.extend(customParseFormat)

export const COLUMN_X = 100 // 多少比例
export const TIME_SIT = 15 // 一格15分钟

export const dayCpYmd = (time) => {
  return dayjs(time, 'YYYY-MM-DD')
}

export const dayCpHm = (time) => {
  return dayjs(time, 'HH:mm')
}

export const dayYmd = (time) => {
  return dayjs(time).format('YYYY-MM-DD')
}

export const dayHm = (time) => {
  return dayjs(time).format('HH:mm')
}

// 时间间隔
export const dayDuration = (start_time, end_time) => {
  const startTime = dayjs(start_time)
  const endTime = dayjs(end_time)
  const diff = endTime.diff(startTime) / 60 / 1000
  return diff
}

// 时间差
export const dayDurationHhmm = (start_time, end_time) => {
  const start = dayjs.tz(`2021-01-01T${start_time}:00`, 'Asia/Shanghai')
  const end = dayjs.tz(`2021-01-01T${end_time}:00`, 'Asia/Shanghai')
  const diff = end.diff(start, 'minute')
  return diff
}

// 周
export const getWeekDays = (date) => {
  const time = date ? date : dayjs().format('YYYY-MM-DD')
  const startOfWeek = dayjs(time).startOf('week').isoWeekday(1)
  const endOfWeek = dayjs(time).endOf('week').isoWeekday(7)
  const days = []
  for (let day = startOfWeek; day <= endOfWeek; day = day.add(1, 'day')) {
    days.push(day.format('YYYY-MM-DD'))
  }
  const two = _.chunk(days, 7)
  let list = two[0]
  if (two[1].indexOf(time) !== -1) {
    list = two[1]
  }
  list = list.map((u, i) => ({
    ...weekList[i],
    ymd: u,
    md: dayjs(u).format('MM-DD'),
  }))
  return list
}

// 天
export const dayOne = (time) => {
  return dayjs(time).format('YYYY-MM-DD')
}

// 星期几
export const dayWeekday = (time) => {
  const date = dayjs(time)
  return date.weekday() || 7
}

export const orderListTrim = (list) => {
  const userStore = useUserStore()
  return list.map((u) => {
    const { order_status, gender_status, start_time, end_time } = u
    // 预约详情
    const order = _.find(userStore.orderStatusList, { key: order_status || '0' })
    console.log({ u, order })

    // 性别
    const gender = _.find(genderStatusList, { key: gender_status || '0' })
    return {
      ...u,
      order_color: order.color,
      order_value: order.value,
      gender_color: gender.color,
      gender_value: gender.value,
      start_time_hm: dayjs(start_time).format('HH:mm'),
      end_time_hm: dayjs(end_time).format('HH:mm'),
    }
  })
}

// 交叉
function countTimeOverlap(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].overlap_count = 0 // 初始化重叠次数
    for (let j = 0; j < arr.length; j++) {
      if (i !== j && arr[i].start_time_hm < arr[j].end_time_hm && arr[i].end_time_hm > arr[j].start_time_hm) {
        arr[i].overlap_count++ // 有重叠，重叠次数加1
      }
    }
  }
  // 返回重叠次数数组
  return arr
}

const week2x = (week) => {
  const x = (week - 1) * COLUMN_X
  return x
}

const doctor2x = (index) => {
  const x = index * COLUMN_X
  return x
}

// 分页

export const paging = (list, size, active) => {
  const startIndex = (active - 1) * size
  const endIndex = startIndex + size
  const pageData = _.slice(list, startIndex, endIndex)
  return pageData
}

// 周
export const order2xywhWeek = (orderList) => {
  const userStore = useUserStore()
  const weekList = userStore.weekList
  const list = []
  const week_arr = [
    { key: 1, timeWList: [] },
    { key: 2, timeWList: [] },
    { key: 3, timeWList: [] },
    { key: 4, timeWList: [] },
    { key: 5, timeWList: [] },
    { key: 6, timeWList: [] },
    { key: 7, timeWList: [] },
  ]
  orderList.forEach((u) => {
    const { doctor_id, doctor_sort, order_id, start_time, end_time } = u
    const week = dayWeekday(start_time)
    const x = week2x(week)
    const y = dayDurationHhmm('09:00', dayjs(start_time).format('HH:mm')) / TIME_SIT
    const diff = dayDuration(start_time, end_time)
    const h = diff / TIME_SIT
    const timeInde = {
      id: u.order_id,
      doctor_id,
      start_index: y,
      end_index: y + h,
      overlap_count: 0,
    }
    // 周
    const sole = _.find(week_arr, { key: week })
    sole.timeWList.push(timeInde)
    const trim = {
      i: order_id,
      x,
      y,
      h,
      week,
      data: u,
    }
    list.push(trim)
  })
  const trim_number_list = []
  const week_arr_w = []
  week_arr.forEach((u, i) => {
    let timeWList = getIndexOverlapCount(u.timeWList)
    trim_number_list.push({
      ...weekList[i],
      number: u.timeWList.length,
    })
    if (timeWList.length) {
      console.log({ timeWList })
      timeWList = trims_order(timeWList)
    }
    const listss = timeWList.map((t) => t.overlap_count)
    const countList = _.orderBy(_.uniq(listss), [], ['desc'])
    week_arr_w.push({
      ...u,
      timeWList,
      countList,
    })
  })
  userStore.updateWeekList(trim_number_list)
  // 计算宽度
  let list2 = []
  list.forEach((u) => {
    const { week, i, y } = u
    let { x } = u
    const sole = _.find(week_arr_w, { key: week })
    const soleW = _.find(sole.timeWList, { id: i })
    // const wOne = parseInt(COLUMN_X / (soleW.overlap_count + 1)) - 1 // 宽度
    // soleW.width = wOne
    // 方法1
    // const soleCount = _.filter(sole.timeWList, { overlap_count: soleW.overlap_count })
    // const soleCountSort = _.sortBy(soleCount, ['doctor_id'])
    // const soleWIndex = _.findIndex(soleCountSort, { id: i })

    // 方法2
    // if (soleW.overlap_count !== 0) {
    //   const soleWIndex = sole.countList.indexOf(soleW.overlap_count)
    //   console.log({ soleWIndex })
    //   x = x + wOne * soleWIndex
    // }
    // console.log({ id: i, soleW, wOne, x, y })
    const res = {
      ...u,
      x: x + soleW.x2,
      w: soleW.w2,
    }
    list2.push(res)
  })
  list.push({
    i: 107,
    x: 300,
    y: 1,
    h: 13,
    week: 4,
    data: {
      order_status_text: '已预约',
      type_text: '初诊',
      order_project_text: ['戴牙', '试戴义齿'],
      id: 107,
      patient_id: '231023000',
      order_doctor_id: 5,
      order_status: 0,
      order_date: '2023-10-12',
      order_start_time: '09:15:00',
      order_end_time: '12:30:00',
      order_project: ['15', '17'],
      type: '0',
      visiting_doctor_id: 9,
      aid_doctor_id: 0,
      nurse_id: 0,
      remark: '',
      status_color: '#FFDB1D',
      project_color: '#4169E1',
      patient_name: 'abc',
      mobile: '132',
      gender: '0',
      gender_text: '',
      age: 0,
      patient_remark: '',
      reference: '',
      reference_text: '',
      order_doctor_name: '公伯青彤',
      doctor_name: '公伯青彤',
      visiting_doctor_name: '滑代枫',
      aid_doctor_name: '未指定',
      nurse_name: '未指定',
      clinic_name: '',
      order_record: [
        {
          order_status_text: '已预约',
          type_text: '初诊',
          order_project_text: ['戴牙', '试戴义齿'],
          id: 107,
          patient_id: '231023000',
          order_doctor_id: 5,
          order_date: '2023-10-12',
          order_start_time: '09:15:00',
          order_end_time: '12:30:00',
          order_project: ['15', '17'],
          order_status: '0',
          type: '0',
          order_doctor_name: '公伯青彤',
          is_current_order: 1,
        },
      ],
      has_medical_record: 0,
      order_id: 107,
      sick_id: '231023000',
      sick_type: '初诊',
      start_time: '2023-10-12 09:15:00',
      end_time: '2023-10-12 12:30:00',
      doctor_id: 5,
      doctor_sort: 5,
      order_project_string: '戴牙,试戴义齿',
      order_color: '#e56522',
      order_value: '已预约',
      gender_color: '#e8ce63',
      gender_value: '保密',
      start_time_hm: '09:15',
      end_time_hm: '12:30',
    },
    w: 100,
    moved: false,
  })
  console.log({ week_arr_w })
  // 计算 x

  console.log({ list2 })
  return list2
}

// 日
export const order2xywhDate = (orderList) => {
  const userStore = useUserStore()
  const doctorList = userStore.doctorList.map((u) => ({ ...u, list: [] }))
  const list = []
  const timeIndexList = []
  orderList.forEach((u) => {
    const { doctor_id, order_id, start_time, end_time } = u
    let x = _.findIndex(doctorList, { key: doctor_id })
    x = doctor2x(x)
    const y = dayDurationHhmm('09:00', dayjs(start_time).format('HH:mm')) / TIME_SIT
    const diff = dayDuration(start_time, end_time)
    const h = diff / TIME_SIT
    timeIndexList.push({
      id: u.id,
      start_index: y,
      end_index: y + h,
      overlap_count: 0,
    })
    // 医生的预约
    const sole = _.find(doctorList, { key: doctor_id })
    if (sole) {
      sole.list.push({
        ...u,
        start_index: y,
        end_index: y + h,
        overlap_count: 0,
      })
    }
    const res = {
      i: order_id,
      x,
      y,
      h,
      data: u,
    }
    list.push(res)
  })
  const list2 = []
  // 计算x
  doctorList.forEach((u) => {
    if (u.list.length) {
      u.list = trims_order(u.list)
    }
  })

  // 计算宽度
  list.forEach((u) => {
    const { data } = u
    let { x } = u
    const { doctor_id, order_id } = data
    // const soleDoctor = _.find(doctorListOverlap, { key: doctor_id })
    // const soleOrder = _.find(soleDoctor.list, 'order_id') // 几个预约
    // const lll = soleDoctor.list.length
    // const wOne = parseInt(COLUMN_X / lll) // 宽度
    // const orderSort = _.sortBy(soleDoctor.list, (u) => {
    //   return dayjs(u.start_time).unix()
    // })
    // const orderIndex = _.findIndex(orderSort, { order_id })

    // 方法1
    const soleDoctor = _.find(doctorList, { key: doctor_id })
    const soleOrder = _.find(soleDoctor.list, { id: order_id })
    const res = {
      ...u,
      x: x + soleOrder.x2,
      w: soleOrder.w2 - 2,
    }
    list2.push(res)
  })
  // console.log({ timeIndexList, doctorList, list })

  return list2
}

export const updateLayout = (list) => {
  const userStore = useUserStore()
  let layout
  let orderList2 = orderListTrim(list)
  userStore.updateOrderList(orderList2)
  if (userStore.timeType === 'week') {
    layout = order2xywhWeek(orderList2)
  } else {
    layout = order2xywhDate(orderList2)
  }
  userStore.layout = layout
}

const getStartEnd = (y, h) => {
  const start = dayjs('09:00', 'HH:mm')
    .add(y * TIME_SIT, 'minute')
    .format('HH:mm')
  const end = dayjs('09:00', 'HH:mm')
    .add((y + h) * TIME_SIT, 'minute')
    .format('HH:mm')
  return {
    start,
    end,
  }
}

export const onMoveResize = (type, id, x, y) => {
  const userStore = useUserStore()
  const timeType = userStore.timeType
  const orderList = userStore.layout
  const doctorList = userStore.doctorList
  const weekList = userStore.weekList

  const sole = _.find(orderList, { i: id })
  const data = sole.data
  // console.log({ sole })
  let req = {
    order_id: data.id,
  }
  if (type === 'move' || type === 'moved') {
    let index = parseInt(sole.x / COLUMN_X)
    let startEnd = getStartEnd(sole.y, sole.h)
    if (type === 'move') {
      index = parseInt(x / COLUMN_X)
      startEnd = getStartEnd(y, sole.h)
    }
    req.order_start_time = startEnd.start
    req.order_end_time = startEnd.end
    if (timeType === 'week') {
      const soleWeek = weekList[index]
      req.order_date = soleWeek.ymd
    } else {
      const soleDoctor = doctorList[index]
      req.order_doctor_id = soleDoctor.key
    }
  } else if (type === 'resize') {
    const startEnd = getStartEnd(sole.y, sole.h)
    req.order_start_time = startEnd.start
    req.order_end_time = startEnd.end
  }
  console.log({ req })
  userStore.onFetchOrderEdit(req)
}

function getIndexOverlapCount(dataList) {
  _.forEach(dataList, (data, index) => {
    let overlapCount = 0
    for (let i = 0; i < dataList.length; i++) {
      if (i === index) {
        continue
      }
      const otherData = dataList[i]
      if (data.start_index < otherData.end_index && otherData.start_index < data.end_index) {
        overlapCount += 1
      }
    }
    data.overlap_count = overlapCount
  })
  return dataList
}
