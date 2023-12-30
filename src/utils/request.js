import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import { useAdminStore } from '@/store/admin'

import { to } from '@/utils'

const baseUrl = import.meta.env.VITE_APP_PROXY_URL

let loading = null

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 60 * 1000,
})

// 请求拦截
instance.interceptors.request.use(
  (config) => {
    loading = ElLoading.service({
      lock: true,
      loading: false,
    })
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
// 相应拦截
instance.interceptors.response.use(
  (response) => {
    const { status, data, request } = response
    loading.close()
    if (status !== 200) {
      return Promise.reject(status)
    } else {
      if (data.code !== 0) {
        ElMessage({
          message: `${data.msg}`,
          type: 'error',
          grouping: true,
          offset: 200,
        })
        return Promise.reject(data)
      } else {
        return Promise.resolve(data.data)
      }
    }
  },
  (error) => {
    loading.close()
    return Promise.reject(error)
  },
)

export const request = (req) => {
  const adminStore = useAdminStore()
  const token = adminStore.token
  let data = req.data ? req.data : {}
  if (req?.method === 'get') {
    data = { params: data }
  } else {
    data = { data: data }
  }
  let headers = {}
  if (req.headers) {
    headers = req.reqders
  }
  if (token) {
    headers = {
      ...req.headers,
      'x-token': token,
    }
  }

  const good = {
    method: 'post',
    url: req.url,
    headers,
    ...data,
  }

  return to(instance(good))
}
