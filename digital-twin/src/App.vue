<!--Chroma - Color map library-->
<!--https://github.com/gka/chroma.js-->
<!--https://element.eleme.cn/2.0/#/zh-CN/component/slider-->
<template>
	<div id="app">

		<mapbox
				id="map"
				:access-token="accessToken"
				:map-options="mapOptions"
				@map-load="onLoadMap"
				@map-click="onClickMap"
				@mousemove="onMousemoveMap"
		/>

		<!-- an element called 'info' -->
		<div id='info'></div>
		<div class="selectionBox">
			<h2>Income Selection</h2>
<!--			<el-select v-model="currentField" placeholder="Select">-->
<!--				<el-option-->
<!--						v-for="item of availableFields"-->
<!--						:key="item"-->
<!--						:label="item"-->
<!--						:value="item">-->
<!--				</el-option>-->
<!--			</el-select>-->
			<span class="demonstration" style="font-size: 10px;padding-left:10px">Medium Income: {{ currentSliderValue }}</span>
			<div class="block" style="padding-left: 15px;padding-right: 15px">

				<el-slider
						v-model="currentSliderValue"
						:step="sliderStep"
						:min="minxSliderValue"
						:max="maxSliderValue"
						show-stops>
				</el-slider>
			</div>
		</div>
		<div class='map-overlay' id='features'>
			<h2>Census Tract</h2>
			<div id='pd'>
				<h3><strong>{{ areaName }}</strong></h3>
<!--				<p>{{ geoid }}</p>-->
        <p>{{ tractName }}</p>
			</div>

		</div>

		<div class='map-overlay' id='legend'>
			<div v-for="item in legend" :key="item.name">
				<span :style="item.colorString" class="legend-key"></span>
				<span>{{ item.name }}</span>
			</div>

		</div>
	</div>


</template>

