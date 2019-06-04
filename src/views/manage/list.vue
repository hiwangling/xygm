<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.type_name" clearable class="filter-item" style="width: 200px;" placeholder="请输入墓名或者墓号" />
      <el-button class="filter-item" type="primary" icon="el-icon-search">查找</el-button>
    </div>
    <div class="manage-tag">
      <el-tag v-for="(value,item,idx) in num" :key="idx" :class="item | getNum" style="margin-left:5px">{{ item | getNumtxt }}({{ value }})</el-tag>
    </div>
    <el-row type="flex" class="row-bg">
      <el-col v-for="(item,value) in list" :key="value" :span="2" :class="item.usestatus | getlist">
        <div style="height:100%;" @click="CreateCemetery(item)">
          <p>墓号：{{ item.vno }}</p>
          <p>墓型：{{ item.cemetery_type.type_name }}</p>
        </div>
      </el-col>
    </el-row>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog id="cemetery" :title="dialogStatus" :visible.sync="dialogFormVisible" top="5vh" @open="activeName = 'reserve'">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="预定" name="reserve"><reserve /></el-tab-pane>
        <el-tab-pane label="购墓" name="sell"><sell /></el-tab-pane>
        <el-tab-pane label="殡葬服务" name="service"><service /></el-tab-pane>
        <el-tab-pane label="寄存" name="save"><save /></el-tab-pane>
        <el-tab-pane label="碑文" name="monument"><monumental /></el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import { listGrave } from '@/api/grave'
import { get_name, get_num } from '@/api/cemetery'
import { vuexData } from '@/utils/mixin'
import Pagination from '@/components/Pagination'
import Service from './service/service'
import Sell from './sell/sell'
import Save from './save/save'
import Reserve from './reserve/reserve'
import monumental from './monumen/monumen'
export default {
  name: 'VueLists',
  components: { Pagination, Service, Sell, Reserve, Save, monumental },
  mixins: [vuexData],
  data() {
    return {
      list: null,
      num: null,
      total: 0,
      cid: '',
      activeName: 'reserve',
      listLoading: true,
      listQuery: {
        q_id: this.$route.params.id,
        page: 1,
        limit: 20,
        keyword: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      }
    }
  },
  created() {
    this.getList()
    this.CemeteryStatus()
  },
  methods: {
    getList() {
      this.listLoading = true
      listGrave(this.listQuery)
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
    CemeteryStatus() {
      const data = { q_id: this.$route.params.id }
      get_num(data)
        .then(res => {
          this.num = res.data
        })
    },
    CreateCemetery(item) {
      this.pay(item.id)
      this.addCemetery(item)
      const data = { cid: item.id }
      get_name(data)
        .then(res => {
          this.dialogStatus = res.data.name
        })
      this.dialogFormVisible = true
    },
    handleClick(tab) {
      this.changeOrders(tab.index)
    }
  }
}
</script>
<style>
#cemetery .el-dialog{
  width: 900px;
}
</style>

