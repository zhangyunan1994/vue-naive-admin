<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/16 18:49:53
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <i
    v-if="appStore.layout !== 'empty' && routerStore.route.path !== '/login'"
    id="layout-setting"
    class="i-fe:settings mr-16 cursor-pointer"
    @click="show = !show"
  />

  <n-float-button v-show="appStore.layout === 'empty' && routerStore.route.path !== '/login'" :right="20" :bottom="400" shape="square" :show-menu="false" class="z-999" @click="show = !show">
    <n-icon>
      <i
        id="layout-setting"
        class="i-fe:settings mr-16 cursor-pointer"
      />
    </n-icon>
  </n-float-button>
  <div>
    <n-drawer v-model:show="show" :width="480">
      <n-drawer-content title="设置" :native-scrollbar="false" closable>
        <n-h5>布局</n-h5>
        <n-space justify="space-between">
          <div class="flex-col cursor-pointer justify-center" @click="appStore.setLayout('full')">
            <div class="flex">
              <n-skeleton :width="20" :height="60" />
              <div class="ml-4">
                <n-skeleton :width="80" :height="6" />
                <n-skeleton class="mt-4" :width="80" :height="4" />
                <n-skeleton class="mt-4" :width="80" :height="42" />
              </div>
            </div>
            <n-button
              class="mt-12"
              size="small"
              :type="appStore.layout === 'full' ? 'primary' : ''"
              ghost
            >
              全面
            </n-button>
          </div>
          <div class="flex-col cursor-pointer justify-center" @click="appStore.setLayout('normal')">
            <div class="flex">
              <n-skeleton :width="20" :height="60" />
              <div class="ml-4">
                <n-skeleton :width="80" :height="10" />
                <n-skeleton class="mt-4" :width="80" :height="46" />
              </div>
            </div>
            <n-button
              class="mt-12"
              size="small"
              :type="appStore.layout === 'normal' ? 'primary' : ''"
              ghost
            >
              通用
            </n-button>
          </div>
          <div class="flex-col cursor-pointer justify-center" @click="appStore.setLayout('simple')">
            <div class="flex">
              <n-skeleton :width="20" :height="60" />
              <div class="ml-4">
                <n-skeleton :width="80" :height="60" />
              </div>
            </div>
            <n-button
              class="mt-12"
              size="small"
              :type="appStore.layout === 'simple' ? 'primary' : ''"
              ghost
            >
              简约
            </n-button>
          </div>
          <div class="flex-col cursor-pointer justify-center" @click="appStore.setLayout('empty')">
            <div class="flex">
              <n-skeleton :width="104" :height="60" />
            </div>
            <n-button
              class="mt-12"
              size="small"
              :type="appStore.layout === 'empty' ? 'primary' : ''"
              ghost
            >
              空白
            </n-button>
          </div>
        </n-space>
        <p class="mt-16 opacity-50">
          注: 此设置仅对未设置layout或者设置成跟随系统的页面有效，菜单设置的layout优先级最高
        </p>
        <n-h5>主题颜色</n-h5>
        <n-flex justify="start" gap-lg gap-row-lg>
          <n-button v-for="color in primaryColors" :key="color" :color="color" @click="appStore.setPrimaryColor(color)">
            <n-icon>
              <i class="i-fe:circle-fill" />
            </n-icon>
          </n-button>
        </n-flex>
        <n-color-picker
          id="theme-setting"
          class="mt-6 h-34 w-80"
          :default-show="true"
          :value="appStore.primaryColor"
          :swatches="primaryColors"
          :on-update:value="(v) => appStore.setPrimaryColor(v)"
          :render-label="() => '自定义'"
        />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup>
import { getPresetColors } from '@arco-design/color'
import { useAppStore, useRouterStore } from '@/store'

const show = ref(false)

const appStore = useAppStore()

const routerStore = useRouterStore()

const primaryColors = Object.entries(getPresetColors()).map(([, value]) => value.primary)
primaryColors.push('#326C72')
</script>
