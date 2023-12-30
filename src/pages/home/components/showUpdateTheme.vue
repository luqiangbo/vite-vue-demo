<script setup>
import { useUserStore } from '@/store/user'
import { reactive } from 'vue'
import { fetchColorProjectList, fetchColorStatusList, fetchColorProjectEdit, fetchColorStatusEdit } from '@/api'

const userStore = useUserStore()

const ruleForm = reactive({
  color_project_list: [],
  color_status_list: [],
})

const predefineColors = ref(['#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585', '#c71585'])

onMounted(() => {
  init()
})

const init = () => {
  onFetchColorProjectList()
  onFetchColorStatusList()
}

const onFetchColorProjectList = async () => {
  const [res, err] = await fetchColorProjectList()
  if (err) return
  const list = []
  for (const key in res) {
    const value = res[key]
    list.push({
      label: key,
      list: value.map((u) => {
        ruleForm[`project-${u.id}`] = u.color
        return { key: u.id, color: u.color, value: u.order_project_name, type: 'project' }
      }),
    })
  }
  console.log({ list })
  ruleForm.color_project_list = list
}

const onFetchColorStatusList = async () => {
  const [res, err] = await fetchColorStatusList()
  if (err) return
  ruleForm.color_status_list = res.map((u) => {
    ruleForm[`status-${u.id}`] = u.color
    return {
      key: u.id,
      value: u.order_status_text,
      color: u.color,
      type: 'status',
    }
  })
}

const onChageColor = (color, u) => {
  if (u.type === 'project') {
    onFetchColorProjectEdit(u, color)
  } else if (u.type === 'status') {
    onFetchColorStatusEdit(u, color)
  }
}

const onFetchColorProjectEdit = async (u, color) => {
  const [res, err] = await fetchColorProjectEdit({ id: u.key, color })
  if (err) return
  ElMessage({
    message: `${u.value}-修改成功!`,
    type: 'success',
  })
}

const onFetchColorStatusEdit = async (u, color) => {
  const [res, err] = await fetchColorStatusEdit({ id: u.key, color })
  if (err) return
  ElMessage({
    message: `${u.value}-修改成功!`,
    type: 'success',
  })
}
</script>

<template>
  <el-dialog v-model="userStore.isShowTheme" :close-on-click-modal="false" title="主题配色">
    <div class="c-theme">
      <div>
        <div class="title-1">状态颜色</div>
        <div v-for="u in ruleForm.color_status_list" :key="u.key">
          <div class="color-item">
            <div class="color-item-label">{{ u.value }}</div>
            <el-color-picker
              v-model="ruleForm[`status-${u.key}`]"
              :predefine="predefineColors"
              :color="u.color"
              @change="(e) => onChageColor(e, u)"
            />
          </div>
        </div>
      </div>
      <div>
        <div class="title-1">项目颜色</div>
        <div v-for="h in ruleForm.color_project_list" :key="h.label">
          <div>
            <div class="title-2">{{ h.label }}</div>
            <div v-for="u in h.list" :key="u.key">
              <div class="color-item">
                <div class="color-item-label">{{ u.value }}</div>
                <el-color-picker
                  v-model="ruleForm[`project-${u.key}`]"
                  :predefine="predefineColors"
                  :color="u.color"
                  @change="(e) => onChageColor(e, u)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="userStore.updateIsShowTheme(false)">关闭</el-button>
        <!-- <el-button type="primary" @click="onSubmit(ruleFormRef)"> 确定 </el-button> -->
      </span>
    </template>
  </el-dialog>
</template>
