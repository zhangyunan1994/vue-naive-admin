<template>
  <CommonBlockPage>
    <n-flex vertical>
      <n-row :gutter="10">
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
      <n-form
        inline
        label-placement="left"
        :label-width="80"
      >
        <n-form-item label="名称" path="user.name">
          <n-input v-model:value="formValue.name" placeholder="Input Name" />
        </n-form-item>
        <n-form-item label="类别" path="user.age">
          <n-select v-model:value="formValue.type" :options="options" placeholder="Input Age" style="width: 150px;"/>
        </n-form-item>
        <n-form-item>
          <n-button>
            查询
          </n-button>

          <n-button>
            重置
          </n-button>
        </n-form-item>
      </n-form>
      <n-data-table
        :columns="columns"
        :data="data"
        :scroll-x="1800"
        :style="{ height: `${height}px` }"
        flex-height
      />
      <n-pagination
        v-model:page="pagination.page"
        :page-count="pagination.pageCount"
        :on-update:page="pagination.onChange"
        size="medium"
        show-quick-jumper
        show-size-picker
      />
    </n-flex>
    <MeModal ref="$modal1">
      <el-form label-position="right" label-width="150px" size="small" :model="datasourceConfig">
        <el-form-item label="名称">
          <el-input size="small" v-model="datasourceConfig.name" placeholder="一个名称，全局唯一，最好是英文"></el-input>
        </el-form-item>
        <el-form-item label="启用状态">
          <el-switch size="small" v-model="datasourceConfig.activeStatusBool" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="描述">
          <el-input size="small" v-model="datasourceConfig.description"></el-input>
        </el-form-item>

        <div v-show="datasourceConfig.type === 1">
          <el-form-item label="最大空闲连接">
            <el-input-number size="small" :min="0" :max="65535" v-model="httpExpansionConfig.maximumPoolSize"
                             placeholder="最大空闲连接，建议在 1 - 100 "></el-input-number>
          </el-form-item>
          <el-form-item label="连接最大存活时间">
            <el-input-number size="small" :min="0" :max="100000" v-model="httpExpansionConfig.keepAliveDuration"
                             placeholder="连接最大存活时间，单位秒"></el-input-number>
          </el-form-item>
        </div>

        <div v-show="datasourceConfig.type === 2">
          <el-form-item label="host">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-input size="small" v-model="mysqlExpansionConfig.host" placeholder="MySQL host"></el-input>
              </el-col>
              <el-col :span="12">
                <el-input-number size="small" :min="0" :max="65535" v-model="mysqlExpansionConfig.port"
                                 placeholder="MySQL 端口号"></el-input-number>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="database">
            <el-input size="small" v-model="mysqlExpansionConfig.database" placeholder="MySQL database"></el-input>
          </el-form-item>
          <el-form-item label="username">
            <el-input size="small" v-model="mysqlExpansionConfig.username" placeholder="MySQL username"></el-input>
          </el-form-item>
          <el-form-item label="password">
            <el-input size="small" v-model="mysqlExpansionConfig.password" placeholder="MySQL password"></el-input>
          </el-form-item>
          <el-form-item label="minimumIdle">
            <el-input-number size="small" :min="1" :max="100" v-model="mysqlExpansionConfig.minimumIdle"
                             placeholder="最小空闲连接，建议在 1 - 100 "></el-input-number>
          </el-form-item>
          <el-form-item label="maximumPoolSize">
            <el-input-number size="small" :min="1" :max="100" v-model="mysqlExpansionConfig.maximumPoolSize"
                             placeholder="最大空闲连接，建议在 1 - 100 "></el-input-number>
          </el-form-item>
        </div>

        <div v-show="datasourceConfig.type === 3">
          <el-form-item label="host">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-input size="small" v-model="redisExpansionConfig.host" placeholder="Redis host"></el-input>
              </el-col>
              <el-col :span="12">
                <el-input-number :min="0" :max="65535" v-model="redisExpansionConfig.port"
                                 placeholder="Redis 端口号"></el-input-number>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="database">
            <el-input-number :min="0" :max="65535" v-model="redisExpansionConfig.database"
                             placeholder="Redis database"></el-input-number>
          </el-form-item>
          <el-form-item label="password">
            <el-input v-model="redisExpansionConfig.password" placeholder="Redis password"></el-input>
          </el-form-item>
          <el-form-item label="timeout">
            <el-input-number v-model="redisExpansionConfig.timeout" placeholder="Redis 读写超时时间"></el-input-number>
          </el-form-item>

          <el-form-item label="minIdle">
            <el-input-number v-model="redisExpansionConfig.minIdle" placeholder="最小空闲连接数量，正整数"></el-input-number>
          </el-form-item>
          <el-form-item label="maxIdle">
            <el-input-number v-model="redisExpansionConfig.maxIdle"
                             placeholder="最大空闲连接数量，正整数，大于等于 minIdle"></el-input-number>
          </el-form-item>
          <el-form-item label="maxActive">
            <el-input-number v-model="redisExpansionConfig.maxActive"
                             placeholder="最大连接数量，正整数，大于等于 maxIdle"></el-input-number>
          </el-form-item>
          <el-form-item label="maxWait">
            <el-input-number v-model="redisExpansionConfig.maxWait" placeholder="获取连接的最大等待时间，正整数"></el-input-number>
          </el-form-item>
        </div>

        <div v-show="datasourceConfig.type === 4">
          <el-form-item label="host">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-input v-model="mongoDBExpansionConfig.host" placeholder="MongoDB host"></el-input>
              </el-col>
              <el-col :span="12">
                <el-input-number :min="0" :max="65535" v-model="mongoDBExpansionConfig.port"
                                 placeholder="MongoDB 端口号"></el-input-number>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="database">
            <el-input v-model="mongoDBExpansionConfig.database" placeholder="MongoDB database"></el-input>
          </el-form-item>
          <el-form-item label="username">
            <el-input v-model="mongoDBExpansionConfig.username" placeholder="MongoDB username"></el-input>
          </el-form-item>
          <el-form-item label="password">
            <el-input v-model="mongoDBExpansionConfig.password" placeholder="MongoDB password"></el-input>
          </el-form-item>
          <el-form-item label="minSize">
            <el-input-number :min="1" :max="100" v-model="mongoDBExpansionConfig.minSize"
                             placeholder="最小空闲连接，建议在 1 - 100 "></el-input-number>
          </el-form-item>
          <el-form-item label="maxSize">
            <el-input-number :min="1" :max="100" v-model="mongoDBExpansionConfig.maxSize"
                             placeholder="最大空闲连接，建议在 1 - 100"></el-input-number>
          </el-form-item>
          <el-form-item label="timeout(毫秒)">
            <el-input-number :min="-1" v-model="mongoDBExpansionConfig.maxWaitTimeMS"
                             placeholder="MongoDB 获取连接时最大的等待时间（毫秒）"></el-input-number>
          </el-form-item>
        </div>


      </el-form>
    </MeModal>
  </CommonBlockPage>
