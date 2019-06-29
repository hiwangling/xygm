<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable class="filter-item" style="width: 150px;" placeholder="请输入墓穴名称" />
      <el-select v-model="listQuery.y_id" placeholder="选择墓园" clearable style="width: 120px" class="filter-item" @change="getarea()">
        <el-option v-for="item in cemetery.g" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.q_id" placeholder="选择墓区" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in area" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-date-picker
        v-model="listQuery.lamp_nd"
        style="width: 120px"
        class="filter-item"
        type="year"
        value-format="yyyy"
        placeholder="点灯时间"
      />
      <el-select v-model="listQuery.pay_type" placeholder="支付类型" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in pay_type" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.isvoice" placeholder="是否开票" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in isvoice" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button v-permission="['GET /api/v1/stat/buy_lightup_list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <!-- <el-button v-permission="['POST /api/v1/cemetery/add']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button> -->
      <el-button v-permission="['GET /api/v1/stat/export_lightup_stat']" :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>
    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <!-- <el-table-column align="center" label="订单号" prop="order_no" /> -->
      <el-table-column align="center" label="墓穴位置" prop="seatname" />
      <el-table-column align="center" label="使用人" prop="buryname" />
      <el-table-column align="center" label="购买人" prop="payer_name" />
      <el-table-column align="center" label="电话" prop="pay_phone" />
      <el-table-column align="center" label="实收价格" prop="real_price" />
      <el-table-column align="center" label="点灯时间" prop="lamp_nd" />
      <el-table-column align="center" label="支付方式" prop="pay_type" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.pay_type | or_status">
            {{ scope.row.pay_type == 0 ? '线下支付' : '微信支付' }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="支付方式" prop="isvoice" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isvoice | or_status">
            {{ scope.row.isvoice == 0 ? '未开票' : '已开票' }}
          </el-tag>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isvoice == 0" type="danger" size="mini" @click="createIsvoice(scope.row)">开票</el-button>
          <el-button v-else type="primary" size="mini" plain>已开票</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>
<script>
import { buy_lightup_list, export_lightup_stat } from '@/api/stats'
// import { get_name } from '@/api/cemetery'
import { get_areas } from '@/api/cemetery'
import Pagination from '@/components/Pagination'
import { page, vuexData } from '@/utils/mixin'

export default {
  name: 'VueSaveList',
  components: { Pagination },
  mixins: [page, vuexData],
  data() {
    return {
      list: null,
      export_list: null,
      total: 0,
      listLoading: true,
      area: null,
      garen_id: '',
      downloadLoading: false,
      pay_type: [{
        id: 0,
        name: '线下支付'
      }, {
        id: 1,
        name: '微信支付'
      }],
      isvoice: [{
        id: 0,
        name: '未开票'
      }, {
        id: 1,
        name: '已开票'
      }],
      listQuery: {
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc',
        keyword: undefined,
        y_id: '',
        q_id: '',
        lamp_nd: '',
        pay_type: '',
        isvoice: ''
      }
    }
  },
  computed: {

  },
  created() {
    this.getList()
    this.inquery()
  },
  methods: {
    getList() {
      this.listLoading = true
      buy_lightup_list(this.listQuery)
        .then(res => {
          this.list = res.data.data
          this.total = res.data.total || 0
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    getarea() {
      const data = {
        pid: this.listQuery.y_id
      }
      this.listQuery.q_id = ''
      // this.dataForm.classify_id = ''
      get_areas(data)
        .then(res => {
          this.area = res.data
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      export_lightup_stat(this.listQuery)
        .then(res => {
          this.export_list = res.data
      import('@/vendor/Export2Excel').then(excel => {
        const filterVal = ['order_no', 'seatname', 'stylename', 'typename', 'buryname', 'buyer_name', 'phone', 'order_begin', 'sum_price']
        const tHeader = ['订单号', '墓穴位置', '单合墓', '样式', '使用人姓名', '购买人姓名', '电话', '购墓时间', '实收价格']
        const data = this.formatJson(filterVal, this.export_list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '点灯列表'
        })
        this.downloadLoading = false
      })
        })
    },
    formatJson(filterVal, jsonData) {
      console.log(jsonData)
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>
