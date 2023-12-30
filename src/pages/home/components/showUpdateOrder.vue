<script setup>
import { reactive } from 'vue'
import _ from 'lodash-es'

import comFormItemList from '@/components/formItemList.vue'
import { outpatientsList } from '@/utils/data.js'
import { dayYmd, dayHm, dayCpYmd, dayCpHm } from './utils.js'
import { useUserStore } from '@/store/user'
import { fetchPatientDetail, fetchOrderAdd, fetchOrderEdit, fetchOrderInfo } from '@/api/index.js'
const userStore = useUserStore()

const ruleFormRef = ref()
const inputSearch = ref('')

const ruleForm = reactive({
  patient_id: null,
  patient_name: '',
  mobile: '',
  start_end: '',
  order_start_time: '',
  order_end_time: '',
  order_date: '',
  type: '', // 就诊类型
  order_doctor_id: 0, // 预约医生ID
  // visiting_doctor_id: 0, // 就诊医生ID
  // aid_doctor_id: 0, // 就诊助力ID
  // nurse_id: 0, // 就诊护士ID
  remark: '', // 备注
  order_project: [],
  status_color: '',
  project_color: '',
})

const isShow = ref(true)
const loadingSelect = ref(false)
const sickList = ref([])

const rules = reactive({
  // status_color: [{ required: true, message: '请选择', trigger: 'change' }],
  // project_color: [{ required: true, message: '请选择', trigger: 'change' }],
  patient_name: [{ required: true, message: '请选择', trigger: 'change' }],
  type: [{ required: true, message: '请选择', trigger: 'change' }],
  order_date: [{ required: true, message: '请输入', trigger: 'change' }],
  order_start_time: [{ required: true, message: '请输入', trigger: 'change' }],
  order_end_time: [{ required: true, message: '请输入', trigger: 'change' }],
  order_project: [{ required: true, message: '请选择预约项目', trigger: 'change' }],
})

const formItemList1 = [
  {
    key: 'type',
    label: '就诊类型',
    placeholder: '请选择',
    type: 'select',
    list: outpatientsList,
  },
  {
    key: 'order_date',
    label: '预约时间',
    placeholder: '请输入',
    type: 'date',
  },
  {
    key: 'start_end',
    key1: 'order_start_time',
    key2: 'order_end_time',
    label: '时间段',
    placeholder: '请输入',
    type: 'date-start-end',
  },
  {
    key: 'order_doctor_id',
    label: '预约医生',
    placeholder: '请选择',
    type: 'select',
    list: [{ key: 0, value: '未选' }, ...(userStore.doctorObj?.major_doctor || [])],
  },
  // {
  //   key: 'visiting_doctor_id',
  //   label: '就诊医生',
  //   placeholder: '请选择',
  //   type: 'select',
  //   list: [{ key: 0, value: '未选' }, ...(userStore.doctorObj?.major_doctor || [])],
  // },
  // {
  //   key: 'aid_doctor_id',
  //   label: '就诊助理',
  //   placeholder: '请选择',
  //   type: 'select',
  //   list: [{ key: 0, value: '未选' }, ...(userStore.doctorObj?.aid_doctor || [])],
  // },
  // {
  //   key: 'nurse_id',
  //   label: '就诊护士',
  //   placeholder: '请选择',
  //   type: 'select',
  //   list: [{ key: 0, value: '未选' }, ...(userStore.doctorObj?.nurse || [])],
  // },
  {
    key: 'remark',
    label: '备注',
    placeholder: '请输入',
    type: 'textarea',
  },
  // {
  //   key: 'status_color',
  //   label: '预约状态自定义色',
  //   placeholder: '请选择',
  //   type: 'color',
  // },
  // {
  //   key: 'project_color',
  //   label: '预约项目自定义色',
  //   placeholder: '请选择',
  //   type: 'color',
  // },
]

onMounted(() => {
  init()
})

const init = () => {
  if (isEdit()) {
    onfetchOrderInfo()
  } else {
    if (userStore.createSick) {
      ruleForm.patient_name = userStore.createSick.name
      ruleForm.mobile = userStore.createSick.mobile
      ruleForm.patient_id = userStore.createSick.id
    }
  }
}

const isEdit = () => {
  return userStore.isShowOrderType === 'edit' || userStore.isShowOrderType === 'readd'
}

const onChangeSick = (v) => {
  const sole = _.find(sickList.value, { id: v })
  console.log({ v, sole, sickList })
  if (sole) {
    ruleForm.patient_name = sole.name
    ruleForm.patient_id = sole.id
    ruleForm.mobile = sole.mobile
  }
}

const remoteMethod = _.debounce((query) => {
  if (_.trim(query)) {
    onFetchSick(_.trim(query))
  }
}, 300)

const onFetchSick = async (query) => {
  loadingSelect.value = true
  const req = {
    name: query,
  }
  sickList.value = []
  const [res, err] = await fetchPatientDetail(req)
  loadingSelect.value = false
  if (err) return
  if (res) {
    sickList.value = res
  }
}

