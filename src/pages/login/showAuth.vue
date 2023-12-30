<script setup>
import { Close, Refresh } from '@element-plus/icons-vue'
import _ from 'lodash-es'

import { fetchCaptchaData, fetchCaptchaCheckData } from '@/api/clinic'

const props = defineProps({
  onClose: {
    type: Function,
    required: true,
  },
  onOk: {
    type: Function,
    required: true,
  },
})

const isOpenAuth = ref(true)
const imageAuthA = ref('')
const imageAuthB = ref('')
const authKey = ref('')
const xyList = ref([])

onMounted(async () => {
  init()
})

const init = () => {
  //
  console.log('init showAuth')
  onfetchCaptchaData()
}

const onfetchCaptchaData = async () => {
  const [res, err] = await fetchCaptchaData({
    dots: '131',
    Key: '131',
  })
  if (err) return

  imageAuthA.value = res.b64
  imageAuthB.value = res.tb64
  authKey.value = res.key
}

const onCloseAuth = () => {
  props.onClose()
}

const onUpdateAuth = () => {
  xyList.value = []
  onfetchCaptchaData()
}

const onXY = (event) => {
  const x = event.offsetX
  const y = event.offsetY
  if (xyList.value.length > 10) {
    return
  }

  xyList.value.push({
    x: x,
    y: y,
    show: true,
  })
}

const onAuth = () => {
  let list = []
  xyList.value.forEach((v) => {
    list.push(v.x)
    list.push(v.y)
  })
  const listString = list.join(',')
  onfetchCaptchaCheckData(listString)
}

const onfetchCaptchaCheckData = async (listString) => {
  const req = {
    key: authKey.value,
    dots: listString,
  }

  const [res, err] = await fetchCaptchaCheckData(req)
  if (err) return

  props.onOk()
}
</script>

<template>
  <el-dialog
    v-model="isOpenAuth"
    modal-class="auth-main"
    :show-close="false"
    :close-on-click-modal="false"
    title="安全验证"
    width="350px"
  >
    <div>
      <div class="flex items-center justify-center mb-2">
        <div class="mr-2">请点击下图<span class="text-blue-500">依次</span>点击 :</div>
        <img class="block" :src="imageAuthB" />
      </div>
      <div class="flex justify-center">
        <div class="flex justify-center mb-2 overflow-hidden rounded-lg w-[300px] relative" @click="onXY">
          <img class="block" :src="imageAuthA" />
          <div
            v-for="(v, i) in xyList"
            :key="i"
            class="xy-item"
            :style="{ left: v.x + 'px', top: v.y + 'px', display: v.show ? 'block' : 'none' }"
          >
            {{ i + 1 }}
          </div>
        </div>
      </div>

      <div class="flex justify-between px-3">
        <div>
          <el-button :icon="Close" circle @click="onCloseAuth" />
          <el-button :icon="Refresh" circle @click="onUpdateAuth" />
        </div>
        <div>
          <el-button type="primary" @click="onAuth">确定</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style></style>
