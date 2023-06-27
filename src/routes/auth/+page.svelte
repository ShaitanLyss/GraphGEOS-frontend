<script>
  import { signIn, signOut } from "@auth/sveltekit/client"
  import { page } from "$app/stores"

</script>

<h1>SvelteKit Auth Example</h1>
<p>
  {#if $page.data.session}
    {#if $page.data.session.user?.image}
      <span
        style="background-image: url('{$page.data.session.user.image}')"
        class="avatar"
      />
    {/if}
    <span class="signedInText">
      <small>Signed in as</small><br />
      <strong>{$page.data.session.user?.name ?? "User"}</strong>
    </span>
    <button on:click={() => signOut()} class="button">Sign out</button>
  {:else}
    <div class="flex flex-col">

    <span class="notSignedInText">You are not signed in</span>
    <button class="btn variant-filled" on:click={() => signIn("github")}>Sign In with GitHub</button>
    </div>
  {/if}
</p>