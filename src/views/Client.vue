<template>
  <div id="wapper">
    <video autoplay controls width="500"></video>
  </div>
</template>

<script>
export default {
  name: 'Client',
  data () {
    return {
      constraints: {
        video: { width: { exact: 1280 }, height: { exact: 720 } },
        audio: false
      }
    }
  },
  methods: {
    async featureDetection () {
      try {
        console.log(navigator.mediaDevices.getSupportedConstraints())
        const checkSupported = await !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
        checkSupported ? this.getPermission() : alert('此瀏覽器無支援userMedia功能')
      } catch (error) {
        throw new Error(error)
      }
    },
    async getPermission () {
      try {
        const video = document.querySelector('video')
        await navigator.mediaDevices.getUserMedia(this.constraints)
          .then(stream => {
            const videoTracks = stream.getVideoTracks()
            const audioTracks = stream.getAudioTracks()
            video.srcObject = stream
            window.stream = stream
            console.log(videoTracks)
            console.log(audioTracks)
          })
      } catch (error) {
        throw new Error(error)
      }
    }
  },
  created () {
    this.featureDetection()
  }
}
</script>

<style scoped>
  #wapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  video {
    display: block;
    box-shadow: 0px 0px 8px 6px gray;
    border-radius: 5px;
  }
</style>
