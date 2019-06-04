<template>
  <div style="height:600px">
    <el-button type="primary" @click="addBig">添加竖碑(大)</el-button>
    <el-button type="primary" @click="addSmall">添加竖碑(小)</el-button>
    <el-button type="primary" @click="addhorizontal">添加横碑</el-button>
    <el-button type="primary" @click="rest">重置清空碑文</el-button>
    <template v-for="(item,index) in content">
      <drag :key="index" :child="item" :top="item.top" :left="item.left" :horizontal="item.horizontal" />
    </template>
    <p>大字：{{ fn.big }}</p>
    <p>小字：{{ fn.small }}</p>
  </div>
</template>
<script>
import Drag from './components/Drag'
export default {
  components: { Drag },
  data() {
    return {
      content: [{
        txt: '一九八九',
        size: true,
        horizontal: false,
        left: 100,
        top: 150
      }, {
        txt: '一九八八',
        size: false,
        horizontal: false,
        left: 400,
        top: 50
      }]
    }
  },
  computed: {
    fn: function() {
      let big = 0; let small = 0
      this.content.filter((v, k) => {
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
        horizontal: false,
        left: 550,
        top: 10
      }
      this.content.push(tempA)
    },
    addSmall() {
      const tempB = {
        txt: '竖排小',
        size: false,
        horizontal: false,
        left: 600,
        top: 10
      }
      this.content.push(tempB)
    },
    addhorizontal() {
      const horizontal = {
        txt: '横排小',
        size: false,
        horizontal: true,
        left: 700,
        top: 10
      }
      this.content.push(horizontal)
    },
    rest() {
      this.content = []
    }
  }
}
</script>

