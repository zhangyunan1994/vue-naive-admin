<template>
  <CommonBlockPage>
    <n-row :gutter="20" class="w-full">
      <n-col :span="6">
        <div class="metric http" @click="showHttpDialog">
          <p>
            <span class="number">HTTP</span>
            <span class="title">HTTP 数据源</span>
          </p>
        </div>
      </n-col>
      <n-col :span="6">
        <div class="metric mysql" @click="showMySQLDialog">
          <p>
            <span class="number">MySQL</span>
            <span class="title">MySQL 数据源</span>
          </p>
        </div>
      </n-col>
      <n-col :span="6">
        <div class="metric redis" @click="showRedisDialog">
          <p>
            <span class="number">&nbsp;</span>
            <span class="title">&nbsp;</span>
          </p>
        </div>
      </n-col>
      <n-col :span="6">
        <div class="metric mongodb" @click="showMongoDBDialog">
          <p>
            <span class="number">&nbsp;</span>
            <span class="title">&nbsp;</span>
          </p>
        </div>
      </n-col>
    </n-row>

    <n-data-table
      :columns="columns"
      :data="data"
      :pagination="pagination"
      :scroll-x="1800"
      :style="{ height: `${height}px` }"
      flex-height
    />
  </CommonBlockPage>
</template>

<script setup>
import { MeModal } from '@/components'
import { sleep } from '@/utils'
import { useModal } from '@/composables'
import { CommonBlockPage } from '@/components/index.js'
import {onMounted, reactive, ref} from 'vue'

const height = ref(500)

const text = ref('')
const pagination = reactive({ pageSize: 10 })

const columns =  ref ([
  {
    type: "selection",
    fixed: "left"
  },
  {
    title: "Name",
    key: "name",
    width: 200,
    fixed: "left"
  },
  {
    title: "Age",
    key: "age",
    width: 100,
    fixed: "left"
  },
  {
    title: "Row",
    key: "row",
    render(row, index) {
      return h("span", ["row ", index]);
    }
  },
  {
    title: "Row1",
    key: "row1",
    render(row, index) {
      return h("span", ["row ", index]);
    }
  },
  {
    title: "Row2",
    key: "row2",
    render(row, index) {
      return h("span", ["row ", index]);
    },
    width: 100,
    fixed: "right"
  },
  {
    title: "Address",
    key: "address",
    width: 200,
    fixed: "right"
  }
])




























const [$modal1, okLoading1] = useModal()
function openModal1() {
  $modal1.value?.open({
    title: '第一个弹窗',
    width: '600px',
    okText: '再弹个窗',
    cancelText: '关闭',
    async onOk() {
      if (!text.value) {
        $message.warning('请输入内容')
        return false // 阻止弹窗关闭
      }
      okLoading1.value = true
      $message.loading('正在提交...', { key: 'modal1' })
      await sleep(1000)
      okLoading1.value = false
      $message.success('提交成功', { key: 'modal1' })
      openModal2()
      return false // 默认关闭弹窗，返回false可让弹窗不关闭
    },
    onCancel(message) {
      $message.info(message ?? '已取消')
    },
  })
}

const [$modal2, okLoading2] = useModal()
function openModal2() {
  $modal2.value?.open({
    cancelText: '关闭当前',
    okText: '关闭所有弹窗',
    width: '400px',
    async onOk() {
      okLoading2.value = true
      $message.loading('正在关闭...', { key: 'modal2' })
      await sleep(1000)
      okLoading2.value = false

      // 把modal1也关了
      $modal1.value?.close()
      $message.success('已关闭', { key: 'modal2' })
    },
  })
}
</script>
