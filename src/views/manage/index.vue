<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable class="filter-item" style="width: 200px;" placeholder="请输入墓名或者墓号" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>
    <grave v-show="flag" ref="child" />
    <div v-show="!flag" class="main">
      <el-row :gutter="20" class="area">
        <el-col v-for="(item, index) in list" :key="index" :span="4">
          <router-link :to="'/list/'+item.id" class="">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span style="font-size:16px">{{ item.type_name }}</span>
              </div>
              <div class="component-item">
                <img :src="item.image_url === url ? gmurl : item.image_url" alt="" class="image">
              </div>
              <div class="manage-tag">
                <el-tag v-for="(value,items,idx) in item.num" :key="idx" size="small" :class="items | getNum" style="margin:5px 6px;">{{ items | getNumtxt }}({{ value }})</el-tag>
              </div>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { listArea } from '@/api/area'
import { listGrave } from '@/api/grave'
import { get_gardens } from '@/api/cemetery'
import { page, vuexData } from '@/utils/mixin'
import grave from './list'
export default {
  name: 'Manage',
  components: { grave },
  mixins: [page, vuexData],
  data() {
    return {
      list: null,
      total: 0,
      url: process.env.VUE_APP_BASE,
      gmurl: 'http://www.iu95522.com/attachs/homephoto/201512/20151208_A575C898CB8EE138978DC03B392F5A18.png',
      sreach: null,
      listLoading: true,
      gardens: null,
      flag: false,
      listQuery: {
        page: 1,
        limit: 20,
        pid: undefined,
        sort: 'add_time',
        y_id: '',
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
      console.log(this.listQuery)
      this.listQuery.y_id = this.garden_id
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
      if (this.listQuery.keyword === '') {
        this.flag = false
      } else {
        this.listQuery.page = 1
        this.listQuery.y_id = this.garden_id
        listGrave(this.listQuery)
          .then(res => {
            this.sreach = res.data.data
            this.flag = true
            const filter = {
              flag: true,
              keyword: this.listQuery.keyword,
              q_id: ''
            }
            this.$refs.child.handleFilters(filter)
          })
      }
    },
    CreateCemetery(row) {

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
    width: 100%;
     height: 150px;
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
.box-card{
  margin-bottom: 10px;
}
 </style>
