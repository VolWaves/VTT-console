<script>
	export let device = null;

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

	let workDuration = 1200;
	let workIntervar = 3000;
	let workDurationScanStart = 300;
	let workDurationScanEnd = 2000;

	let inputCheckTimerID = 0;
	let inputCheckCount = 10;
	let inputCheck = () => {
		let timerID = 0;
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

	$: if (workDuration > 8000 || workDuration < 100) {
		inputCheckCount = 10;
	}

	$: workDurationScanEnd = Math.max(workDurationScanEnd, workDurationScanStart + 1);

	const title = 'select-none self-start text-sm w-full text-center font-bold';
	const settinggroup = 'pt-2 w-full text-center max-w-xs';
	const settings = 'flex text-secondary font-bold';
	const numberinput = 'appearance-none input input-bordered input-secondary input-xs w-full';
	const testbtn = 'self-end btn btn-outline btn-warning';
	const controls =
		'flex flex-wrap gap-x-2 gap-y-1 justify-center items-center lg:w-[23%] w-[48%] px-2 py-2 border-2 rounded-xl';
</script>

<div class="flex w-full px-6 py-2">
	<div class="flex flex-wrap justify-center gap-y-1 gap-x-2 w-full">
		<div class={controls}>
			<span class={title}>单次点火测试</span>
			<div class={settinggroup}>
				<span class={settings}>点火时长 {workDuration}ms</span>
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
		<div class={controls}>
			<span class={title}>连续点火测试</span>
			<div class={settinggroup}>
				<span class={settings}>点火时长 {workDuration}ms</span>
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
				<span class={settings}>点火间隔 {workIntervar}ms</span>
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
			<button
				class={testbtn}
				on:click={() => console.log('连续点火测试', workDuration, workIntervar)}>⚠️ 点火 ⚠️</button
			>
		</div>
		<div class={controls}>
			<span class={title}>点火时序测试</span>
			<div class={settinggroup}>
				<span class={settings}>点火扫描区间 {workDurationScanStart}ms-{workDurationScanEnd}ms</span>
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
				<span class={settings}>点火间隔 {workIntervar}ms</span>
				<input
					type="range"
					min="200"
					max="10000"
					bind:value={workIntervar}
					class="range range-secondary range-xs"
				/>
				<input
					type="number"
					placeholder="间隔（毫秒）"
					bind:value={workIntervar}
					class={numberinput}
				/>
			</div>
			<button
				class={testbtn}
				on:click={() => console.log('点火时序测试', workDurationScanStart, workDurationScanEnd)}
				>⚠️ 点火 ⚠️</button
			>
		</div>
		<div class={controls}>
			<span class={title}>系统功能</span>
			<div class={settinggroup}>
				<span class={settings}>波形数据</span>
				<button class="btn btn-outline btn-success">数据导出</button>
				<button class="btn btn-outline btn-success" onclick="dataClear.showModal()">数据清理</button
				>
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
				<span class={settings}>测试接口</span>
				<button class="btn btn-outline btn-success" on:click={() => hidTest(0xa5)}
					>HIDtest A5</button
				>
				<button class="btn btn-outline btn-success" on:click={() => setWorkMode(0x80)}
					>主动低有效</button
				>
				<button class="btn btn-outline btn-success" on:click={() => setWorkMode(0x00)}
					>被动低有效</button
				>
				<button class="btn btn-outline btn-error" on:click={BootLoader}>BootLoader</button>
			</div>
		</div>
	</div>
</div>
