<template>
  <div id="q-app">
    <transition mode="out-in" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <router-view />
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>
