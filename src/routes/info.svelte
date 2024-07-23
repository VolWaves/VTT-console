<script>
	export let dataTypesArrayU;
	const cellStyle = 'flex flex-col justify-center items-center w-full';
	let datas = [
		{ name: '阻抗估计', value: '?', unit: 'Ω' },
		{ name: '点火延迟', value: 0, unit: 'ms' },
		{ name: '点火压降', value: 0, unit: 'mV' },
		{ name: '点火时间', value: 0.0, unit: 's' },
		{ name: '平均功率', value: 0.0, unit: 'W' },
		{ name: '能量释放', value: 0.0, unit: 'mAh' }
	];
	let state = '空闲';
	let pwm = 0;
	let peakPower = 0;
	let batt = 0;
	let battIdle = 0;
	let burnTime = 0;
	let inputCurrent = 0;
	let dataUpdate = (dat) => {
		dat.forEach((elem) => {
			switch (elem.head) {
				case 0x72: // 点火延迟
					datas[1].value = (elem.v / 1e3).toFixed(1);
					break;
				case 0x74: // 燃烧时间
					burnTime = (elem.v / 1e6).toFixed(2);
					break;
				case 0x18: // 占空比
					pwm = elem.v / 100;
					break;
				case 0xf0: // 峰值功率
					peakPower = elem.v;
					break;
				case 0x13: // 输入电压
					batt = elem.v;
					break;
				case 0x12: // 输入电流
					inputCurrent = elem.v;
					break;
			}
		});
		if (inputCurrent < -0.06) {
			state = '充电';
		} else if (peakPower < 1.0) {
			battIdle = batt;
			datas[2].value = 0;
			state = '空闲';
		} else if (peakPower > 2.0) {
			state = '放电';
		}
		if (burnTime > 0.5 && burnTime < 1.0) {
			let voltDrop = (battIdle - batt) * 1000;
			if (voltDrop > datas[2].value) {
				datas[2].value = voltDrop.toFixed(0);
			}
		}
		datas[3].value = burnTime;
		let power = peakPower * pwm;
		if (power > 10.0) {
			datas[4].value = power.toFixed(1);
		} else {
			datas[4].value = power.toFixed(2);
		}
	};
	$: dataUpdate(dataTypesArrayU);
</script>

<div
	class="flex lg:flex-col justify-center lg:gap-y-1 lg:w-[18%] flex-row gap-x-2 w-full min-h-[80px] border-2 lg:ml-2 p-2 rounded-xl"
>
	<div class={cellStyle}>
		<span class="text-5xl font-bold lg:pb-16">{state}</span>
	</div>

	<div class={cellStyle}>
		<div class="flex flex-wrap flex-col gap-y-0 justify-center">
			{#each datas as item}
				<div class="flex pt-1">
					<span class="inline-block text-sm text-right">{item.name}</span>
					<span class="inline-block text-sm text-center text-secondary font-bold pl-2 pr-1"
						>{item.value}</span
					>
					<span class="inline-block text-xs text-right align-text-bottom">{item.unit}</span>
				</div>
			{/each}
		</div>
	</div>
</div>
