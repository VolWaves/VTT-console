<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	import { IconSun } from '@tabler/icons-svelte';
	import { IconMoon } from '@tabler/icons-svelte';
	import Webhid from './webhid.svelte';
	import RealtimeData from './realtimeData.svelte';

	export let device;
	export let dataTypesArrayU;

	function onHidNewDataMsg(event) {
		dispatch('message', event.detail);
	}
</script>

<div class="navbar bg-base-100">
	<div class="flex-none">
		<img src="favicon.png" class="max-h-16" alt="LOGO" />
	</div>
	<div class="flex-none">
		<a class="btn btn-ghost normal-case text-xl" href="#">Volwave TT</a>
	</div>
	<div class="flex-none">
		{#if device && device.opened}
			<div class="badge badge-success gap-2 select-none">已连接</div>
		{:else}
			<div class="badge badge-error gap-2 select-none">未连接</div>
		{/if}
	</div>

	<RealtimeData {dataTypesArrayU} />
	<Webhid on:message={onHidNewDataMsg} bind:hidDevice={device} />

	<label class="swap swap-rotate px-4">
		<input type="checkbox" value="cupcake" class="theme-controller" />
		<IconMoon class="swap-on" />
		<IconSun class="swap-off" />
	</label>
</div>
