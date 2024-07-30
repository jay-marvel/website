<script>
  import '../app.css';
  import AppNav from '$lib/AppNav.svelte'
  import {Container} from '@sveltestrap/sveltestrap';
</script>

<main>
  <AppNav></AppNav>
  <Container>
    <slot />
  </Container>
  
</main>