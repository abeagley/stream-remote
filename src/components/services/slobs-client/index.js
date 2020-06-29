import SockJS from 'sockjs-client'

export class SLOBSClient {
  // Callback properties
  onConnect = null
  onDisconnect = null
  onFail = null
  onRequestData = null

  // Connection properties
  connected = false
  ip = null
  port = null
  requests = {}
  socket = null
  token = null
  totalRequests = 0

  // Vuex store
  store = null

  constructor (conn = {}, opts = {}, store = null) {
    // Connection info
    this.ip = conn.ip || '127.0.0.1'
    this.port = conn.port || '59650'
    this.token = conn.token || null

    // Callbacks
    this.onConnect = opts.onConnect || null
    this.onDisconnect = opts.onDisconnect || null
    this.onFail = opts.onFail || null
    this.onRequestData = opts.onRequestData || null

    // Vuex
    this.store = store || null
  }

  // Primary public methods

  connect () {
    this.socket = new SockJS(`http://${this.ip}:${this.port}/api`)

    this.socket.onerror = () => {
      console.log('BA BOOM')
      if (this.onFail) {
        this.onFail()
      }
    }

    this.socket.onopen = () => {
      this.request('TcpServerService', 'auth', this.token)
        .then(() => {
          this.connected = true
          if (this.onConnect) {
            this.onConnect()
          }
        })
        .catch((e) => {
          if (this.onFail) {
            this.onFail()
          }
        })
    }

    this.socket.onmessage = (e) => {
      const message = this.handleMessage(e.data)
      if (this.onRequestData) {
        this.onRequestData(message)
      }
    }

    this.socket.onclose = (e) => {
      this.connected = false
      if (this.onDisconnect) {
        this.onDisconnect()
      }
    }
  }

  disconnect () {
    if (!this.socket || !this.connected) {
      return false
    }

    this.socket.close()
  }

  request (resourceId, methodName, ...args) {
    if (!this.socket) {
      return false
    }

    this.totalRequests += 1
    const id = `r${this.totalRequests}`
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

  subscribe () {
    // Not sure yet
  }

  // Standard get operations
  async getScenes () {
    try {
      const scenes = await this.request('ScenesService', 'getScenes')
      console.log(scenes)
      return scenes
    } catch (e) {
      // Do something
      return []
    }
  }

  // Handlers

  handleMessage (data) {
    const message = JSON.parse(data)
    const request = this.requests[message.id]

    if (request) {
      if (message.error) {
        request.reject(message.error)
      } else {
        request.resolve(message.result)
      }
      delete this.requests[message.id]
    }

    const result = message.result
    if (!result) return false

    if (result._type === 'EVENT' && result.emitter === 'STREAM') {
      // subscript stuff
      // result.data
    }
  }
}
