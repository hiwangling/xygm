<template>
  <div
    v-drag
    class="box"
    :contenteditable="true"
    :style="{'top':top + 'px','left':left + 'px','width':horizontal ? 'auto' : '22px'}"
    @input="changeTxt"
    @focus="lock=true"
    @blur="lock=false"
    v-html="innerText"
  />
</template>
<script>
export default {
  directives: {
    drag: {
      bind: function(el) {
        const odiv = el // 获取当前元素
        odiv.onmousedown = (e) => {
          // 算出鼠标相对元素的位置
          const disX = e.clientX - odiv.offsetLeft
          const disY = e.clientY - odiv.offsetTop

          document.onmousemove = (e) => {
            // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            const left = e.clientX - disX
            const top = e.clientY - disY

            // 绑定元素位置到positionX和positionY上面
            window.positionX = top
            window.positionY = left
            // 移动当前元素
            odiv.style.left = left + 'px'
            odiv.style.top = top + 'px'
          }
          document.onmouseup = (e) => {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    }
  },
  props: {
    child: {
      type: Object,
      required: true
    },
    top: {
      type: null,
      required: true
    },
    left: {
      type: null,
      required: true
    },
    horizontal: {
      type: null,
      required: true
    }
  },
  data() {
    return {
      innerText: this.child.txt,
      lock: false
    }
  },
  watch: {
    child: {
      handler(newValue, oldValue) {
        if (!this.lock) {
          this.innerText = this.child.txt
        }
      },
      deep: true
    }
  },
  methods: {
    changeTxt: function(e) {
      this.child.txt = this.$el.innerHTML
    }
  }

}
</script>
<style scoped>
 .box{
        position: absolute;
        top: 10px;
        left: 10px;
        width: 22px;
        padding: 2px 0px;
        text-align: center;
        cursor:pointer;
        /* border: 1px dashed #666; */
        border-top: 3px solid #4a9ff9;
        outline: none;
    }
</style>
