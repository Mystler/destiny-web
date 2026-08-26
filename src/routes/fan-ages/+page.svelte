<script lang="ts">
  import { resolve } from "$app/paths";

  let { data } = $props();
  let search = $state("");
</script>

<svelte:head>
  <title>DestinyURU Fan Ages</title>
  <meta name="description" content="See which fan ages are currently supported by Destiny." />
</svelte:head>

<h1>Fan Ages</h1>

<div class="p-1">
  <p>Here is a list of the currently supported fan ages and their unique sequence prefix numbers.</p>
  <p>
    These ages can be visited on Destiny, but be aware that you still need to get the game files for them yourself and
    put them into the game folder in order to actually play there.
  </p>
  <p>
    If you are logged into the site, you can upload your own fan age using the <a
      href={resolve("/(authenticated)/age-upload")}>Age Uploader</a
    > form. I will add it to this list once I have processed your age.
  </p>
  <p>
    Sequence prefixes below 100 should be considered reserved by Cyan and not used for fan ages. Likewise, do not use
    numbers at 32768 or higher.
  </p>
  {#if !data.sequencePrefixes || data.sequencePrefixes.length === 0}
    <p class="bg-slate-700">The list is currently empty.</p>
  {:else}
    <p><label>Search: <input class="p-1" type="search" bind:value={search} /></label></p>
    {const filtered = $derived(
      data.sequencePrefixes.filter((x) => x.seqPrefix.toString().includes(search) || x.age.includes(search)),
    )}
    <table class="mx-auto text-left md:min-w-md">
      <tbody>
        <tr><td><b>Prefix</b></td><td><b>Age</b></td></tr>
        {#each filtered as entry (entry.seqPrefix)}
          <tr><td>{entry.seqPrefix}</td><td>{entry.age}</td></tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<style lang="postcss">
  @reference "../../routes/layout.css";

  tr {
    @apply odd:bg-slate-700;
  }

  td {
    padding: 4px 8px;
  }
</style>
