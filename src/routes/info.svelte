<script>
	const cellStyle = 'flex flex-col justify-center items-center w-full';
</script>

<div
	class="flex lg:flex-col justify-center lg:gap-y-1 lg:w-[18%] flex-row gap-x-2 w-full min-h-[80px] border-2 lg:ml-2 p-2 rounded-xl"
>
	<div class={cellStyle}>
		<span class="text-5xl font-bold lg:pb-16">空闲</span>
	</div>

	<div class={cellStyle}>
		<div class="flex flex-wrap flex-col gap-y-0 justify-center">
			{#each [{ name: '阻抗估计', value: 1.04, unit: 'Ω' }, { name: '点火延迟', value: 22, unit: 'ms' }, { name: '点火压降', value: 335, unit: 'mV' }, { name: '点火时间', value: 2.35, unit: 's' }, { name: '平均功率', value: 8.09, unit: 'W' }, { name: '能量释放', value: 11.253, unit: 'mAh' }] as item}
				<div class="flex pt-1">
					<span class="inline-block text-sm text-left">{item.name}</span>
					<span class="inline-block text-sm text-center text-secondary font-bold pl-2 pr-1"
						>{item.value}</span
					>
					<span class="inline-block text-xs text-right align-text-bottom">{item.unit}</span>
				</div>
			{/each}
		</div>
	</div>
</div>
