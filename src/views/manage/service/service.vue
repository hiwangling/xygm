<template>
  <div class="container">
    <div style="margin:0 0 10px 0">
      <el-button v-if="currentStatus != 1" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加服务信息</el-button>
      <el-button v-else type="info" plain disabled>服务已锁定</el-button>
      <el-button v-if="status" class="filter-item" type="primary" icon="el-icon-edit" @click="handleMonumen">刻碑</el-button>
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
      <el-table-column align="center" label="墓主" prop="buryname" />
      <el-table-column align="center" label="服务时间" prop="service_time" />
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
    <el-dialog id="monumen" class="dialog" title="刻碑" :visible.sync="dialogFormVisible" top="5vh" append-to-body>
      <Monumen ref="get" @CloseDialog="CloseDialog" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createDate">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ServiceSelect from './components/ServiceSelect'
import { getsevices, delservices, payservices, get_mentstatus } from '@/api/buy-service'
import { vuexData, page } from '@/utils/mixin'
import Monumen from '@/components/Monumen'
export default {
  components: { ServiceSelect, Monumen },
  mixins: [vuexData, page],
  data() {
    return {
      index: 2,
      list: null,
      status: false,
      linkman_id: '',
      listlink: '',
      linkdata: null,
      dialogFormVisible: false,
      listLoading: false
    }
  },
  watch: {
    order(val) {
      if (val === this.index) {
        this.getStatus()
      }
    },
    cems: {
      handler(val) {
        this.getList()
        // this.getStatus()
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
      get_mentstatus(data)
        .then(res => {
          console.log(res.data)
          this.status = res.data !== '0'
        })
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
      this.dialogFormVisible = false
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
        type: 'warning',
        customClass: 'confirmTop'
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
    handleMonumen() {
      this.dialogFormVisible = true
    },
    createDate() {
      this.$refs.get.getData()
    }
  }
}
</script>
<style >
#monumen .el-dialog{
  width: 900px;
}
</style>

