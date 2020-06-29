<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page>
        <transition mode="out-in" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
          <router-view v-if="init" />
        </transition>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'main-electron-layout',

    beforeRouteEnter (to, prev, next) {
      next((vm) => {
        if (vm.needsConnection && to.name !== 'Connections New') {
          vm.$router.replace({
            name: 'Connections New'
          })
        }

        if (!vm.needsConnection && vm.defaultConnection && vm.$slobs) {
          vm.startSocket(vm.defaultConnection)
        }
      })
    },

    computed: mapGetters({
      defaultConnection: 'connectionDefault',
      init: 'connectionsInitialized',
      needsConnection: 'connectionsNeedsDefault'
    }),

    data () {
      return {
        slobsVuex: null
      }
    },

    methods: {
      startSocket (conn) {
        this.$slobs.connect(conn)
      },

      minimize () {
        if (process.env.MODE === 'electron') {
          this.$q.electron.remote.BrowserWindow.getFocusedWindow().minimize()
        }
      },

      maximize () {
        if (process.env.MODE === 'electron') {
          const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow()

          if (win.isMaximized()) {
            win.unmaximize()
          } else {
            win.maximize()
          }
        }
      },

      closeApp () {
        if (process.env.MODE === 'electron') {
          this.$q.electron.remote.BrowserWindow.getFocusedWindow().close()
        }
      }
    },

    watch: {
      defaultConnection (newValue, oldValue) {
        if (newValue && !oldValue) {
          // Default connection was just created
          this.startSocket(newValue)
        }
      },

      needsConnection (newValue, oldValue) {
        console.log(newValue, oldValue)
      }
    }
  }
</script>
