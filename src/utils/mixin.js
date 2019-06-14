import { mapGetters, mapActions } from 'vuex'
import { listlink } from '@/api/link'
import { get_gardens, get_styles, get_types, get_status } from '@/api/cemetery'
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
      listlink: null,
      cemetery: {
        g: null,
        a: null,
        s: null,
        t: null,
        u: null
      }
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
    },
    inquery() {
      get_gardens()
        .then(res => {
          this.cemetery.g = res.data
        })
      get_status()
        .then(res => {
          this.cemetery.u = res.data
        })
      get_styles()
        .then(res => {
          this.cemetery.s = res.data
        })
      get_types()
        .then(res => {
          this.cemetery.t = res.data
        })
    }
  }
}

