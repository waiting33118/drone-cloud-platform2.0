<template>
  <div id="golden-layout"></div>
</template>

<script>
import GoldenLayout from 'golden-layout'
import mapboxgl from 'mapbox-gl'
import io from 'socket.io-client'
import './../../node_modules/mapbox-gl/dist/mapbox-gl.css'
import './../../node_modules/golden-layout/src/css/goldenlayout-base.css'
import './../../node_modules/golden-layout/src/css/goldenlayout-light-theme.css'

export default {
  name: 'Layout',
  data () {
    return {
      config: {
        content: [
          {
            type: 'row',
            content: [
              {
                type: 'column',
                width: 37,
                content: [
                  {
                    type: 'component',
                    componentName: 'droneComponent',
                    title: 'Drone Status'
                  },
                  {
                    type: 'component',
                    componentName: 'streamComponent',
                    title: 'Stream Monitor'
                  }
                ]
              }, {
                type: 'column',
                content: [
                  {
                    type: 'component',
                    componentName: 'mapComponent',
                    title: 'Mapbox'
                  }
                ]
              }
            ]
          }
        ]
      },
      token: 'pk.eyJ1Ijoid2FpdGluZzMzMTE4IiwiYSI6ImNrZDVlZWp6MjFxcXQyeHF2bW0xenU4YXoifQ.iGfojLdouAjsovJuRxjYVA',
      coords: []
    }
  },
  mounted () {
    const myLayout = new GoldenLayout(this.config, document.querySelector('#golden-layout'))

    // drone status
    myLayout.registerComponent('droneComponent', (container, state) => {
      container.getElement()[0].classList.add('status')
      container.getElement()[0].setAttribute('style', 'display:flex; flex-flow:column nowrap;')
      container.getElement().html('<div style="height:25px; text-align: center;">Connections:<span class="connections mx-2">0</span></div><ul class="logs" style="flex-grow: 1; background-color: #000000; color: white; overflow-y: auto; margin: 0; padding-top: 10px;"><li>Welcome to drone cloud platform</li></ul>')
    })

    // video stream
    myLayout.registerComponent('streamComponent', (container, state) => {
      container.getElement().html('<video width=100% height=100% controls autoplay style="outline: none; object-fit:cover;"><source src="https://i.imgur.com/zQJGZvg.mp4" type="video/mp4"></source></video>')
    })

    // mapbox
    myLayout.registerComponent('mapComponent', (container, state) => {
      container.getElement()[0].id = 'mapbox'
      container.on('open', () => {
        mapboxgl.accessToken = this.token
        const map = new mapboxgl.Map({
          style: 'mapbox://styles/waiting33118/ckdfkx3t10k9w1irkp8anuy39',
          center: { lon: 121.534907, lat: 25.043163 },
          zoom: 17,
          pitch: 55,
          bearing: 0,
          antialias: true,
          container: 'mapbox'
        })

        container.on('resize', () => map.resize())

        map.on('load', () => {
          const layers = map.getStyle().layers
          let labelLayerId
          for (let i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
              labelLayerId = layers[i].id
              break
            }
          }
          map.addLayer(
            {
              id: '3d-buildings',
              source: 'composite',
              'source-layer': 'building',
              filter: ['==', 'extrude', 'true'],
              type: 'fill-extrusion',
              minzoom: 17,
              paint: {
                'fill-extrusion-color': '#aaa',
                'fill-extrusion-height': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  15,
                  0,
                  15.05,
                  ['get', 'height']
                ],
                'fill-extrusion-base': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  15,
                  0,
                  15.05,
                  ['get', 'min_height']
                ],
                'fill-extrusion-opacity': 0.6
              }
            },
            labelLayerId
          )
          map.addSource('trace', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: this.coords
              }
            }
          })
          map.addLayer({
            id: 'trace',
            type: 'line',
            source: 'trace',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': 'yellow',
              'line-opacity': 0.75,
              'line-width': 10
            }
          })
        })

        map.addControl(new mapboxgl.NavigationControl({
          visualizePitch: true
        }), 'top-right')
        map.addControl(new mapboxgl.FullscreenControl(), 'top-left')
        map.addControl(new mapboxgl.ScaleControl({
          maxWidth: 200,
          unit: 'metric'
        }), 'bottom-right')

        const droneIcon = document.createElement('div')
        droneIcon.className = 'drone-icon'
        droneIcon.style.backgroundImage = 'url(https://www.flaticon.com/svg/static/icons/svg/3569/3569919.svg)'
        droneIcon.style.height = '50px'
        droneIcon.style.width = '50px'
        droneIcon.style.backgroundSize = 'cover'
        const drone = new mapboxgl.Marker({
          element: droneIcon,
          draggable: true
        })
          .setLngLat([121.53468225613972, 25.042934498680154])
          .addTo(map)

        drone.on('dragend', () => {
          const coords = drone.getLngLat()
          console.log(coords.lng, coords.lat)
          const logs = document.querySelector('.logs')
          const logElement = document.createElement('li')
          logElement.innerHTML = `Set drone position to GPS:${coords.lng} ${coords.lat}`
          logs.prepend(logElement)
        })

        const socket = io('https://140.124.71.226:3030/')
        socket.on('newDrone', (data) => {
          console.log(data)
          const logs = document.querySelector('.logs')
          const connections = document.querySelector('.connections')
          connections.innerHTML = data.droneCounts
          const logElement = document.createElement('li')
          logElement.innerHTML = `|New| Client ID: ${data.clientId}`
          logs.prepend(logElement)
        })
        socket.on('droneDisconnect', (data) => {
          console.log(data)
          const logs = document.querySelector('.logs')
          const connections = document.querySelector('.connections')
          connections.innerHTML = data.droneCounts
          const logElement = document.createElement('li')
          logElement.innerHTML = '|Drone disconnected|'
          logs.prepend(logElement)
        })
        socket.on('sendCoords', (data) => {
          this.coords.push(data)
          map.getSource('trace').setData({
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: this.coords
              }
            }]
          })
          map.panTo(this.coords[this.coords.length - 1])
          const logs = document.querySelector('.logs')
          const logElement = document.createElement('li')
          logElement.innerHTML = `GPS:${data[0]},${data[1]}`
          logs.prepend(logElement)
        })
        socket.on('stopSending', (data) => {
          const logs = document.querySelector('.logs')
          const logElement = document.createElement('li')
          logElement.innerHTML = '===Gps tracking stopped!==='
          logs.prepend(logElement)
        })
      })
    })
    myLayout.init()
    window.addEventListener('resize', () => myLayout.updateSize())
  }
}
</script>

<style scoped>
  #golden-layout {
    width: 100%;
    height: 100%;
  }
  #mapbox {
    width: 100%;
    height: 100%;
  }
</style>
