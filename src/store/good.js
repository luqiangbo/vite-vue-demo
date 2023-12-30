import { defineStore } from 'pinia'

export const useGoodStore = defineStore({
  id: 'clinic-good', // id必填，且需要唯一
  state: () => {
    return {
      routers: [],
      isShowUser: false,
      isShowUserType: '',
      isShowUserData: {},
      areaAll: [],
    }
  },
  actions: {},
})
