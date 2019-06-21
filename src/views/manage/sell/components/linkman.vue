<template>
  <div class="container">
    <el-button class="filter-item" type="primary" icon="el-icon-edit" style="margin:10px 0" @click="handlelink">增加联系人</el-button>
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="姓名" prop="link_name" />
      <el-table-column align="center" label="电话" prop="phone" />
      <el-table-column align="center" label="关系" prop="relation" />
      <el-table-column align="center" label="住址" prop="address" />
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdatelink(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDeletelink(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 增加联系人 -->
    <el-dialog class="dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" append-to-body top="5vh">
      <div class="linkman">
        <el-form ref="dataForm" :inline="true" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="margin-left:50px;" class="dataFormman">
          <el-form-item label="姓名" prop="link_name">
            <el-input v-model="dataForm.link_name" />
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="dataForm.phone" />
          </el-form-item>
          <el-form-item label="身份证" prop="card_no">
            <el-input v-model="dataForm.card_no" />
          </el-form-item>
          <el-form-item label="关系" prop="relation">
            <el-input v-model="dataForm.relation" />
          </el-form-item>
          <el-form-item label="住址" prop="address">
            <el-input v-model="dataForm.address" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createDatalink">确定</el-button>
        <el-button v-else type="primary" @click="updateDatalink">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { listlink, createlink, updatelink, deletelink } from '@/api/link'
import { vuexData } from '@/utils/mixin'
export default {
  mixins: [vuexData],
  data() {
    return {
      index: 1,
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: '',
      dataForm: {
        cid: '',
        link_name: '',
        phone: '',
        card_no: '',
        relation: '',
        address: ''
      },
      rules: {
        link_name: [{ required: true, message: '联系人姓名不能为空', trigger: 'blur' }]
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
      const data = {
        cid: this.cems.id
      }
      listlink(data)
        .then(res => {
          this.list = res.data
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
    handlelink() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetForm() {
      this.dataForm = {
        cid: '',
        link_name: '',
        phone: '',
        card_no: '',
        relation: '',
        address: ''
      }
    },
    createDatalink() {
      this.dataForm.cid = this.cems.id
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createlink(this.dataForm)
            .then(res => {
              this.list.unshift(res.data)
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '添加联系人成功'
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
    handleUpdatelink(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateDatalink() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updatelink(this.dataForm)
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
                message: '更新联系人成功'
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
    handleDeletelink(row) {
      deletelink(row)
        .then(res => {
          this.$notify.success({
            title: '成功',
            message: '删除联系人成功'
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
<style scoped>

</style>

