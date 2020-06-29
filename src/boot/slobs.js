import { SLOBSVuex } from 'components/services/slobs-vuex'

export default async ({ store, Vue }) => {
  Vue.prototype.$SLOBSClient = SLOBSVuex

  let defaultConnection = null
  try {
    defaultConnection = await store.dispatch('loadDefaultConnection')
  } catch (e) {
    // Do nothing... yet
  }

  if (!defaultConnection) {
    Vue.prototype.$slobs = new SLOBSVuex({}, store)
    store.commit('setConnectionsNeedsDefault')
    return true
  }

  Vue.prototype.$slobs = new SLOBSVuex({
    ip: defaultConnection.ip,
    port: defaultConnection.port,
    token: defaultConnection.token
  }, store)
  store.commit('setConnectionsInitialized')
}
