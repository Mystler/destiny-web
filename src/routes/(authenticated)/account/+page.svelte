<script lang="ts">
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import { slide } from "$lib/assets/Animatons";

  let { form } = $props();
  let showForm = $state<"email" | "password">();
</script>

<svelte:head>
  <title>DestinyURU Account</title>
  <meta name="description" content="Manage your DestinyURU account." />
</svelte:head>

<h1>My DestinyURU Account</h1>

<p>Welcome {page.data.loggedIn}!</p>

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

<div class="mt-16">More content may appear here later!</div>
