<script>
	import Nav from './nav.svelte';
	import Chart from './chartData.svelte';
	import Controller from './controller.svelte';

	import { dataTypesArray } from './dataHandler';
	let dataTypesArrayU = dataTypesArray;
	let device;

	function onHidNewDataMsg(event) {
		dataTypesArrayU = dataTypesArray;
	}
	function onControlMsg(event) {}
</script>

<div class="min-w-[680px]">
	<Nav on:message={onHidNewDataMsg} {dataTypesArrayU} bind:device />
	<div class="divider mt-1" />
	<Chart {dataTypesArrayU} bind:device />
	<div class="divider">控制台</div>
	<Controller on:message={onControlMsg} bind:device />
</div>
