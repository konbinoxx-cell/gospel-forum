<script>
  import { onMount } from 'svelte';
  import { getThreads } from '$lib/api/readIssues';

  let threads = [];
  let loading = true;

  onMount(async () => {
    threads = await getThreads();
    loading = false;
  });
</script>

<main style="max-width: 800px; margin: 0 auto; padding: 1.5rem; font-family: system-ui, sans-serif;">
  <header>
    <h1 style="font-size: 1.8rem; margin-bottom: 1.5rem;">福音论坛</h1>
  </header>

  {#if loading}
    <p>载入中，请稍候...</p>
  {:else}
    <div style="display: grid; gap: 1.2rem;">
      {#each threads as thread}
        <article style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.2rem; background: #fff;">
          <div style="display: inline-block; background: #ebf8ff; color: #3182ce; padding: 0.25rem 0.75rem; font-size: 0.85rem; border-radius: 999px; margin-bottom: 0.75rem;">
            {thread.category}
          </div>
          <h2 style="font-size: 1.25rem; margin: 0.5rem 0;">{thread.title}</h2>
          <p style="color: #4a5568; line-height: 1.6; margin: 0.75rem 0;">{thread.body}</p>
          <footer style="display: flex; justify-content: space-between; color: #718096; font-size: 0.875rem; margin-top: 1rem;">
            <span>by {thread.nickname}</span>
            <time>{new Date(thread.createdAt).toLocaleDateString('zh-CN')}</time>
          </footer>
        </article>
      {/each}
    </div>
  {/if}
</main>
