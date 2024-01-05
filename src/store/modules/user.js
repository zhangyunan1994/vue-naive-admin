/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:25:59
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { defineStore } from 'pinia'
import api from '@/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
  }),
  getters: {
    userId() {
      return this.userInfo?.id
    },
    username() {
      return this.userInfo?.username
    },
    nickName() {
      return this.userInfo?.nickName
    },
    avatar() {
      return this.userInfo?.avatar
    },
    currentRole() {
      return this.userInfo?.currentRole || {}
    },
    roles() {
      return this.userInfo?.roles || []
    },
  },
  actions: {
    async getUserInfo() {
      try {
        const res = await api.getUser()
        const { id, username, profile, roles, currentRole } = res.data || {}
        this.userInfo = {
          id,
          username,
          avatar: profile?.avatar,
          nickName: profile?.nickName,
          gender: profile?.gender,
          address: profile?.address,
          email: profile?.email,
          roles,
          currentRole,
        }
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    resetUser() {
      this.$reset()
    },
  },
})
