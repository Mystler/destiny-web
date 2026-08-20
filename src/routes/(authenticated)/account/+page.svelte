<script lang="ts">
  import { resolve } from "$app/paths";
  import { slide } from "$lib/assets/Animatons";
  import ButtonLink from "$lib/components/ButtonLink.svelte";
  import Card from "$lib/components/Card.svelte";

  let { data, form } = $props();
  let showForm = $state<"email" | "password">();
</script>

<svelte:head>
  <title>DestinyURU Account</title>
  <meta name="description" content="Manage your DestinyURU account." />
</svelte:head>

<h1>My Account</h1>

<p>Welcome {data.loggedIn}!</p>

{#if form?.error}
  <p class="error">{form.error}</p>
{/if}
{#if form?.success}
  <p class="success">{form.success}</p>
{/if}

<p>
  <button class="link-btn" onclick={() => (showForm = showForm !== "email" ? "email" : undefined)}>Change E-Mail</button
  ><br />
  <button class="link-btn" onclick={() => (showForm = showForm !== "password" ? "password" : undefined)}
    >Change Password</button
  ><br />
  <a class="link-btn" href={resolve("/logout")}>Logout</a>
</p>

{#if showForm === "email"}
  <form transition:slide method="POST" action="?/change_email" class="flex flex-col items-center gap-2 text-left">
    <p class="text-xs">Current E-Mail Address:<br />{data.email}</p>
    <label>
      Password:<br />
      <input type="password" name="password" required />
    </label>
    <label>
      New E-Mail Address:<br />
      <input type="email" name="email" required />
    </label>
    <input type="submit" value="Confirm" />
  </form>
{:else if showForm === "password"}
  <form transition:slide method="POST" action="?/change_password" class="flex flex-col items-center gap-2 text-left">
    <label>
      Old Password:<br />
      <input type="password" name="old_password" required />
    </label>
    <label>
      New Password:<br />
      <input type="password" name="new_password" required />
    </label>
    <label>
      Confirm Password:<br />
      <input type="password" name="password_confirm" required />
    </label>
    <input type="submit" value="Confirm" />
  </form>
{/if}

<div class="mt-16">
  <ButtonLink href={resolve("/(authenticated)/age-upload")}>Age Uploader</ButtonLink>
</div>

<div class="mx-auto mt-16 max-w-xl p-1">
  <Card>
    <h3>My Avatars</h3>
    {#if !data.avatars || data.avatars.length === 0}
      <p>None! You should log into Destiny and make one!</p>
    {:else}
      <div class="flex flex-col gap-2">
        {#each data.avatars as avatar (avatar.PlayerIdx)}
          <div class="flex flex-wrap items-center gap-4">
            <div>{avatar.Online ? "🟢" : "🔴"} {avatar.PlayerName}</div>
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
