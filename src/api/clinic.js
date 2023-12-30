import { request } from '@/utils/request'

// 获取验证码
export const fetchCaptchaData = (data) => request({ url: '/abc/base/go_captcha_data', data })

// 验证验证码
export const fetchCaptchaCheckData = (data) => request({ url: '/abc/base/go_captcha_check_data', data })

// 登录
export const fetchClinicUserLogin = (data) => request({ url: '/clinic/public/user/login', data })

// 店铺列表
export const fetchClinicPublicShopList = (data) => request({ url: '/clinic/public/shop/list', data })

// auth验证
export const fetchClinicUserAuth = (data) => request({ url: '/clinic/user/auth', data })

// 添加成员
export const fetchClinicUserAdd = (data) => request({ url: '/clinic/public/user/add', data })

// 更新
export const fetchClinicUserUpdate = (data) => request({ url: '/clinic/user/update', data })

// 删除
export const fetchClinicUserDelete = (data) => request({ url: '/clinic/user/delete', data })

// 地址
export const fetchClinicAreaAll = (data) => request({ url: '/clinic/area/all', data })

// 项目列表
export const fetchClinicSection0List = (data) => request({ url: '/clinic/section0/list', data })

// 客户列表
export const fetchClinicPatientList = (data) => request({ url: '/clinic/patient/list', data })
