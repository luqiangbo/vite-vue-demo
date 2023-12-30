import dayjs from 'dayjs'

// 工具
export const to = (promise) => promise.then((res) => [res, null]).catch((err) => [null, err])

// 年龄和生日

export const onGetAgeBirthday = (dateString) => {
  // 解析为dayjs对象
  const date = dayjs(dateString)

  // 获取出生年份
  const birthYear = date.year()

  // 获取当前年份
  const now = dayjs()
  const currentYear = now.year()

  // 计算年龄
  const age = currentYear - birthYear

  // 格式化输出生日
  const birthDay = date.format('MM-DD')

  return [age, birthDay]
}

export const onGetFormat = (dateString) => {
  // 解析时间字符串
  const date = dayjs(dateString)

  // 格式化输出
  const formatDate = date.format('YYYY-MM-DD HH:mm:ss')
  return formatDate
}
