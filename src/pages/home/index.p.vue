<script setup>
import _ from 'lodash-es'

import ComFilter from './components/filter.vue'
import ComEdit from './components/edit.vue'
import ComPanel from './components/panel.vue'
import { updateLayout } from './components/utils.js'
import { useUserStore } from '@/store/user'
import { fetchUserList, fetchClinicList, fetchPatientInfo, fetchOrderAdd, fetchEnumList } from '@/api'
import { fetchClinicSection0List } from '@/api/clinic'

const userStore = useUserStore()

onMounted(() => {
  init()
})
const init = async () => {
  // await onFetchEnumList()
  await onfetchUserList()
  await onFetchClinicList()
  await onfetchClinicSection0List()
  userStore.onFetchOrderList()
}

const onFetchEnumList = async () => {
  const [res, err] = await fetchEnumList()
  if (err) return
  const list = [
    {
      key: 'order_project',
      label: '预约项目',
      type: 'checkbox-tree',
      list: [
        { key: '修复', list: res['修复'] },
        { key: '其他', list: res['其他'] },
        { key: '口外', list: res['口外'] },
        { key: '口腔检查', list: res['口腔检查'] },
        { key: '定期复诊', list: res['定期复诊'] },
        { key: '正畸', list: res['正畸'] },
        { key: '牙体', list: res['牙体'] },
        { key: '种植', list: res['种植'] },
        { key: '牙周', list: res['牙周'] },
      ],
    },
  ]
  userStore.updateOrderProjectList(list)
}

//  新建预约
const onFetchOrderAdd = async () => {
  const req = {
    patient_id: '123',
    type: '321',
    order_project: '321',
    gender_status: 0,
  }
  const [res, err] = await fetchOrderAdd(req)
}

const onfetchUserList = async () => {
  const req = {
    page_number: 1,
    page_size: 100,
  }
  const [res, err] = await fetchUserList(req)
  if (err) return
  if (res) {
    const major_doctor = [] // 医生
    const aid_doctor = [] // 助理
    const nurse = [] // 护士
    res.list.forEach((u) => {
      const utrim = {
        key: u.id,
        value: u.name,
      }
      if (u.authority === '1') {
        major_doctor.push(utrim)
      }
      if (u.authority === '2') {
        aid_doctor.push(utrim)
      }
      if (u.authority === '3') {
        nurse.push(utrim)
      }
    })

    userStore.updateDoctorObj({
      major_doctor,
      aid_doctor,
      nurse,
    })
    userStore.updateDoctorList()
  }
}

const onFetchClinicList = async () => {
  const [res, err] = await fetchClinicList()
}

const onFetchPatientInfo = async () => {
  const req = {
    order_id: 8,
  }
  const [res, err] = await fetchPatientInfo(req)
}

const onfetchClinicSection0List = async () => {
  const req = {
    page_number: 1,
    page_size: 10,
  }
  const [res, err] = await fetchClinicSection0List(req)
  if (err) return
  const productList = []
  res.list.forEach((u) => {
    productList.push({
      key: u.id,
      value: u.name,
      list: u.section1s.map((h) => ({ key: h.id, value: h.name })),
    })
  })

  const list = [
    {
      key: 'order_project',
      label: '预约项目',
      type: 'checkbox-tree',
      list: productList,
    },
  ]

  userStore.updateOrderProjectList(list)
}
</script>

<template>
  <div class="page-home">
    <com-filter></com-filter>
    <com-panel></com-panel>
    <com-edit></com-edit>
  </div>
</template>

<style lang="less">
@import './index.less';
</style>
