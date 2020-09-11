<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <router-link to="/" class="navbar-brand mb-0 h1">
      <img src="./assets/logo.svg" width="30" height="30" class="d-inline-block align-top" alt="logo" loading="lazy">
      無人機雲端控制平台
      </router-link>
      <div id="item-list" class="ml-auto">
        <router-link to="/client" class="btn btn-success rounded-pill" target="_blank">客戶端</router-link>
      </div>
    </nav>
    <router-view class="view"/>
  </div>
</template>

<script>
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
export default {

}
</script>

<style scoped>
  #app  {
    display: flex;
    flex-flow: column nowrap;
    height: 100%;
    width: 100%;
  }
  nav {
    z-index: 999;
    box-shadow: 0 8px 6px -6px black;
  }
  .view {
    flex-grow: 1;
  }
</style>
