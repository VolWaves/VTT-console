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

	let signalMode = 0;
	let signalLevel = 0;
	let signalPinSetting = (mode, level) => {
		if (!hidDevice.isOnline()) return;
		console.log('信号引脚设置', mode, level);
		let setting;
		if (mode == 2) {
			setting = 0x80;
		} else {
			setting = 0x00;
		}
		if (level == 1) {
			setting |= 0x01;
		}
		hidDevice.setWorkMode(setting);
	};
	$: signalPinSetting(signalMode, signalLevel);
</script>

<div class={controls}>
	<span class={title}>信号引脚设置</span>

	<div class="{settinggroup} justify-center items-center text-center">
		<span class={settings_title}>信号引脚模式</span>
		<div class="flex justify-center gap-x-2">
			{#each [{ name: '无效', value: 0 }, { name: '输入', value: 1 }, { name: '输出', value: 2 }] as item}
				<label class="flex flex-col justify-center items-center text-center text-xs">
					<input
						type="radio"
						name="signalMode"
						value={item.value}
						class="radio radio-primary"
						bind:group={signalMode}
					/>
					<span class="select-none">{item.name}</span>
				</label>
			{/each}
		</div>
	</div>

	<div class="{settinggroup} justify-center items-center text-center">
		<span class={settings_title}>有效电平</span>
		<div class="flex justify-center gap-x-2">
			{#each [{ name: '低电平', value: 0 }, { name: '高电平', value: 1 }] as item}
				<label class="flex flex-col justify-center items-center text-center text-xs">
					<input
						type="radio"
						name="signalLevel"
						value={item.value}
						class="radio radio-primary"
						disabled={signalMode == 0}
						bind:group={signalLevel}
					/>
					<span class="select-none">{item.name}</span>
				</label>
			{/each}
		</div>
	</div>
</div>

<div class="divider divider-horizontal {dividerStyle}" />

<div class={controls}>
	<span class={title}>系统功能</span>
	<div class={settinggroup}>
		<span class={settings_title}>波形数据</span>
		<button class="btn btn-outline btn-success">数据导出</button>
		<button class="btn btn-outline btn-success" onclick="dataClear.showModal()">数据清理</button>
		<dialog id="dataClear" class="modal">
			<div class="modal-box border-2 rounded-xl border-warning">
				<h3 class="font-bold text-lg text-warning">⚠️ 确认清除缓存数据</h3>
				<div class="modal-action">
					<form method="dialog">
						<button class="btn btn-error" on:click={() => {}}>清除</button>
						<button class="btn btn-neutral">取消</button>
					</form>
				</div>
			</div>
		</dialog>
	</div>
	<div class={settinggroup}>
		<span class={settings_title}>测试接口</span>
		<button class="btn btn-outline btn-success" on:click={() => hidDevice.hidTest(0xa5)}
			>HIDtest A5</button
		>
		<button class="btn btn-outline btn-error" on:click={hidDevice.BootLoader}>BootLoader</button>
	</div>
</div>
