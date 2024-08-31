<script lang="ts">
	import { Layer, Stage } from 'svelte-konva';
</script>

<div>
	<Stage config={{ width: window.innerWidth, height: window.innerHeight, id: 'interactive-background' }}>
		<Layer></Layer>
	</Stage>
</div>

<style>
	div {
		position: absolute;
		left: 0;
		top: 0;
	}
</style>
