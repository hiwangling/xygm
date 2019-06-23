<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable class="filter-item" style="width: 150px;" placeholder="请输入服务名称" />
      <!-- <el-select v-model="listQuery.y_id" placeholder="选择墓园" clearable style="width: 120px" class="filter-item" @change="getarea()">
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
      /> -->
      <!-- <el-select v-model="listQuery.usestatus" placeholder="选择状态" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(value, item) in cemetery.u" :key="item" :label="value" :value="item" />
      </el-select> -->
      <el-button v-permission="['GET /api/v1/cemetery/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>
    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" label="墓穴位置" prop="seatname" width="200" />
      <el-table-column align="center" label="墓位类型" prop="typename" width="100" />
      <el-table-column align="center" label="墓穴样式" prop="stylename" width="100" />
      <el-table-column align="center" label="使用人姓名" prop="buryname" width="300" />
      <el-table-column align="center" label="服务项目" prop="sell_title" />
      <el-table-column align="center" label="单价" prop="unit_price" width="100" />
      <el-table-column align="center" label="数量" prop="amount" width="80" />
      <el-table-column align="center" label="实收价格" prop="real_price" width="100" />
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>
<script>
import { buy_services_list, export_order_stat } from '@/api/order'
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
      buy_services_list(this.listQuery)
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
      export_order_stat(this.listQuery)
        .then(res => {
          this.export_list = res.data
          console.log(this.export_list)
        })
      // this.downloadLoading = true
      // import('@/vendor/Export2Excel').then(excel => {
      //   const tHeader = ['cname', 'y_name', 'usestatus']
      //   const filterVal = ['cname', 'y_name', 'usestatus']
      //   const data = this.formatJson(filterVal, this.list)
      //   excel.export_json_to_excel({
      //     header: tHeader,
      //     data,
      //     filename: 'table-list'
      //   })
      //   this.downloadLoading = false
      // })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>
