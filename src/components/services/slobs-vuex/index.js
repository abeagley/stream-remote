import SockJS from 'sockjs-client'

import logger from 'components/services/logger'

export class SLOBSVuex {
  connected = false
  requests = {}
  requestsTotal = 0
  subscriptions = {}

  constructor (conn = {}, store) {
    this.conn = conn
    this.store = store
  }

  // Actions

  connect (conn) {
    if (conn) {
      this.conn.token = conn.token
    }

    this.socket = new SockJS(`http://${conn.ip}:${conn.port}/api`)

    this.socket.onclose = this.handleSocketClose.bind(this)
    this.socket.onerror = this.handleSocketError.bind(this)
    this.socket.onmessage = this.handleSocketMessage.bind(this)
    this.socket.onopen = this.handleSocketOpen.bind(this)
  }

  disconnect () {
    if (!this.socket) {
      logger.error('no SLOBS Vuex socket to close')
      return false
    }

    this.socket.close()
  }

  doChangeScene (sceneId) {
    this.makeRequest('ScenesService', 'makeSceneActive', sceneId)
  }

  makeRequest (resourceId, methodName, ...args) {
    if (!this.socket) {
      logger.error('no SLOBS Vuex socket to send request')
      return false
    }

    this.requestsTotal += 1
    const id = `r${this.requestsTotal}`
    const newRequest = {
      jsonrpc: '2.0',
      id,
      method: methodName,
      params: { resource: resourceId, args }
    }

    return new Promise((resolve, reject) => {
      this.requests[id] = {
        resolve,
        reject
      }

      this.socket.send(JSON.stringify(newRequest))
    })
  }

  subscribe (resourceId, channelName, cb) {
    this.makeRequest(resourceId, channelName).then((subscriptionInfo) => {
      this.subscriptions[subscriptionInfo.resourceId] = cb
    })
  }

  subscribeToStreams () {
    // Initial lists
    try {
      this.makeRequest('ScenesService', 'getScenes').then(this.setScenes.bind(this))
      this.makeRequest('ScenesService', 'activeSceneId').then(this.setActiveSceneId.bind(this))

      this.subscribe('ScenesService', 'sceneSwitched', (scene) => this.changeActiveScene(scene))
      this.subscribe('ScenesService', 'sceneAdded', (scene) => this.addScene(scene))
      this.subscribe('ScenesService', 'sceneRemoved', (scene) => this.removeScene(scene))
      this.subscribe('SourcesService', 'sourceUpdated', (source) => this.updateSource(source))
      this.subscribe('ScenesService', 'itemAdded', (item) => this.addItem(item))
      this.subscribe('ScenesService', 'itemUpdated', (item) => this.updateItem(item))
    } catch (e) {
      logger.error(e)
    }
  }

  // Socket Events

  handleSocketClose () {
    logger.info('SLOBS Vuex socket has been closed')
    this.connected = false
  }

  handleSocketError (e) {
    logger.error(e)
  }

  handleSocketMessage (message) {
    const data = JSON.parse(message.data)
    const request = this.requests[data.id]

    if (request) {
      if (data.error) {
        request.reject(data.error)
      } else {
        request.resolve(data.result)
      }
      delete this.requests[data.id]
    }

    const result = data.result
    if (!result) return false

    if (result._type === 'EVENT' && result.emitter === 'STREAM') {
      this.subscriptions[result.resourceId](result.data)
    }
  }

  handleSocketOpen () {
    if (!this.conn) {
      logger.error(`no configuration object available for handling SLOBS Vuex socket event 'open'`)
      this.disconnect()
      return false
    }

    logger.info('SLOBS Vuex socket has been opened')
    this.connected = true

    this.makeRequest('TcpServerService', 'auth', this.conn.token)
      .then(() => {
        this.connected = true
        this.subscribeToStreams()
      })
      .catch((e) => {
        logger.error(e)
      })
  }

  // Vuex Setters

  addItem (item) {
    logger.info('ADD ITEM', item)
  }

  addScene (scene) {
    this.store.dispatch('slobsAddScene', scene)
  }

  changeActiveScene (scene) {
    this.store.commit('slobsSetActiveSceneId', scene.id)
  }

  removeScene (scene) {
    this.store.dispatch('slobsRemoveScene', scene)
  }

  setActiveSceneId (sceneId) {
    this.store.commit('slobsSetActiveSceneId', sceneId)
  }

  setScenes (scenes) {
    this.store.commit('slobsSetScenes', scenes)
  }

  updateItem (item) {
    logger.info('UPDATE ITEM', item)
  }

  updateSource (source) {
    logger.info('UPDATED SOURCE', source)
  }
}
