<script setup>
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { fetchUserList } from '@/api'
import { fetchClinicUserDelete } from '@/api/clinic'
import { useAdminStore } from '@/store/admin'
import { useGoodStore } from '@/store/good'

import ShowUser from './showUser.vue'
import { messageConfig } from 'element-plus'

const adminStore = useAdminStore()
const goodStore = useGoodStore()
const doctorList = ref([])
const isShowDelete = ref(false)
const state = reactive({
  circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
  squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
})
const { circleUrl, squareUrl } = toRefs(state)

onMounted(async () => {
  init()
})

const init = () => {
  onfetchUserList()
}

const onfetchUserList = async () => {
  const req = {
    page_number: 1,
    page_size: 100,
  }
  const [res, err] = await fetchUserList(req)
  if (err) return
  const list1 = []
  const list2 = []
  const list3 = []
  res.list.forEach((u) => {
    if (u.authority === '1') {
      list1.push(u)
    }
    if (u.authority === '2') {
      list2.push(u)
    }
    if (u.authority === '3') {
      list3.push(u)
    }
  })

  const listAll = [
    {
      key: '1',
      value: '医生',
      list: list1,
    },
    {
      key: '2',
      value: '助理',
      list: list2,
    },
    {
      key: '3',
      value: '护士',
      list: list3,
    },
  ]

  doctorList.value = listAll
}

const onAdd = () => {
  goodStore.isShowUser = true
  goodStore.isShowUserType = 'add'
}

const onEdit = (data) => {
  goodStore.isShowUserData = { ...data }
  goodStore.isShowUser = true
  goodStore.isShowUserType = 'edit'
}

const onUserDelete = (data) => {
  onfetchClinicUserDelete(data.id)
}

const onfetchClinicUserDelete = async (id) => {
  const [res, err] = await fetchClinicUserDelete({ id })
  if (err) {
    ElMessage('删除失败')
  }
  onfetchUserList()
}
</script>

<template>
  <div class="page-me">
    <el-button type="primary" :icon="Plus" class="absolute top-20 right-5" @click="onAdd"> 新增成员 </el-button>
    <div v-for="u in doctorList" :key="u.key" class="p-2 mb-5">
      <h1 class="mb-2">{{ u.value }}</h1>
      <div>
        <el-space wrap>
          <el-card v-for="h in u.list" :key="h.id" class="w-[250px]">
            <template #header>
              <div class="flex p-4">
                <div class="mr-2">
                  <el-avatar :size="50" :src="circleUrl" />
                </div>
                <div>
                  <div class="mb-1">
                    <el-tag :type="''" effect="dark"> {{ h.name }}</el-tag>
                  </div>
                  <div>
                    <el-tag :type="'info'"> {{ h.email }}</el-tag>
                  </div>
                </div>
              </div>
            </template>
            <div>
              <el-button-group class="w-full">
                <el-button type="primary" :icon="Edit" :class="u.key === '1' ? 'w-full' : 'w-1/2'" @click="onEdit(h)" />
                <el-popover v-if="u.key !== '1'" :key="h.id" trigger="click" placement="top" :width="200">
                  <template #default>
                    <p class="mb-3">
                      确定要删除 <el-tag> {{ h.name }}</el-tag> ?
                    </p>
                    <div class="text-right">
                      <el-button size="small" type="danger" @click="onUserDelete(h)">删除</el-button>
                    </div>
                  </template>
                  <template #reference>
                    <el-button type="danger" :disabled="adminStore.authority !== '1'" :icon="Delete" class="w-1/2" />
                  </template>
                </el-popover>
              </el-button-group>
            </div>
          </el-card>
        </el-space>
      </div>
    </div>
    <ShowUser v-if="goodStore.isShowUser" :onList="onfetchUserList" />
  </div>
</template>

<style scoped></style>
