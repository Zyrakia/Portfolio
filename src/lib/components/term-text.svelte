<script lang="ts">
	export let text: string;
	export let lineIndicator = '$';
</script>

<p class="terminal-text">
	<span class="line-indicator">{lineIndicator}</span>
	<span class="text-content">
		{text}
	</span>
</p>

<style>
	.line-indicator {
		color: darkseagreen;
		font-weight: lighter;
	}
</style>
