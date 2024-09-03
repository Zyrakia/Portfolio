<script lang="ts">
	export let title: string | undefined = undefined;
</script>

<div>
	{#if title}
		<h2>{title}</h2>
	{/if}

	<slot />
</div>

<style>
	div {
		text-indent: 1em;
		display: flex;
		flex-direction: column;
	}
</style>
