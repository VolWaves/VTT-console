<script>
	import { IconSun } from '@tabler/icons-svelte';
	import { IconMoon } from '@tabler/icons-svelte';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	onMount(() => {
		themeChange(false);
	});
	let device = null;

	async function handleConnectClick() {
		device = await openDevice();
	}
	async function handleDisconnectClick() {
		if (!device) return;
		await device.close();
		device = null;
		console.log('device closed');
	}
	async function openDevice() {
		const vendorId = 0xcafe;

		const device_list = await navigator.hid.getDevices();
		console.log(device_list);

		let device = device_list.find((d) => d.vendorId === vendorId);

		if (!device) {
			// this returns an array now
			let devices = await navigator.hid.requestDevice({
				filters: [{ vendorId }]
			});
			console.log('devices:', devices);
			device = devices[0];
			if (!device) return null;
		}

		if (!device.opened) {
			await device.open();
		}
		device.oninputreport = printReport;
		console.log('device opened:', device);
		return device;
	}

	let temperatureDataSet = {
		name: 'Temperature',
		head: 0x00,
		postfix: '℃',
		v: 0,
		postProc: (v) => {
			let temp;
			if (v >= 0x8000) {
				temp = 0x10000 - v;
			} else {
				temp = v;
			}
			return temp / 10;
		},
		print: (self) => {
			return self.v.toFixed(1) + self.postfix;
		}
	};
	let freqDataSet = {
		name: 'Freq',
		head: 0x10,
		postfix: 'Hz',
		v: 0,
		postProc: (v) => {
			return v / 10;
		},
		print: (self) => {
			return self.v.toFixed(1) + self.postfix;
		}
	};
	let peakDataSet = {
		name: 'Peak',
		head: 0x11,
		v: 0
	};
	let currentDataSet = {
		name: 'Current',
		head: 0x12,
		v: 0
	};
	let battDataSet = {
		name: 'Batt',
		head: 0x13,
		v: 0
	};
	let ratioDataSet = {
		name: 'DutyRatio',
		head: 0x18,
		postfix: '%',
		v: 0,
		postProc: (v) => {
			return v / 10;
		},
		print: (self) => {
			return self.v.toFixed(1) + self.postfix;
		}
	};
	let dataTypesArray = new Array(
		temperatureDataSet,
		freqDataSet,
		peakDataSet,
		battDataSet,
		currentDataSet,
		ratioDataSet
	);
	const dataTypes = new Map([
		[0x00, temperatureDataSet],
		[0x10, freqDataSet],
		[0x11, peakDataSet],
		[0x12, currentDataSet],
		[0x13, battDataSet],
		[0x18, ratioDataSet]
	]);

	function dataPaser(data) {
		if (data.length != 64) {
			return;
		}
		if (data[0] != 0x5e) {
			return;
		}
		if (data[2] != (data[0] ^ data[1])) {
			return;
		}
		if (data[4] != (data[2] ^ data[3])) {
			return;
		}
		let validDataType = (dt) => {
			if (dataTypes.has(dt)) {
				return dataTypes.get(dt);
			}
			return null;
		};
		let idx = 5;
		let getDataFrame = () => {
			let dataType = validDataType(data[idx]);
			if (!dataType) {
				return null;
			}
			idx++;
			let dataLength = data[idx];
			let dataValue = 0;
			while (dataLength > 0) {
				idx += 1;
				dataValue <<= 8;
				dataValue += data[idx];
				dataLength -= 1;
			}
			idx += 1;
			if (dataType.hasOwnProperty('postProc')) {
				dataValue = dataType.postProc(dataValue);
			}
			dataType.v = dataValue;
			return dataType.name + ':[' + dataValue + ']';
		};
		let output = '';
		let dataFrame = getDataFrame();
		while (dataFrame) {
			output += dataFrame + ' ';
			dataFrame = getDataFrame();
		}
		if (output.length) {
			dataTypesArray = dataTypesArray;
			// console.log(output);
		}
	}

	function printReport(event) {
		const { data, device, reportId } = event;
		dataPaser(new Uint8Array(data.buffer));
	}
</script>

<div class="navbar bg-base-100">
	<div class="flex-none">
		{#if device}
			<div class="badge badge-success gap-2">已连接</div>
		{:else}
			<div class="badge badge-error gap-2">未连接</div>
		{/if}
	</div>
	<div class="flex-1">
		<a class="btn btn-ghost normal-case text-xl" href="#">Volwave TT</a>
	</div>
	<button data-set-theme="cupcake" data-act-class="hidden"><IconSun /></button>
	<button data-set-theme="mytheme" data-act-class="hidden"><IconMoon /></button>
	<div class="flex-none join">
		<button type="button" class="btn btn-success join-item" on:click={handleConnectClick}
			>连接</button
		>
		<button type="button" class="btn btn-error join-item" on:click={handleDisconnectClick}
			>断开</button
		>
	</div>
</div>

{#if device}
	<div class="py-24 sm:py-32">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<dl class="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-6">
				{#each dataTypesArray as item}
					<div class="mx-auto flex max-w-xs flex-col gap-y-4">
						<dt class="text-base leading-7 text-gray-600">{item.name}</dt>
						<dd
							class="order-first text-3xl font-semibold tracking-tight text-white-900 sm:text-5xl"
						>
							{#if item.print}{item.print(item)}{:else}{item.v}{/if}
						</dd>
					</div>
				{/each}
			</dl>
		</div>
	</div>
{/if}
