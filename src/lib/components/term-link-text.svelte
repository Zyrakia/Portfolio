<script lang="ts">
	import TermText from './term-text.svelte';

	export let text: string;
	export let url: string;
</script>

<a href={url}>
	<TermText {text} />
</a>

<style>
    a {
        text-decoration: none;
    }
</style>