<template>
  <el-dialog id="service" class="dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="5vh" append-to-body>
    <div>
      <div class="filter-container" style="padding-bottom:0">
        <el-form ref="dataForm" :rules="rules" :inline="true" :model="dataForm" status-icon label-position="left" label-width="80px">
          <el-form-item label="购买人" prop="linkman_id">
            <el-select v-model="dataForm.linkman_id" clearable placeholder="请选择" style="width:140px" size="mini">
              <el-option
                v-for="item in listlink"
                :key="item.id"
                :label="item.link_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="服务时间">
            <el-date-picker
              v-model="dataForm.servicedate"
              style="width:140px!important"
              size="mini"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="墓主">
            <el-checkbox-group v-model="dataForm.bury">
              <el-checkbox label="墓主1" />
              <el-checkbox label="墓主2" />
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="ele" />
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        border
        :row-class-name="tableRow"
        highlight-current-row
        :data="list"
        tooltip-effect="dark"
        style="width: 100%;margin-bottom:10px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column prop="service_name" align="center" label="服务名称" />
        <el-table-column prop="sellprice" align="center" width="300" label="服务价格" show-overflow-tooltip>
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.sellprice" class="edit-input" size="mini" style="width:100px" />
              <el-button size="mini" type="success" @click="confirmEdit(row)">
                确定
              </el-button>
              <el-button size="mini" type="warning" @click="cancelEdit(row)">
                取消
              </el-button>
            </template>
            <span v-else @click="row.edit=!row.edit">{{ row.sellprice }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="el-divider el-divider--horizontal"><div class="el-divider__text is-left">已选项目</div></div>
      <el-table
        v-loading="listLoading"
        :show-header="false"
        show-summary
        :data="sell"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="index"
          width="50"
        />
        <el-table-column prop="service_name" width="200" />
        <el-table-column prop="sellprice" />
      </el-table>
      <div slot="footer" class="dialog-footer service">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="sendData">确定</el-button>
        <el-button v-else type="primary" @click="editData">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
// import { listService } from '@/api/service'
import { getEditService, addservices, editservices, getServiceOne } from '@/api/buy-service'
import { listlink } from '@/api/link'
import { vuexData } from '@/utils/mixin'
export default {
  mixins: [vuexData],
  data() {
    return {
      bury: '',
      listlink: '',
      order_detail_ids: null,
      sum_price: '',
      id: '',
      dataForm: {
        linkman_id: '',
        servicedate: '',
        bury: ['墓主1']
      },

      list: null,
      sell: null,
      listLoading: true,
      multipleSelection: [],
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: '编辑服务',
        create: '创建服务'
      },
      rules: {
        linkman_id: [{ required: true, message: '联系人不能为空', trigger: 'change' }]
      }
    }
  },
  watch: {
    sell: {
      handler() {
        let sum_price = 0
        if (this.sell) {
          this.sell.forEach((v, k) => {
            sum_price = sum_price + parseInt(v.sellprice)
          })
        }
        this.sum_price = sum_price
      },
      immediate: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const parm = { service_type: 2 }
      getServiceOne(parm)
        .then(res => {
          this.list = res.data
          this.listLoading = false
          const items = res.data
          this.list = items.map(v => {
            this.$set(v, 'edit', false)
            v.originalTitle = v.sellprice
            return v
          })
        })
        .catch(() => {
          this.list = []
          this.listLoading = false
        })
    },
    cancelEdit(row) {
      row.sellprice = row.originalTitle
      row.edit = false
      this.$message({
        message: '操作取消',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.originalTitle = row.sellprice
    },
    restservice() {
      this.dataForm.linkman_id = null
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.multipleTable.clearSelection()
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.findlink()
    },
    editservice(val) {
      this.id = val
      const data = { id: val }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      getEditService(data)
        .then(res => {
          this.order_detail_ids = res.data.order_detail_ids
          this.dataForm.linkman_id = res.data.linkman_id
          const service = res.data.services
          service.forEach((v, k) => {
            this.$refs.multipleTable.toggleRowSelection(this.$refs.multipleTable.data.find((item) => item.id === v.id), true)
          })
        })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.findlink()
    },
    sendData() {
      const data = {
        cid: this.cems.id,
        services: this.sell,
        sum_price: this.sum_price,
        linkman_id: this.dataForm.linkman_id
      }
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addservices(data)
            .then(res => {
              this.$notify.success({
                title: '成功',
                message: '添加服务成功'
              })
              this.dialogFormVisible = false
              this.CloseDialog()
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
    editData() {
      const data = {
        id: this.id,
        services: this.sell,
        order_detail_ids: this.order_detail_ids,
        sum_price: this.sum_price,
        linkman_id: this.dataForm.linkman_id
      }
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          editservices(data)
            .then(res => {
              this.$notify.success({
                title: '成功',
                message: '编辑服务成功'
              })
              this.CloseDialog()
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
    CloseDialog() {
      this.$emit('CloseDialog', false)
    },
    handleSelectionChange(val) {
      this.sell = val
    },
    tableRow({ row, rowIndex }) {
      return 'rows'
    },
    findlink() {
      const data = { cid: this.cems.id }
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
<style>
   .el-table .rows {
   height: 50px;
  }
   .service{
    text-align: right;
    height: 65px;
    line-height: 80px;
  }
</style>