const onSubmit = async (formEl) => {
  await formEl.validate((valid, fields) => {
    console.log({ valid, fields })
    if (valid) {
      const {
        order_doctor_id,
        visiting_doctor_id,
        aid_doctor_id,
        nurse_id,
        type,
        order_date,
        patient_id,
        remark,
        order_project,
        status_color,
        project_color,
      } = ruleForm

      const userList = userStore.doctorObj.major_doctor || []
      const sole = _.find(userList, { key: order_doctor_id })

      const req = {
        ...ruleForm,
        order_doctor_id,
        order_doctor_name: sole.value,
        visiting_doctor_id,
        aid_doctor_id,
        nurse_id,
        type,
        remark,
        order_date: dayYmd(order_date),
        patient_id: patient_id + '',
        order_project: order_project.join(','),
      }
      if (status_color) req.status_color = status_color
      if (project_color) req.project_color = project_color
      console.log({ req, ruleForm, is: isEdit() })
      if (userStore.isShowOrderType === 'edit') {
        const res = userStore.isShowOrderDetail
        onfetchOrderEdit(req)
      } else {
        onfetchOrderAdd(req)
      }
    } else {
      const sole = _.find(fields.order_project, { field: 'order_project' })
      if (sole) {
        ElMessage({
          message: sole.message,
          type: 'error',
          grouping: true,
          offset: 200,
        })
      }
    }
  })
}

const onfetchOrderInfo = async (req) => {
  // const [res, err] = await fetchOrderInfo(req)
  // if (err) return
  const res = userStore.isShowOrderDetail
  console.log({ res })

  let type = ''
  if (userStore.isShowOrderType === 'edit') {
    type = res.type
    const order_project = res.order_project.split(',')
    ruleForm.order_project = order_project
  } else if (userStore.isShowOrderType === 'readd') {
    type = '1'
  }
  ruleForm.status_color = res.status_color
  ruleForm.project_color = res.project_color
  ruleForm.patient_id = res.patient_id
  ruleForm.patient_name = res.patient_name
  ruleForm.mobile = res.mobile
  ruleForm.type = type
  ruleForm.order_doctor_id = res.order_doctor_id
  ruleForm.visiting_doctor_id = res.visiting_doctor_id
  ruleForm.aid_doctor_id = res.aid_doctor_id
  ruleForm.nurse_id = res.nurse_id
  if (userStore.isShowOrderType === 'edit') {
    ruleForm.remark = res.remark
  }
  ruleForm.order_date = res.order_date
  ruleForm.order_start_time = res.order_start_time
  ruleForm.order_end_time = res.order_end_time
}

const onfetchOrderAdd = async (req) => {
  const [res, err] = await fetchOrderAdd(req)
  userStore.updateIsShowOrder(false)
  userStore.onFetchOrderList()
}

const onfetchOrderEdit = async (req) => {
  const [res, err] = await fetchOrderEdit(req)
  userStore.updateIsShowOrder(false)
  userStore.onFetchOrderList()
}

const onClose = () => {
  userStore.updateIsShowOrder(false)
}

const onChageSearch = (v) => {
  console.log({ v })
}

const onFilterProject = () => {
  const list = _.cloneDeep(userStore.orderProjectList)
  const search = inputSearch.value
  const listTrim = []
  if (search) {
    list[0].list.forEach((u) => {
      const listAbc = _.filter(u.list, (h) => h.value.indexOf(search) !== -1)
      if (listAbc.length) {
        listTrim.push({
          key: u.key,
          list: listAbc,
        })
      }
    })
    list[0].list = listTrim
  }
  return list
}
</script>

<template>
  <!-- <el-drawer v-model="isShow" :with-header="false" @close="onClose"> -->
  <div v-if="isShow" class="order-main">
    <div class="header">
      <div class="order-main-left">预约</div>
      <div class="order-main-right">
        <el-button @click="userStore.updateIsShowOrder(false)"> 取消 </el-button>
        <el-button type="primary" @click="onSubmit(ruleFormRef)"> 保存预约 </el-button>
      </div>
    </div>

    <div class="body">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        :label-position="'top'"
        class="demo-ruleForm"
        status-icon
      >
        <div class="lr left">
          <div class="lr-header">
            <div class="find-sick">
              <el-form-item :prop="'patient_name'" label="客户信息">
                <el-select
                  v-model="ruleForm.patient_name"
                  :disabled="isEdit()"
                  remote
                  filterable
                  reserve-keyword
                  placeholder="请输入客户信息"
                  :remote-method="remoteMethod"
                  :loading="loadingSelect"
                  @change="onChangeSick"
                >
                  <el-option v-for="u in sickList" :key="u.id" :value="u.id">
                    {{ u.name }} - {{ u.id }} -{{ u.mobile }}
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="lr-header-detail">
            <div class="lr-header-detail-item">客户:{{ ruleForm?.patient_name }}</div>
            <div class="lr-header-detail-item">手机:{{ ruleForm?.mobile }}</div>
          </div>
          <div class="lr-header">预约信息</div>
          <com-form-item-list :form-item-list="formItemList1" :rule-form="ruleForm"></com-form-item-list>
        </div>
        <div class="lr right">
          <div :style="{ marginBottom: '5px' }">
            <div :style="{ marginBottom: '5px' }">搜索</div>
            <el-input v-model="inputSearch" placeholder="" @change="onChageSearch" />
          </div>
          <com-form-item-list :form-item-list="onFilterProject()" :rule-form="ruleForm"></com-form-item-list>
        </div>
      </el-form>
    </div>
  </div>
  <!-- </el-drawer> -->
</template>
