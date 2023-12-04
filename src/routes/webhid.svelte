<script>
	import { IconSun } from '@tabler/icons-svelte';
	import { IconMoon } from '@tabler/icons-svelte';
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	let mychart;
	let chartCanvas;
	let chartKey = -600;
	let chartDataCount = 0;
	function renderChart() {
		let ctx = chartCanvas.getContext('2d');
		mychart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: [],
				datasets: [
					{
						label: 'Batt',
						borderColor: '#eb8f34',
						yAxisID: 'mv',
						tension: 0.4,
						pointStyle: false,
						data: []
					},
					{
						label: 'Temperature',
						borderColor: '#346eeb',
						yAxisID: 'cels',
						tension: 0.4,
						pointStyle: false,
						data: []
					}
				]
			},
			options: {
				normalized: true,
				responsive: true,
				maintainAspectRatio: true,
				aspectRatio: 12 / 5,
				resizeDelay: 300,
				interaction: {
					intersect: false,
					axis: 'x'
				},
				scales: {
					x: {
						type: 'linear',
						max: 0,
						min: -600,
						grid: {
							color: ['#77777780']
						},
						ticks: {
							stepSize: 5
						}
					},
					mv: {
						type: 'linear',
						display: true,
						position: 'left',
						suggestedMin: 2000,
						suggestedMax: 4200,
						grid: {
							color: ['#777777FF', '#77777780']
						}
					},
					cels: {
						type: 'linear',
						display: true,
						position: 'right',
						suggestedMin: 20,
						suggestedMax: 40,
						grid: {
							drawOnChartArea: false
						}
					}
				}
			}
		});
	}
	onMount(async () => {
		console.log('renderChart()');
		renderChart();
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
		name: '温度',
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
		name: '输出频率',
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
		name: '输出峰值',
		head: 0x11,
		v: 0
	};
	let currentDataSet = {
		name: '输出电流',
		head: 0x12,
		v: 0
	};
	let battDataSet = {
		name: '电池电压',
		head: 0x13,
		v: 0
	};
	let ratioDataSet = {
		name: '输出占空比',
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
		battDataSet,
		currentDataSet,
		peakDataSet,
		freqDataSet,
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

			if (dataType.name == temperatureDataSet.name) {
				mychart.data.datasets.forEach((dataset) => {
					if (dataset.label == dataType.name) {
						dataset.data.push(dataValue);
					}
				});
			}
			if (dataType.name == battDataSet.name) {
				mychart.data.datasets.forEach((dataset) => {
					if (dataset.label == dataType.name) {
						dataset.data.push(dataValue);
					}
				});
			}
			return dataType.name + ':[' + dataValue + ']';
		};
		let output = '';
		let dataFrame = getDataFrame();
		while (dataFrame) {
			output += dataFrame + ' ';
			dataFrame = getDataFrame();
		}
		if (output.length) {
			chartDataCount++;
			if (chartDataCount > 600) {
				mychart.data.datasets.forEach((dataset) => {
					dataset.data.shift();
				});
				chartDataCount -= 1;
			} else {
				chartKey++;
				mychart.data.labels.push(chartKey);
			}
			mychart.update('none');
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
	<div class="flex-none">
		<a class="btn btn-ghost normal-case text-xl" href="#">Volwave TT</a>
	</div>

	<div class="flex-1">
		<div class="mx-auto max-w-7xl px-6">
			<dl class="grid gap-x-8 text-center lg:grid-cols-6 grid-cols-3">
				{#each dataTypesArray as item}
					<div class="mx-auto flex max-w-xs flex-col gap-y-0">
						<dt class="lg:text-sm text-xs leading-7 text-gray-600">{item.name}</dt>
						<dd
							class="order-first lg:text-2xl text-base font-semibold tracking-tight text-white-900"
						>
							{#if item.print}{item.print(item)}{:else}{item.v}{/if}
						</dd>
					</div>
				{/each}
			</dl>
		</div>
	</div>

	<label class="swap swap-rotate">
		<input type="checkbox" value="cupcake" class="theme-controller" />
		<IconMoon class="swap-on" />
		<IconSun class="swap-off" />
	</label>
	<div class="flex-none join">
		<button type="button" class="btn btn-success join-item" on:click={handleConnectClick}
			>连接</button
		>
		<button type="button" class="btn btn-error join-item" on:click={handleDisconnectClick}
			>断开</button
		>
	</div>
</div>
<div class="flex lg:flex-row flex-col w-full px-6">
	<div class="flex lg:w-4/5 w-full h-max">
		<div class="flex justify-center py-2 h-full w-full">
			<div class="w-full aspect-[12/5]">
				<canvas bind:this={chartCanvas} />
			</div>
		</div>
	</div>
	<div class="flex lg:flex-col lg:gap-y-1 lg:pl-4 lg:w-1/5 flex-row gay-x-2 w-full min-h-[80px]">
		{#each Array(4) as _, index (index)}
			<div
				class="skeleton flex justify-center items-center lg:w-full lg:h-1/4 w-1/4 h-full border-2"
			>
				<span class="loading loading-spinner loading-xs" />
				<span>Loading...</span>
			</div>
		{/each}
	</div>
</div>
