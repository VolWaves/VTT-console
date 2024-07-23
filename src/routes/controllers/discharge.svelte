<script>
	export let title = '';
	export let settinggroup = '';
	export let settings_title = '';
	export let settings_value = '';
	export let numberinput = '';
	export let testbtn = '';
	export let controls = '';
	export let dividerStyle = '';

	export let hidDevice;

	let workDuration = 1200;
	let workIntervar = 3000;
</script>

<div class={controls}>
	<span class={title}>放电测试</span>
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
		<input
			type="number"
			placeholder="间隔时间（毫秒）"
			bind:value={workIntervar}
			class={numberinput}
		/>
	</div>
	<button class={testbtn} on:click={() => console.log('放电测试', workDuration, workIntervar)}
		>⚠️ 开始 ⚠️</button
	>
</div>
