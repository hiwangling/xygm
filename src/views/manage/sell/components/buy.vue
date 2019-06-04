<template>
  <div class="container">
    <el-button v-if="list ? list.length < 1 : true" class="filter-item" type="primary" icon="el-icon-edit" style="margin:0 0 10px 0" @click="handleBury">添加购墓信息</el-button>
    <el-button v-else type="info" plain disabled style="margin:10px 0">购墓单信息</el-button>
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="订单号" prop="order_no" />
      <el-table-column align="center" width="80" label="购墓人" prop="link_name" />
      <el-table-column align="center" label="购买日期" prop="order_begin" />
      <el-table-column align="center" label="到期日期" prop="order_end" />
      <el-table-column align="center" width="80" label="销售金额" prop="sell_price" />
      <el-table-column align="center" width="80" label="实收金额" prop="real_price" />
      <el-table-column prop="order_status" label="付款状态" align="center" width="80">
        <template>
          <el-tag :type="payStatus | or_status">
            {{ payStatus == 1 ? '未付款' : '已付款' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="payStatus == 1" align="center" label="操作" class-name="small-padding fixed-width" width="220">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="handlePay(scope.row)">付款</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="5vh" append-to-body>
      <el-form ref="dataForm" :inline="true" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="margin-left:50px;">
        <el-form-item label="联系人" prop="linkman_id" :rules="[dataForm.link_name ? true : { required: true, message: '联系人不能为空', trigger: 'change' }]">
          <el-select v-model="dataForm.linkman_id" clearable placeholder="请选择" :disabled="dataForm.link_name ? true : false" @change="changelink">
            <el-option
              v-for="item in listlink"
              :key="item.id"
              :label="item.link_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="link_name" :rules="[dataForm.linkman_id ? true : { required: true, message: '联系人不能为空', trigger: 'blur' }]">
          <el-input v-model="dataForm.link_name" :disabled="rule" />
        </el-form-item>
        <el-form-item label="联系人电话">
          <el-input v-model="dataForm.phone" :disabled="rule" />
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="dataForm.card_no" :disabled="rule" />
        </el-form-item>
        <el-form-item label="关系">
          <el-input v-model="dataForm.relation" :disabled="rule" />
        </el-form-item>
        <el-form-item label="住址">
          <el-input v-model="dataForm.address" :disabled="rule" />
        </el-form-item>
        <el-form-item label="销售金额">
          <el-input v-model="cems.sellprice" :disabled="true" />
        </el-form-item>
        <el-form-item label="购买日期">
          <el-date-picker
            v-model="dataForm.order_begin"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="到期日期">
          <el-date-picker
            v-model="dataForm.order_end"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="实收金额">
          <el-input v-model="dataForm.real_price" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { addbuy, listbuy, editbuy, deletebuy, pay } from '@/api/buy'
import { listlink } from '@/api/link'
import { vuexData } from '@/utils/mixin'
export default {
  mixins: [vuexData],
  data() {
    return {
      index: 1,
      list: null,
      listlink: null,
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: '',
      dataForm: {
        cid: '',
        linkman_id: '',
        order_begin: '',
        order_end: '',
        real_price: '',
        link_name: '',
        phone: '',
        card_no: '',
        relation: '',
        address: ''
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        // linkman_id: [{ required: true, message: '联系人不能为空', trigger: 'change' }]
      }
    }
  },
  computed: {
    rule() {
      return !!this.dataForm.linkman_id
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
  created() {

  },
  methods: {
    getList() {
      this.listLoading = true
      const data = {
        cid: this.cems.id
      }
      listbuy(data)
        .then(res => {
          this.list = res.data
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.listLoading = false
        })
    },
    handleBury() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.resetForm()
      this.listlink_()
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addbuy(this.dataForm)
            .then(res => {
              res.data.sell_price = this.cems.sellprice
              this.list.unshift(res.data)
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '添加购墓信息成功'
              })
            })
            .catch(res => {
              this.$notify.error({
                title: '失败',
                message: res.msg
              })
            })
        }
      })
    },
    changelink() {
      this.$nextTick(() => {
        this.dataForm.phone = ''
        this.dataForm.relation = ''
        this.dataForm.address = ''
        this.dataForm.card_no = ''
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      if (this.dataForm.linkman_id) {
        this.dataForm.link_name = ''
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.listlink_()
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          editbuy(this.dataForm)
            .then((res) => {
              for (const v of this.list) {
                if (v.id === res.data.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, res.data)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '更新购墓信息成功'
              })
            })
            .catch(res => {
              this.$notify.error({
                title: '失败',
                message: res.msg
              })
            })
        }
      })
    },
    handleDelete(row) {
      deletebuy(row)
        .then(res => {
          this.$notify.success({
            title: '成功',
            message: '删除购墓信息成功'
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
    handlePay() {
      this.$confirm('付款此订单后购墓信息及墓主信息将无法再次修改, 是否继续?', '付款操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          cid: this.cems.id
        }
        pay(data)
          .then(res => {
            this.$store.dispatch('cemetery/pay', this.cems.id)
            this.$notify.success({
              title: '成功',
              message: '付款成功'
            })
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
    resetForm() {
      this.dataForm = {
        cid: this.cems.id,
        linkman_id: '',
        order_begin: '',
        order_end: '',
        real_price: '',
        link_name: '',
        card_no: '',
        phone: '',
        relation: '',
        address: ''
      }
    },
    listlink_() {
      const data = {
        cid: this.cems.id
      }
      listlink(data)
        .then(res => {
          this.listlink = res.data
        })
        .catch(() => {
          this.listlink = null
        })
    }
  }
}
</script>

