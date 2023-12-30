<script setup>
import { Plus } from '@element-plus/icons-vue'

import { fetchClinicPatientList } from '@/api/clinic'
import { useUserStore } from '@/store/user'
import { onGetGender, onGetReference } from '@/utils/data'
import { onGetAgeBirthday, onGetFormat } from '@/utils'

const userStore = useUserStore()
const tableList = ref([])

onMounted(async () => {
  init()
})

const init = () => {
  onfetchClinicPatientList()
}

const onfetchClinicPatientList = async () => {
  const req = {
    page_number: 1,
    page_size: 10,
  }
  const [res, err] = await fetchClinicPatientList(req)
  if (err) return
  tableList.value = res.list
}

//   name: '', // 客户姓名
//   gender: '0', // 性别
//   avatar: '',
//   mobile: '', // 电话
//   address: '', // 地区
//   address_detail: '', // 详细地址
//   nationality: '', // 民族
//   company: '', // 公司
//   email: '', // 邮箱
//   reference: '', // 获悉方式
//   birthday: '', // 出生日期
//   learnMode: '', // 获悉方式

const onEdit = async (data) => {
  userStore.isShowSickType = 'edit'
  userStore.isShowSickData = data
  userStore.isShowSick = true
}
</script>

<template>
  <div class="page-good page p-3">
    <div class="flex justify-between items-center mb-4">
      <h1 class="mb-3">客户管理</h1>
      <div>
        <el-button type="primary" :icon="Plus" @click="userStore.updateIsShowSick(true, 'add')"> 新增客户 </el-button>
      </div>
    </div>

    <el-card class="p-3">
      <el-table :data="tableList">
        <el-table-column label="姓名" fixed="left">
          <template #default="scope">
            <div>{{ scope.row.name }}</div>
          </template>
        </el-table-column>

        <el-table-column label="性别" width="200">
          <template #default="scope">
            <div>{{ onGetGender(scope.row.gender) }}</div>
          </template>
        </el-table-column>

        <el-table-column label="联系电话" width="200">
          <template #default="scope">
            <div>{{ scope.row.mobile }}</div>
          </template>
        </el-table-column>

        <el-table-column label="邮箱" width="200">
          <template #default="scope">
            <div>{{ scope.row.email }}</div>
          </template>
        </el-table-column>

        <el-table-column label="民族" width="200">
          <template #default="scope">
            <div>{{ scope.row.nationality }}</div>
          </template>
        </el-table-column>

        <el-table-column label="公司" width="200">
          <template #default="scope">
            <div>{{ scope.row.company }}</div>
          </template>
        </el-table-column>

        <el-table-column label="获悉方式" width="200">
          <template #default="scope">
            <div>{{ onGetReference(scope.row.reference) }}</div>
          </template>
        </el-table-column>

        <el-table-column label="出生日期" width="200">
          <template #default="scope">
            <div>
              <el-tag class="mr-2">年龄: {{ onGetAgeBirthday(scope.row.birthday)[0] }}</el-tag>
              <el-tag>生日: {{ onGetAgeBirthday(scope.row.birthday)[1] }}</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" width="200">
          <template #default="scope">
            <div>{{ onGetFormat(scope.row.created_at) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="200">
          <template #default="scope">
            <div>{{ onGetFormat(scope.row.updated_at) }}</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="onEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <ShowUpdateSick v-if="userStore.isShowSick" :onList="onfetchClinicPatientList" />
  </div>
</template>

<style scoped></style>
