<template>
  <AppPage>
    <n-flex vertical>
      <n-card content-style="padding: 0;">
        <div class="flex justify-between p-16">
          <n-input-group>
            <n-input :style="{ width: '50%' }" clearable />
            <n-button attr-type="submit" class="ml-20" type="primary">
              <i class="i-fe:search mr-4" />
              搜索
            </n-button>
          </n-input-group>
          <div class="flex-shrink-0">
            <n-button ghost type="primary" @click="openModal('新增模型')">
              <i class="i-fe:upload-cloud mr-4" />
              新增
            </n-button>
          </div>
        </div>
      </n-card>

      <n-card content-style="padding: 0;">
        <n-flex vertical>
          <n-data-table
            :columns="columns"
            :data="data"
            :style="{minHeight: `500px`,  height: `calc(100vh - ${height}px)` }"
            flex-height
          />
          <n-flex justify="end" class="pt-4 pr-16 pb-16">
            <n-pagination
              v-model:page="pagination.page"
              :page-count="pagination.pageCount"
              :on-update:page="pagination.onChange"
              :page-size="pagination.pageSize"
              :page-sizes="[10,20,30,50]"
              size="medium"
              show-quick-jumper
              show-size-picker
            />
          </n-flex>
        </n-flex>
      </n-card>
    </n-flex>

    <MeModal ref="$modal1" :width="`800px`">
      <n-form label-placement="left" label-width="80px">
        <n-form-item label="名称">
          <n-input v-model:value="model_file.name" placeholder="一个名称，如果和原有同名则进行合并"></n-input>
        </n-form-item>
        <n-form-item label="版本号">
          <n-input-number v-model:value="model_file.version" placeholder="版本号，如果不填，则根据历史版本进行递增"  class="width-full" clearable />
        </n-form-item>
        <n-form-item label="描述">
          <n-input v-model:value="model_file.description" placeholder="请输入模型相关的描述"></n-input>
        </n-form-item>
        <n-upload
          multiple
          directory-dnd
          action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
          :max="5"
        >
          <n-upload-dragger>
            <div style="margin-bottom: 12px">
              <n-icon size="48" :depth="3">
                <i class="i-fe:upload" />
              </n-icon>
            </div>
            <n-text style="font-size: 16px">
              点击或者拖动模型文件文件到该区域来上传
            </n-text>
            <n-p depth="3" style="margin: 8px 0 0 0">
              请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
            </n-p>
          </n-upload-dragger>
        </n-upload>
      </n-form>
    </MeModal>
  </AppPage>
</template>

<script setup>
import { MeCrud, MeModal, MeQueryItem } from '@/components'
import { sleep } from '@/utils'
import { useModal } from '@/composables'
import { AppPage, CommonBlockPage } from '@/components/index.js'
import { onMounted, reactive, ref, h } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'


const height = ref(220)

const model_file = ref({
  id: null,
  name: '',
  type: 'PMML',
  version: null,
  description: '',
})

const pagination = reactive({
  page: 3,
  pageCount: 20,
  pageSize: 50,
  onChange: (page) => {
    pagination.page = page
  },
  onUpdatePageSize: (pageSize) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  }
})

const data = ref(
  [
    {
      id: 1,
      name: 'AdultIncome',
      type: 'PMML',
      latestVersion: '2024-02-09',
      createUser: '张瑀楠',
      lastModifyUser: '张瑀楠',
      description: '成年人收入',
      createTime: '2024-02-09 12:12:12',
      updateTime: '2024-02-09 12:12:12'
    },
    {
      id: 2,
      name: 'CreditCardFraud',
      type: 'PMML',
      latestVersion: '2024-02-09',
      createUser: '张瑀楠',
      lastModifyUser: '张瑀楠',
      description: '德国信用卡欺诈',
      createTime: '2024-02-09 12:12:12',
      updateTime: '2024-02-09 12:12:12'
    },
    {
      id: 3,
      name: 'Wine',
      type: 'PMML',
      latestVersion: '2024-02-09',
      createUser: '张瑀楠',
      lastModifyUser: '张瑀楠',
      description: '葡萄酒',
      createTime: '2024-02-09 12:12:12',
      updateTime: '2024-02-09 12:12:12'
    }
  ]
)


const columns = ref([
  {
    title: 'ID',
    key: 'id',
    width: 80
  },
  {
    title: '名称',
    key: 'name',
    width: 200,
    fixed: 'left'
  },
  {
    title: '最新版本',
    key: 'latestVersion',
    width: 150
  },
  {
    title: '描述',
    key: 'description'
  },
  {
    title: '创建人',
    key: 'createUser',
    width: 150
  },
  {
    title: '最后修改人',
    key: 'lastModifyUser',
    width: 150
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 200
  },
  {
    title: '更新时间',
    key: 'updateTime',
    width: 200
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    render(row) {
      return [h(
        NButton,
        {
          size: 'small',
          onClick: () => openModal(row)
        },
        { default: () => '历史记录' }
      )]
    }
  }
])


const [$modal1, okLoading1] = useModal()


function openModal(title) {
  $modal1.value?.open({
    title: title,
    width: '600px',
    okText: '确认',
    cancelText: '关闭',
    async onOk() {
      // 校验逻辑
      if (!!!model_file.value.name) {
        $message.warning('名称不能为空')
        return false
      }
      if (!!!model_file.value.description) {
        $message.warning('描述不能为空')
        return false
      }

      $message.warning('请输入内容')
      okLoading1.value = true
      $message.loading('正在提交...', { key: 'modal1' })
      await sleep(1000)
      okLoading1.value = false
      $message.success('提交成功', { key: 'modal1' })
      return true // 默认关闭弹窗，返回false可让弹窗不关闭
    }
  })
}
</script>
