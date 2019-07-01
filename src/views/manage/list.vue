<template>
  <div class="app-container">
    <div v-show="!filter" class="filter-container">
      <el-input v-model="listQuery.keyword" clearable class="filter-item" style="width: 200px;" placeholder="请输入墓名或者墓号" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilters">查找</el-button>
    </div>
    <div v-show="!filter" class="manage-tag">
      <el-tag v-for="(value,item,idx) in num" :key="idx" :class="item | getNum" style="margin-left:5px" @click="handleFilterTag(item)">{{ item | getNumtxt }}({{ value }})</el-tag>
    </div>
    <el-row :gutter="20">
      <el-col v-for="(item,value) in list" :key="value" :span="2" :class="item.usestatus | getlist">
        <div style="height:100%;" @click="CreateCemetery(item)">
          <p>{{ item.cname }}</p>
          <p>{{ item.muzhu_name }}</p>
          <p>({{ item.type_id == 1 ? '单墓' : '合墓' }})</p>
        </div>
      </el-col>
    </el-row>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog id="cemetery" :title="dialogStatus" :visible.sync="dialogFormVisible" top="5vh" @open="activeName = 'sell'">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item,index) in tab" :key="index" :label="item.label" :name="item.name"><component :is="item.name" @v="v" /></el-tab-pane>
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
import Reserve from './reserve/reserve'
// import monument from './monumen/monumen'
import lamp from './lamp/lamp'
import swap from './swap/swap'
import move from './move/move'
export default {
  name: 'List',
  components: { Pagination, Service, Sell, Reserve, lamp, swap, move },
  mixins: [vuexData],
  data() {
    return {
      list: null,
      num: null,
      total: 0,
      cid: '',
      filter: false,
      activeName: 'sell',
      listLoading: true,
      listQuery: {
        q_id: this.$route.params.id,
        page: 1,
        limit: 40,
        usestatus: '',
        keyword: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      tab: [
        { label: '预定', name: 'reserve' },
        { label: '购墓', name: 'sell' },
        { label: '服务', name: 'service' },
        // { label: '碑文', name: 'monument' },
        { label: '点灯', name: 'lamp' },
        { label: '换墓', name: 'swap' },
        { label: '退迁', name: 'move' }
      ],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      }
    }
  },
  created() {
    this.v()
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
          this.addCname(res.data.name)
        })
      this.dialogFormVisible = true
    },
    handleClick(tab) {
      this.changeOrders(tab.index)
    },
    handleFilters(filter) {
      this.listQuery.page = 1
      if (filter.flag) {
        this.listQuery.q_id = filter.q_id
        this.listQuery.keyword = filter.keyword
        this.filter = filter.flag
      } else {
        this.listQuery.usestatus = ''
        this.listQuery.q_id = this.$route.params.id
      }
      this.getList()
    },
    handleFilterTag(item) {
      this.listQuery.usestatus = item
      this.getList()
    },
    v() {
      this.getList()
      this.CemeteryStatus()
    }
  }
}
</script>
<style>
#cemetery .el-dialog{
  width: 900px;
}
.manage-tag span{
  cursor:pointer
}
</style>

