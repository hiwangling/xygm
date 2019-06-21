<template>
  <div class="container">
    <buy @v="v" />
    <dead ref="dead" @v="v" />
    <linkman ref="linkman" />
  </div>
</template>
<script>
import buy from './components/buy'
import dead from './components/dead'
import linkman from './components/linkman'
export default {
  components: { buy, dead, linkman },
  data() {
    return {

    }
  },
  methods: {
    v() {
      this.$emit('v')
      this.$refs.dead.refresh()
      this.$refs.linkman.refresh()
    }
  }
}
</script>
<style scoped>

</style>

