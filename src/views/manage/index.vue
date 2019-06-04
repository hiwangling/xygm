<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.pid" placeholder="选择墓园" clearable style="width: 160px" class="filter-item">
        <el-option v-for="item in gardens" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>
    <el-row :gutter="20" class="area">
      <el-col v-for="(item, index) in list" :key="index" :span="4">
        <router-link :to="'/manage/list/'+item.id" class="">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{ item.type_name }} ({{ item.y_name }})</span>
            </div>
            <div class="component-item">
              <img :src="item.image_url" alt="" class="image">
            </div>
            <div class="manage-tag">
              <el-tag v-for="(value,items,idx) in item.num" :key="idx" size="small" :class="items | getNum" style="margin:5px 2px;width:80px">{{ items | getNumtxt }}({{ value }})</el-tag>
            </div>
          </el-card>
        </router-link>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { listArea } from '@/api/area'
import { get_gardens } from '@/api/cemetery'
export default {
  name: 'VueList',
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      gardens: null,
      listQuery: {
        page: 1,
        limit: 20,
        pid: undefined,
        sort: 'add_time',
        order: 'desc'
      }
    }
  },
  created() {
    this.getList()
    get_gardens()
      .then(res => {
        this.gardens = res.data
      })
  },
  methods: {
    getList() {
      this.listLoading = true
      listArea(this.listQuery)
        .then(res => {
          this.list = res.data.data
          this.total = res.data.total || 0
          this.listLoading = false
          this.list.forEach((v, k) => {
            v.image_url = process.env.VUE_APP_BASE + v.image_url
          })
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
    }
  }
}
</script>
 <style  scoped>
 .manage-components-container{
 padding: 0 20px;
 min-height: calc(100vh - 84px);
 }

 .component-item{
   min-height: 100px;
   }
.image {
    width: 200px;
    height: 200px;
    display: block;
  }
  .manage-tag{
margin-top:10px;
text-align: center;
  }
  .el-tag--medium{
  margin-right: 10px;
  margin-bottom:5px
  }

 </style>
