<template>
  <div>
    <button class="btn btn-primary rounded-pill" @click.prevent.stop="getPermission">請求權限</button>
    <video autoplay></video>
  </div>
</template>

<script>
export default {
  name: 'Client',
  data () {
    return {
    }
  },
  methods: {
    // async featureDetection () {
    //   console.log(navigator.mediaDevices)
    //   console.log(navigator.mediaDevices.getUserMedia)
    //   const checkSupported = await !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    //   checkSupported ? this.getPermission() : alert('此瀏覽器無支援userMedia功能')
    // },
    async getPermission () {
      console.log('getPermission')
      const constraints = {
        video: true,
        audio: true
      }
      const video = document.querySelector('video')
      await navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => { video.srcObject = stream })
    }
  }
}
</script>

<style scoped>
</style>
