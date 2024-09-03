<script lang="ts">
	export let text: string;
</script>

<span class="terminal-text"><span class="line-indicator">$</span> {text}</span>

<style>
	.line-indicator {
		color: darkseagreen;
		font-weight: bold;
	}
</style>
