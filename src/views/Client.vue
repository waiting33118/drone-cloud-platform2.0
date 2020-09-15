<template>
  <div id="wapper">
    <div class="container p-3 d-flex justify-content-around">
        <select id="videoSelected" class="form-control w-50" @change.prevent.stop="videoSourceChange">
          <option disabled>鏡頭選擇</option>
          <option v-for="videoSource in videoSources" :key="videoSource.deviceId" :value="videoSource.deviceId">{{videoSource.label}}</option>
        </select>
        <select class="form-control w-25">
          <option disabled>錄音選擇</option>
          <option v-for="audioSource in audioSources" :key="audioSource.deviceId" :value="audioSource.deviceId">{{audioSource.label}}</option>
        </select>
    </div>
    <video autoplay controls></video>
  </div>
</template>

<script>
export default {
  name: 'Client',
  data () {
    return {
      constraints: {
        video: {
          deviceId: '',
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { max: 60 }
        },
        audio: {
          echoCancellation: false
        }
      },
      videoSources: [],
      audioSources: []
    }
  },
  methods: {
    async featureDetection () {
      try {
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
            video.srcObject = stream
            window.stream = stream
          })
      } catch (error) {
        throw new Error(error)
      }
    },
    getVideoSource () {
      const enumeratorPromise = navigator.mediaDevices.enumerateDevices()
      enumeratorPromise
        .then(devices => {
          this.videoSources = devices.filter(device => device.kind === 'videoinput')
          this.audioSources = devices.filter(device => device.kind === 'audioinput')
        })
        .catch(error => new Error(error))
    },
    videoSourceChange () {
      console.log('change device!')
      const videoSelection = document.querySelector('#videoSelected')
      this.constraints.video.deviceId = videoSelection.value
      this.stopStream()
      this.getPermission()
    },
    stopStream () {
      if (window.stream) {
        window.stream.getTracks().forEach(track => track.stop())
      }
    }
  },
  created () {
    this.featureDetection()
    this.getVideoSource()
  }
}
</script>

<style scoped>
  #wapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100vw;
  }
  video {
    display: block;
    width: 300px;
    border-radius: 5px;
  }

  @media screen and (min-width: 576px) {
    video {
      width: 400px;
    }
  }

  @media screen and (min-width: 768px) {
    video {
      width: 750px;
    }
  }
</style>
