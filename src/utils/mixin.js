import { mapGetters, mapActions } from 'vuex'
import { listlink } from '@/api/link'
export const vuexData = {
  data() {
    return {
      textMap: {
        update: '编辑',
        create: '创建'
      }
    }
  },
  computed: {
    ...mapGetters([
      'cems',
      'order',
      'payStatus',
      'cname'
    ])
  },
  methods: {
    ...mapActions({
      addCemetery: 'cemetery/addCemetery',
      changeOrders: 'cemetery/changeOrders',
      pay: 'cemetery/pay',
      addCname: 'cemetery/addCname'
    })
  }
}

export const page = {
  data() {
    return {
      listlink: null
    }
  },
  methods: {
    link() {
      const data = { cid: this.cems.id }
      listlink(data)
        .then(res => {
          this.listlink = res.data
        })
        .catch(() => {
          this.listlink = null
        })
    }
  }
}

