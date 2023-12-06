let temperatureDataSet = {
	name: "温度",
	head: 0x00,
	postfix: "℃",
	v: 0,
	postProc: (v) => {
		let temp
		if (v >= 0x8000) {
			temp = 0x10000 - v
		} else {
			temp = v
		}
		return temp / 10
	},
	print: (self) => {
		return self.v.toFixed(1) + self.postfix
	},
}
let freqDataSet = {
	name: "输出频率",
	head: 0x10,
	postfix: "Hz",
	v: 0,
	postProc: (v) => {
		return v / 10
	},
	print: (self) => {
		return self.v.toFixed(1) + self.postfix
	},
}
let peakDataSet = {
	name: "输出峰值",
	head: 0x11,
	v: 0,
}
let currentDataSet = {
	name: "输出电流",
	head: 0x12,
	v: 0,
}
let battDataSet = {
	name: "电池电压",
	head: 0x13,
	v: 0,
}
let ratioDataSet = {
	name: "输出占空比",
	head: 0x18,
	postfix: "%",
	v: 0,
	postProc: (v) => {
		return v / 10
	},
	print: (self) => {
		return self.v.toFixed(1) + self.postfix
	},
}
export let dataTypesArray = new Array(
	temperatureDataSet,
	battDataSet,
	currentDataSet,
	peakDataSet,
	freqDataSet,
	ratioDataSet
)
export const dataTypes = new Map([
	[0x00, temperatureDataSet],
	[0x10, freqDataSet],
	[0x11, peakDataSet],
	[0x12, currentDataSet],
	[0x13, battDataSet],
	[0x18, ratioDataSet],
])
export function dataUpdate(datas) {
	datas.forEach((element) => {
		if (dataTypes.has(element.head)) {
			dataTypes.get(element.head).v = element.v
		}
	})
}
