<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable class="filter-item" style="width: 150px;" placeholder="请输入墓穴名称" />
      <el-select v-model="listQuery.y_id" placeholder="选择墓园" clearable style="width: 120px" class="filter-item" @change="getarea()">
        <el-option v-for="item in cemetery.g" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.q_id" placeholder="选择墓区" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in cemetery.a" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.type_id" placeholder="选择类型" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in cemetery.t" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.style_id" placeholder="选择样式" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in cemetery.s" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.usestatus" placeholder="选择状态" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(value, item) in cemetery.usestatus" :key="item" :label="value" :value="item" />
      </el-select>
      <el-button v-permission="['GET /api/v1/cemetery/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /api/v1/cemetery/add']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :default-sort="{prop: 'sort',order:'ascending'}" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="墓号" prop="vno" width="150" />
      <el-table-column align="center" label="名称" prop="cname" />
      <el-table-column align="center" label="墓园" prop="y_name" />
      <el-table-column align="center" label="墓区" prop="cemetery_classify.type_name" />
      <el-table-column align="center" label="类型" prop="cemetery_type.type_name" />
      <el-table-column align="center" label="样式" prop="cemetery_style.type_name" />
      <el-table-column align="center" label="状态" prop="usestatus">
        <template slot-scope="{row}">
          <el-tag :type="row.usestatus | statusFilter">
            {{ row.usestatus | userstatusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="价格" prop="sellprice" />
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="200">
        <template slot-scope="{row}">
          <el-button v-permission="['POST /api/v1/cemetery/edit']" type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button v-permission="['GET /api/v1/cemetery/del']" type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog class="dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :inline="true" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="margin-left:50px;">
        <el-form-item label="墓号" prop="vno">
          <el-input v-model="dataForm.vno" />
        </el-form-item>
        <el-form-item label="名称" prop="cname">
          <el-input v-model="dataForm.cname" />
        </el-form-item>
        <el-form-item label="面积" prop="area">
          <el-input v-model="dataForm.area" />
        </el-form-item>
        <el-form-item label="朝向" prop="orientation">
          <el-input v-model="dataForm.orientation" />
        </el-form-item>
        <el-form-item label="行" prop="ix">
          <el-input v-model="dataForm.ix" />
        </el-form-item>
        <el-form-item label="列" prop="iy">
          <el-input v-model="dataForm.iy" />
        </el-form-item>
        <el-form-item label="价格" prop="sellprice">
          <el-input v-model="dataForm.sellprice" />
        </el-form-item>
        <el-form-item label="墓园选择" prop="yid">
          <el-select v-model="garen_id" clearable placeholder="请选择" @change="getarea()">
            <el-option
              v-for="item in cemetery.gardens"
              :key="item.id"
              :label="item.type_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="墓区选择" prop="classify_id">
          <el-select v-model="dataForm.classify_id" clearable placeholder="请选择">
            <el-option
              v-for="item in cemetery.areas"
              :key="item.id"
              :label="item.type_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型选择" prop="type_id">
          <el-select v-model="dataForm.type_id" clearable placeholder="请选择">
            <el-option
              v-for="item in cemetery.types"
              :key="item.id"
              :label="item.type_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="样式选择" prop="style_id">
          <el-select v-model="dataForm.style_id" clearable placeholder="请选择">
            <el-option
              v-for="item in cemetery.styles"
              :key="item.id"
              :label="item.type_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" prop="createdate">
          <el-date-picker
            v-model="dataForm.createdate"
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
import { listGrave, createGrave, updateGrave, deleteGrave } from '@/api/grave'
import { get_gardens, get_areas, get_styles, get_types, get_status } from '@/api/cemetery'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
  name: 'VueArea',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      cemetery: {
        g: null,
        a: null,
        s: null,
        t: null
      },
      listLoading: true,
      downloadLoading: false,
      garen_id: '',
      listQuery: {
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc',
        keyword: undefined,
        y_id: '',
        q_id: '',
        type_id: '',
        style_id: '',
        usestatus: ''
      },
      dataForm: {
        cname: '',
        classify_id: '',
        type_id: '',
        style_id: '',
        area: '',
        ix: '',
        iy: '',
        orientation: '',
        vcdesc: '',
        sellprice: '',
        createdate: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        vno: [{ required: true, message: '墓号不能为空', trigger: 'blur' }],
        classify_id: [{ required: true, message: '墓区不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
  },
  created() {
    this.getList()
    get_gardens()
      .then(res => {
        this.cemetery.g = res.data
      })
    get_status()
      .then(res => {
        this.cemetery.usestatus = res.data
      })
    get_styles()
      .then(res => {
        this.cemetery.s = res.data
      })
    get_types()
      .then(res => {
        this.cemetery.t = res.data
      })
  },
  methods: {
    getList() {
      this.listLoading = true
      listGrave(this.listQuery)
        .then(res => {
          this.list = res.data.data
          this.garen_id = res.data.data.y_id
          this.total = res.data.total || 0
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        cname: '',
        classify_id: '',
        type_id: '',
        style_id: '',
        area: '',
        ix: '',
        iy: '',
        orientation: '',
        vcdesc: '',
        sellprice: '',
        createdate: null
      }
      this.garen_id = ''
    },
    getarea() {
      const data = {
        pid: this.garen_id || this.listQuery.y_id
      }
      this.listQuery.q_id = ''
      this.dataForm.classify_id = ''
      get_areas(data)
        .then(res => {
          this.cemetery.a = res.data
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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createGrave(this.dataForm)
            .then(res => {
              console.log(res.data)
              this.list.unshift(res.data)
              this.dialogFormVisible = false
              this.getList()
              this.$notify.success({
                title: '成功',
                message: '添加墓穴成功'
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
      this.garen_id = row.y_id
      const data = {
        pid: this.garen_id
      }
      get_areas(data)
        .then(res => {
          this.cemetery.areas = res.data
        })
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
          updateGrave(this.dataForm)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.dataForm.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.dataForm)
                  break
                }
              }
              this.dialogFormVisible = false
              this.getList()
              this.$notify.success({
                title: '成功',
                message: '更新墓穴成功'
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
      deleteGrave(row)
        .then(res => {
          this.$notify.success({
            title: '成功',
            message: '删除墓穴成功'
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['cname', 'y_name', 'usestatus']
        const filterVal = ['cname', 'y_name', 'usestatus']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
