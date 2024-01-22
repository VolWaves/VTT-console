<script>
	export let title = '';
	export let settinggroup = '';
	export let settings_title = '';
	export let settings_value = '';
	export let numberinput = '';
	export let testbtn = '';
	export let controls = '';
	export let dividerStyle = '';

	let workDuration = 1200;
	let workIntervar = 3000;
	let workCount = 10;
	let workDurationScanStart = 300;
	let workDurationScanEnd = 2000;

	let inputCheckTimerID = 0;
	let inputCheckCount = 10;
	let inputCheck = () => {
		let timerID = 0;
		console.log('inputCheck start');
		timerID = setInterval(() => {
			if (inputCheckCount > 0) {
				inputCheckCount -= 1;
				if (inputCheckCount == 0) {
					workDuration = Math.min(8000, Math.max(100, workDuration));
					workIntervar = Math.min(10000, Math.max(200, workIntervar));
				}
			}
			if (timerID != inputCheckTimerID) {
				clearInterval(timerID);
			}
		}, 100);
		inputCheckTimerID = timerID;
	};
	inputCheck();

	$: if (workDuration > 8000 || workDuration < 100 || workIntervar < 200 || workIntervar > 10000) {
		inputCheckCount = 10;
	}

	$: workDurationScanEnd = Math.max(workDurationScanEnd, workDurationScanStart + 1);
</script>

<div class={controls}>
	<span class={title}>单次点火测试</span>
	<div class={settinggroup}>
		<span class={settings_title}>点火时长</span>
		<span class={settings_value}>{workDuration}ms</span>
		<input
			type="range"
			min="100"
			max="8000"
			bind:value={workDuration}
			class="range range-secondary range-xs"
		/>
		<input
			type="number"
			placeholder="点火时间（毫秒）"
			bind:value={workDuration}
			class={numberinput}
		/>
	</div>
	<button
		class={testbtn}
		on:click={() => {
			console.log('单次点火测试', workDuration);
			setWorkSingle(workDuration);
		}}>⚠️ 点火 ⚠️</button
	>
</div>

<div class="divider divider-horizontal {dividerStyle}" />
<div class={controls}>
	<span class={title}>点火时序测试</span>
	<div class={settinggroup}>
		<span class={settings_title}>点火扫描区间</span>
		<span class={settings_value}>{workDurationScanStart}ms</span>
		<span class={settings_title}>-</span>
		<span class={settings_value}>{workDurationScanEnd}ms</span>
		<input
			type="range"
			min="100"
			max="7990"
			bind:value={workDurationScanStart}
			class="range range-secondary range-xs"
		/>
		<input
			type="range"
			min="110"
			max="8000"
			bind:value={workDurationScanEnd}
			class="range range-secondary range-xs"
		/>
	</div>
	<div class={settinggroup}>
		<span class={settings_title}>点火间隔</span>
		<span class={settings_value}>{workIntervar}ms</span>
		<input
			type="range"
			min="200"
			max="10000"
			bind:value={workIntervar}
			class="range range-secondary range-xs"
		/>
		<input type="number" placeholder="间隔（毫秒）" bind:value={workIntervar} class={numberinput} />
	</div>
	<button
		class={testbtn}
		on:click={() => console.log('点火时序测试', workDurationScanStart, workDurationScanEnd)}
		>⚠️ 扫描 ⚠️</button
	>
</div>
