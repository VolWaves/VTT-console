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
let voltPostProc = (adc) => {
	let mv = 1.277 * adc - 96;
	if (mv < 50) {
		mv = 0;
	}
	return mv / 1000;
};
let currentPostProc = (adc) => {
	let mA = 4.07 * adc - 12610;
	if (mA < 140 && mA > -80) {
		mA = 0;
	}
	return mA / 1000;
};
let voltOutDataSet = {
	name: '输出电压',
	head: 0x11,
	postfix: 'V',
	v: 0,
	postProc: voltPostProc,
	print: (self) => {
		return self.v.toFixed(2) + self.postfix;
	}
};
let currentInDataSet = {
	name: '输入电流',
	head: 0x12,
	postfix: 'A',
	v: 0,
	postProc: currentPostProc,
	print: (self) => {
		return self.v.toFixed(2) + self.postfix;
	}
};
let voltInDataSet = {
	name: '输入电压',
	head: 0x13,
	postfix: 'V',
	v: 0,
	postProc: voltPostProc,
	print: (self) => {
		return self.v.toFixed(2) + self.postfix;
	}
};
let currentOutDataSet = {
	name: '输出电流',
	head: 0x14,
	postfix: 'A',
	v: 0,
	postProc: currentPostProc,
	print: (self) => {
		return self.v.toFixed(2) + self.postfix;
	}
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
let powerDataSet = {
	name: '峰值功率',
	head: 0xf0,
	postfix: 'W',
	v: 0,
	print: (self) => {
		return self.v.toFixed(1) + self.postfix;
	}
};
let delayDataSet = {
	name: '点火延迟',
	head: 0x72,
	postfix: 'ms',
	v: 0,
	print: (self) => {
		return (self.v / 1000).toFixed(1) + self.postfix;
	}
};
let worktimeDataSet = {
	name: '燃烧时间',
	head: 0x74,
	postfix: 'ms',
	v: 0,
	print: (self) => {
		return (self.v / 1000).toFixed(0) + self.postfix;
	}
};
let timestampDataSet = {
	name: '时间戳',
	head: 0x7f,
	postfix: 'us',
	v: 0
};

export let dataTypesArray = new Array(
	temperatureDataSet,
	voltInDataSet,
	currentInDataSet,
	voltOutDataSet,
	currentOutDataSet,
	powerDataSet,
	freqDataSet,
	ratioDataSet,
	delayDataSet,
	worktimeDataSet,
	timestampDataSet
);
export const dataTypes = new Map([
	[0x00, temperatureDataSet],
	[0x10, freqDataSet],
	[0x11, voltOutDataSet],
	[0x12, currentInDataSet],
	[0x13, voltInDataSet],
	[0x14, currentOutDataSet],
	[0x18, ratioDataSet],
	[0xf0, powerDataSet],
	[0x72, delayDataSet],
	[0x74, worktimeDataSet],
	[0x7f, timestampDataSet]
]);
export function dataUpdate(datas) {
	datas.forEach((element) => {
		if (dataTypes.has(element.head)) {
			dataTypes.get(element.head).v = element.v;
		}
	});
	powerDataSet.v = voltOutDataSet.v * currentInDataSet.v;
	if (freqDataSet.v > 0.0 && freqDataSet.v < 100.0) {
		powerDataSet.v = (powerDataSet.v * freqDataSet.v) / 100;
	}
}
