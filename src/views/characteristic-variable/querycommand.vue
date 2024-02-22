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
          <div class="metric clickhouse" @click="showClickHouseDialog">
            <p>
              <span class="number">&nbsp;</span>
              <span class="title">&nbsp;</span>
            </p>
          </div>
        </n-col>
        <n-col :span="4">
          <div class="metric elasticsearch" @click="showElasticSearchDialog">
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

    <MeModal ref="$modal1" :width="`1000px`">
      <n-form label-placement="left" label-width="150px" :size="`small`">
        <n-form-item label="名称">
          <n-input v-model="fetcherConfig.name" placeholder="一个名称，全局唯一，最好是英文"></n-input>
        </n-form-item>
        <n-form-item label="启用状态">
          <n-switch v-model="fetcherConfig.activeStatus" active-color="#13ce66" inactive-color="#ff4949"></n-switch>
        </n-form-item>
        <n-form-item label="描述">
          <n-input v-model="fetcherConfig.description"></n-input>
        </n-form-item>
        <n-form-item label="预计执行时间(毫秒)">
          <n-input-number v-model:value="fetcherConfig.estimatedExecutionTime"></n-input-number>
        </n-form-item>

        <n-form-item label="数据源">
          <n-select v-model="fetcherConfig.datasource" placeholder="请选择" style="width: 100%" clearable>
          </n-select>
        </n-form-item>


        <div v-show="fetcherConfig.type === 1">
          <!-- http 操作 -->
          <n-form-item label="url">
            <n-input v-model="httpExpansionConfig.url" placeholder="http url（全路径）"></n-input>
          </n-form-item>
          <n-form-item label="method">
            <n-select v-model="httpExpansionConfig.method" placeholder="请选择" :options="[{label: 'GET', value: 'GET'}, {label: 'POST', value: 'POST'}]" clearable>
            </n-select>
          </n-form-item>
          <n-form-item label="headers">
            <n-row v-for="(header, index) in httpExpansionConfig.headers">
              <n-col class="line" :span="3">key : &nbsp;</n-col>
              <n-col :span="7">
                <n-input placeholder="header key" v-model="header.key" style="width: 100%;"></n-input>
              </n-col>
              <n-col class="line" :span="3">value : &nbsp;</n-col>
              <n-col :span="7">
                <n-input placeholder="header value" v-model="header.value" style="width: 100%;"></n-input>
              </n-col>
              <n-col :span="4">
                &nbsp;
                <n-button tertiary circle>
                  <template #icon>
                    <n-icon><i class="i-fe:plus" /></n-icon>
                  </template>
                </n-button>
                <n-button type="primary" icon="n-icon-plus" circle @click="addHttpHeader(index)"></n-button>
                <n-button type="danger" icon="n-icon-delete" circle @click="removeHttpHeader(index)"></n-button>
              </n-col>
            </n-row>
          </n-form-item>
          <n-form-item label="http auth">
            <n-row>
              <n-col class="line" :span="3">username : &nbsp;</n-col>
              <n-col :span="7">
                <n-input placeholder="username" v-model="httpExpansionConfig.httpAuth.username"
                          style="width: 100%;"></n-input>
              </n-col>
              <n-col class="line" :span="3">password : &nbsp;</n-col>
              <n-col :span="7">
                <n-input placeholder="password" v-model="httpExpansionConfig.httpAuth.password"
                          style="width: 100%;"></n-input>
              </n-col>
            </n-row>
          </n-form-item>
        </div>

        <div v-show="fetcherConfig.type === 2">
          <n-form-item label="table">
            <n-input v-model="mysqlExpansionConfig.table" placeholder="表名"></n-input>
          </n-form-item>
          <n-form-item label="查询字段">
            <table class="mytable">
              <tr>
                <th>#</th>
                <th>映射出变量名</th>
                <th>数据库原始字段名</th>
                <th>操作</th>
              </tr>
              <tr v-for="(item, index) in mysqlExpansionConfig.columnItems">
                <td>{{ index }}</td>
                <td>
                  <n-input placeholder="数据库原始字段名" v-model="item.alias" style="width: 100%;"></n-input>
                </td>
                <td>
                  <n-input placeholder="映射出变量名" v-model="item.column" style="width: 100%;"></n-input>
                </td>
                <td width="100px">
                  <n-flex>
                  <n-button type="primary" circle @click="addMySQLField(index)">
                    <template #icon>
                      <n-icon><i class="i-fe:plus" /></n-icon>
                    </template>
                  </n-button>
                  <n-button type="error" icon="n-icon-delete" circle @click="removeMySQLField(index)">
                    <template #icon>
                      <n-icon><i class="i-fe:x-circle" /></n-icon>
                    </template>
                  </n-button>
                  </n-flex>
                </td>
              </tr>
            </table>
          </n-form-item>
          <n-form-item label="查询表达式">
            <n-input v-model="mysqlExpansionConfig.condition" placeholder="where 条件表达式"></n-input>
          </n-form-item>
          <n-form-item label="查询数量（limit）">
            <n-input-number v-model="mysqlExpansionConfig.limit" :min="-1" :max="65535"
                             label="查询数量"></n-input-number>
          </n-form-item>
        </div>

        <div v-show="fetcherConfig.type === 3">
          <n-form-item label="host">
            <n-row :gutter="20">
              <n-col :span="12">
                <n-input v-model:value="clickhouseExpansionConfig.host" placeholder="host"></n-input>
              </n-col>
              <n-col :span="12">
                <n-input-number :min="0" :max="65535" v-model:value="clickhouseExpansionConfig.port"
                                placeholder="MySQL 端口号"></n-input-number>
              </n-col>
            </n-row>
          </n-form-item>
          <n-form-item label="database">
            <n-input v-model:value="clickhouseExpansionConfig.database" placeholder="database"></n-input>
          </n-form-item>
          <n-form-item label="username">
            <n-input v-model:value="clickhouseExpansionConfig.username" placeholder="username"></n-input>
          </n-form-item>
          <n-form-item label="password">
            <n-input v-model:value="clickhouseExpansionConfig.password" placeholder="password"></n-input>
          </n-form-item>
          <n-form-item label="minimumIdle">
            <n-input-number :min="1" :max="100" v-model:value="clickhouseExpansionConfig.minimumIdle"
                            placeholder="最小空闲连接，建议在 1 - 100 "></n-input-number>
          </n-form-item>
          <n-form-item label="maximumPoolSize">
            <n-input-number :min="1" :max="100" v-model:value="clickhouseExpansionConfig.maximumPoolSize"
                            placeholder="最大空闲连接，建议在 1 - 100 "></n-input-number>
          </n-form-item>
          <n-form-item label="timeout(毫秒)">
            <n-input-number :min="-1" v-model="clickhouseExpansionConfig.maxWaitTimeMS"
                            placeholder="等待时间（毫秒）"></n-input-number>
          </n-form-item>
        </div>

        <div v-show="fetcherConfig.type === 5">
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

        <div v-show="fetcherConfig.type === 6">
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
import { AppPage, CommonBlockPage } from '@/components/index.js'
import { onMounted, reactive, ref, h } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'
import api from '@/views/pms/user/api.js'


