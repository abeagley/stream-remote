import { openDB } from 'idb/with-async-ittr'

export const getDB = async () => {
  return await openDB('obs-button-panel', 1, {
    upgrade (db) {
      const buttons = db.createObjectStore('buttons', {
        keyPath: 'id',
        autoIncrement: true
      })
      const connections = db.createObjectStore('connections', {
        keyPath: 'id',
        autoIncrement: true
      })
      const images = db.createObjectStore('images', {
        keyPath: 'id',
        autoIncrement: true
      })
      const panels = db.createObjectStore('panels', {
        keyPath: 'id',
        autoIncrement: true
      })
      const settings = db.createObjectStore('settings', {
        keyPath: 'id',
        autoIncrement: true
      })

      buttons.createIndex('by-button-name', 'name')
      buttons.createIndex('by-button-image-id', 'imageId')
      buttons.createIndex('by-button-panel-id', 'panelId')
      connections.createIndex('by-connection-name', 'name')
      images.createIndex('by-image-name', 'name')
      panels.createIndex('by-panel-name', 'name')
      settings.createIndex('by-setting-name', 'name')
    }
  })
}
