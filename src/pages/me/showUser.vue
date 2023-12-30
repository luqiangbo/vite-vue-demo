<script setup>
import { useAdminStore } from '@/store/admin'
import { useGoodStore } from '@/store/good'
import FormItemList from '@/components/formItemList.vue'
import { fetchClinicUserAdd, fetchClinicUserUpdate } from '@/api/clinic'

const adminStore = useAdminStore()
const goodStore = useGoodStore()
const loadingBtn = ref(false)

const props = defineProps({
  onList: {
    type: Function,
    required: true,
  },
})

// form start
const ruleFormRef = ref()
const ruleForm = reactive({
  name: '', // 姓名
  email: '', // 邮箱
  password: '',
  password_confirm: '',
  authority: '',
})
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (ruleForm.password_confirm !== '') {
      if (!ruleFormRef.value) return
    }
    callback()
  }
}
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (value !== ruleForm.password) {
    callback(new Error('密码不同'))
  } else {
    callback()
  }
}
const rules = reactive({
  name: [{ required: true, message: '请选择', trigger: 'change' }],
  email: [{ required: true, message: '请选择', trigger: 'change' }],
  password: [{ required: true, validator: validatePass, trigger: 'blur' }],
  password_confirm: [{ required: true, validator: validatePass2, trigger: 'blur' }],
  authority: [{ required: true, message: '请选择', trigger: 'change' }],
})
const formItemList = [
  {
    key: 'name',
    label: '姓名',
    placeholder: '请输入姓名',
    type: 'input',
  },
  {
    key: 'email',
    label: '邮箱',
    placeholder: '请输入邮箱',
    type: 'input',
  },
  {
    key: 'password',
    label: '密码',
    placeholder: '请输入密码',
    type: 'input',
  },
  {
    key: 'password_confirm',
    label: '确认密码',
    placeholder: '请输入密码',
    type: 'input',
  },
  {
    key: 'authority',
    label: '职位',
    placeholder: '请选择',
    type: 'radio',
    list: [
      { key: '1', value: '医生' },
      { key: '2', value: '助理' },
      { key: '3', value: '护士' },
    ],
  },
]

const formItemListEdit = [
  {
    key: 'name',
    label: '姓名',
    placeholder: '请输入姓名',
    type: 'input',
  },
  {
    key: 'email',
    label: '邮箱',
    placeholder: '请输入邮箱',
    type: 'input',
  },
  {
    key: 'authority',
    label: '职位',
    placeholder: '请选择',
    type: 'radio',
    disabled: adminStore.authority !== '1',
    list: [
      { key: '1', value: '医生' },
      { key: '2', value: '助理' },
      { key: '3', value: '护士' },
    ],
  },
]
// form end

onMounted(() => {
  init()
})

const init = () => {
  if (isEdit()) {
    ruleForm.name = goodStore.isShowUserData.name
    ruleForm.email = goodStore.isShowUserData.email
    ruleForm.authority = goodStore.isShowUserData.authority
  }
}

const isEdit = () => {
  return goodStore.isShowUserType === 'edit'
}

const onSubmit = async (formEl) => {
  await formEl.validate((valid, fields) => {
    // console.log({ valid, fields, ruleForm })
    if (valid) {
      if (isEdit()) {
        onfetchClinicUserUpdate()
      } else {
        onfetchClinicUserAdd()
      }
    }
  })
}

const onfetchClinicUserAdd = async () => {
  loadingBtn.value = true
  const req = {
    ...ruleForm,
    c_shop_id: adminStore.shop_id,
  }
  const [res, err] = await fetchClinicUserAdd(req)
  loadingBtn.value = false
  if (err) {
    ElMessage('添加失败')
    return
  }
  ElMessage('添加成功')
  goodStore.isShowUser = false
}

const onfetchClinicUserUpdate = async () => {
  loadingBtn.value = true
  const req = {
    id: goodStore.isShowUserData.id,
    name: ruleForm.name,
    email: ruleForm.email,
    authority: ruleForm.authority,
  }
  const [res, err] = await fetchClinicUserUpdate(req)
  loadingBtn.value = false
  if (err) {
    ElMessage('编辑失败')
    return
  }
  ElMessage('编辑成功')
  props.onList()
  goodStore.isShowUser = false
}
</script>

<template>
  <el-dialog v-model="goodStore.isShowUser" :close-on-click-modal="false" :title="isEdit() ? '编辑' : '添加'">
    <div class="c-theme">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
        <FormItemList :form-item-list="isEdit() ? formItemListEdit : formItemList" :rule-form="ruleForm" />
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button :loading="loadingBtn" @click="onSubmit(ruleFormRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