const height = ref(320)

const fetcherConfig = ref({
  name: '',
  type: 1,
  expansionConfig: '',
  activeStatus: true,
  description: '',
  datasource: null,
  estimatedExecutionTime: -1
})

const httpExpansionConfig = ref({
  url: "",
  method: "GET",
  headers: [{}],
  params: [{}],
  data: [{}],
  httpAuth: {
    username: "",
    password: ""
  }
})
const mysqlExpansionConfig = ref({
  table: "",
  columnItems: [{}],
  condition: "",
  limit: -1,
})
const clickhouseExpansionConfig = ref({
  host: '',
  port: 8123,
  database: '',
  username: '',
  password: '',
  minimumIdle: 5,
  maximumPoolSize: 5
})
const elasticSearchExpansionConfig = ref({
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
    width: '960px',
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

function addMySQLField(index) {
  mysqlExpansionConfig.value.columnItems.splice(index + 1, 0, {})
}

function removeMySQLField(index) {
  mysqlExpansionConfig.value.columnItems.splice(index, 1)
  if (mysqlExpansionConfig.value.columnItems.length === 0) {
    mysqlExpansionConfig.value.columnItems.push({})
  }
}

function showHttpDialog() {
  fetcherConfig.value.type = 1
  openModal('HTTP')
}

function showMySQLDialog() {
  fetcherConfig.value.type = 2
  openModal('MySQL')
}

function showClickHouseDialog() {
  fetcherConfig.value.type = 3
  openModal('ClickHouse')
}

function showElasticSearchDialog() {
  fetcherConfig.value.type = 4
  openModal('ElasticSearch')
}

function showRedisDialog() {
  fetcherConfig.value.type = 5
  openModal('Redis')
}

function showMongoDBDialog() {
  fetcherConfig.value.type = 6
  openModal('MongoDB')
}
</script>
