<template>
  <div class="container">
    <buy @v="v" />
    <dead @v="v" />
    <linkman />
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
    }
  }
}
</script>
<style scoped>

</style>

