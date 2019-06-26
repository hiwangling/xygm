<template>
  <div class="container">
    <div style="margin:0 0 10px 0">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加置换服务</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="旧墓名" prop="old_name" />
      <el-table-column align="center" label="新墓名" prop="new_name" />
      <el-table-column align="center" label="联系人" prop="linkname" />
      <el-table-column align="center" label="操作人" prop="operate_name" />
    </el-table>
    <el-dialog class="dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="5vh" append-to-body>
      <el-form ref="dataForm" :inline="false" :rules="rules" status-icon label-position="left" :model="dataForm" label-width="100px" style="margin-left:50px;">
        <el-form-item label="原墓穴">
          <span style="color:#1890ff">{{ cname }}   /  {{ real_price }} 元</span>
        </el-form-item>
        <el-form-item label="新墓穴">
          <span>{{ newname }}</span>
          <el-button type="primary" icon="el-icon-search" plain size="mini" @click="ChangeCmes()" />
          <el-button v-if="newname" type="danger" icon="el-icon-delete" plain size="mini" @click="newname = ''" />
          <!-- <el-input v-model="dataForm.name" prefix-icon="el-icon-search" @focus="ChangeCmes()" /> -->
        </el-form-item>
        <!-- <el-form-item label="补差价">
          <el-input v-model="dataForm.price" class="cprice" />
        </el-form-item> -->
        <el-form-item label="联系人">
          <el-select v-model="dataForm.linkman_id" clearable placeholder="请选择">
            <el-option
              v-for="item in listlink"
              :key="item.id"
              :label="item.link_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
    <Swap-search ref="child" @getname="getname" />
  </div>
</template>
<script>
import SwapSearch from './components/search'
import { change_cemetery, historyinfo } from '@/api/historyinfo'
import { listlink } from '@/api/link'
import { listbuy } from '@/api/buy'
import { page, vuexData } from '@/utils/mixin'
export default {
  components: { SwapSearch },
  mixins: [page, vuexData],
  data() {
    return {
      list: null,
      index: 4,
      links: [],
      newname: '',
      listLoading: true,
      dialogStatus: '',
      real_price: '',
      dataForm: {
        old_cid: '',
        new_cid: '',
        new_name: '',
        old_name: '',
        linkman_id: ''
      },
      dialogFormVisible: false,
      rules: {
        // linkman: [{ required: true, message: '购买人不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    order(val) {
      if (val === this.index) {
        this.link()
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
        typeid: 1
      }
      historyinfo(data)
        .then(res => {
          this.listLoading = false
          this.list = res.data
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
      this.newname = ''
      this.dataForm = {
        old_cid: this.cems.id,
        new_cid: '',
        new_name: '',
        old_name: '',
        linkman_id: ''
      }
      const data = {
        cid: this.cems.id
      }
      listbuy(data)
        .then(res => {
          this.real_price = res.data[0].real_price
        })
    },
    createData() {
      this.dataForm.old_name = this.cname
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          change_cemetery(this.dataForm)
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
    },
    ChangeCmes() {
      this.$nextTick(() => {
        this.$refs.child.show()
      })
    },
    link() {
      const data = {
        cid: this.cems.id
      }
      listlink(data)
        .then(res => {
          this.listlink = res.data
        })
    },
    getname(v) {
      this.newname = v.y_name + v.cemetery_classify.type_name + v.vno + v.cname + ' / ' + v.sellprice + ' 元'
      this.dataForm.new_name = v.y_name + v.cemetery_classify.type_name + v.vno + v.cname
      this.dataForm.new_cid = v.id
    }
  }
}
</script>
<style>
</style>

