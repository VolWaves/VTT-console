<script>
	import { createEventDispatcher } from 'svelte';
	import { dataTypes, dataUpdate } from './dataHandler';
	import { onMount } from 'svelte';
	const dispatch = createEventDispatcher();

	export let hidDevice = null;
	let wantConnect = false;
	onMount(() => {
		navigator.hid.addEventListener('connect', ({ device }) => {
			console.log(`HID connected: ${device.productName}`);
			if (!hidDevice && device.vendorId == 0xcafe) {
				wantConnect = true;
				handleConnection();
			}
		});

		navigator.hid.addEventListener('disconnect', ({ device }) => {
			console.log(`HID disconnected: ${device.productName}`);
			if (device.vendorId == 0xcafe) {
				hidDevice = null;
				wantConnect = false;
				handleConnection();
			}
		});
	});
	async function handleConnection() {
		setTimeout(async () => {
			await handleDisconnectClick();
			if (wantConnect) {
				await handleConnectClick();
				if (!hidDevice) {
					wantConnect = false;
				}
			}
		}, 150);
	}
	async function handleConnectClick() {
		let ret = await openFirstDeviceById(0xcafe);
		if (ret < 0) {
			hidDevice = null;
		} else {
			hidDevice = ret;
		}
	}
	async function handleDisconnectClick() {
		if (!hidDevice) return;
		console.log(hidDevice);

		await hidDevice.close();
		hidDevice = null;
		console.log('device closed');
	}
	async function openFirstDeviceById(vid) {
		const device_list = await navigator.hid.getDevices();
		if (device_list.length == 0) {
			console.log('ERROR: No devices found');
			return -1;
		}
		console.log('device list', device_list);
		let hidDevice = device_list.find((d) => d.vendorId === vid);
		if (!hidDevice) {
			console.log('ERROR: No valid devices found');
			return -2;
		}
		if (!hidDevice.opened) {
			await hidDevice.open();
		}
		hidDevice.oninputreport = reportPaser;
		console.log('device opened:', hidDevice);
		return hidDevice;
	}
	async function openDeviceListById(vendorId) {
		let devs = await navigator.hid.requestDevice({
			filters: [{ vendorId }]
		});
		if (devs.length == 0) {
			console.log('ERROR: No valid devices found');
			return -1;
		}
		console.log('valid devices:', devs);
		let hidDevice = devs[0];
		if (!hidDevice.opened) {
			await hidDevice.open();
		}
		hidDevice.oninputreport = reportPaser;
		console.log('device opened:', hidDevice);
		return hidDevice;
	}

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
		// function buf2hex(buffer) {
		// 	return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, '0')).join(' ');
		// }
		// console.log("hid", buf2hex(data.buffer));
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
			return { name: dataType.name, head: dataType.head, v: dataType.v };
		};
		let output = [];
		let dataFrame = getDataFrame();
		while (dataFrame) {
			output.push(dataFrame);
			dataFrame = getDataFrame();
		}
		if (output.length) {
			dataUpdate(output);
			dispatch('message', output);
		}
	}

	function reportPaser(event) {
		const { data, device, reportId } = event;
		if (!hidDevice) {
			device.close();
			return;
		}
		dataPaser(new Uint8Array(data.buffer));
	}
</script>

<label class="flex-none cursor-pointer gap-2">
	<span class="label-text">断开</span>
	<input
		type="checkbox"
		class="toggle checked:bg-green-300 checked:border-green-800"
		on:change={handleConnection}
		bind:checked={wantConnect}
	/>
	<span class="label-text">连接</span>
</label>
