<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { X, ImageIcon } from 'lucide-svelte';

	let { value = $bindable(''), label = '', name = '' } = $props();

	let previewUrl = $state(value);
	let fileInput: HTMLInputElement;

	// Update preview if value changes from parent (e.g. initial load)
	$effect(() => {
		if (value && !value.startsWith('blob:')) {
			previewUrl = value;
		}
	});

	function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		// Local preview only
		previewUrl = URL.createObjectURL(file);
	}

	function removeImage() {
		previewUrl = '';
		// We don't clear the 'value' prop here because it might be the existing URL
		// But we should signal that we want to remove/replace it.
		// A common trick is to have a hidden input that tells the server to delete the old one.
		if (fileInput) fileInput.value = '';
	}
</script>

<div class="space-y-2">
	<Label>{label}</Label>
	<div
		class="relative flex min-h-[140px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-4 transition-colors hover:border-primary/50"
	>
		{#if previewUrl}
			<div class="group relative h-32 w-full overflow-hidden rounded-md border bg-background">
				<img src={previewUrl} alt="Preview" class="h-full w-full object-contain" />
				<div
					class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
				>
					<Button
						variant="destructive"
						size="icon"
						class="h-8 w-8"
						onclick={removeImage}
						type="button"
					>
						<X size={14} />
					</Button>
				</div>
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center space-y-2 text-center">
				<div class="rounded-full bg-background p-3 shadow-sm">
					<ImageIcon class="h-6 w-6 text-muted-foreground" />
				</div>
				<div class="text-xs text-muted-foreground">
					<p class="font-medium text-foreground">Klik untuk ganti gambar</p>
					<p>PNG, JPG up to 5MB</p>
				</div>
			</div>
		{/if}

		<input
			type="file"
			{name}
			accept="image/*"
			class="absolute inset-0 cursor-pointer opacity-0"
			onchange={handleFileChange}
			bind:this={fileInput}
		/>
	</div>
	{#if value && value === previewUrl}
		<p class="text-[10px] text-muted-foreground truncate">Current: {value.split('/').pop()}</p>
	{/if}
</div>
