<script setup>
import { useUserStore } from '@/store/user'
import comFormItemList from '@/components/formItemList.vue'
import { reactive } from 'vue'
import { fetchPatientAdd, fetchPatientUpdate, fetchUploadOne } from '@/api'
import { referenceList } from '@/utils/data'

const userStore = useUserStore()

const props = defineProps({
  onList: Function,
})

const uploadRef = ref()
const signList = ref([])
const ruleFormRef = ref()
const ruleForm = reactive({
  patient_id: '', // 病例号
  name: '', // 客户姓名
  gender: '0', // 性别
  avatar: '',
  mobile: '', // 电话
  address: '', // 地区
  address_detail: '', // 详细地址
  nationality: '', // 民族
  company: '', // 公司
  email: '', // 邮箱
  reference: '', // 获悉方式
  birthday: '', // 出生日期
  learnMode: '', // 获悉方式
  standardStarDegree: '', // 标星度
})

const rules = reactive({
  reference: [{ required: true, message: '请选择', trigger: 'change' }],
  birthday: [{ required: true, message: '请选择', trigger: 'change' }],
  name: [{ required: true, message: '请选择', trigger: 'change' }],
  mobile: [{ required: true, message: '请选择', trigger: 'change' }],
})

const formItemList = [
  // {
  //   key: 'patient_id',
  //   label: '病历号',
  //   placeholder: '请输入病历号',
  //   type: 'input',
  //   disabled: false,
  // },
  {
    key: 'name',
    label: '客户姓名',
    placeholder: '请输入客户姓名',
    type: 'input',
    search: true,
  },
  {
    key: 'gender',
    label: '性别',
    placeholder: '请选择',
    type: 'radio',
    list: [
      { key: '0', value: '保密' },
      { key: '1', value: '男' },
      { key: '2', value: '女' },
    ],
  },
  {
    key: 'avatar',
    label: '头像',
    type: 'upload',
    func(file) {
      console.log({ file })
      onfetchUploadOne(file)
      return false
    },
  },
  {
    key: 'mobile',
    label: '联系电话',
    placeholder: '请输入联系电话',
    type: 'input',
  },
  {
    key: 'address',
    label: '地区',
    placeholder: '请选择',
    type: 'addressAll',
  },
  {
    key: 'address_detail',
    label: '详细地址',
    placeholder: '请输入详细地址',
    type: 'input',
  },
  {
    key: 'nationality',
    label: '民族',
    placeholder: '请输入',
    type: 'input',
  },
  {
    key: 'company',
    label: '公司',
    placeholder: '请输入',
    type: 'input',
  },
  {
    key: 'email',
    label: '邮箱',
    placeholder: '请输入',
    type: 'input',
  },
  {
    key: 'reference',
    label: '获悉方式',
    placeholder: '请输入',
    type: 'select',
    list: referenceList,
  },
  {
    key: 'birthday',
    label: '出生日期',
    placeholder: '请输入',
    type: 'date',
  },
  // {
  //   key: 'standardStarDegree',
  //   label: '标星度',
  //   placeholder: '请输入',
  //   type: 'rate',
  // },
]

onMounted(() => {
  init()
})

const init = () => {
  if (isEdit()) {
    const data = userStore.isShowSickData
    ruleForm.name = data.name
    ruleForm.gender = data.gender
    ruleForm.avatar = data.avatar
    ruleForm.mobile = data.mobile
    ruleForm.address = data.address.split(',')
    ruleForm.address_detail = data.address_detail
    ruleForm.nationality = data.nationality
    ruleForm.company = data.company
    ruleForm.email = data.email
    ruleForm.reference = data.reference
    ruleForm.birthday = data.birthday
    ruleForm.learnMode = data.learnMode
  }
}

const isEdit = () => {
  return userStore.isShowSickType === 'edit'
}

const onSubmit = async (formEl, type) => {
  await formEl.validate((valid, fields) => {
    console.log({ valid, fields })
    if (valid) {
      if (isEdit()) {
        onFetchPatientUpdate()
      } else {
        onFetchPatientAdd(type)
      }
    }
  })
}

const onFetchPatientAdd = async (type) => {
  const req = {
    ...ruleForm,
    address: ruleForm.address.join(','),
  }
  const [res, err] = await fetchPatientAdd(req)
  if (err) return
  userStore.updateIsShowSick(false)

  if (type) {
    userStore.updateIsShowOrder(true, 'add')
    userStore.updateCreateSick(req)
  }
}

const onFetchPatientUpdate = async () => {
  const data = userStore.isShowSickData
  const req = {
    ...ruleForm,
    address: ruleForm.address.join(','),
    id: data.id,
  }
  const [res, err] = await fetchPatientUpdate(req)
  if (err) return
  userStore.updateIsShowSick(false)
  props.onList()
}

const onfetchUploadOne = async (file) => {
  const req = {
    file,
  }
  const [res, err] = await fetchUploadOne(req)
  if (err) return
  ruleForm.avatar = res.url
}
</script>

<template>
  <el-dialog v-model="userStore.isShowSick" :close-on-click-modal="false" :title="isEdit() ? '编辑客户' : '新增客户'">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
      <com-form-item-list :form-item-list="formItemList" :rule-form="ruleForm"></com-form-item-list>
    </el-form>

    <!-- <div class="sign-main">
      <div class="left">标星度</div>
      <div class="right">
        <div v-for="u in signList" :key="u.id" class="item-sign">
          <div>{{ u.sign }}</div>
          <div><el-input-number v-model="u.quantity" :min="0" :max="5" /></div>
        </div>
      </div>
    </div> -->

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="userStore.updateIsShowSick(false)">关闭</el-button>
        <!-- <el-button type="primary" @click="onSubmit(ruleFormRef, 'order')"> 保存并预约 </el-button> -->
        <el-button type="primary" @click="onSubmit(ruleFormRef)"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
