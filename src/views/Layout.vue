<template>
  <div id="golden-layout"></div>
</template>

<script>
import GoldenLayout from 'golden-layout'
import mapboxgl from 'mapbox-gl'
import './../../node_modules/mapbox-gl/dist/mapbox-gl.css'
import './../../node_modules/golden-layout/src/css/goldenlayout-base.css'
import './../../node_modules/golden-layout/src/css/goldenlayout-light-theme.css'

export default {
  name: 'Layout',
  mounted () {
    const config = {
      content: [
        {
          type: 'row',
          content: [
            {
              type: 'column',
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
    }
    /* golden layout */
    const myLayout = new GoldenLayout(config, document.getElementById('golden-layout'))
    myLayout.registerComponent('droneComponent', function (container, state) {
    })
    myLayout.registerComponent('streamComponent', function (container, state) {
    })
    myLayout.registerComponent('mapComponent', function (container, state) {
      container.getElement()[0].id = 'mapbox'
      container.on('open', () => {
        mapboxgl.accessToken = 'pk.eyJ1Ijoid2FpdGluZzMzMTE4IiwiYSI6ImNrZDVlZWp6MjFxcXQyeHF2bW0xenU4YXoifQ.iGfojLdouAjsovJuRxjYVA'
        const map = new mapboxgl.Map({
          style: 'mapbox://styles/waiting33118/ckdfkx3t10k9w1irkp8anuy39',
          center: { lon: 121.534907, lat: 25.043163 },
          zoom: 17,
          pitch: 55,
          bearing: 0,
          antialias: true,
          container: 'mapbox'
        })

        container.on('resize', () => {
          map.resize()
        })

        const nav = new mapboxgl.NavigationControl()
        map.addControl(nav, 'top-right')

        const geolocate = new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        })
        map.addControl(geolocate, 'top-right')
        map.addControl(new mapboxgl.FullscreenControl(), 'top-left')

        // The 'building' layer in the mapbox-streets vector source contains building-height data from OpenStreetMap.
        map.on('load', () => {
          // Insert the layer beneath any symbol layer.
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
                // use an 'interpolate' expression to add a smooth transition effect to the buildings as the user zooms in
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
        })

        const scale = new mapboxgl.ScaleControl({
          maxWidth: 80,
          unit: 'imperial'
        })
        map.addControl(scale)
        scale.setUnit('metric')
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
