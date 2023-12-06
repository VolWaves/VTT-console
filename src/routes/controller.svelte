<div class="flex flex-row w-full px-6 py-2">
	<div class="flex flex-row flex-wrap gap-y-2 w-full min-h-[80px]">
		{#each Array(4) as _, index (index)}
			<div class="skeleton flex justify-center items-center px-2 lg:w-1/4 w-1/2 h-full border-2">
				<span class="loading loading-spinner loading-xs" />
				<span class="pl-2">Loading...</span>
			</div>
		{/each}
	</div>
</div>
