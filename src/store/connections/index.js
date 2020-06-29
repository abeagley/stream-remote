import { getDB } from 'components/services/db'
import log from 'components/services/logger'

export default {
  state: {
    connection: null,
    connectionCreating: false,
    connectionDefault: null,
    connectionLoading: false,
    connections: [],
    connectionsLoading: false,
    connectionsInitialized: false,
    connectionsNeedsDefault: false,
    connectionUpdating: false
  },

  getters: {
    connection: (state) => state.connection,
    connectionCreating: (state) => state.connectionCreating,
    connectionDefault: (state) => state.connectionDefault,
    connectionLoading: (state) => state.connectionLoading,
    connections: (state) => state.connections,
    connectionsLoading: (state) => state.connectionsLoading,
    connectionsInitialized: (state) => state.connectionsInitialized,
    connectionsNeedsDefault: (state) => state.connectionsNeedsDefault,
    connectionUpdating: (state) => state.connectionUpdating
  },

  actions: {
    async loadConnection ({ commit }, details) {
      commit('loadingConnection')

      let connection = null
      try {
        const db = await getDB()
        connection = await db.get('connections', details.connectionId)
      } catch (e) {
        log.error(e)
        throw e
      }

      commit('loadingConnectionComplete', connection)
    },

    async loadConnections ({ commit }, details) {
      commit('loadingConnections')

      let connections = []
      try {
        const db = await getDB()
        connections = await db.getAllFromIndex('connections', 'by-connection-name')
      } catch (e) {
        log.error(e)
        throw e
      }

      commit('loadingConnectionsComplete', connections)
      return connections || []
    },

    async loadDefaultConnection ({ commit, dispatch }) {
      commit('loadingConnectionDefault')

      let connection = null
      try {
        const connections = await dispatch('loadConnections')
        connection = connections.find((c) => c.isDefault)
      } catch (e) {
        log.error(e)
        throw e
      }

      commit('loadingConnectionDefaultComplete', connection)
      return connection
    },

    async createConnection ({ commit, dispatch }, details) {
      commit('creatingConnection')

      let connectionId = null
      try {
        const db = await getDB()
        connectionId = await db.add('connections', details.data)
      } catch (e) {
        log.error(e)
        commit('creatingConnectionComplete')
        throw e
      }

      commit('creatingConnectionComplete')
      return connectionId
    },

    async updateConnection ({ commit }, details) {
      commit('updatingConnection')
      commit('updatingConnectionComplete')
    }
  },

  mutations: {
    creatingConnection (state) {
      state.connectionCreating = true
    },

    creatingConnectionComplete (state) {
      state.connectionCreating = false
    },

    loadingConnection (state) {
      state.connection = null
      state.connectionLoading = true
    },

    loadingConnectionComplete (state, connection) {
      state.connectionLoading = false
      state.connection = connection
    },

    loadingConnectionDefault (state) {
      state.connectionDefault = null
    },

    loadingConnectionDefaultComplete (state, connection) {
      state.connectionDefault = connection
    },

    loadingConnections (state) {
      state.connections = []
      state.connectionsLoading = true
    },

    loadingConnectionsComplete (state, connections) {
      state.connectionsLoading = false
      state.connections = connections
    },

    setConnectionsInitialized (state) {
      state.connectionsInitialized = true
    },

    setConnectionsNeedsDefault (state) {
      state.connectionsInitialized = true
      state.connectionsNeedsDefault = true
    },

    updatingConnection (state) {
      state.connectionUpdating = true
    },

    updatingConnectionComplete (state, connection) {
      state.connectionUpdating = false
      state.connection = connection
    }
  }
}
