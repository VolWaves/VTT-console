<script>
	import Nav from './nav.svelte';
	import Chart from './chartData.svelte';

	import { dataTypesArray } from './dataHandler';
	let dataTypesArrayU = dataTypesArray;
	let device;

	function onHidNewDataMsg(event) {
		dataTypesArrayU = dataTypesArray;
	}
</script>

<div class="min-w-[680px]">
	<Nav on:message={onHidNewDataMsg} {dataTypesArrayU} bind:device />
	<Chart {dataTypesArrayU} bind:device />
</div>
