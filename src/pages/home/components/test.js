import _ from 'lodash-es'

const COLUMN_X = 100

const orderList = [
  { id: 1, start_index: 0, end_index: 4 },
  { id: 2, start_index: 0, end_index: 4 },
  // { id: 3, start_index: 2, end_index: 8 },
  // { id: 4, start_index: 2, end_index: 12 },
  // { id: 4, start_index: 2, end_index: 12 },
  // { id: 4, start_index: 2, end_index: 12 },
  // { id: 5, start_index: 0, end_index: 2 },
]

export const trims_order = (orderList) => {
  const list = []
  let listAll = []
  let maxCol = 0
  let maxColList = []
  let xyObj = {}
  orderList.forEach((u) => {
    const ens = _.range(u.start_index, u.end_index)
    listAll = [...listAll, ...ens]
    list.push({
      ...u,
      timeList: ens,
    })
  })
  const listSort = _.sortBy(list, ['start_index'])
  const count = _.countBy(listAll) // 每个数出现的次数
  const maxCount = _.maxBy(_.keys(count), (key) => count[key]) // 次数最多的数字
  maxCol = count[maxCount]
  maxColList = _.range(0, maxCol)
  // console.log(list)
  // console.log(count)
  // console.log(maxCount)
  // console.log(listSort)
  console.log({ maxCol })
  // console.log(maxColList)
  listSort.forEach((u) => {
    const { obj, x } = xyTrim(u, maxColList, xyObj)
    const x2 = x * parseInt(COLUMN_X / maxCol)
    u.x2 = x2
    u.w2 = parseInt(COLUMN_X / maxCol)
    xyObj = { ...xyObj, ...obj }
  })
  console.log(listSort)
  return listSort
}

function xyTrim(u, maxColList, xyObj) {
  let xy = ''
  let x = 0
  for (const h in maxColList) {
    xy = `${h}-${u.timeList[0]}`
    x = h
    if (!_.has(xyObj, xy)) {
      break
    }
  }
  const xyItemObj = {}
  u.timeList.forEach((b) => {
    xyItemObj[`${x}-${b}`] = 1
  })
  // console.log(xyItemObj)
  return { obj: xyItemObj, x }
}

// trims_order(orderList)
