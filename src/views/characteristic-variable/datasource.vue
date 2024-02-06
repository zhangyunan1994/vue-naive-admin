<template>
  <AppPage>
    <n-flex vertical>
      <n-row :gutter="10">
        <n-col :span="4">
          <div class="metric http bg-white dark:bg-black" @click="showHttpDialog">
            <p>
              <span class="number">HTTP</span>
              <span class="title">&nbsp;</span>
            </p>
          </div>
        </n-col>
        <n-col :span="4">
          <div class="metric mysql" @click="showMySQLDialog">
            <p>
              <span class="number">&nbsp;</span>
              <span class="title">&nbsp;</span>
            </p>
          </div>
        </n-col>
        <n-col :span="4">
          <div class="metric clickhouse" @click="showMySQLDialog">
            <p>
              <span class="number">&nbsp;</span>
              <span class="title">&nbsp;</span>
            </p>
          </div>
        </n-col>
        <n-col :span="4">
          <div class="metric elasticsearch" @click="showMySQLDialog">
            <p>
              <span class="number">&nbsp;</span>
              <span class="title">&nbsp;</span>
            </p>
          </div>
        </n-col>
        <n-col :span="4">
          <div class="metric redis" @click="showRedisDialog">
            <p>
              <span class="number">&nbsp;</span>
              <span class="title">&nbsp;</span>
            </p>
          </div>
        </n-col>
        <n-col :span="4">
          <div class="metric mongodb" @click="showMongoDBDialog">
            <p>
              <span class="number">&nbsp;</span>
              <span class="title">&nbsp;</span>
            </p>
          </div>
        </n-col>
      </n-row>
      <n-card content-style="padding: 0;">
        <form class="flex justify-between p-16">
          <n-space wrap :size="[32, 16]">
            <MeQueryItem label="类型" :labn-width="50">
              <n-select v-model:value="formValue.type" :options="options" clearable />
            </MeQueryItem>
            <MeQueryItem label="名称" :labn-width="50">
              <n-input
                v-model:value="formValue.name"
                type="text"
                placeholder="请输入"
                clearable
              />
            </MeQueryItem>
          </n-space>
          <div class="flex-shrink-0">
            <n-button ghost type="primary">
              <i class="i-fe:rotate-ccw mr-4" />
              重置
            </n-button>
            <n-button attr-type="submit" class="ml-20" type="primary">
              <i class="i-fe:search mr-4" />
              搜索
            </n-button>
          </div>
        </form>
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

    <MeModal ref="$modal1">
      <n-form label-placement="left" label-width="150px" :size="`small`">
        <n-form-item label="名称">
          <n-input v-model="datasourceConfig.name" placeholder="一个名称，全局唯一，最好是英文"></n-input>
        </n-form-item>
        <n-form-item label="启用状态">
          <n-switch v-model="datasourceConfig.activeStatusBool" active-color="#13ce66"
                    inactive-color="#ff4949">
          </n-switch>
        </n-form-item>
        <n-form-item label="描述">
          <n-input v-model="datasourceConfig.description"></n-input>
        </n-form-item>

        <div v-show="datasourceConfig.type === 1">
          <n-form-item label="最大空闲连接">
            <n-input-number :min="0" :max="65535" v-model:value="httpExpansionConfig.maximumPoolSize"
                            placeholder="最大空闲连接，建议在 1 - 100 "></n-input-number>
          </n-form-item>
          <n-form-item label="连接最大存活时间">
            <n-input-number :min="0" :max="100000" v-model:value="httpExpansionConfig.keepAliveDuration"
                            placeholder="连接最大存活时间，单位秒"></n-input-number>
          </n-form-item>
        </div>

        <div v-show="datasourceConfig.type === 2">
          <n-form-item label="host">
            <n-row :gutter="20">
              <n-col :span="12">
                <n-input v-model:value="mysqlExpansionConfig.host" placeholder="MySQL host"></n-input>
              </n-col>
              <n-col :span="12">
                <n-input-number :min="0" :max="65535" v-model:value="mysqlExpansionConfig.port"
                                placeholder="MySQL 端口号"></n-input-number>
              </n-col>
            </n-row>
          </n-form-item>
          <n-form-item label="database">
            <n-input v-model:value="mysqlExpansionConfig.database" placeholder="MySQL database"></n-input>
          </n-form-item>
          <n-form-item label="username">
            <n-input v-model:value="mysqlExpansionConfig.username" placeholder="MySQL username"></n-input>
          </n-form-item>
          <n-form-item label="password">
            <n-input v-model:value="mysqlExpansionConfig.password" placeholder="MySQL password"></n-input>
          </n-form-item>
          <n-form-item label="minimumIdle">
            <n-input-number :min="1" :max="100" v-model:value="mysqlExpansionConfig.minimumIdle"
                            placeholder="最小空闲连接，建议在 1 - 100 "></n-input-number>
          </n-form-item>
          <n-form-item label="maximumPoolSize">
            <n-input-number :min="1" :max="100" v-model:value="mysqlExpansionConfig.maximumPoolSize"
                            placeholder="最大空闲连接，建议在 1 - 100 "></n-input-number>
          </n-form-item>
        </div>

        <div v-show="datasourceConfig.type === 3">
          <n-form-item label="host">
            <n-row :gutter="20">
              <n-col :span="12">
                <n-input v-model="redisExpansionConfig.host" placeholder="Redis host"></n-input>
              </n-col>
              <n-col :span="12">
                <n-input-number :min="0" :max="65535" v-model="redisExpansionConfig.port"
                                placeholder="Redis 端口号"></n-input-number>
              </n-col>
            </n-row>
          </n-form-item>
          <n-form-item label="database">
            <n-input-number :min="0" :max="65535" v-model="redisExpansionConfig.database"
                            placeholder="Redis database"></n-input-number>
          </n-form-item>
          <n-form-item label="password">
            <n-input v-model="redisExpansionConfig.password" placeholder="Redis password"></n-input>
          </n-form-item>
          <n-form-item label="timeout">
            <n-input-number v-model="redisExpansionConfig.timeout" placeholder="Redis 读写超时时间"></n-input-number>
          </n-form-item>

          <n-form-item label="minIdle">
            <n-input-number v-model="redisExpansionConfig.minIdle"
                            placeholder="最小空闲连接数量，正整数"></n-input-number>
          </n-form-item>
          <n-form-item label="maxIdle">
            <n-input-number v-model="redisExpansionConfig.maxIdle"
                            placeholder="最大空闲连接数量，正整数，大于等于 minIdle"></n-input-number>
          </n-form-item>
          <n-form-item label="maxActive">
            <n-input-number v-model="redisExpansionConfig.maxActive"
                            placeholder="最大连接数量，正整数，大于等于 maxIdle"></n-input-number>
          </n-form-item>
          <n-form-item label="maxWait">
            <n-input-number v-model="redisExpansionConfig.maxWait"
                            placeholder="获取连接的最大等待时间，正整数"></n-input-number>
          </n-form-item>
        </div>

        <div v-show="datasourceConfig.type === 6">
          <n-form-item label="host">
            <n-row :gutter="20">
              <n-col :span="12">
                <n-input v-model="mongoDBExpansionConfig.host" placeholder="MongoDB host"></n-input>
              </n-col>
              <n-col :span="12">
                <n-input-number :min="0" :max="65535" v-model="mongoDBExpansionConfig.port"
                                placeholder="MongoDB 端口号"></n-input-number>
              </n-col>
            </n-row>
          </n-form-item>
          <n-form-item label="database">
            <n-input v-model="mongoDBExpansionConfig.database" placeholder="MongoDB database"></n-input>
          </n-form-item>
          <n-form-item label="username">
            <n-input v-model="mongoDBExpansionConfig.username" placeholder="MongoDB username"></n-input>
          </n-form-item>
          <n-form-item label="password">
            <n-input v-model="mongoDBExpansionConfig.password" placeholder="MongoDB password"></n-input>
          </n-form-item>
          <n-form-item label="minSize">
            <n-input-number :min="1" :max="100" v-model="mongoDBExpansionConfig.minSize"
                            placeholder="最小空闲连接，建议在 1 - 100 "></n-input-number>
          </n-form-item>
          <n-form-item label="maxSize">
            <n-input-number :min="1" :max="100" v-model="mongoDBExpansionConfig.maxSize"
                            placeholder="最大空闲连接，建议在 1 - 100"></n-input-number>
          </n-form-item>
          <n-form-item label="timeout(毫秒)">
            <n-input-number :min="-1" v-model="mongoDBExpansionConfig.maxWaitTimeMS"
                            placeholder="MongoDB 获取连接时最大的等待时间（毫秒）"></n-input-number>
          </n-form-item>
        </div>


      </n-form>
    </MeModal>
  </AppPage>
