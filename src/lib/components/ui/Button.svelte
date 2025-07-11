<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'ghost' | 'link' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let disabled = false;
  export let loading = false;

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    link: 'btn-link',
  };

  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  };

  $: classes = `btn ${variantClasses[variant]} ${sizeClasses[size]}`;
</script>

<button class={classes} {disabled} on:click {...$$restProps}>
  {#if loading}
    <span class="loading loading-spinner"></span>
  {/if}
  <slot />
</button>
