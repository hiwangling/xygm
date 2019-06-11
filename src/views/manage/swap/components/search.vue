<template>
  <el-dialog id="search" class="dialog" :title="dialogStatus" :visible.sync="dialogFormVisible" top="5vh" append-to-body>
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable class="filter-item" placeholder="请输入墓穴名称" style="width: 200px;" />
      <el-select v-model="listQuery.y_id" placeholder="选择墓园" clearable class="filter-item" @change="getarea()">
        <el-option v-for="item in cemetery.g" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.q_id" placeholder="选择墓区" clearable class="filter-item">
        <el-option v-for="item in cemetery.a" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.type_id" placeholder="选择类型" clearable class="filter-item">
        <el-option v-for="item in cemetery.t" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.style_id" placeholder="选择样式" clearable class="filter-item">
        <el-option v-for="item in cemetery.s" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" :default-sort="{prop: 'sort',order:'ascending'}" element-loading-text="正在查询中。。。" border fit highlight-current-row @current-change="handleCurrentChange">
      <el-table-column align="center" label="墓号" prop="vno" width="50" />
      <el-table-column align="center" label="名称" prop="cname" />
      <el-table-column align="center" label="墓园" prop="y_name" />
      <el-table-column align="center" label="墓区" prop="cemetery_classify.type_name" />
      <el-table-column align="center" label="类型" prop="cemetery_type.type_name" />
      <el-table-column align="center" label="样式" prop="cemetery_style.type_name" />
      <el-table-column align="center" label="价格" prop="sellprice" />
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </el-dialog>
</template>
<script>
import { vuexData } from '@/utils/mixin'
import Pagination from '@/components/Pagination'
import { listGrave } from '@/api/grave'
import { get_gardens, get_areas, get_styles, get_types, get_status } from '@/api/cemetery'
export default {
  components: { Pagination },
  mixins: [vuexData],
  data() {
    return {
      list: null,
      total: 0,
      dialogStatus: '',
      garen_id: '',
      listLoading: true,
      dialogFormVisible: false,
      cemetery: {
        g: null,
        a: null,
        s: null,
        t: null
      },
      listQuery: {
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc',
        keyword: undefined,
        y_id: '',
        q_id: '',
        type_id: '',
        style_id: '',
        usestatus: 1
      }
    }
  },
  created() {
    this.getList()
    get_gardens()
      .then(res => {
        this.cemetery.g = res.data
      })
    get_status()
      .then(res => {
        this.cemetery.u = res.data
      })
    get_styles()
      .then(res => {
        this.cemetery.s = res.data
      })
    get_types()
      .then(res => {
        this.cemetery.t = res.data
      })
  },
  methods: {
    getList() {
      this.listLoading = true
      listGrave(this.listQuery)
        .then(res => {
          this.list = res.data.data
          this.garen_id = res.data.data.y_id
          this.total = res.data.total || 0
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getarea() {
      const data = {
        pid: this.garen_id || this.listQuery.y_id
      }
      this.listQuery.q_id = ''
      get_areas(data)
        .then(res => {
          this.cemetery.a = res.data
        })
    },
    show() {
      this.dialogStatus = '墓穴查询'
      this.dialogFormVisible = true
    },
    handleCurrentChange(val) {
      this.dialogFormVisible = false
      this.$emit('getname', val)
    }
  }
}
</script>
<style scope>
#search .el-input--medium .el-input__inner{
   width:auto
}
</style>

