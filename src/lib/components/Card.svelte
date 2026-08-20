<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
    date?: string;
  }
  let { children, date }: Props = $props();
</script>

<div class="rounded-xl border border-amber-400 bg-slate-800 p-2 text-justify">
  {#if date}
    <p class="text-sm text-slate-400">{date}</p>
  {/if}
  {@render children()}
</div>
