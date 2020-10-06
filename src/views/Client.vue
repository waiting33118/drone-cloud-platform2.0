<template>
  <div id="wapper">
    <div class="container p-3 d-flex justify-content-around align-items-center">
        <button class="btn btn-success rounded send" :disabled="isStart">start</button>
        <button class="btn btn-danger rounded stop" :disabled="isStopped">stop</button>
        <select id="videoSelected" class="form-control w-50" @change="videoSourceChange">
          <option disabled>鏡頭選擇</option>
          <option v-for="videoSource in videoSources" :key="videoSource.deviceId" :value="videoSource.deviceId">{{videoSource.label}}</option>
        </select>
        <select class="form-control w-25">
          <option disabled>錄音選擇</option>
          <option v-for="audioSource in audioSources" :key="audioSource.deviceId" :value="audioSource.deviceId">{{audioSource.label}}</option>
        </select>
    </div>
    <div class="client">{{clientName}}</div>
    <video autoplay controls></video>
  </div>
</template>

<script>
import io from 'socket.io-client'
export default {
  name: 'Client',
  data () {
    return {
      clientName: '',
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
      audioSources: [],
      isStart: false,
      isStopped: true,
      watchId: 0
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
    },
    socketClientInit () {
      const sendButton = document.querySelector('.send')
      const stopButton = document.querySelector('.stop')
      const socket = io('https://140.124.71.226:3030/client')
      socket.on('connect', () => {
        this.clientName = socket.id
        socket.emit('userId', socket.id)
      })

      const sendCoords = () => {
        this.watchId = navigator.geolocation.watchPosition(position => {
          this.isStart = true
          this.isStopped = false
          console.log(this.watchId)
          const { longitude, latitude } = position.coords
          console.log({ longitude, latitude })
          socket.emit('sendCoords', { longitude, latitude })
        }
        , (error) => new Error(error.message)
        , { enableHighAccuracy: true })
      }

      const stopWatching = () => {
        this.isStart = false
        this.isStopped = true
        navigator.geolocation.clearWatch(this.watchId)
        socket.emit('stopSending')
      }

      sendButton.addEventListener('click', sendCoords)
      stopButton.addEventListener('click', stopWatching)
    }
  },
  mounted () {
    this.socketClientInit()
    this.featureDetection()
    this.getVideoSource()
  },
  watch: {
    videoSources: {
      handler: 'getVideoSource',
      deep: true
    }
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
