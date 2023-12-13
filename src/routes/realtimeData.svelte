
<script>
	export let dataTypesArrayU
</script>

<div class="flex-1">
	<div class="mx-auto min-w-[80%]">
		<dl class="grid gap-x-2 auto-cols-max text-center lg:grid-cols-6 grid-cols-3">
			{#if dataTypesArrayU}
			{#each dataTypesArrayU as item}
				<div class="flex flex-col gap-y-0">
					<dt class="lg:text-sm text-xs leading-7 text-gray-600">{item.name}</dt>
					<dd
						class="order-first lg:text-2xl text-base font-semibold tracking-tight text-white-900"
					>
						{#if item.print}{item.print(item)}{:else}{item.v}{/if}
					</dd>
				</div>
			{/each}
			{/if}
		</dl>
	</div>
</div>
