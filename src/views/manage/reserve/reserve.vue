<template>
  <div class="container">
    <div style="margin:0 0 10px 0">
      <el-button v-if="list ? list.length < 1 : ''" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加预定信息</el-button>
      <el-button v-else type="info" plain disabled>墓穴已预定</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="预定人" prop="buyer_name" />
      <el-table-column align="center" label="联系电话" prop="phone" />
      <el-table-column align="center" label="开始时间" prop="ordainbegin" />
      <el-table-column align="center" label="到期时间" prop="ordainend" />
      <el-table-column align="center" label="预定状态" prop="guoqi_status" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.guoqi_status | or_status">
            {{ scope.row.guoqi_days }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="5vh" append-to-body>
      <el-form ref="dataForm" :inline="true" :rules="rules" status-icon :model="dataForm" label-position="left" label-width="120px" style="margin-left:50px;">
        <el-form-item label="预定人" prop="buyer_name">
          <el-input v-model="dataForm.buyer_name" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="dataForm.phone" />
        </el-form-item>
        <el-form-item label="开始时间" prop="ordainbegin">
          <el-date-picker
            v-model="dataForm.ordainbegin"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="ordainend">
          <el-date-picker
            v-model="dataForm.ordainend"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
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
import { listReserve, createReserve, updateReserve, deleteReserve } from '@/api/reserve'
import { vuexData } from '@/utils/mixin'
export default {
  mixins: [vuexData],
  data() {
    return {
      index: 0,
      list: null,
      listLoading: true,
      dialogStatus: '',
      dataForm: {
        cid: '',
        buyer_name: '',
        ordainbegin: '',
        ordainend: '',
        phone: ''
      },
      dialogFormVisible: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        buyer_name: [{ required: true, message: '预定人不能为空', trigger: 'blur' }],
        ordainbegin: [{ required: true, message: '请选择日期', trigger: 'change' }],
        ordainend: [{ required: true, message: '请选择日期', trigger: 'change' }]
      }
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
      this.listLoading = false
      this.listLoading = false
      const data = { cid: this.cems.id }
      listReserve(data)
        .then(res => {
          this.list = res.data
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.listLoading = false
        })
    },
    resetForm() {
      this.dataForm = {
        cid: this.cems.id,
        buyer_name: '',
        ordainbegin: '',
        ordainend: '',
        phone: ''
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createReserve(this.dataForm)
            .then(res => {
              // this.list.unshift(res.data)
              this.getList()
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '添加预定信息成功'
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
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          delete this.dataForm['guoqi_days']
          delete this.dataForm['guoqi_status']
          updateReserve(this.dataForm)
            .then((res) => {
              // for (const v of this.list) {
              //   if (v.id === res.data.id) {
              //     const index = this.list.indexOf(v)
              //     this.list.splice(index, 1, res.data)
              //     break
              //   }
              // }
              this.dialogFormVisible = false
              this.getList()
              this.$notify.success({
                title: '成功',
                message: '更新预定信息成功'
              })
            })
            .catch(res => {
              this.$notify.error({
                title: '失败',
                message: res
              })
            })
        }
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      deleteReserve(row)
        .then(res => {
          this.$notify.success({
            title: '成功',
            message: '删除预定信息成功'
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
    }
  }
}
</script>
