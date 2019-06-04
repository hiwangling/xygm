<template>
  <div class="container">
    <el-button v-if="list ? (list[0] ? list[0].type_id > list.length : true) : true" class="filter-item" type="primary" icon="el-icon-edit" style="margin:10px 0" @click="handleBury">添加墓主信息</el-button>
    <el-button v-else type="info" plain disabled style="margin:10px 0">墓位信息 </el-button>
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="姓名" prop="vcname" />
      <el-table-column align="center" label="性别" prop="sex" width="50" />
      <el-table-column align="center" label="出生日期" prop="birth" />
      <el-table-column align="center" label="去世日期" prop="death" />
      <el-table-column align="center" label="安葬日期" prop="bury" />
      <el-table-column align="center" label="状态" prop="sex" />
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="220">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="GoBury(scope.row)">安葬</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="payStatus == 1" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog id="dead" class="dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="5vh" append-to-body>
      <el-form v-if="list ? list.length>0 : true" ref="dataFormEdit" :inline="true" :rules="rules" status-icon label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
        <el-form-item label="墓主">
          <el-input v-model="dataFormEdit.vcname" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="dataFormEdit.sex">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="dataFormEdit.card_no" />
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
            v-model="dataFormEdit.birth"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="去世日期">
          <el-date-picker
            v-model="dataFormEdit.death"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="安葬日期">
          <el-date-picker
            v-model="dataFormEdit.bury"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
      </el-form>
      <template v-else>
        <div style="height:30px">
          <el-form ref="dataForm" :rules="rules" status-icon label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
            <el-form-item label="实际墓型">
              <el-select v-model="type_id" clearable placeholder="请选择" @change="SeleteCeme">
                <el-option
                  v-for="item in cemeteryType"
                  :key="item.id"
                  :label="item.type_name"
                  :value="item.hrm"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="el-divider el-divider--horizontal"><div class="el-divider__text is-left">墓主信息</div></div>
        <el-form ref="dataForm" :inline="true" :rules="rules" status-icon label-position="left" label-width="100px" style="margin-left:50px;">
          <div v-for="(idx,item) in type_id" :key="idx" style="height:120px">
            <el-form-item :label="'墓主(' + idx + ')'">
              <el-input v-model="dataForm[item].vcname" />
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="dataForm[item].sex">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-form-item>
            <el-form-item label="身份证">
              <el-input v-model="dataForm[item].card_no" />
            </el-form-item>
            <el-form-item label="出生日期">
              <el-date-picker
                v-model="dataForm[item].birth"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item label="去世日期">
              <el-date-picker
                v-model="dataForm[item].death"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item label="安葬日期">
              <el-date-picker
                v-model="dataForm[item].bury"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
          </div>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { listType } from '@/api/type'
import { vuexData } from '@/utils/mixin'
import { adddead, listdead, deletedead, updatedead } from '@/api/dead'
export default {
  mixins: [vuexData],
  data() {
    return {
      index: 1,
      list: null,
      listLoading: true,
      type_id: 2,
      dialogFormVisible: false,
      cemeteryType: null,
      dialogStatus: '',
      dataForm: null,
      dataFormEdit: {
        cid: '',
        card_no: '',
        vcname: '',
        sex: '',
        birth: '',
        death: '',
        bury: ''
      },
      buryForm: null,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        // vcname: [{ required: true, message: '墓主不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    cems: {
      handler(val) {
        this.getList()
        this.Creattype()
        this.SeleteCeme(this.type_id)
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
    handleBury() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.resetFormEdit()
    },
    handleUpdate(row) {
      this.dataFormEdit = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      updatedead(this.dataFormEdit)
        .then(() => {
          for (const v of this.list) {
            if (v.id === this.dataFormEdit.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, this.dataFormEdit)
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

    },
    createData() {
      const Creatdata = {
        bury: this.dataForm,
        cid: this.cems.id
      }
      const data = this.list.length > 0 ? this.dataFormEdit : Creatdata
      adddead(data)
        .then(res => {
          if (this.list.length > 0) {
            this.list.unshift(res.data)
          } else {
            res.data.forEach((v, k) => {
              this.list.unshift(res.data[k])
            })
          }
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
    },
    resetForm() {
      this.dataForm = [{
        cid: this.cems.id,
        card_no: '',
        vcname: '',
        sex: '',
        birth: '',
        death: '',
        bury: '',
        type_id: this.type_id
      }]
    },
    resetFormEdit() {
      this.dataFormEdit = {
        cid: this.cems.id,
        card_no: '',
        vcname: '',
        sex: '',
        birth: '',
        death: '',
        bury: ''
      }
    },
    SeleteCeme(val) {
      this.resetForm()
      for (let i = 0; i < val - 1; i++) {
        this.dataForm.push({
          cid: this.cems.id,
          card_no: '',
          vcname: '',
          sex: '',
          birth: '',
          death: '',
          bury: '',
          type_id: this.type_id
        })
      }
    },
    Creattype() {
      listType()
        .then(res => {
          this.cemeteryType = res.data
        })
    }
  }
}
</script>
<style>
#dead .el-dialog{
  width: 900px;
}
</style>

