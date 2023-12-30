import { request } from '@/utils/request'

// 获取预约列表
export const fetchTreeArea = (data) => request({ url: '/admin/ajax/area', data, method: 'get' })

// 获取预约列表
export const fetchEnumList = (data) => request({ url: '/admin/enum/orderProject', data })

// 获取预约列表
export const fetchOrderList = (data) => request({ url: '/clinic/order/list', data })

// 编辑预约
export const fetchOrderEdit = (data) => request({ url: '/clinic/order/update', data })

// 新建预约
export const fetchOrderAdd = (data) => request({ url: '/clinic/order/add', data })

// 预约详情
export const fetchOrderInfo = (data) => request({ url: '/admin/order/info', data })

// 获取客户预约记录
export const fetchPatientInfo = (data) => request({ url: '/admin/patient/info', data })

// 获取客户预约记录
export const fetchPatientOrder = (data) => request({ url: '/admin/patient/getOrderRecord', data })

// 新建客户
export const fetchPatientAdd = (data) => request({ url: '/clinic/patient/add', data })

// 编辑客户
export const fetchPatientUpdate = (data) => request({ url: '/clinic/patient/update', data })

// 获取最新病历号
export const fetchPatientId = (data) => request({ url: '/admin/patient/getLastPatientId', data })

// 获取最新病历号
export const fetchPatientDetail = (data) => request({ url: '/clinic/patient/detail', data })

// 获取诊所信息
export const fetchClinicAdd = (data) => request({ url: '/admin/clinic/add', data })

// 获取诊所列表
export const fetchClinicList = (data) => request({ url: '/clinic/public/shop/list', data })

// 获取医务人员信息
export const fetchUserList = (data) => request({ url: '/clinic/user/list', data })

// 获取所有标识
export const fetchSignList = (data) => request({ url: '/admin/sign/list', data })

// 上传
export const fetchUploadOne = (data) =>
  request({
    url: '/clinic/upload/one',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

// 预约项目颜色列表
export const fetchColorProjectList = (data) => request({ url: '/admin/OrderProjectColor/list', data })
// 更新
export const fetchColorProjectEdit = (data) => request({ url: '/admin/OrderProjectColor/edit', data })

// 预约状态颜色列表
export const fetchColorStatusList = (data) => request({ url: '/admin/OrderStatusColor/list', data })
// 更新
export const fetchColorStatusEdit = (data) => request({ url: '/admin/OrderStatusColor/edit', data })