</template>

<script setup>
import { MeModal } from '@/components'
import { sleep } from '@/utils'
import { useModal } from '@/composables'
import { CommonBlockPage } from '@/components/index.js'
import { onMounted, reactive, ref, h } from 'vue'
import { NTag, NButton, useMessage } from "naive-ui";


const height = ref(500)

const options = [
  {
    label: "HTTP",
    value: 1,
  },
  {
    label: 'MySQL',
    value: 2
  }]

const formValue =  ref({
    name: 'name',
    type: 1
})

const pagination = reactive({
  page: 3,
  pageCount: 20,
  pageSize: 10,
  showSizePicker: true,
  showQuickJumper: true,
  pageSizes: [10, 20, 50],
  onChange: (page) => {
    pagination.page = page
  },
  onUpdatePageSize: (pageSize) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  }
})

const data = ref([{
  id: 1,
  name: "sherry",
  type: "HTTP",
  status: 1,
  createTime: '2024-02-09 12:12:12',
  updateTime: '2024-02-09 12:12:12',
}, {
  id: 2,
  name: "sherry1",
  type: "MongoDB",
  status: 1,
  createTime: '2024-02-09 12:12:12',
  updateTime: '2024-02-09 12:12:12',
}, {
  id: 3,
  name: "sherry2",
  type: "Redis",
  status: 1,
  createTime: '2024-02-09 12:12:12',
  updateTime: '2024-02-09 12:12:12',
}])



const columns = ref([
  {
    title: 'Id',
    key: 'id',
    width: 50,
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
    width: 100,
  },
  {
    title: '状态',
    key: 'status',
  },
  {
    title: '创建时间',
    key: 'createTime',
  },
  {
    title: '更新时间',
    key: 'updateTime',
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    render (row) {
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
    },
  })
}

function showHttpDialog() {
  openModal("HTTP")
}
function showMySQLDialog() {
  openModal("MySQL")

}
function showRedisDialog() {
  openModal("Redis")

}
function showMongoDBDialog() {
  openModal("MongoDB")
}
</script>
