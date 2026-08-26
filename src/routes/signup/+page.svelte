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
    {#if form?.missing}
      <p class="error">All fields need to be filled out!</p>
    {/if}
    {#if form?.emailUser}
      <p class="error">Please do not use an e-mail address as your username.</p>
    {/if}
    {#if form?.passwordMismatch}
      <p class="error">Your password confirmation did not match!</p>
    {/if}
    {#if form?.passwordTooLong}
      <p class="error">Sorry, URU only supports password up to 15 characters in length!</p>
    {/if}
    {#if form?.fail}
      <p class="error">Your account could not be created, the Username or E-Mail might already exist!</p>
    {/if}
    {#if form?.captchaFailed}
      <p class="error">You could not be verified by against bot protections... Shame...</p>
    {/if}
    <input type="submit" />
  {:else}
    <p>Your account has been created! You can now go and log in!</p>
    <ButtonLink href={resolve("/login")}>Login</ButtonLink>
  {/if}
</form>
