import _ from 'lodash-es'

export const weekList = [
  { key: 1, value: '星期一' },
  { key: 2, value: '星期二' },
  { key: 3, value: '星期三' },
  { key: 4, value: '星期四' },
  { key: 5, value: '星期五' },
  { key: 6, value: '星期六' },
  { key: 7, value: '星期日' },
]

// 就诊类型
export const outpatientsList = [
  { key: '0', value: '初诊' },
  { key: '1', value: '复诊' },
]

export const genderStatusList = [
  { key: '0', value: '保密', color: '#e8ce63' },
  { key: '1', value: '男', color: '#46d6ef' },
  { key: '2', value: '女', color: '#da5661' },
]

// 图片类型
export const imageTypeList = [
  { key: 1, value: '未知' },
  { key: 0, value: 'X-Ray' },
  { key: 1, value: '面照' },
  { key: 2, value: '口类照' },
  { key: 3, value: '知情同意书' },
  { key: 4, value: '手写笔记' },
  { key: 5, value: '诊前问卷签字' },
  { key: 6, value: '费用说明' },
]
//  知情同意书类型
export const consentTypeList = [
  { key: 0, value: '无' },
  { key: 1, value: '正畸确认同意书' },
  { key: 2, value: '费用说明' },
  { key: 3, value: '保持须知' },
  { key: 4, value: '二次矫正' },
  { key: 5, value: '深圳初诊远程方案确认书' },
  { key: 6, value: '拔牙手术知情同意书' },
  { key: 7, value: '拔牙术后知情同意书' },
]

//  获悉方式
export const referenceList = [
  { key: '1', value: '微博' },
  { key: '2', value: '知乎' },
  { key: '3', value: 'b站' },
  { key: '4', value: '抖音' },
  { key: '5', value: '公众号' },
  { key: '6', value: '朋友介绍' },
]

// 治疗目的及要求
export const dentalDemandList = [
  { key: '1', value: '检查' },
  { key: '2', value: '洁牙' },
  { key: '3', value: '补牙' },
  { key: '4', value: '拔牙' },
  { key: '5', value: '牙裂痕' },
  { key: '6', value: '牙龈炎' },
  { key: '7', value: '牙周炎' },
  { key: '8', value: '牙痛' },
  { key: '9', value: '牙齿美白' },
  { key: '10', value: '牙齿修复' },
  { key: '11', value: '牙齿矫正' },
]

// 是否有过敏药物（has_allergy_drugs）:0=无,1=有
export const hasAllergyDrugsLIst = [
  { key: '0', value: '无' },
  { key: '1', value: '有' },
]

// 是否对麻醉药品过敏（is_allergy_anesthetics）:0=未知,1=是,2=否
export const isAllergyAnestheticsList = [
  { key: '0', value: '未知' },
  { key: '1', value: '是' },
  { key: '1', value: '否' },
]
// 慢性病（chronic_diseases）
export const chronicDiseasesList = [
  { key: '0', value: '无' },
  { key: '1', value: '心脏病' },
  { key: '2', value: '糖尿病' },
  { key: '3', value: '贫血' },
  { key: '4', value: '癫痫' },
  { key: '5', value: '血液病' },
  { key: '6', value: '肾病' },
  { key: '7', value: '哮喘' },
  { key: '8', value: '肝病' },
  { key: '9', value: '甲状腺疾病' },
  { key: '10', value: '风湿热' },
  { key: '11', value: '高血压' },
  { key: '12', value: '癌症' },
  { key: '13', value: '艾滋病' },
]

// 是否怀孕（is_pregnant）:0=未知,1=是,2=否
export const isPregnantList = [
  { key: '0', value: '未知' },
  { key: '1', value: '是' },
  { key: '1', value: '否' },
]

export const actionList = [
  { key: 'edit', value: '修改' },
  { key: 'readd', value: '再次预约' },
]

export const timeDetailList = ['00', '15', '30', '45']
export const timeList = [
  {
    key: '9',
    value: timeDetailList,
  },
  {
    key: '10',
    value: timeDetailList,
  },
  {
    key: '11',
    value: timeDetailList,
  },
  {
    key: '12',
    value: timeDetailList,
  },
  {
    key: '13',
    value: timeDetailList,
  },
  {
    key: '14',
    value: timeDetailList,
  },
  {
    key: '15',
    value: timeDetailList,
  },
  {
    key: '16',
    value: timeDetailList,
  },
  {
    key: '17',
    value: timeDetailList,
  },
  {
    key: '18',
    value: timeDetailList,
  },
  {
    key: '19',
    value: timeDetailList,
  },
  {
    key: '20',
    value: timeDetailList,
  },
]

export const orderStatusList = [
  { key: '1', value: '已预约', color: '#e56522' },
  { key: '2', value: '已挂号', color: '#68b4f1' },
  { key: '3', value: '治疗中', color: '#90EE90' },
  { key: '4', value: '治疗完成', color: '#9ccd72' },
  { key: '5', value: '已离店', color: '#4d8ce4' },
  { key: '6', value: '已失约', color: '#455896' },
  { key: '0', value: '取消', color: '#efb2d1' },
]

export const onGetGender = (key) => _.get(_.find(genderStatusList, { key }), 'value', '无')

export const onGetReference = (key) => _.get(_.find(referenceList, { key }), 'value', '无')
