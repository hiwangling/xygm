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
      <el-select v-model="listQuery.type_id" placeholder="选择类型" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in cemetery.t" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.style_id" placeholder="选择样式" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in cemetery.s" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-date-picker
        v-model="listQuery.begindate"
        class="filter-item"
        type="date"
        style="width: 200px"
        placeholder="开始日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
      />
      <el-date-picker
        v-model="listQuery.enddate"
        type="date"
        style="width: 200px"
        class="filter-item"
        placeholder="结束日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
      />
      <!-- <el-select v-model="listQuery.usestatus" placeholder="选择状态" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(value, item) in cemetery.u" :key="item" :label="value" :value="item" />
      </el-select> -->
      <el-button v-permission="['GET /api/v1/cemetery/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>
    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="墓区" prop="area_name" />
      <el-table-column align="center" label="墓号" prop="cem_name" />
      <el-table-column align="center" label="类型" prop="stylename" width="80" />
      <el-table-column align="center" label="使用人" prop="buryname" />
      <el-table-column align="center" label="性别" prop="sex" />
      <el-table-column align="center" label="购买人" prop="link_name" />
      <el-table-column align="center" label="电话" prop="phone" />
      <el-table-column align="center" label="出生日期" prop="birth" />
      <el-table-column align="center" label="死亡日期" prop="death" />
      <el-table-column align="center" label="安葬日期" prop="bury" />

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>
<script>
import { az_bury_list, export_bury_stat } from '@/api/stats'
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
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        y_id: '',
        q_id: '',
        type_id: '',
        style_id: '',
        begindate: '',
        enddate: '',
        sort: 'add_time',
        order: 'desc'
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
      az_bury_list(this.listQuery)
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
      export_bury_stat(this.listQuery)
        .then(res => {
          this.export_list = res.data
      import('@/vendor/Export2Excel').then(excel => {
        const filterVal = ['order_no', 'seatname', 'stylename', 'typename', 'buryname', 'buyer_name', 'phone', 'order_begin', 'sum_price']
        const tHeader = ['订单号', '墓穴位置', '单合墓', '样式', '使用人姓名', '购买人姓名', '电话', '购墓时间', '实收价格']
        const data = this.formatJson(filterVal, this.export_list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '公墓订单'
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
