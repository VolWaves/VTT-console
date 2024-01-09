<script>
	import Nav from './nav.svelte';
	import Chart from './chartData.svelte';
	import Info from './info.svelte';
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

	<div class="flex justify-center w-full px-6 py-2">
		<div class="flex lg:flex-row flex-col lg:w-[90%] w-full">
			<Chart {dataTypesArrayU} bind:device />
			<Info />
		</div>
	</div>

	<Controller on:message={onControlMsg} bind:device />
</div>