</template>

<script setup>
import { MeCrud, MeModal, MeQueryItem } from '@/components'
import { sleep } from '@/utils'
import { useModal } from '@/composables'
import { CommonBlockPage } from '@/components/index.js'
import { onMounted, reactive, ref, h } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'
import api from '@/views/pms/user/api.js'


const height = ref(320)

const datasourceConfig = ref({
  name: '',
  type: 1,
  expansionConfig: '',
  activeStatusBool: true,
  description: ''
})

const httpExpansionConfig = ref({
  maximumPoolSize: 5,
  keepAliveDuration: 300
})
const mysqlExpansionConfig = ref({
  host: '',
  port: 3306,
  database: '',
  username: '',
  password: '',
  minimumIdle: 5,
  maximumPoolSize: 5
})
const redisExpansionConfig = ref({
  host: '',
  port: 3306,
  database: 0,
  password: '',
  timeout: 2500,
  minIdle: 0,
  maxIdle: 8,
  maxActive: 8,
  maxWait: 300
})
const mongoDBExpansionConfig = ref({
  host: '',
  port: 27017,
  database: '',
  username: '',
  password: '',
  minSize: 0,
  maxSize: 100,
  maxWaitTimeMS: 120000
})

const options = [
  {
    label: 'HTTP',
    value: 1
  },
  {
    label: 'MySQL',
    value: 2
  },
  {
    label: 'ClickHouse',
    value: 3
  },
  {
    label: 'ElasticSearch',
    value: 4
  },
  {
    label: 'Redis',
    value: 5
  },
  {
    label: 'MongoDB',
    value: 6
  }
]

