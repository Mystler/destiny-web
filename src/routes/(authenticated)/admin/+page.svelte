<script lang="ts">
  // Disable ESLint alert for using @html because highlight.js will sanitize
  /* eslint svelte/no-at-html-tags: 0 */

  import { slide } from "$lib/assets/Animatons.js";
  import Card from "$lib/components/Card.svelte";
  import {
    copyAgeFile,
    copySdlFile,
    getOnlineList,
    getPlayerList,
    restartDirtsand,
    viewAgeUpload,
  } from "./admin.remote";
  import hljs from "highlight.js/lib/core";
  import diff from "highlight.js/lib/languages/diff";
  import "highlight.js/styles/github-dark-dimmed.css";

  hljs.registerLanguage("diff", diff);

  let { data } = $props();
  let showPlayerBrowser = $state(false);
  let playerSearch = $state("");
</script>

<svelte:head>
  <title>DestinyURU Admin Panel</title>
  <meta name="description" content="The DestinyURU view for admin stuff." />
</svelte:head>

<h1>Admin Panel</h1>

<div class="p-1">
  <p>{data.stats?.players} avatars on {data.stats?.accounts} accounts.</p>
  <div class="mx-auto max-w-xl p-1">
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
  <p>
    <button type="button" class="link-btn" onclick={() => (showPlayerBrowser = !showPlayerBrowser)}
      >Show All Players</button
    >
  </p>
  {#if showPlayerBrowser}
    <div transition:slide class="mx-auto max-w-xl p-1">
      <Card>
        <h3>Player Browser</h3>
        {const avatars = $derived(
          (await getPlayerList())?.filter(
            (x) =>
              x.PlayerName.toLowerCase().includes(playerSearch.toLowerCase()) ||
              x.UserName.toLowerCase().includes(playerSearch.toLowerCase()),
          ),
        )}
        <div class="mb-2">
          <label>Search: <input type="search" class="p-1" bind:value={playerSearch} /></label>
        </div>
        {#if !avatars || avatars.length === 0}
          <p>Nobody is online right now!</p>
        {:else}
          <div class="flex flex-col gap-2">
            {#each avatars as avatar (avatar.PlayerIdx)}
              <div class="flex flex-wrap items-center gap-4">
                <div>{avatar.Online ? "🟢" : "🔴"} {avatar.PlayerName} ({avatar.UserName})</div>
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
  {/if}
  <div class="p-1">
    <Card>
      <h3>Age Upload Viewer</h3>
      <div class="flex flex-col gap-2 text-left">
        <form {...viewAgeUpload} class="mb-2">
          <label>Age: <input required {...viewAgeUpload.fields.ageName.as("text")} /></label>
          <input type="submit" value="Check" />
        </form>
        {#each viewAgeUpload.fields.allIssues() as issue (issue.path)}
          <p class="error">{issue.message}</p>
        {/each}
        {#if viewAgeUpload.result}
          <div>Age Diff</div>
          <code class="rounded-xl bg-slate-700 p-2 whitespace-pre">
            {@html hljs.highlight(viewAgeUpload.result.diffAge, { language: "diff" }).value}
          </code>
          <div>SDL Diff</div>
          <code class="rounded-xl bg-slate-700 p-2 whitespace-pre">
            {@html hljs.highlight(viewAgeUpload.result.diffSdl, { language: "diff" }).value}
          </code>
          <div>Uploaded Age</div>
          <code class="rounded-xl bg-slate-700 p-2 whitespace-pre">
            {viewAgeUpload.result.age}
          </code>
          {#if viewAgeUpload.result.age !== "---"}
            <input
              type="button"
              class="self-end"
              onclick={async () => {
                if (!confirm("Do you really want to copy this age file?")) return;
                if (!viewAgeUpload.result?.ageName) return;
                try {
                  await copyAgeFile(viewAgeUpload.result?.ageName);
                } catch {
                  alert("Errror copying age file!");
                }
              }}
              value="Copy Age File"
            />
          {/if}
          <div>Uploaded SDL</div>
          <code class="rounded-xl bg-slate-700 p-2 whitespace-pre">
            {viewAgeUpload.result.sdl}
          </code>
          {#if viewAgeUpload.result.sdl !== "---"}
            <input
              type="button"
              class="self-end"
              onclick={async () => {
                if (!confirm("Do you really want to copy this SDL file?")) return;
                if (!viewAgeUpload.result?.ageName) return;
                try {
                  await copySdlFile(viewAgeUpload.result?.ageName);
                } catch {
                  alert("Errror copying SDL file!");
                }
              }}
              value="Copy SDL File"
            />
          {/if}
        {/if}
      </div>
    </Card>
  </div>
  <div class="p-1">
    <input
      type="button"
      onclick={async () => {
        if (!confirm("Do you really want to restart the Destiny server?")) return;
        try {
          await restartDirtsand();
        } catch {
          alert("Errror restarting Destiny server!");
        }
      }}
      value="Restart Destiny"
    />
  </div>
</div>
