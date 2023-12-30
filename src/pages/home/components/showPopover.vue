<script setup>
import { useUserStore } from '@/store/user'
import { actionList } from '@/utils/data.js'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})
const userStore = useUserStore()
const tab = ref(0)

const onClickDropdown = (key, detail) => {
  if (key === 'edit' || key === 'readd') {
    userStore.updateIsShowOrder(true, key, detail)
  }
}

const onClickDropdownType = (key, detail) => {
  const { id, order_id } = detail
  const req = {
    id,
    order_id,
    type: key,
  }
  if (req.id) {
    console.log('更新状态', { req, detail })
    userStore.onFetchOrderEdit(req)
  }
}

const getPlacement = () => {
  return userStore.doctorList.length === 1 ? 'bottom' : 'right'
}
</script>

<template>
  <div class="item-order">
    <el-popover trigger="contextmenu" :placement="getPlacement()" width="300px">
      <template #reference>
        <div class="item-order-main">
          <div class="item-order-header" :style="{ backgroundColor: data.order_color }">
            <div>{{ data.patient_name }} {{ data.gender_text }}</div>
            <div>{{ data.order_project_string }}</div>
          </div>
          <div class="item-order-body" :style="{ backgroundColor: data.status_color }">
            <div>{{ data.order_value }}</div>
            <div>{{ data.start_time_hm }}~{{ data.end_time_hm }}</div>
            <div>{{ data.remark }}</div>
          </div>
        </div>
      </template>
      <template #default>
        <div class="popver-order">
          <div class="popver-order-header">
            <div class="name">姓名: {{ data.patient_name }} 性别: {{ data.gender_text }}</div>
            <div class="number">电话: {{ data.mobile }}</div>
            <div class="number">客户来源: {{ data.reference_text }}</div>
            <div class="number">客户备注: {{ data.patient_remark }}</div>
          </div>

          <el-tabs v-model="tab" type="border-card">
            <el-tab-pane label="预约详情" :name="0">
              <div class="label-value">
                <div class="label">病例编号:</div>
                <div class="value">{{ data.patient_id }}</div>
              </div>
              <div class="label-value">
                <div class="label">开始时间:</div>
                <div class="value">{{ data.start_time }}</div>
              </div>
              <div class="label-value">
                <div class="label">结束时间:</div>
                <div class="value">{{ data.end_time }}</div>
              </div>
              <div class="label-value">
                <div class="label">预约项目:</div>
                <div class="value">{{ data.order_project_string }}</div>
              </div>
              <div class="label-value">
                <div class="label">预约医生:</div>
                <div class="value">{{ data.doctor_name }}</div>
              </div>
              <div class="label-value">
                <div class="label">就诊医生:</div>
                <div class="value">{{ data.visiting_doctor_name }}</div>
              </div>
              <div class="label-value">
                <div class="label">就诊护士:</div>
                <div class="value">{{ data.nurse_name }}</div>
              </div>
              <div class="label-value">
                <div class="label">就诊助理:</div>
                <div class="value">{{ data.aid_doctor_name }}</div>
              </div>
              <div class="label-value">
                <div class="label">就诊类型:</div>
                <div class="value">{{ data.type_text }}</div>
              </div>
              <div class="label-value">
                <div class="label">预约状态:</div>
                <div class="value">{{ data.order_value }}</div>
              </div>

              <div class="label-value">
                <div class="label">预约备注:</div>
                <div class="value">{{ data.remark }}</div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="预约记录" :name="1">
              <el-timeline>
                <el-timeline-item
                  v-for="u in data.order_record"
                  :key="u.id"
                  :timestamp="`${u.order_date} ${u.order_start_time}~${u.order_end_time} `"
                  :type="u.is_current_order ? 'primary' : ''"
                >
                  <div><el-tag v-if="u.is_current_order">本次</el-tag> 医生: {{ u.order_doctor_name }}</div>
                  <div>类型: {{ u.order_status_text }}</div>
                  <div>预约项目: {{ u.order_project_text.join('，') }}</div>
                </el-timeline-item>
              </el-timeline>
            </el-tab-pane>
          </el-tabs>
          <div class="popver-order-footer">
            <div class="left">
              <el-dropdown>
                <el-button>
                  预约状态<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="v in userStore.orderStatusList"
                      :key="v.key"
                      @click="onClickDropdownType(v.key, { ...data })"
                    >
                      {{ v.value }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="right">
              <el-dropdown>
                <el-button>
                  更多操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-for="v in actionList" :key="v.key" @click="onClickDropdown(v.key, data)">
                      {{ v.value }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>
