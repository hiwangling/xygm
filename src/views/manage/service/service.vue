<template>
  <div class="container">
    <div style="margin:0 0 10px 0">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加服务信息</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" width="110" label="订单号" prop="order_no" />
      <el-table-column align="center" width="80" label="购墓人" prop="buyer_name" />
      <el-table-column align="center" width="100" label="购买日期" prop="create_time">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="服务项目" prop="sell_title" show-overflow-tooltip />
      <el-table-column align="center" width="80" label="服务总价" prop="sum_price" />
      <el-table-column prop="order_status" label="付款状态" align="center" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.order_status | or_status">
            {{ scope.row.order_status == 1 ? '未付款' : '已付款' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="220">
        <template slot-scope="scope">
          <template v-if="scope.row.order_status == 1">
            <el-button type="warning" size="mini" @click="handlePay(scope.row)">付款</el-button>
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
          <el-button v-else type="info" size="mini" plain disabled>已付款</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Service-select ref="child" @CloseDialog="CloseDialog" />
  </div>
</template>
<script>
import ServiceSelect from './components/ServiceSelect'
import { getsevices, delservices, payservices } from '@/api/buy-service'
import { vuexData } from '@/utils/mixin'
export default {
  components: { ServiceSelect },
  mixins: [vuexData],
  data() {
    return {
      index: 2,
      list: null,
      linkman_id: '',
      listlink: '',
      linkdata: null,
      listLoading: false
    }
  },
  watch: {
    cems: {
      handler(val) {
        this.getList()
      },
      immediate: true
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      const data = {
        cid: this.cems.id
      }
      getsevices(data)
        .then(res => {
          this.list = res.data
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.listLoading = false
        })
    },
    handleCreate() {
      this.$refs.child.restservice()
    },
    handleUpdate(row) {
      this.$refs.child.editservice(row.id)
    },
    CloseDialog(val) {
      this.getList()
    },
    handleDelete(row) {
      delservices(row)
        .then(res => {
          this.$notify.success({
            title: '成功',
            message: '删除服务成功'
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
        .catch(res => {
          this.$notify.error({
            title: '失败',
            message: res.msg
          })
        })
    },
    handlePay(row) {
      this.$confirm('付款此订单后服务信息将无法修改和删除, 是否继续?', '付款操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        payservices(row)
          .then(res => {
            this.$notify.success({
              title: '成功',
              message: '付款服务成功'
            })
            this.getList()
          })
          .catch(res => {
            this.$notify.error({
              title: '失败',
              message: res.msg
            })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    Creatlink(val) {
    //   let obj = {}
    //   obj = this.listlink.find((item) => {
    //     return item.id === val
    //   })
    //   this.linkdata = obj
    }

  }
}
</script>
<style scoped>

</style>

