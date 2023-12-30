<script setup>
import _ from 'lodash-es'

import { fetchTreeArea, fetchPatientDetail } from '@/api'
import { useGoodStore } from '@/store/good'

const goodStore = useGoodStore()
const nameList = ref([])

const props = defineProps({
  formItemList: {
    type: Array,
    required: true,
  },
  ruleForm: {
    type: Object,
    required: true,
  },
})

const predefineColors = ref(['#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585', '#c71585'])

const propsArea = {
  lazy: true,
  lazyLoad: async (node, resolve) => {
    const { level, value, data } = node
    let req = {}
    if (level === 1) {
      req = {
        province: value,
      }
    } else if (level === 2) {
      req = {
        province: data.value,
        city: value,
      }
    }
    const [res, err] = await fetchTreeArea(req)
    const list = []
    res.forEach((u) => {
      list.push({
        value: u.value,
        label: u.label,
        leaf: level >= 2,
      })
    })
    resolve(list)
  },
}

onMounted(async () => {
  init()
})

const init = () => {}

const onFetchFindName = async (name) => {
  const req = { name: name }
  const [res, err] = await fetchPatientDetail(req)
  if (err) return
  console.log({ res })
  nameList.value = res
}

const imageSrc = (src) => {
  let res = ''
  if (src) {
    res = import.meta.env.VITE_APP_PROXY_URL_IMAGE + src
  }
  return res
}

const onChageSearch = _.debounce((v, u) => {
  if (u.search) {
    console.log({ v, u })
    if (_.trim(v)) {
      onFetchFindName(v)
    } else {
      nameList.value = []
    }
  }
}, 500)
</script>

<template>
  <el-form-item v-for="u in formItemList" :key="u.key" :prop="u.key" :label="u.label">
    <!-- color -->
    <el-color-picker v-if="u.type === 'color'" v-model="ruleForm[u.key]" :predefine="predefineColors" />
    <!-- color -->
    <!-- theme -->
    <div v-if="u.type === 'theme'" class="form-theme">
      <div v-for="h in u.list" :key="h.key" class="form-theme-item">
        <div class="form-theme-item-label">{{ h.value }}</div>
        <el-color-picker v-model="ruleForm[h.key]" :predefine="predefineColors" />
      </div>
    </div>
    <!-- theme -->
    <!-- select -->
    <el-select v-if="u.type === 'select'" v-model="ruleForm[u.key]" :placeholder="u.placeholder">
      <el-option v-for="h in u.list" :key="h.key" :label="h.value" :value="h.key" />
    </el-select>
    <!-- input -->
    <el-input
      v-if="u.type === 'input'"
      v-model="ruleForm[u.key]"
      :disabled="u.disabled"
      :placeholder="u.placeholder"
      @input="(v) => onChageSearch(v, u)"
    />
    <!-- textarea -->
    <el-input
      v-if="u.type === 'textarea'"
      v-model="ruleForm[u.key]"
      :placeholder="u.placeholder"
      :rows="2"
      type="textarea"
    />
    <!-- radio -->
    <el-radio-group v-if="u.type === 'radio'" v-model="ruleForm[u.key]" :disabled="u.disabled">
      <el-radio v-for="h in u.list" :key="h.key" :label="h.key">{{ h.value }}</el-radio>
    </el-radio-group>
    <!-- checkbox -->
    <el-checkbox-group v-if="u.type === 'checkbox'" v-model="ruleForm[u.key]">
      <el-checkbox v-for="h in u.list" :key="h.key" :label="h.key">
        {{ h.value }}
      </el-checkbox>
    </el-checkbox-group>
    <!-- checkbox-tree -->
    <el-checkbox-group v-if="u.type === 'checkbox-tree'" v-model="ruleForm[u.key]">
      <div v-for="h in u.list" :key="h.key" class="checkbox-tree-main">
        <div class="checkbox-tree-main-header">{{ h.value }}</div>
        <div class="checkbox-tree-main-body">
          <el-checkbox v-for="b in h.list" :key="b.key" :label="b.key">
            {{ b.value }}
          </el-checkbox>
        </div>
      </div>
    </el-checkbox-group>
    <!-- rate -->
    <el-rate v-if="u.type === 'rate'" v-model="ruleForm[u.key]" />
    <!-- rate -->
    <!-- upload -->
    <el-upload v-if="u.type === 'upload'" class="avatar-uploader" :show-file-list="false" :before-upload="u.func">
      <img v-if="ruleForm[u.key]" :src="ruleForm[u.key]" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <!-- date -->
    <el-date-picker
      v-if="u.type === 'date'"
      v-model="ruleForm[u.key]"
      type="date"
      :placeholder="u.placeholder"
      format="YYYY-MM-DD"
    />
    <!-- data -->
    <div v-if="u.type === 'date-start-end'" class="date-start-end">
      <el-time-select
        v-model="ruleForm[u.key1]"
        :max-time="ruleForm[u.key2]"
        placeholder="开始时间"
        format="HH:mm"
        start="09:00"
        step="00:15"
        end="21:00"
      />
      <el-time-select
        v-model="ruleForm[u.key2]"
        :min-time="ruleForm[u.key1]"
        format="HH:mm"
        placeholder="结束时间"
        start="09:00"
        step="00:15"
        end="21:00"
      />
    </div>
    <!-- 动态加载地区 -->
    <el-cascader v-if="u.type === 'address'" v-model="ruleForm[u.key]" :props="propsArea" style="width: 100%" />
    <!-- 全部地区 -->
    <el-cascader
      v-if="u.type === 'addressAll'"
      v-model="ruleForm[u.key]"
      :options="goodStore.areaAll"
      :props="{
        label: 'name',
        value: 'code',
      }"
      class="w-full"
    />

    <div v-if="u.search === true" class="comp-name-list">
      <div v-for="u in nameList" :key="u.id" class="name-list-item">
        {{ u.name }} - {{ u.patient_id }} -{{ u.mobile }}
      </div>
    </div>
  </el-form-item>
</template>
