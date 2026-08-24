<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  import { getOnlineList } from "./admin.remote";

  let { data } = $props();
</script>

<svelte:head>
  <title>DestinyURU Admin Panel</title>
  <meta name="description" content="The DestinyURU view for admin stuff." />
</svelte:head>

<h1>Admin Panel</h1>

<div class="p-1">
  <p>{data.stats?.players} avatars on {data.stats?.accounts} accounts.</p>
  <div class="mx-auto mt-16 max-w-xl p-1">
    <Card>
      <h3>Online Avatars</h3>
      {const avatars = $derived(await getOnlineList())}
      {#if !avatars || avatars.length === 0}
        <p>Nobody is online right now!</p>
      {:else}
        <div class="flex flex-col gap-2">
          {#each avatars as avatar (avatar.PlayerIdx)}
            <div class="flex flex-wrap items-center gap-4">
              <div>🟢 {avatar.PlayerName}</div>
              <div class="text-xs text-slate-500">(KI# {avatar.PlayerIdx})</div>
              {#if avatar.Location}
                <div class="text-xs text-slate-500">Currently online in {avatar.Location}</div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </Card>
  </div>
</div>