<script>
	/* eslint-disable vue/no-unused-components  */
	/* eslint-disable no-unused-vars */
	import data from '../public/Resources/Data/geo_median_income.json'
	import Mapbox from 'mapbox-gl-vue'
	import mapboxgl from 'mapbox-gl'
	import PopupContent from './components/PopupContent.vue'
	import { ElSelect, ELSlider } from 'element-ui'
	let mapObj;
	export default {
		name: 'App',
		components: {
			Mapbox,
			PopupContent,

		},
		data(){
			return {
				// Configuration
				currentField: "medium_income_2010", // Default Field
				availableFields: [
					"medium_income_2010",
					"medium_income_2011",
					"medium_income_2012",
					"medium_income_2013",
					"medium_income_2014",
					"medium_income_2015",
					"medium_income_2016",
					"medium_income_2017",
					"medium_income_2018",
				],
				colorScheme: {
					medium_income_2010: ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A'],
					medium_income_2011: ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A'],
					medium_income_2012: ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A'],
					medium_income_2013: ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A'],
					medium_income_2014: ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A'],
					medium_income_2015: ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A'],
					medium_income_2016: ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A'],
					medium_income_2017: ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A'],
					medium_income_2018: ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A'],
				},


				// access token. Needed if you using Mapbox maps
				accessToken: "pk.eyJ1IjoieGJsdXgiLCJhIjoiY2tmc2w0MXJiMG81ZDJ5bndvMGNrajR0aSJ9.D7C_-vLYzalyoZq_974skA",
				mapOptions: {
					style: "mapbox://styles/mapbox/light-v10",
					zoom: 1,
					maxBounds: [
						// Source: New York City Census Tracts for 2010 US Census
						[-74.34438,40.47392], // Southwest coordinates
						[-73.68091,40.95147] // Northeast coordinates
					],
					center: [40.70578, -73.978187],
				},
				legend: [],
				geoid: "",
				areaName: "",
                tractName: "",
				geoJsonSource: {id: "tract",...data, type:'geojson'},
				geoJsonLayer_tract_fill: {
					"id": "tract_fill",
					"type": "fill",
					"source": "tract",
					"paint": {
						'fill-color': ["rgba", 255, 40, 0, ["get", "shape_areaOPC"]],
						// hover state is set here using a case expression
						// if hover is false, then opacity should be 0.6
						// if hover is true then opacity should be 1
						'fill-opacity': 1
					},
				},
				geoJsonLayer_tract_line: {
					"id": "tract_line",
					"type": "line",
					"source": "tract",
					"paint": {
						"line-color": "#000",
						"line-width": 0.5
					},
				},

				dataField: {},

				layerLegendText: [],


				// Stepping
				currentSliderValue: 2010,
				minxSliderValue: 2010,
				maxSliderValue: 2019,
				sliderStep: 1
			}
		},
		created(){

			this.processData();
			this.setField(this.currentField)

		},
		watch:{
			currentField(newVal, oldVal){

				this.switchLayer(newVal)
			},
			currentSliderValue(newVal, oldVal){

				this.currentField = `medium_income_${newVal}`
			},
		},
		methods: {
			processData(){
				for(let item of this.availableFields){
					this.dataField[item] = {
						min: 0,
						max: 0,
						interval: []
					}
				}
				for(let i in data.features) {
					for(let item of this.availableFields){
						let number = parseFloat(data.features[i].properties[item]) || 0;
						data.features[i].properties[item] = number;
						this.dataField[item].max = Math.max(number, this.dataField[item].max)
						this.dataField[item].min = Math.min(number, this.dataField[item].min)
						this.dataField[item].min = this.dataField[item].min < 0 ? 0 : this.dataField[item].min
					}

				}
				for(let i in this.dataField){

					let interval = Math.ceil((this.dataField[i].max - this.dataField[i].min) / this.colorScheme[i].length)
					for(let j in this.colorScheme[i]){
						this.dataField[i].interval.push(interval * j)
					}
					this.dataField[i].interval.push(this.dataField[i].max + 1)
				}
			},
			setField(id){
				this.legend = [];
				console.log(this.dataField[id].interval)
				let fillColor = ['case']
				for(let i = 0; i < this.dataField[id].interval.length - 1; i++){
					this.legend.push({
						name: `${~~this.dataField[id].interval[i]}-${~~this.dataField[id].interval[i+1]}`,
						color: this.colorScheme[id][i],
						colorString: `background-color: ${this.colorScheme[id][i]}`
					})
					fillColor.push(["all",[ ">=", ["get", id], this.dataField[id].interval[i]], [ "<", ["get", id], this.dataField[id].interval[i + 1]]])
					fillColor.push(this.colorScheme[id][i])
				}
				fillColor.push("#000000")
				this.geoJsonLayer_tract_fill.paint["fill-color"] = fillColor

			},
			switchLayer(id){
				this.setField(id || this.currentField)
				mapObj.removeLayer("tract_fill")
				mapObj.removeLayer("tract_line")
				mapObj.addLayer(this.geoJsonLayer_tract_fill);
				mapObj.addLayer(this.geoJsonLayer_tract_line);
			},
			onLoadMap(map){
				// in component
				//
				mapObj = map;

				map.addSource('tract', {
					'type': 'geojson',
					'data': data
				});
				map.addLayer(this.geoJsonLayer_tract_fill);
				map.addLayer(this.geoJsonLayer_tract_line);

			},
			onClickMap(map, e){

				let event = e

				let lng = event.lngLat.lng
				let lat = event.lngLat.lat

				console.log("clicked:", lng, lat)

				document.getElementById('info').innerHTML = lng.toFixed(5) + "," + lat.toFixed(5) + '/n'

				var tract = map.queryRenderedFeatures(event.point, {
					layers: ['tract_fill']
				});
				let title = tract[0].properties.nta_name;
				let coordinates = [lng, lat];
				let description = tract[0].properties.GEO_ID;
				let area = tract[0].properties.shape_area;
				//
				// // Ensure that if the map is zoomed out such that multiple
				// // copies of the feature are visible, the popup appears
				// // over the copy being pointed to.
				// while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
				// 	coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
				// }

				new mapboxgl.Popup()
					.setLngLat([lng, lat])
					.setHTML('<div id="vue-popup-content"></div>')
					.addTo(map);

				new PopupContent({ propsData: { feature: {
					title,description,coordinates,area
				} },
				}).$mount('#vue-popup-content')

			},

			onMousemoveMap(map, e){
				let event = e
				var tract = map.queryRenderedFeatures(event.point, {
					layers: ['tract_fill']
				});

				if (tract.length > 0) {
					this.geoid = tract[0].properties.GEO_ID
					this.areaName = tract[0].properties.nta_name
          this.tractName = tract[0].properties.NAME

				} else {
					this.geoid = "Move around!"

				}
			}
		},

	}
</script>

<style>
	body, html {
		margin: 0;
		padding: 0;
		font-family: monospace;
	}

	#map {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
	}
	.selectionBox {
		position: absolute;
		top: 0;
		left: 0;
		margin: 10px 10px auto auto;

		width: 200px;
		color: #222;
		background: #fff;

	}
	#info {
		position: absolute;
		top: 0;
		right: 0;
		margin: 10px 10px auto auto;    /* top right bottom left */
		padding: 5px;
		border: 2px solid #ddd;
		border-radius: 5px;
		font-size: 12px;
		text-align: center;
		color: #222;
		background: #fff;
	}

	img {
		width: 300px;
	}
	span {
		font-family: "Open Sans";
	}
	h2,
	h3 {
		margin: 10px;
		font-size: 1.2em;
		font-family: "Open Sans";
	}

	h3 {
		font-size: 1em;
	}

	p {
		font-size: 0.85em;
		margin: 10px;
		text-align: left;
	}

	/**
	* Set rules for how the map overlays
	* (information box and legend) will be displayed
	* on the page. */
	.map-overlay {
		position: absolute;
		right: 0;
		background: rgba(255, 255, 255, 0.8);
		margin-right: 20px;
		font-family: Arial, sans-serif;
		overflow: auto;
		border-radius: 3px;
	}

	#features {
		top: 0;

		margin-top: 20px;
		width: 250px;
	}

	#legend {
		padding: 10px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		line-height: 18px;
		height: 150px;
		margin-bottom: 40px;
		width: 100px;
	}

	.legend-key {
		display: inline-block;
		border-radius: 20%;
		width: 10px;
		height: 10px;
		margin-right: 5px;
	}
</style>
