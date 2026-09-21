<script lang="ts">
  import { resolve } from "$app/paths";
  import ButtonLink from "$lib/components/ButtonLink.svelte";
  import { PUBLIC_RECAPTCHA_SITE_KEY } from "$env/static/public";

  let { form } = $props();
</script>

<svelte:head>
  <title>DestinyURU Signup</title>
  <meta name="description" content="Register an account for DestinyURU." />
  <script src="https://www.google.com/recaptcha/enterprise.js" async defer></script>
</svelte:head>

<h1>Sign Up for DestinyURU</h1>

<form method="POST" class="flex flex-col items-center gap-2 text-left">
  {#if !form?.accountCreated}
    <label>
      Username:<br />
      <input type="text" name="login" value={form?.login ?? ""} required />
    </label>
    <label>
      E-Mail Address:<br />
      <input type="email" name="email" value={form?.email ?? ""} required />
    </label>
    <label>
      Password:<br />
      <input type="password" name="password" required />
    </label>
    <label>
      Confirm Password:<br />
      <input type="password" name="password_confirm" required />
    </label>
    <div class="g-recaptcha" data-sitekey={PUBLIC_RECAPTCHA_SITE_KEY} data-action="SIGNUP"></div>
    {#each form?.issues as issue (issue.path)}
      <p class="error">{issue.message}</p>
    {/each}
    {#if form?.error}
      <p class="error">{form.error}</p>
    {/if}
    <input type="submit" />
  {:else}
    <p>Your account has been created! You can now go and log in!</p>
    <ButtonLink href={resolve("/login")}>Login</ButtonLink>
  {/if}
</form>
