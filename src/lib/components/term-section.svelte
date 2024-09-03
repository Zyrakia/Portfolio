<script lang="ts">
	import TermText from './term-text.svelte';

	export let title: string | undefined = undefined;
</script>

<div class="section">
	{#if title}
		<TermText text={title} lineIndicator="|" />
	{/if}

	<div class="content" style="padding-left: {title ? '1.25rem' : '0'}">
		<slot />
	</div>
</div>

<style>
	.section {
		display: flex;
		flex-direction: column;
	}
</style>
