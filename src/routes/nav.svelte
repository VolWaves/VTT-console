<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	import { IconSun } from '@tabler/icons-svelte';
	import { IconMoon } from '@tabler/icons-svelte';
	import Webhid from './webhid.svelte';
	import RealtimeData from './realtimeData.svelte';

	export let device;
	export let dataTypesArrayU;

	const temperature_badge_themes = ['badge-info', 'badge-success', 'badge-warning', 'badge-error'];
	const temperature_badge_levels_high = [24, 45, 60, 100];
	const temperature_badge_levels_low = [0, 22, 42, 58];
	let temperature_badge_level = 1;
	$: temperature_badge_theme = temperature_badge_themes[temperature_badge_level];

	function onHidNewDataMsg(event) {
		dispatch('message', event.detail);
		event.detail.forEach((data) => {
			if (data.head == 0x00) {
				if (data.v > temperature_badge_levels_high[temperature_badge_level]) {
					temperature_badge_level += 1;
				}
				if (data.v < temperature_badge_levels_low[temperature_badge_level]) {
					temperature_badge_level -= 1;
				}
			}
		});
	}
</script>

<div class="navbar bg-base-100">
	<div class="flex-none">
		{#if device && device.opened}
			<div class="badge badge-success gap-2">已连接</div>
		{:else}
			<div class="badge badge-error gap-2">未连接</div>
		{/if}
	</div>
	<div class="flex-none">
		<a class="btn btn-ghost normal-case text-xl" href="#">Volwave TT</a>
	</div>
	<div class="flex-none">
		{#if device && device.opened}
			<div class="badge badge-success gap-2 select-none">已连接</div>
			{#if dataTypesArrayU}
				{#each dataTypesArrayU as item}
					{#if item.head == 0x00}
						<div class="badge gap-2 ml-2 {temperature_badge_theme}">
							{#if item.print}{item.print(item)}{:else}{item.v}{/if}
						</div>
					{/if}
				{/each}
			{/if}
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
