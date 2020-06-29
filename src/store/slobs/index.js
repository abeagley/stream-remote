export default {
  state: {
    slobsActiveSceneId: '',
    slobsScenes: []
  },

  getters: {
    slobsActiveSceneId: (state) => state.slobsActiveSceneId,
    slobsActiveScene: (state) => {
      if (!state.slobsActiveSceneId || state.slobsScenes.length === 0) {
        return null
      }

      return state.slobsScenes.find((s) => s.id === state.slobsActiveSceneId)
    },
    slobsScenes: (state) => state.slobsScenes
  },

  actions: {
    slobsAddScene ({ commit, getters }, scene) {
      commit('slobsSetScenes', [...getters.slobsScenes, scene])
    },

    slobsRemoveScene ({ commit, getters }, scene) {
      commit('slobsSetScenes', getters.slobsScenes.filter((s) => s.id !== scene.id))
    }
  },

  mutations: {
    slobsSetActiveSceneId (state, id) {
      state.slobsActiveSceneId = id
    },

    slobsSetScenes (state, scenes) {
      state.slobsScenes = scenes
    }
  }
}
