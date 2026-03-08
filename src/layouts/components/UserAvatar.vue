<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/16 18:50:42
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <n-dropdown trigger="click" :options="options" @select="handleSelect">
    <div id="user-dropdown" class="flex cursor-pointer items-center">
      <NAvatar round :size="36" :src="userStore.avatar" />
      <div v-if="userStore.userInfo" class="ml-12 flex-col flex-shrink-0 items-center">
        <span class="text-14">{{ userStore.nickName ?? userStore.username }}</span>
        <span class="text-12">{{ userStore.username }}</span>
      </div>
    </div>
  </n-dropdown>
</template>

<script setup>
import { NAvatar, NText } from 'naive-ui'
import api from '@/api'
import { useAuthStore, usePermissionStore, useUserStore } from '@/store'

const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()
const permissionStore = usePermissionStore()

function renderCustomHeader() {
  return h(
    'div',
    {
      style: 'display: flex; align-items: center; padding: 8px 12px;',
    },
    [
      h(NAvatar, {
        round: true,
        style: 'margin-right: 12px;',
        size: 48,
        src: userStore.avatarUrl,
      }),
      h('div', null, [
        h('div', null, [h(NText, { depth: 2 }, { default: () => userStore.nickName ?? userStore.username })]),
        h('div', { style: 'font-size: 14px;' }, [
          h(
            NText,
            { depth: 3 },
            { default: () => '毫无疑问，你是办公室里最亮的星' },
          ),
        ]),
      ]),
    ],
  )
}

const options = reactive([
  {
    key: 'header',
    type: 'render',
    render: renderCustomHeader,
  },
  {
    key: 'header-divider',
    type: 'divider',
  },
  {
    label: '个人资料',
    key: 'profile',
    icon: () => h('i', { class: 'i-material-symbols:person-outline text-14' }),
    show: computed(() => permissionStore.accessRoutes?.some(item => item.path === '/profile')),
  },
  {
    label: 'API Keys',
    key: 'APIKeys',
    icon: () => h('i', { class: 'i-basil:exchange-solid text-14' }),
    show: computed(() => permissionStore.accessRoutes?.some(item => item.path === '/openapi/apikey')),
  },
  {
    key: 'header-divider',
    type: 'divider',
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h('i', { class: 'i-mdi:exit-to-app text-14' }),
  },
])

function handleSelect(key) {
  switch (key) {
    case 'profile':
      router.push('/profile')
      break
    case 'APIKeys':
      router.push('/openapi/apikey')
      break
    case 'logout':
      $dialog.confirm({
        title: '提示',
        type: 'info',
        content: '确认退出？',
        async confirm() {
          try {
            await api.logout()
          }
          catch (error) {
            console.error(error)
          }
          authStore.logout()
          $message.success('已退出登录')
        },
      })
      break
  }
}
</script>
