<script lang="ts">
    import {
      Button,
      Collapse,
      Container,
      Navbar,
      NavbarToggler,
      NavbarBrand,
      Nav,
      NavItem,
      NavLink,
      Dropdown,
      DropdownToggle,
      DropdownMenu,
      DropdownItem
    } from '@sveltestrap/sveltestrap';
    import { Fa } from 'svelte-fa';
    import { faBars } from '@fortawesome/free-solid-svg-icons';
    import LoginModal from '$lib/LoginModal.svelte';
    import SignupModal from '$lib/SignupModal.svelte';

    import { goto } from '$app/navigation'; 
    import { onMount } from 'svelte';
    import { token, clearToken, initializeToken } from '$stores/auth'; // Adjust the path as needed
    import { writable } from 'svelte/store';

  
    let isOpen = false;
    let amILoggedIn = false;
    let isLoginModalOpen: boolean = false;
    let isSignupModalOpen: boolean = false;

    const tokenStore = writable<string | null>(null);

  onMount(() => {
    initializeToken();
  });

  function logout() {
    clearToken();
    tokenStore.set(null);
    goto('/');
  }

    function handleUpdate(event: any) {
      isOpen = event.detail.isOpen;
    }
  
    function toggleLoginModal(): void {
      isLoginModalOpen = !isLoginModalOpen;
    } 
    function toggleSignupModal(): void {
      isSignupModalOpen = !isSignupModalOpen;
    } 

  </script>

  <style>


  </style>
  

  <Navbar class="sticky-top drexel-blue"   dark expand="md">
    <NavbarBrand href="/" >
      <img style="height:40px" src="/drexel_nav_logo.png" alt="Drexel Logo">
      <code style="color: #FFC600">
        /* CNSE Explorer */
      </code>
    </NavbarBrand>
    <NavbarToggler on:click={() => (isOpen = !isOpen)} >
      <Fa icon={faBars} style="color: #FFC600"/>
    </NavbarToggler>
    <Collapse {isOpen} navbar expand="md" style="border-color: #FFC600" on:update={handleUpdate}>
      <Nav class="ml-auto d-flex" navbar>
        <NavItem>
          <NavLink href="/" style="color: #FFC600"
          on:click={() => (isOpen = !isOpen)}>Home</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/explore" style="color: #FFC600" 
            on:click={() => (isOpen = !isOpen)}>Explore</NavLink>
        </NavItem>
        
        
        {#if $token}
        <NavItem>
          <NavLink href="/contribute" style="color: #FFC600"
          on:click={() => (isOpen = !isOpen)}>Contribute</NavLink>
        </NavItem>
        <NavItem class="ml-4">
          <NavLink href="/profile" style="color: #FFC600"
          on:click={() => (isOpen = !isOpen)}>MyProfile</NavLink>
        </NavItem>
        <NavItem>
          <Button color="primary" class="rounded-pill" 
          on:click={logout}>Logout</Button>
        </NavItem>
        {:else}
          <NavItem class="ml-4">
            <NavLink  style="color: #FFC600"
            on:click={toggleSignupModal}>SignUp</NavLink>
          </NavItem>
          <NavItem>
            <Button color="primary" class="rounded-pill" 
            on:click={toggleLoginModal}>Login</Button>
          </NavItem>
        {/if}
      </Nav>
    </Collapse>

  </Navbar>

  <LoginModal isOpen={isLoginModalOpen} toggle={toggleLoginModal} />
  <SignupModal isOpen={isSignupModalOpen} toggle={toggleSignupModal} />
