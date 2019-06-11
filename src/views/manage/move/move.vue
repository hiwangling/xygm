<template>
  <div class="container">
    <div style="margin:0 0 10px 0">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加退迁服务</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="姓名" prop="link_name" />
      <el-table-column align="center" label="开始日期" prop="savebegindate" width="100" />
      <el-table-column align="center" label="结束日期" prop="saveenddate" width="100" />
      <el-table-column align="center" label="费用" prop="saveprice" width="70" />
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="220">
        <template slot-scope="scope">
          <template v-if="scope.row.save_status == 1">
            <el-button v-if="scope.row.order_state == 1" type="warning" size="mini" @click="handlePay(scope.row)">付款</el-button>
            <el-button v-else type="success" size="mini" @click="handleGo(scope.row)">取走</el-button>
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
          <template v-else>
            <el-button type="info" size="mini" plain disabled>已完结</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="5vh" append-to-body>
      <el-form ref="dataForm" :inline="false" :rules="rules" status-icon label-position="left" :model="dataForm" label-width="100px" style="margin-left:50px;">
        <el-form-item label="墓名">
          <span class="tag">{{ cname }}</span>
        </el-form-item>
        <el-form-item label="操作" prop="vcname">
          <el-radio v-model="radio" label="1">退墓</el-radio>
          <el-radio v-model="radio" label="2">迁出</el-radio>
        </el-form-item>
        <el-form-item label="备注" prop="phone">
          <el-input
            v-model="dataForm.vcname"
            style="width:50%"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
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
import { updateSave, createSave, listSave, deleteSave } from '@/api/save'
import { vuexData } from '@/utils/mixin'
export default {
  mixins: [vuexData],
  data() {
    return {
      list: null,
      radio: '1',
      listLoading: true,
      dialogStatus: '',
      dataForm: {
        cid: '',
        vcname: '',
        phone: '',
        price: '',
        sfz: ''
      },
      dialogFormVisible: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        vcname: [{ required: true, message: '购买人不能为空', trigger: 'blur' }]
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
      this.listLoading = true
      const data = { cid: this.cems.id }
      listSave(data)
        .then(res => {
          this.list = res.data.data
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.listLoading = false
        })
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetForm() {
      this.dataForm = {
        cid: this.cems.id,
        vcname: '',
        phone: '',
        price: '100'
      }
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createSave(this.dataForm)
            .then(res => {
              // this.list.unshift(res.data)
              this.getList()
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '添加寄存信息成功'
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
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateSave(this.dataForm)
            .then((res) => {
              this.getList()
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '更新寄存信息成功'
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
    handleDelete(row) {
      deleteSave(row)
        .then(res => {
          this.$notify.success({
            title: '成功',
            message: '删除寄存信息成功'
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

