<template>
  <div class="flow--container is-small">
    <p class="page--heading">{{mainHeading}}</p>
    <p class="page--sub-heading">{{subHeading}}</p>
    <q-form @submit="handleCreateConnection" class="full-width">
      <q-input label="Name" v-model="connection.name"></q-input>
      <q-input label="API Token" v-model="connection.token"></q-input>
      <q-input label="Port" placeholder="59650" v-model="connection.port"></q-input>
      <q-input label="IP Address" placeholder="127.0.0.1" v-model="connection.ip"></q-input>
      <div class="q-pt-lg flex justify-end">
        <q-btn :disable="testingConnection" :loading="testingConnection" push color="secondary" class="q-mr-md" label="Test" @click="testConnection"></q-btn>
        <q-btn type="submit" :disable="!testedConnection || testingConnection" push color="primary" label="Create"></q-btn>
      </div>
    </q-form>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  import { SLOBSClient } from 'components/services/slobs-client'

  export default {
    name: 'connections-new',

    data () {
      return {
        client: null,
        connection: {
          ip: '127.0.0.1',
          isDefault: true,
          name: 'Local',
          port: '59650',
          token: '',
          type: 'SLOBS'
        },
        testedConnection: false,
        testingConnection: false
      }
    },

    computed: {
      ...mapGetters({
        needsConnection: 'connectionsNeedsDefault'
      }),

      mainHeading () {
        return this.needsConnection
          ? `Welcome to SLOBS Remote`
          : `Let's create a new connection`
      },

      subHeading () {
        return this.needsConnection
          ? `Let's get your first connection created`
          : `Let's create a new connection`
      }
    },

    methods: {
      ...mapActions(['createConnection', 'loadDefaultConnection']),

      async handleCreateConnection () {
        try {
          await this.createConnection({ data: this.connection })
          await this.loadDefaultConnection()

          this.$q.notify({
            message: 'Connection created',
            icon: 'done',
            type: 'positive'
          })

          this.$router.push({
            name: 'Dashboard'
          })
        } catch (e) {
          // Do something
        }
      },

      async testConnection () {
        this.client = new SLOBSClient({
          ip: this.connection.ip,
          port: this.connection.port,
          token: this.connection.token
        }, { onConnect: this.testPassed.bind(this) })
        this.client.connect()
        this.testingConnection = true

        setTimeout(() => {
          if (this.testingConnection) {
            this.testFailed()
          }
        }, 5000)
      },

      testFailed () {
        this.client.disconnect()
        this.client = null
        this.testedConnection = false
        this.testingConnection = false

        this.$q.notify({
          message: 'Connection unsuccessful',
          icon: 'close',
          type: 'negative'
        })
      },

      testPassed () {
        this.client.disconnect()
        this.client = null
        this.testingConnection = false
        this.testedConnection = true

        this.$q.notify({
          message: 'Connection successful',
          icon: 'done',
          type: 'positive'
        })
      }
    }
  }
</script>

<style scoped>

</style>
