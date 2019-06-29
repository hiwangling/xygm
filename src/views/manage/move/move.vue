<template>
  <div class="container">
    <div style="margin:0 0 10px 0">
      <el-button v-if="currentStatus != 1" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加退迁服务</el-button>
      <el-button v-else type="info" plain disabled>退迁已锁定</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="墓名" prop="old_name" />
      <el-table-column align="center" label="联系人" prop="linkname" />
      <el-table-column align="center" label="联系电话" prop="linkphone" />
      <el-table-column align="center" label="操作人" prop="operate_name" width="100" />
    </el-table>
    <el-dialog class="dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="5vh" append-to-body>
      <el-form ref="dataForm" :inline="false" :rules="rules" status-icon label-position="left" :model="dataForm" label-width="100px" style="margin-left:50px;">
        <el-form-item label="墓名">
          <span class="tag">{{ cname }}</span>
        </el-form-item>
        <el-form-item label="操作">
          <el-radio v-model="dataForm.typeid" label="2">退墓</el-radio>
          <el-radio v-model="dataForm.typeid" label="3">迁出</el-radio>
        </el-form-item>
        <el-form-item label="联系人" prop="linkname">
          <el-input v-model="dataForm.linkname" placeholder="" />
        </el-form-item>
        <el-form-item label="电话" prop="linkphone">
          <el-input v-model="dataForm.linkphone" placeholder="" />
        </el-form-item>
        <el-form-item label="备注" prop="vcnote">
          <el-input
            v-model="dataForm.vcnote"
            style="width:50%"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { move_cemetery, historyinfo } from '@/api/historyinfo'
import { vuexData, page } from '@/utils/mixin'
export default {
  mixins: [vuexData, page],
  data() {
    return {
      list: null,
      index: 5,
      listLoading: true,
      dialogStatus: '',
      dataForm: {
        cid: '',
        cem_name: '',
        linkname: '',
        linkphone: '',
        typeid: '2',
        vcnote: ''
      },
      dialogFormVisible: false,
      rules: {
        linkname: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
        linkphone: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }],
        vcnote: [{ required: true, message: '备注不能为空', trigger: 'blur' }]
      }
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
      },
      immediate: true
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      const data = {
        cid: this.cems.id,
        typeid: 0
      }
      historyinfo(data)
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
        cem_name: '',
        linkname: '',
        linkphone: '',
        typeid: '2',
        vcnote: ''
      }
    },
    v() {
      this.$emit('v')
    },
    createData() {
      this.dataForm.cem_name = this.cname
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          move_cemetery(this.dataForm)
            .then(res => {
              this.getList()
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '操作成功'
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
    }
  }
}
</script>

