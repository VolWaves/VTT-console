<script>
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import { resizeObserver } from '@sveu/browser';

	function observer(target) {
		const { cleanup } = resizeObserver(target, (entries) => {
			const [entry] = entries;
			const { width, height } = entry.contentRect;
			handleChartResize(width, height);
			return {
				destroy() {
					cleanup();
				}
			};
		});
	}

	function delayRun(fn, t) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(fn());
			}, t);
		});
	}
	onMount(async () => {
		await delayRun(renderChart, 50);
	});
	function renderChart() {
		// console.log('renderChart()');
		let ctx = chartCanvas.getContext('2d');
		mychart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: [],
				datasets: [
					{
						head: 0x13,
						label: '电池',
						borderColor: '#8feb34',
						yAxisID: 'mv',
						tension: 0.4,
						pointStyle: false,
						data: []
					},
					{
						head: 0x11,
						label: '峰值',
						borderColor: '#eb6e34',
						yAxisID: 'mv',
						tension: 0.4,
						pointStyle: false,
						data: []
					},
					{
						head: 0x12,
						label: '电流',
						borderColor: '#eb346a',
						yAxisID: 'mA',
						tension: 0.4,
						pointStyle: false,
						data: []
					},
					{
						head: 0xf0,
						label: '功率',
						borderColor: '#ebebeb',
						yAxisID: 'Watt',
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
				aspectRatio: 3 / 1,
				resizeDelay: 0,
				interaction: {
					intersect: false,
					axis: 'x'
				},
				scales: {
					x: {
						type: 'category',
						ticks: {
							maxRotation: 36,
							autoSkipPadding: 50,
							maxTicksLimit: 60
						},
						grid: {
							color: ['#77777780']
						}
					},
					Watt: {
						type: 'linear',
						display: true,
						position: 'right',
						suggestedMin: 0,
						suggestedMax: 25,
						grid: {
							drawOnChartArea: false
						}
					},
					A: {
						type: 'linear',
						display: true,
						position: 'right',
						suggestedMin: -2.0,
						suggestedMax: 10
					},
					mv: {
						type: 'linear',
						display: true,
						position: 'left',
						suggestedMin: 0.0,
						suggestedMax: 4.2,
						grid: {
							color: ['#777777FF', '#77777780']
						}
					}
				}
			}
		});
		chartDataClear();
	}
	let mychart = null;
	let chartCanvas;
	let chartKey = 0;
	let chartDataCount = 0;
	export let dataTypesArrayU;
	$: chartDataPush(dataTypesArrayU);
	function chartDataPush(newdatas) {
		if (!mychart) return;
		mychart.data.datasets.forEach((dataset) => {
			newdatas.forEach((newdata) => {
				if (dataset.head == newdata.head) {
					dataset.data.push(newdata.v);
				}
			});
		});
		chartDataCount++;
		chartKey++;
		if (chartDataCount > 600) {
			mychart.data.datasets.forEach((dataset) => {
				dataset.data.shift();
			});
			mychart.data.labels.shift();
			mychart.data.labels.push(chartKey * 50 + 'ms');
			chartDataCount -= 1;
		}
		mychart.update('none');
	}
	function chartDataClear() {
		mychart.data.labels = [];
		for (let k = 0; k < 600; k++) {
			mychart.data.labels.push(k * 50 + 'ms');
		}
		mychart.data.datasets.forEach((dataset) => {
			dataset.data = [];
		});
		chartKey = 0;
		chartDataCount = 0;
		mychart.update('none');
	}
	export let device;
	$: if (device) {
		chartDataClear();
	}
	let chartRendering = false;
	let chartRenderingTimeout = 0;
	let lastRenderTimerId = 0;
	function handleChartResize(w, h) {
		chartRenderingTimeout = 200;
		if (lastRenderTimerId > 0) {
			return;
		}
		chartRendering = true;
		let timerID = setInterval(() => {
			if (chartRenderingTimeout > 0) {
				chartRenderingTimeout -= 50;
			} else {
				chartRendering = false;
			}
			if (!chartRendering) {
				clearInterval(timerID);
				lastRenderTimerId = 0;
			}
		}, 50);
		lastRenderTimerId = timerID;
	}
</script>

<div use:observer class="flex lg:w-4/5 w-full h-max p-4 border-2 rounded-xl">
	<div class="flex justify-center h-full w-full">
		<div
			class={mychart != null && !chartRendering
				? 'hidden'
				: 'skeleton flex w-full aspect-[3/1] justify-center items-center'}
		>
			<span class="loading loading-spinner loading-lg" />
		</div>
		<div class={mychart == null || chartRendering ? 'hidden' : 'w-full aspect-[3/1]'}>
			<canvas bind:this={chartCanvas} class="max-w-full max-h-full" />
		</div>
	</div>
</div>
