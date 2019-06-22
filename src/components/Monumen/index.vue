<template>
  <div style="height:700px;position: relative;">
    <el-button type="danger" plain size="small" @click="flag = true">竖碑</el-button>
    <el-button type="danger" plain size="small" @click="flag = false">横碑</el-button>
    <el-button v-if="flag" type="primary" plain size="small" @click="addBig">添加竖碑(大)</el-button>
    <el-button v-if="flag" type="primary" plain size="small" @click="addSmall">添加竖碑(小)</el-button>
    <el-button v-if="!flag" type="primary" plain size="small" @click="addh">添加横碑</el-button>
    <el-button type="primary" plain size="small" @click="rest">重置碑文</el-button>
    <el-button type="primary" plain size="small" @click="print">打印</el-button>
    <section ref="print">
      <template v-if="flag">
        <template v-for="(item,index) in vert">
          <drag :key="index" :child="item" />
        </template>
      </template>
      <template v-else>
        <template v-for="(item,index) in hori">
          <drag :key="index" :child="item" />
        </template>
      </template>
    </section>
    <!-- <p>大字：{{ fn.big }}</p>
    <p>小字：{{ fn.small }}</p> -->
  </div>
</template>
<script>
import { vuexData } from '@/utils/mixin'
import Drag from './components/Drag'
import text from '@/utils/text'
import { listdead } from '@/api/dead'
import { inscription_add, get_inscription } from '@/api/monumen'

const initHori = text.initHori
const initVert = text.initVert
export default {
  components: { Drag },
  mixins: [vuexData],
  data() {
    return {
      sex: '男',
      flag: true,
      dead: null,
      hori: [],
      vert: []
    }
  },
  // computed: {
  //   //计算大字小字
  //   fn: function() {
  //     let big = 0; let small = 0
  //     this.vert.filter((v, k) => {
  //       const text = v.t.match(/[\u4e00-\u9fa5]/g)
  //       if (text !== null) {
  //         v.t = text.join('')
  //       }
  //       v.s ? big += v.t.length : small += v.t.length
  //     }
  //     )
  //     return { big, small }
  //   }
  // },
  watch: {
    cems: {
      handler(val) {
        this.init()
      },
      immediate: true
    }
  },
  created() {

  },
  methods: {
    init() {
      const data = {
        cid: this.cems.id
      }
      get_inscription(data)
        .then(res => {
          if (res.data) {
            this.vert = res.data
          } else {
            this.rest()
          }
        })
      listdead(data)
        .then(res => {
          const dead = {
            dead1: '',
            dead2: ''
          }
          res.data.forEach((v, k) => {
            if (v.sex === this.sex) {
              dead.dead1 = res.data[k].vcname
            } else {
              dead.dead2 = res.data[k].vcname
            }
          })
          // console.log(dead)
          initVert.forEach((v, k) => {
            if (v.match === 'dead1') {
              v.t = dead.dead1
            } else if (v.match === 'dead2') {
              v.t = dead.dead2
            }
          })
        })
      this.hori = Object.assign([], initHori)
      this.vert = Object.assign([], initVert)
    },
    addBig() {
      const A = {
        t: '',
        s: true,
        e: false,
        h: false,
        l: 550,
        p: 20
      }
      this.vert.push(A)
    },
    addSmall() {
      const B = {
        t: '',
        s: false,
        e: false,
        h: false,
        l: 600,
        p: 20
      }
      this.vert.push(B)
    },
    addh() {
      const C = {
        t: '',
        s: false,
        e: false,
        h: true,
        l: 700,
        p: 20
      }
      this.hori.push(C)
    },
    print() {
      this.$print(this.$refs.print)
    },
    rest() {
      if (this.flag) {
        this.vert = Object.assign([], initVert)
      } else {
        this.hori = Object.assign([], initHori)
      }
    },
    getData() {
      const data = {
        cid: this.cems.id,
        inscription: this.vert
      }
      inscription_add(data)
        .then(res => {
          this.$emit('CloseDialog')
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
  }
}
</script>

