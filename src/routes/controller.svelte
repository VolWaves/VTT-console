<script>
	export let device;

	function hidTest(n) {
		let rand = Math.floor(Math.random() * 256);
		device.sendReport(0, new Uint8Array([0x5e, rand, 0x5e ^ rand, 2, 0xe5, n]));
	}
	function BootLoader() {
		let rand = Math.floor(Math.random() * 256);
		device.sendReport(0, new Uint8Array([0x5e, rand, 0x5e ^ rand, 2, 0xfe, 0xff]));
	}
</script>

<div class="flex flex-row w-full px-6 py-2">
	<div class="flex flex-row flex-wrap gap-y-2 w-full min-h-[80px]">
		<div class="flex gap-x-2 justify-center items-center px-2 lg:w-1/4 w-1/2 h-full border-2">
			<button class="btn btn-outline btn-success" on:click={() => hidTest(0x12)}>HID test 1</button>
			<button class="btn btn-outline btn-success" on:click={() => hidTest(0x23)}>HID test 2</button>
			<button class="btn btn-outline btn-success" on:click={() => hidTest(0x34)}>HID test 3</button>
			<button class="btn btn-outline btn-success" on:click={() => hidTest(0xa5)}>HID test 4</button>
		</div>
		{#each Array(2) as _, index (index)}
			<div class="skeleton flex justify-center items-center px-2 lg:w-1/4 w-1/2 h-full border-2">
				<span class="loading loading-spinner loading-xs" />
				<span class="pl-2">Loading...</span>
			</div>
		{/each}
		<div class="flex gap-x-2 justify-center items-center px-2 lg:w-1/4 w-1/2 h-full border-2">
			<button class="btn btn-outline btn-error" on:click={BootLoader}>BootLoader</button>
		</div>
	</div>
</div>
