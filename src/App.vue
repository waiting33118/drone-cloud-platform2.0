<template>
  <div id="app">
    <nav class="navbar navbar-expand-md navbar-light bg-light">
      <router-link to="/" class="navbar-brand mb-0 h1 mr-0">
      <img src="./assets/logo.svg" width="30" height="30" class="d-inline-block align-top" alt="logo" loading="lazy">
      Drone Cloud Platform 2.0
      </router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
        <ul class="navbar-nav ml-auto mt-2 mt-lg-0">
          <li class="nav-item d-flex justify-content-center mb-2 mb-md-0">
            <router-link v-if="$route.path === '/client'" to="/authorize" class="btn btn-success rounded-pill mr-md-1">Authorize</router-link>
          </li>
          <li class="nav-item d-flex justify-content-center">
              <router-link v-if="$route.path === '/client'" to="/" class="btn btn-primary rounded-pill">Home</router-link>
              <router-link v-else to="/client" class="btn btn-success rounded-pill" target="_blank">Client</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <router-view class="view"/>
  </div>
</template>

<script>
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

export default {
  name: 'App'
}
</script>

<style scoped>
#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
nav {
  z-index: 999;
  box-shadow: 0 8px 6px -6px black;
}
.view {
  flex-grow: 1;
}
</style>
