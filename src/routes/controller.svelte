<script>
	import Work from './controllers/work.svelte';
	import Sysctrl from './controllers/system.svelte';
	import Discharge from './controllers/discharge.svelte';
	export let device = null;

	function isOnline() {
		return device && device.opened;
	}
	function hidTest(n) {
		if (!device) return;
		let rand = Math.floor(Math.random() * 256);
		device.sendReport(0, new Uint8Array([0x5e, rand, 0x5e ^ rand, 2, 0xe5, n]));
	}
	function BootLoader() {
		if (!device) return;
		let rand = Math.floor(Math.random() * 256);
		device.sendReport(0, new Uint8Array([0x5e, rand, 0x5e ^ rand, 2, 0xfe, 0xff]));
	}
	function setWorkMode(m) {
		if (!device) return;
		let rand = Math.floor(Math.random() * 256);
		device.sendReport(0, new Uint8Array([0x5e, rand, 0x5e ^ rand, 3, 0x01, 0x20, m]));
	}
	function setWorkSingle(t) {
		if (!device) return;
		let rand = Math.floor(Math.random() * 256);
		device.sendReport(
			0,
			new Uint8Array([0x5e, rand, 0x5e ^ rand, 4, 0x01, 0x01, t & 0xff, (t >> 8) & 0xff])
		);
	}

	let ctrlPanelMode = '1';

	const title = 'select-none self-start text-sm w-full text-center font-bold';
	const settinggroup = 'pt-2 w-full max-w-xs';
	const settings_title = '';
	const settings_value = 'text-secondary font-bold';
	const numberinput = 'appearance-none input input-bordered input-secondary input-xs w-full';
	const testbtn = 'self-end btn btn-outline btn-warning';
	const controls =
		'flex flex-wrap gap-x-2 gap-y-1 justify-center items-center lg:w-[23%] w-[40%] px-2 py-2';
	const dividerStyle = 'mx-0 lg:visible invisible';
	const styles = {
		title,
		settinggroup,
		settings_title,
		settings_value,
		numberinput,
		testbtn,
		controls,
		dividerStyle
	};
	const hidDevice = { isOnline, hidTest, BootLoader, setWorkMode, setWorkSingle };
</script>

<div class="divider">
	{#each [{ label: '点火测试', value: '1' }, { label: '放电测试', value: '2' }, { label: '系统功能', value: '3' }] as item}
		<input
			type="radio"
			name="mode"
			aria-label={item.label}
			class="btn btn-outline"
			value={item.value}
			bind:group={ctrlPanelMode}
		/>
	{/each}
</div>

<div class="flex w-full px-6 py-2">
	<div class="flex flex-wrap justify-center gap-y-1 gap-x-1 w-full">
		{#if ctrlPanelMode == '1'}
			<Work {...styles} {hidDevice} />
		{/if}
		{#if ctrlPanelMode == '2'}
			<Discharge {...styles} {hidDevice} />
		{/if}
		{#if ctrlPanelMode == '3'}
			<Sysctrl {...styles} {hidDevice} />
		{/if}
	</div>
</div>
