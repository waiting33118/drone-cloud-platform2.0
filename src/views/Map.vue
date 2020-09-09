<template>
  <div id="mapContainer" class="basemap"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import './../../node_modules/mapbox-gl/dist/mapbox-gl.css'

export default {
  name: 'Map',
  data () {
    return {
      accessToken: 'pk.eyJ1Ijoid2FpdGluZzMzMTE4IiwiYSI6ImNrZDVlZWp6MjFxcXQyeHF2bW0xenU4YXoifQ.iGfojLdouAjsovJuRxjYVA'
    }
  },
  mounted () {
    mapboxgl.accessToken = this.accessToken
    const map = new mapboxgl.Map({
      style: 'mapbox://styles/waiting33118/ckdfkx3t10k9w1irkp8anuy39',
      center: { lon: 121.534907, lat: 25.043163 },
      zoom: 17,
      pitch: 55,
      bearing: 0,
      container: 'mapContainer',
      antialias: true
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
  }
}
</script>

<style scoped>
  .basemap {
    width: 100%;
    height: 100%;
  }
</style>
