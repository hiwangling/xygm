<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable class="filter-item" style="width: 200px;" placeholder="请输入寄存人或墓号" />
      <el-select v-model="listQuery.save_status" placeholder="选择寄存状态" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in save" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button v-permission="['POST /api/v1/save/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /api/v1/save/add']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加寄存信息</el-button>
    </div>
    <el-dialog class="dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="5vh" append-to-body>
      <el-form ref="dataForm" :inline="true" :rules="rules" status-icon label-position="left" :model="dataForm" label-width="100px" style="margin-left:50px;">
        <!-- <el-form-item label="联系人" prop="link_name">
          <el-select v-model="dataForm.link_name" clearable placeholder="请选择" style="width:150px">
            <el-option
              v-for="item in listlink"
              :key="item.id"
              :label="item.link_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="寄存人">
          <el-input v-model="dataForm.link_name" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="dataForm.phone" />
        </el-form-item>
        <el-form-item label="使用人">
          <el-input v-model="dataForm.deathname" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="dataForm.savebegindate"
            type="date"
            value-format="timestamp"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="dataForm.saveenddate"
            type="date"
            value-format="timestamp"
            placeholder="选择日期"
            @change="choose"
          />
        </el-form-item>
        <el-form-item label="寄存地点">
          <el-select v-model="dataForm.saveareaaddr" clearable placeholder="请选择" style="width:150px">
            <el-option
              v-for="item in address"
              :key="item.id"
              :label="item.link_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="寄存月数">
          <el-input v-model="dataForm.save_month" :disabled="true" />
        </el-form-item>
        <el-form-item label="寄存费用">
          <span style="color: red">{{ dataForm.saveprice }} 元</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="寄存人" prop="link_name" width="100" />
      <el-table-column align="center" label="电话" prop="phone" width="120" />
      <el-table-column align="center" label="使用人" prop="deathname" width="120" />
      <el-table-column align="center" label="开始时间" prop="savebegindate" width="120" />
      <el-table-column align="center" label="结束时间" prop="saveenddate" width="120" />
      <el-table-column align="center" label="费用" prop="saveprice" width="100" />
      <el-table-column align="center" label="寄存状态" prop="save_status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.save_status | or_status">
            {{ scope.row.save_status == 1 ? '寄存中' : '已取走' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="付款状态" prop="order_state">
        <template slot-scope="scope">
          <el-tag :type="scope.row.order_state | or_status">
            {{ scope.row.order_state == 1 ? '未付款' : '已付款' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="到期时间" prop="guoqi_status" width="120">
        <template v-if="scope.row.guoqi_days" slot-scope="scope">
          <el-tag :type="scope.row.guoqi_status | or_status">
            {{ scope.row.guoqi_days }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="220">
        <template slot-scope="scope">
          <template v-if="scope.row.save_status == 1">
            <el-button v-if="scope.row.order_state == 1" v-permission="['POST /api/v1/save/jiesuan']" type="warning" size="mini" @click="handlePay(scope.row)">付款</el-button>
            <el-button v-else type="success" size="mini" @click="handleGo(scope.row)">取走</el-button>
            <el-button v-permission="['POST /api/v1/save/edit']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button v-permission="['GET /api/v1/save/del']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
          <template v-else>
            <el-button type="info" size="mini" plain disabled>已完结</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>
<script>
import { updateSave, createSave, listSave, deleteSave, PaySave } from '@/api/save'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
export default {
  name: 'VueSaveList',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      address: [{
        id: '仙园公墓',
        link_name: '仙园公墓'
      }],
      save: [{
        id: 1,
        name: '寄存中'
      }, {
        id: 2,
        name: '已取走'
      }],
      dataForm: {
        link_name: '',
        phone: '',
        address: '',
        deathname: '',
        savebegindate: '',
        saveenddate: '',
        saveareaaddr: '',
        unitprice: 5,
        saveprice: '',
        save_month: ''
      },
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        save_status: '',
        sort: 'add_time',
        order: 'desc'
      },
      rules: {
        // link_name: [{ required: true, message: '联系人不能为空', trigger: 'change' }]
      }
    }
  },
  computed: {

  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listSave(this.listQuery)
        .then(res => {
          this.list = res.data.data
          this.total = res.data.total || 0
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
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
    createData() {
      this.dataForm.savebegindate = parseTime(this.dataForm.savebegindate, '{y}-{m}-{d}')
      this.dataForm.saveenddate = parseTime(this.dataForm.saveenddate, '{y}-{m}-{d}')
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
    },
    handlePay(row) {
      this.$confirm('付款此订单后寄存信息将无法修改和删除, 是否继续?', '付款操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'confirmTop'
      }).then(() => {
        const data = { id: row.id }
        PaySave(data)
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
    handleGo(row) {
      this.$confirm('确定取走?', '取走操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'confirmTop'
      }).then(() => {
        row.save_status = 2
        updateSave(row)
          .then((res) => {
            this.getList()
            this.$notify.success({
              title: '成功',
              message: '已取走'
            })
          })
          .catch(res => {
            this.$notify.error({
              title: '失败',
              message: res
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
        link_name: '',
        phone: '',
        address: '无',
        deathname: '',
        savebegindate: Date.parse(new Date()),
        saveenddate: '',
        saveareaaddr: '',
        unitprice: 5,
        saveprice: 5,
        save_month: 1
      }
    },
    choose() {
      const start = this.dataForm.savebegindate
      const end = this.dataForm.saveenddate
      this.dataForm.save_month = Math.ceil(((end - start) / (60 * 60 * 24 * 1000)) / 30)
      this.dataForm.save_month = this.dataForm.save_month > 0 ? this.dataForm.save_month : 1
      this.dataForm.saveprice = this.dataForm.save_month * 5
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateSave(this.dataForm)
            .then((res) => {
              // for (const v of this.list) {
              //   if (v.id === res.data.id) {
              //     const index = this.list.indexOf(v)
              //     this.list.splice(index, 1, res.data)
              //     break
              //   }
              // }
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>
