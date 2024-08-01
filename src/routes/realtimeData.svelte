<script>
	export let dataTypesArrayU;
	// 显示过滤
	const filter = [0x10, 0x11, 0x12, 0x13, 0x14, 0x18, 0xf0];
</script>

<div class="flex-1">
	<div class="mx-auto min-w-[80%]">
		<dl class="grid gap-x-2 auto-cols-max text-center lg:grid-cols-7 grid-cols-3">
			{#if dataTypesArrayU}
				{#each dataTypesArrayU as item}
					{#if filter.includes(item.head)}
						<div class="flex flex-col gap-y-0">
							<dt class="lg:text-sm text-xs leading-7 text-gray-600">{item.name}</dt>
							<dd
								class="order-first lg:text-2xl text-base font-semibold tracking-tight text-white-900"
							>
								{#if item.print}{item.print(item)}{:else}{item.v}{/if}
							</dd>
						</div>
					{/if}
				{/each}
			{/if}
		</dl>
	</div>
</div>
