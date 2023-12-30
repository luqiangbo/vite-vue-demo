<script setup>
import { useRouter } from 'vue-router'
import { Lock, User } from '@element-plus/icons-vue'

import { useAdminStore } from '@/store/admin'
import { fetchClinicUserLogin, fetchClinicPublicShopList } from '@/api/clinic'
import ShowAuth from './showAuth.vue'
import ImgTooth1 from '@/assets/tooth1.svg?url'
import ImgTiga from '@/assets/tiga.jpg?url'

const userEmail = import.meta.env.VITE_USER_EMAIL
const userPassword = import.meta.env.VITE_USER_PASSWORD

const router = useRouter()
const ruleFormRef = ref()
const isOpenAuth = ref(false)
const formLabelAlign = reactive({
  email: userEmail,
  password: userPassword,
})

const rules = reactive({
  email: [
    { required: true, message: '请填写邮箱', trigger: 'blur' },
    { min: 3, max: 50, message: '3 to 50', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请填写密码', trigger: 'blur' },
    { min: 3, max: 50, message: '3 to 50', trigger: 'blur' },
  ],
})

onMounted(async () => {
  init()
})

const init = () => {
  //
  onfetchClinicPublicShopList()
}

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!', { ...formLabelAlign })
      isOpenAuth.value = true
    } else {
      console.log('error submit!', fields)
    }
  })
}

const onClose = () => {
  isOpenAuth.value = false
}

const onOk = () => {
  isOpenAuth.value = false
  onfetchClinicUserLogin()
}

const onfetchClinicUserLogin = async () => {
  const adminStore = useAdminStore()
  const req = { ...formLabelAlign }
  const [res, err] = await fetchClinicUserLogin(req)
  if (err) return
  adminStore.token = res.token
  adminStore.routerActive = '//'
  router.push({
    path: '//',
  })
}

const onfetchClinicPublicShopList = async () => {
  const req = {
    page_number: 1,
    page_size: 3,
  }
  const [res, err] = await fetchClinicPublicShopList(req)
  if (err) return
}
</script>

<template>
  <div class="page-login">
    <div class="page-login-banner">
      <img :src="ImgTooth1" />
    </div>

    <div class="page-login-main">
      <img :src="ImgTiga" alt="" class="login-bg" />

      <div class="box-card">
        <div class="page-login-title">美好口腔</div>

        <el-form
          ref="ruleFormRef"
          :rules="rules"
          :model="formLabelAlign"
          label-position="right"
          style="max-width: 460px"
        >
          <el-form-item label="" prop="email">
            <el-input v-model="formLabelAlign.email" :prefix-icon="User" placeholder="email" />
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input v-model="formLabelAlign.password" :prefix-icon="Lock" type="password" placeholder="password" />
          </el-form-item>
          <el-form-item>
            <el-button class="w-full" type="primary" @click="submitForm(ruleFormRef)"> 登录 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <ShowAuth v-if="isOpenAuth" :onClose="onClose" :onOk="onOk"></ShowAuth>
  </div>
</template>

<style lang="less">
@import './index.less';
</style>
