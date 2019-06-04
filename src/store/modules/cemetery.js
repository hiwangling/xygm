import { get_order_status } from '@/api/buy'
const state = {
  cems: null,
  pay: '',
  order: 0
}

const mutations = {
  ADD_CEMETERY: (state, cems) => {
    state.cems = cems
  },
  ADD_PAY: (state, pay) => {
    state.pay = pay
  },
  ADD_INDEX: (state, order) => {
    state.order = parseInt(order)
  }
}

const actions = {
  addCemetery({ commit }, cems) {
    commit('ADD_CEMETERY', cems)
  },
  changeOrders({ commit }, order) {
    commit('ADD_INDEX', order)
  },
  pay({ commit }, cid) {
    return new Promise((resolve, reject) => {
      const data = { cid: cid }
      get_order_status(data).then(response => {
        const { data } = response
        if (data.order_status) {
          commit('ADD_PAY', data.order_status)
        } else {
          commit('ADD_PAY', 1)
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
