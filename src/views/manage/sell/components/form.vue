<template>
  <div>
    <div style="height:50px">
      <el-form ref="bury" status-icon label-position="left" label-width="100px" style="width: 600px; ">
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
    <el-form ref="bury" :inline="true" status-icon label-position="left" label-width="100px">
      <div v-for="(idx,item) in Number(type_id)" :key="idx">
        <el-form-item :label="'墓主(' + item + ')'">
          <el-input v-model="bury[item].vcname" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="bury[item].sex">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="bury[item].card_no" />
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
            v-model="bury[item].birth"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="去世日期">
          <el-date-picker
            v-model="bury[item].death"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="安葬日期">
          <el-date-picker
            v-model="bury[item].bury"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import { listType } from '@/api/type'
import { vuexData, page } from '@/utils/mixin'
import { addbuy } from '@/api/buy'
export default {
  mixins: [vuexData, page],
  data() {
    return {
      type_id: '2',
      bury: null,
      cemeteryType: null
    }
  },
  watch: {
    cems: {
      handler(val) {
        this.Creattype()
        this.SeleteCeme(this.type_id)
      },
      immediate: true
    }
  },
  methods: {
    resetForm() {
      this.bury = [{
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
    SeleteCeme(val) {
      this.resetForm()
      for (let i = 0; i < val - 1; i++) {
        this.bury.push({
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
    addForm(val) {
      const obj = Object.assign({}, this.bury)
      const dead = []
      for (const i in obj) {
        dead.push(obj[i])
      }
      dead.forEach((v, k) => {
        if (v.vcname === '') {
          const index = dead.indexOf(v)
          dead.splice(index, 1)
        }
      })
      const data = {
        buy: val,
        dead: dead
      }
      addbuy(data)
        .then(res => {
          // res.data.sell_price = this.cems.sellprice
          // this.list.unshift(res.data)
          // this.dialogFormVisible = false
          this.$emit('CloseDialog', false)
          console.log(1)
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
    Creattype() {
      listType()
        .then(res => {
          this.cemeteryType = res.data
        })
    }
  }
}
</script>
