<script lang="ts">
  import { resolve } from "$app/paths";
  import { slide } from "$lib/assets/Animatons";
  import ButtonLink from "$lib/components/ButtonLink.svelte";
  import Card from "$lib/components/Card.svelte";
  import { onMount } from "svelte";
  import { getAvatars, updateEmail, updatePassword } from "./data.remote.js";

  let { data } = $props();
  let showForm = $state<"email" | "password">();
  let updateEmailResult = $derived(updateEmail.result);
  let updatePasswordResult = $derived(updatePassword.result);
  onMount(() => {
    updateEmailResult = undefined;
    updatePasswordResult = undefined;
    updateEmail.element?.reset();
    updatePassword.element?.reset();
  });
</script>

<svelte:head>
  <title>DestinyURU Account</title>
  <meta name="description" content="Manage your DestinyURU account." />
</svelte:head>

<h1>My Account</h1>

<p>Welcome {data.loggedIn}!</p>

{#each updateEmail.fields.allIssues() as issue (issue.path)}
  <p class="error">{issue.message}</p>
{/each}
{#if updateEmailResult?.success}
  <p class="success">{updateEmailResult.success}</p>
{/if}
{#if updateEmailResult?.error}
  <p class="error">{updateEmailResult.error}</p>
{/if}
{#each updatePassword.fields.allIssues() as issue (issue.path)}
  <p class="error">{issue.message}</p>
{/each}
{#if updatePasswordResult?.success}
  <p class="success">{updatePasswordResult.success}</p>
{/if}
{#if updatePasswordResult?.error}
  <p class="error">{updatePasswordResult.error}</p>
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
  <form transition:slide {...updateEmail} class="flex flex-col items-center gap-2 text-left">
    <p class="text-xs">Current E-Mail Address:<br />{data.email}</p>
    <label>
      Password:<br />
      <input required {...updateEmail.fields.password.as("password")} />
    </label>
    <label>
      New E-Mail Address:<br />
      <input required {...updateEmail.fields.email.as("email")} />
    </label>
    <input type="submit" value="Confirm" />
  </form>
{:else if showForm === "password"}
  <form transition:slide {...updatePassword} class="flex flex-col items-center gap-2 text-left">
    <label>
      Old Password:<br />
      <input required {...updatePassword.fields._old_password.as("password")} />
    </label>
    <label>
      New Password:<br />
      <input required {...updatePassword.fields._new_password.as("password")} />
    </label>
    <label>
      Confirm Password:<br />
      <input required {...updatePassword.fields._password_confirm.as("password")} />
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
    {const avatars = $derived(await getAvatars())}
    {#if !avatars || avatars.length === 0}
      <p>None! You should log into Destiny and make one!</p>
    {:else}
      <div class="flex flex-col gap-2">
        {#each avatars as avatar (avatar.PlayerIdx)}
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
