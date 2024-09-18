<script lang="ts">
	import type Konva from 'konva';
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import { Group, Rect } from 'svelte-konva';

	export let bg: Omit<Konva.RectConfig, 'width' | 'height'>;
	export let padding = 0;

	const emit = createEventDispatcher();

	let width = 0;
	let height = 0;

	let ref: Konva.Group | undefined;

	const update = () => {
		if (!ref) return;
		const rect = ref.getClientRect();
		width = rect.width + padding;
		height = rect.height + padding;

		emit('update', { width, height });
	};

	onMount(async () => {
		await tick();
		update();
	});
</script>

<Rect config={{ ...bg, width, height }} />

<Group bind:handle={ref} config={{ offsetX: -padding / 2, offsetY: -padding / 2 }}>
	<slot />
</Group>
