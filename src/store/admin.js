import { defineStore } from 'pinia'

export const useAdminStore = defineStore({
  id: 'clinic-admin', // id必填，且需要唯一
  persist: true,
  state: () => {
    return {
      token: '',
      routerActive: '//',
      shop_id: '',
      authority: '',
    }
  },
  actions: {},
})
