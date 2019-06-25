<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable class="filter-item" style="width: 150px;" placeholder="请输入墓穴名称" />
      <el-button v-permission="['GET /api/v1/cemetery/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <!-- <el-button v-permission="['POST /api/v1/cemetery/add']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button> -->
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>
    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="墓穴号" prop="mxh" />
      <el-table-column align="center" label="区号" prop="qh" />
      <el-table-column align="center" label="排号" prop="ph" />
      <el-table-column align="center" label="编号" prop="bh" />
      <el-table-column align="center" label="墓主" prop="name" />
      <el-table-column align="center" label="墓类" prop="ml" />
      <el-table-column align="center" label="收费标准" prop="sfbz" />
      <el-table-column align="center" label="安葬时间" prop="azsj" />
      <el-table-column align="center" label="联系人" prop="lxr" />
      <el-table-column align="center" label="单位地址" prop="dwdz" />
      <el-table-column align="center" label="电话" prop="phone" />
      <el-table-column align="center" label="备注" prop="bz" />

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>
<script>
import { get_olddata } from '@/api/stats'
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
      get_olddata()
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
