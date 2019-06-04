<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.type_name" clearable class="filter-item" style="width: 200px;" placeholder="请输入墓区名称" />
      <el-select v-model="listQuery.pid" placeholder="选择墓园" clearable style="width: 120px" class="filter-item" @change="getarea()">
        <el-option v-for="item in gardens" :key="item.id" :label="item.type_name" :value="item.id" />
      </el-select>
      <el-button v-permission="['GET /api/v1/cemetery_classify/a_list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /api/v1/cemetery_classify/a_add']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :default-sort="{prop: 'sort',order:'ascending'}" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="排序" prop="sort" width="200">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.sort" class="edit-input" size="mini" style="width:100px" />
            <el-button
              class="cancel-btn"
              size="mini"
              type="warning"
              @click="cancelEdit(row)"
            >
              取消
            </el-button>
          </template>
          <span v-else>{{ row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" prop="type_name" />
      <el-table-column align="center" label="园区" prop="y_name" width="200" />
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="230">
        <template slot-scope="{row}">
          <el-button v-if="row.edit" type="success" size="mini" @click="confirmEdit(row)">
            确定
          </el-button>
          <el-button v-else v-permission="['POST /api/v1/cemetery_classify/a_edit']" type="warning" size="mini" @click="row.edit=!row.edit">
            排序
          </el-button>
          <el-button v-permission="['POST /api/v1/cemetery_classify/a_edit']" type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button v-permission="['GET /api/v1/cemetery_classify/a_del']" type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="墓区名称" prop="type_name">
          <el-input v-model="dataForm.type_name" />
        </el-form-item>
        <el-form-item label="墓区排序" prop="sort">
          <el-input v-model="dataForm.sort" />
        </el-form-item>
        <el-form-item label="墓园选择" prop="yid">
          <el-select v-model="dataForm.parent_id" clearable placeholder="请选择">
            <el-option
              v-for="item in gardens"
              :key="item.id"
              :label="item.type_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="上传图片">
          <span style="color:red">只能上传image/jpeg文件，且不超过2M</span>
          <el-upload
            class="avatar-uploader"
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="image_url" :src="image_url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
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
import { listArea, createArea, updateArea, deleteArea } from '@/api/area'
import { uploadPath } from '@/api/upload'
import { get_gardens } from '@/api/cemetery'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'

export default {
  name: 'VueArea',
  components: { Pagination },
  data() {
    return {
      uploadPath,
      list: null,
      total: 0,
      gardens: null,
      image_url: '',
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        pid: undefined,
        image_url: '',
        type_name: undefined,
        sort: undefined,
        parent_id: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        type_name: [{ required: true, message: '墓区名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    headers() {
      return {
        'token': getToken()
      }
    }
  },
  created() {
    this.getList()
    get_gardens()
      .then(res => {
        this.gardens = res.data
      })
  },
  methods: {
    getList() {
      this.listLoading = true
      listArea(this.listQuery)
        .then(res => {
          this.list = res.data.data
          this.total = res.data.total || 0
          const items = res.data.data
          this.list = items.map(v => {
            this.$set(v, 'edit', false)
            v.originalTitle = v.sort
            return v
          })
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
    cancelEdit(row) {
      row.title = row.originalTitle
      row.edit = false
      this.$message({
        message: '操作取消',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.originalTitle = row.title
      updateArea(row)
        .then(() => {
          for (const v of this.list) {
            if (v.id === row.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, row)
              break
            }
          }
          this.$message({
            message: '更新墓区排序成功',
            type: 'success'
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
        id: undefined,
        type_name: undefined,
        image_url: '',
        sort: undefined,
        parent_id: undefined
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
          createArea(this.dataForm)
            .then(res => {
              console.log(res.data)
              this.list.unshift(res.data)
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '添加墓区成功'
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
      if (this.dataForm.image_url) {
        this.image_url = process.env.VUE_APP_BASE + this.dataForm.image_url
      } else {
        this.image_url = ''
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateArea(this.dataForm)
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
                message: '更新墓区成功'
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
      deleteArea(row)
        .then(res => {
          this.$notify.success({
            title: '成功',
            message: '删除墓区成功'
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
    handleAvatarSuccess(res, file) {
      this.image_url = process.env.VUE_APP_BASE + file.response.data
      this.dataForm.image_url = file.response.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style scope>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

