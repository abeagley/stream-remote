<template>
  <div>
    <q-toolbar class="bg-primary">
      <q-icon name="wifi" size="sm" color="positive"></q-icon>
      <q-toolbar-title>
        {{activeSceneName}}
      </q-toolbar-title>
      <q-btn flat round dense icon="apps">
        <q-menu auto-close content-class="bg-primary text-white">
          <q-list style="min-width: 100px">
            <q-item
              v-for="scene in scenes"
              :key="scene.id"
              :active="scene.id === activeSceneId"
              active-class="bg-dark text-white"
              @click="() => handleChangeScene(scene)"
              clickable
            >
              <q-item-section>{{scene.name}}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <q-btn flat round dense icon="more_vert">
        <q-menu auto-close content-class="bg-primary text-white">
          <q-list style="min-width: 100px">
            <q-item clickable active-class="bg-accent text-white">
              <q-item-section>Settings</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Help &amp; Feedback</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
    <div class="dashboard--items" v-if="activeScene">
      <div class="dashboard--item" v-for="node in activeScene.nodes" :key="node.id">
        <div class="dashboard--btn">
          <div class="dashboard--btn-inner bg-primary">
            <span>{{node.name}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'dashboard',

    mounted () {
      console.log(this.$slobs)
    },

    computed: {
      ...mapGetters({
        activeSceneId: 'slobsActiveSceneId',
        activeScene: 'slobsActiveScene',
        scenes: 'slobsScenes'
      }),

      activeSceneName () {
        return (this.activeScene) ? this.activeScene.name : 'Scene Dashboard'
      }
    },

    methods: {
      handleChangeScene (scene) {
        if (scene.id !== this.activeSceneId) {
          this.$slobs.doChangeScene(scene.id)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .dashboard--items {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;

    .dashboard--item {
      height: 182px;
      padding: 1rem;
      position: relative;
      width: 20%;

      .dashboard--btn {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        height: 100%;
        padding: 1rem;
        position: relative;
        width: 100%;

        .dashboard--btn-inner {
          align-items: center;
          border-radius: 8px;
          display: flex;
          height: 100%;
          justify-content: center;
          padding: 0 1rem;
          position: relative;
          width: 100%;

          span {
            display: block;
            overflow: hidden;
            text-align: center;
            text-overflow: ellipsis;
            width: 100%;
            white-space: nowrap;
          }
        }
      }
    }
  }
</style>
