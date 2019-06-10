import { mapGetters, mapActions } from 'vuex'
export const vuexData = {
  data() {
    return {
      showFlag: true
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

