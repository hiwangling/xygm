<template>
  <div class="container">
    <el-button v-if=" list ? (list[0] ? list[0].type_id > list.length : true) : true" class="filter-item" type="primary" icon="el-icon-edit" style="margin:10px 0" @click="handleBury">添加墓主信息</el-button>
    <el-button v-else type="info" plain disabled style="margin:10px 0">墓位信息 </el-button>
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="姓名" prop="vcname" />
      <el-table-column align="center" label="性别" prop="sex" width="50" />
      <el-table-column align="center" label="出生日期" prop="birth" />
      <el-table-column align="center" label="去世日期" prop="death" />
      <el-table-column align="center" label="安葬日期" prop="bury" />
      <el-table-column align="center" label="状态" prop="bury_status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.bury_status | bury_status">
            {{ scope.row.bury_status == 0 ? '未安葬' : '已安葬' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="220">
        <template slot-scope="scope">
          <el-button v-if="scope.row.bury_status == 0" type="warning" size="mini" @click="GoBury(scope.row)">安葬</el-button>
          <el-button v-else type="info" size="mini" plain disabled>已安葬</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.bury_status == 0" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog id="dead" class="dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="5vh" append-to-body>
      <el-form ref="dataForm" :inline="true" :rules="rules" status-icon label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
        <el-form-item label="墓主">
          <el-input v-model="dataForm.vcname" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="dataForm.sex">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="dataForm.card_no" />
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
            v-model="dataForm.birth"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="去世日期">
          <el-date-picker
            v-model="dataForm.death"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="安葬日期">
          <el-date-picker
            v-model="dataForm.bury"
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
import { vuexData, page } from '@/utils/mixin'
import { adddead, listdead, deletedead, updatedead, godead } from '@/api/dead'
export default {
  mixins: [vuexData, page],
  data() {
    return {
      index: 1,
      list: null,
      listLoading: true,
      type_id: '2',
      dialogFormVisible: false,
      cemeteryType: null,
      dialogStatus: '',
      dataForm: {
        cid: '',
        card_no: '',
        vcname: '',
        sex: '',
        birth: '',
        death: '',
        bury: ''
      },
      buryForm: null,
      rules: {
        // vcname: [{ required: true, message: '墓主不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    cems: {
      handler(val) {
        this.getList()
        this.getStatus()
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
      listdead(data)
        .then(res => {
          this.list = res.data
          this.type_id = this.list[0].type_id
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.listLoading = false
        })
    },
    refresh() {
      this.getList()
    },
    handleBury() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.resetForm()
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      updatedead(this.dataForm)
        .then(() => {
          for (const v of this.list) {
            if (v.id === this.dataForm.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, this.dataForm)
              break
            }
          }
          this.dialogFormVisible = false
          this.$notify.success({
            title: '成功',
            message: '更新墓主信息成功'
          })
        })
        .catch(res => {
          this.$notify.error({
            title: '失败',
            message: res.msg
          })
        })
    },
    handleDelete(row) {
      deletedead(row)
        .then(res => {
          this.$notify.success({
            title: '成功',
            message: '删除墓主成功'
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
    GoBury(row) {
      const data = {
        id: row.id,
        bury: row.bury
      }
      this.$confirm('是否安葬?', '安葬操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'confirmTop'
      }).then(() => {
        godead(data)
          .then(res => {
            this.$emit('v')
            this.$notify.success({
              title: '成功',
              message: '操作成功'
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
    createData() {
      this.dataForm.cid = this.cems.id
      adddead(this.dataForm)
        .then(res => {
          this.getList()
          this.dialogFormVisible = false
          this.$notify.success({
            title: '成功',
            message: '添加墓主信息成功'
          })
        })
        .catch(res => {
          this.$notify.error({
            title: '失败',
            message: res.msg
          })
        })
    },
    resetForm() {
      this.dataForm = {
        cid: this.cems.id,
        card_no: '',
        vcname: '',
        sex: '',
        birth: '',
        death: '',
        bury: ''
      }
    }
  }
}
</script>
<style>
#dead .el-dialog{
  width: 900px;
}
</style>

