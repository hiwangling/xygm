<template>
  <div style="height:700px">
    <el-button type="danger" plain size="small" @click="flag = true">竖碑</el-button>
    <el-button type="danger" plain size="small" @click="flag = false">横碑</el-button>
    <el-button type="primary" plain size="small" @click="addBig">添加竖碑(大)</el-button>
    <el-button type="primary" plain size="small" @click="addSmall">添加竖碑(小)</el-button>
    <el-button type="primary" plain size="small" @click="addhorizontal">添加横碑</el-button>
    <el-button type="primary" plain size="small" @click="rest">重置清空碑文</el-button>
    <el-button type="primary" plain size="small" @click="print">打印</el-button>
    <section ref="print">
      <template v-if="flag">
        <template v-for="(item,index) in vert">
          <drag :key="index" :child="item" :top="item.top" :left="item.left" :header="item.header" :size="item.size" :horizontal="item.horizontal" />
        </template>
      </template>
      <template v-else>
        <template v-for="(item,index) in hori">
          <drag :key="index" :child="item" :top="item.top" :left="item.left" :header="item.header" :size="item.size" :horizontal="item.horizontal" />
        </template>
      </template>
    </section>
    <!-- <p>大字：{{ fn.big }}</p>
    <p>小字：{{ fn.small }}</p> -->
  </div>
</template>
<script>
import Drag from './components/Drag'
export default {
  components: { Drag },
  data() {
    return {
      flag: true,
      hori: [{
        txt: '父',
        size: true,
        header: false,
        horizontal: true,
        left: 150,
        top: 100
      }, {
        txt: '母',
        size: true,
        header: false,
        horizontal: true,
        left: 150,
        top: 150
      }, {
        txt: '孝男',
        size: false,
        header: false,
        horizontal: true,
        left: 130,
        top: 220
      }, {
        txt: '媳',
        size: false,
        header: false,
        horizontal: true,
        left: 300,
        top: 220
      }, {
        txt: '孙',
        size: false,
        header: false,
        horizontal: true,
        left: 500,
        top: 220
      }, {
        txt: '女',
        size: false,
        header: false,
        horizontal: true,
        left: 150,
        top: 300
      }, {
        txt: '婿',
        size: false,
        header: false,
        horizontal: true,
        left: 300,
        top: 300
      }, {
        txt: '年',
        size: true,
        header: false,
        horizontal: true,
        left: 580,
        top: 430
      }, {
        txt: '月',
        size: true,
        header: false,
        horizontal: true,
        left: 660,
        top: 430
      }, {
        txt: '日立',
        size: true,
        header: false,
        horizontal: true,
        left: 730,
        top: 430
      }],
      vert: [{
        txt: '先',
        size: false,
        header: false,
        horizontal: false,
        left: 755,
        top: 45
      }, {
        txt: '生于',
        size: false,
        header: false,
        horizontal: false,
        left: 755,
        top: 80
      }, {
        txt: '母',
        size: false,
        header: false,
        horizontal: false,
        left: 720,
        top: 60
      }, {
        txt: '父',
        size: false,
        header: false,
        horizontal: false,
        left: 795,
        top: 60
      }, {
        txt: '年',
        size: false,
        header: false,
        horizontal: false,
        left: 755,
        top: 180
      }, {
        txt: '月',
        size: false,
        header: false,
        horizontal: false,
        left: 755,
        top: 245
      }, {
        txt: '日卒于',
        size: false,
        header: false,
        horizontal: false,
        left: 755,
        top: 320
      }, {
        txt: '年',
        size: false,
        header: false,
        horizontal: false,
        left: 755,
        top: 435
      }, {
        txt: '月',
        size: false,
        header: false,
        horizontal: false,
        left: 755,
        top: 500
      }, {
        txt: '日',
        size: false,
        header: false,
        horizontal: false,
        left: 755,
        top: 560
      }, {
        txt: '先',
        size: true,
        header: false,
        horizontal: false,
        left: 500,
        top: 45
      }, {
        txt: '母',
        size: true,
        header: false,
        horizontal: false,
        left: 460,
        top: 70
      }, {
        txt: '父',
        size: true,
        header: false,
        horizontal: false,
        left: 540,
        top: 70
      }, {
        txt: '大人之墓',
        size: true,
        header: false,
        horizontal: false,
        left: 500,
        top: 270
      }, {
        txt: '孝',
        size: false,
        header: false,
        horizontal: false,
        left: 250,
        top: 45
      }, {
        txt: '女',
        size: false,
        header: false,
        horizontal: false,
        left: 210,
        top: 70
      }, {
        txt: '男',
        size: false,
        header: false,
        horizontal: false,
        left: 290,
        top: 70
      }, {
        txt: '年',
        size: false,
        header: false,
        horizontal: false,
        left: 125,
        top: 365
      }, {
        txt: '月',
        size: false,
        header: false,
        horizontal: false,
        left: 125,
        top: 430
      }, {
        txt: '日立',
        size: false,
        header: false,
        horizontal: false,
        left: 125,
        top: 500
      }
      ]
    }
  },
  computed: {
    fn: function() {
      let big = 0; let small = 0
      this.vert.filter((v, k) => {
        const text = v.txt.match(/[\u4e00-\u9fa5]/g)
        if (text !== null) {
          v.txt = text.join('')
        }
        v.size ? big += v.txt.length : small += v.txt.length
      }
      )
      return { big, small }
    }
  },
  methods: {
    addBig() {
      const tempA = {
        txt: '竖排大',
        size: true,
        header: false,
        horizontal: false,
        left: 550,
        top: 10
      }
      this.vert.push(tempA)
    },
    addSmall() {
      const tempB = {
        txt: '竖排小',
        size: false,
        header: false,
        horizontal: false,
        left: 600,
        top: 10
      }
      this.vert.push(tempB)
    },
    addhorizontal() {
      const horizontal = {
        txt: '横排小',
        size: false,
        header: false,
        horizontal: true,
        left: 700,
        top: 10
      }
      this.hori.push(horizontal)
    },
    print() {
      this.$print(this.$refs.print)
    },
    rest() {
      this.vert = []
    }
  }
}
</script>

