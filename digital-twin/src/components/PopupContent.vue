<template>
	<div>
		<h3>{{ feature.title }}</h3>
		<p>Coordinates: {{ feature.coordinates[0] }}, {{ feature.coordinates[1] }}</p>
		<p>Area: {{ feature.area }}</p>
	</div>
</template>

<script>
	import Vue from 'vue'
	export default Vue.extend({
		props: {
			feature: {
				required: true,
				type: Object,
			},
		},
		methods: {
			popupClicked() {
				alert('Learn more clicked')
			},
		},
	})
</script>