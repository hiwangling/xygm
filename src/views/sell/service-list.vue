<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable class="filter-item" style="width: 200px;" placeholder="请输入墓主或墓号" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>
    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="墓名" prop="cname" width="200" />
      <el-table-column align="center" label="墓主" prop="vcname" width="150" />
      <el-table-column align="center" label="联系人" prop="buyer_name" width="150" />
      <el-table-column align="center" label="已完成服务" prop="finish_num">
        <template slot-scope="scope">
          {{ scope.row.finish_num }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="未完成服务" prop="to_be_com_num">
        <template slot-scope="scope">
          <span style="color:red"> {{ scope.row.to_be_com_num }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="wancheng_status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.wancheng_status | or_status">
            {{ scope.row.wancheng_status == 1 ? '待完成' : '已完成' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog class="dialog" :title="dialogStatus" :visible.sync="dialogFormVisible" top="5vh">
      <el-table v-loading="listLoading_" :data="list_service" element-loading-text="正在查询中。。。" border fit highlight-current-row>
        <el-table-column align="center" label="服务名称" prop="service_name" />
        <el-table-column align="center" label="服务数量" prop="serviceamount" width="80" />
        <el-table-column align="center" label="创建时间" prop="begindate" width="100" />
        <el-table-column align="center" label="状态" prop="resutlstatus" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.resutlstatus | or_status">
              {{ scope.row.resutlstatus == 1 ? '待完成' : '已完成' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="130">
          <template slot-scope="scope">
            <el-button v-if="scope.row.resutlstatus == 2 " type="primary" size="mini" @click="handleCat(scope.row.id)">查看</el-button>
            <el-button v-else type="danger" size="mini" @click="handleCreate(scope.row.id)">执行</el-button>
          </template>

        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog class="dialog" :title="textMap[dialogStatus2]" :visible.sync="dialogFormVisible_" top="5vh">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="margin-left:50px;">
        <el-form-item label="完成时间" prop="execdate">
          <el-date-picker
            v-model="dataForm.execdate"
            type="date"
            :disabled="flag ? true : false"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item v-if="flag" label="执行人">
          <el-input v-model="operater_name" :disabled="flag ? true : false" />
        </el-form-item>
        <el-form-item label="上传图片">
          <span v-if="!flag" style="color:red">只能上传image/jpeg文件，且不超过2M</span>
          <el-upload
            class="avatar-uploader"
            :headers="headers"
            :action="uploadPath"
            :disabled="flag ? true : false"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="image_url" :src="image_url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="服务说明" prop="execnote">
          <el-input v-model="dataForm.execnote" :disabled="flag ? true : false" type="textarea" style="width: 250px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_ = false">取消</el-button>
        <el-button v-if="flag == false" type="primary" @click="SendData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { AllCemetery, AllCemeteryCid, ExecuteService, CatService } from '@/api/to-service'
// import { get_name } from '@/api/cemetery'
import { uploadPath } from '@/api/upload'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'

export default {
  name: 'VueSaveList',
  components: { Pagination },
  data() {
    return {
      uploadPath,
      list: null,
      list_service: null,
      operater_name: '',
      total: 0,
      image_url: '',
      flag: false,
      listLoading: true,
      listLoading_: true,
      dialogStatus: '',
      dialogStatus2: '',
      textMap: {
        update: '查看服务',
        create: '服务执行'
      },
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        save_status: '',
        sort: 'add_time',
        order: 'desc'
      },
      dialogFormVisible: false,
      dialogFormVisible_: false,
      dataForm: {
        cid: '',
        id: '',
        image_url: '',
        execdate: '',
        execnote: ''
      },
      rules: {
        execdate: [{ required: true, message: '服务时间不能为空', trigger: 'change' }]
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
  },
  methods: {
    getList() {
      this.listLoading = true
      AllCemetery(this.listQuery)
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdate(row) {
      this.listLoading_ = true
      this.dialogStatus = row.cname
      this.dialogFormVisible = true
      this.dataForm.cid = row.cid
      const data = { cid: row.cid }
      AllCemeteryCid(data)
        .then(res => {
          this.list_service = res.data
          this.listLoading_ = false
        })
        .catch(() => {
          this.list_service = []
          this.listLoading_ = false
        })
    },
    handleCat(id) {
      this.flag = true
      this.dialogStatus2 = 'update'
      const data = { id: id }
      CatService(data)
        .then(res => {
          this.dialogFormVisible_ = true
          this.image_url = res.data.image_url !== '' ? process.env.VUE_APP_BASE + res.data.image_url : ''
          this.dataForm.execdate = res.data.execdate
          this.operater_name = res.data.operater_name
          this.dataForm.execnote = res.data.execnote
        })
    },
    handleCreate(id) {
      this.flag = false
      this.dialogStatus2 = 'create'
      this.dataForm.execdate = ''
      this.dataForm.execnote = ''
      this.dialogFormVisible_ = true
      this.dataForm.id = id
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      //    if (this.dataForm.image_url) {
      //   this.image_url = process.env.VUE_APP_BASE + this.dataForm.image_url
      // } else {
      //   this.image_url = ''
      // }
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
    },
    SendData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          ExecuteService(this.dataForm)
            .then(res => {
              for (const v of this.list_service) {
                if (v.id === res.data.id) {
                  v.resutlstatus = 2
                  break
                }
              }
              this.getList()
              this.dialogFormVisible_ = false
              this.$notify.success({
                title: '成功',
                message: '服务执行成功'
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