const formValue = ref({
  name: '',
  type: null
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
      name: 'sherry',
      type: 'HTTP',
      status: 1,
      createTime: '2024-02-09 12:12:12',
      updateTime: '2024-02-09 12:12:12'
    }, {
    id: 2,
    name: 'sherry1',
    type: 'MongoDB',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 3,
    name: 'sherry2',
    type: 'Redis',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 1,
    name: 'sherry',
    type: 'HTTP',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 2,
    name: 'sherry1',
    type: 'MongoDB',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 3,
    name: 'sherry2',
    type: 'Redis',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 1,
    name: 'sherry',
    type: 'HTTP',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 2,
    name: 'sherry1',
    type: 'MongoDB',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 3,
    name: 'sherry2',
    type: 'Redis',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 1,
    name: 'sherry',
    type: 'HTTP',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 2,
    name: 'sherry1',
    type: 'MongoDB',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 3,
    name: 'sherry2',
    type: 'Redis',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 1,
    name: 'sherry',
    type: 'HTTP',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 2,
    name: 'sherry1',
    type: 'MongoDB',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 3,
    name: 'sherry2',
    type: 'Redis',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 1,
    name: 'sherry',
    type: 'HTTP',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 2,
    name: 'sherry1',
    type: 'MongoDB',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 3,
    name: 'sherry2',
    type: 'Redis',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 1,
    name: 'sherry',
    type: 'HTTP',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 2,
    name: 'sherry1',
    type: 'MongoDB',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 3,
    name: 'sherry2',
    type: 'Redis',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 1,
    name: 'sherry',
    type: 'HTTP',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 2,
    name: 'sherry1',
    type: 'MongoDB',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 3,
    name: 'sherry2',
    type: 'Redis',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 1,
    name: 'sherry',
    type: 'HTTP',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 2,
    name: 'sherry1',
    type: 'MongoDB',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }, {
    id: 3,
    name: 'sherry2',
    type: 'Redis',
    status: 1,
    createTime: '2024-02-09 12:12:12',
    updateTime: '2024-02-09 12:12:12'
  }])


const columns = ref([
  {
    title: 'Id',
    key: 'id',
    width: 50
  },
  {
    title: '名称',
    key: 'name',
    width: 200,
    fixed: 'left'
  },
  {
    title: '类型',
    key: 'type',
    width: 100
  },
  {
    title: '状态',
    key: 'status'
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
          onClick: () => sendMail(row)
        },
        { default: () => '编辑' }
      ), h(
        NButton,
        {
          size: 'small',
          onClick: () => sendMail(row)
        },
        { default: () => '删除' }
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

function showHttpDialog() {

  openModal('HTTP')
}

function showMySQLDialog() {
  datasourceConfig.value.type = 2
  openModal('MySQL')

}

function showRedisDialog() {
  openModal('Redis')
}

function showMongoDBDialog() {
  datasourceConfig.value.type = 6
  openModal('MongoDB')
}
</script>
