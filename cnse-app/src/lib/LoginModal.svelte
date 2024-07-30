<script lang="ts">
    import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from '@sveltestrap/sveltestrap';
    import api from '$lib/axios'; // Import Axios instance
    import { setToken } from '$stores/auth'; // Import the store

    export let isOpen: boolean;
    export let toggle: () => void;
    let loginFailed = false;
  
    let email: string = '';
    let password: string = '';
    let emailError = '';

    $: disabled = !(email && password && emailError === '');

    function validateEmail() {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      emailError = emailPattern.test(email) ? '' : 'Invalid email address';
    }
  
    async function handleLogin() {
      // Implement login logic here
      let API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

      console.log('Username:', email);
      console.log('Password:', password)
      console.log('API Server:',API_SERVER_URL);

      try {
        const response = await api.post('/account/login', { 
          'email':email, 
          'password':password 
        });
        if (response.status == 200) {
          const { token } = response.data; 
        
          console.log('token:', token)
          setToken(token); // Store the JWT token in the Svelte store
          toggle();
          loginFailed = false;
        }   
      } catch (error) {
        console.error('Login error:', error);
        loginFailed = true;
      }
    }
  
  </script>
  
  <Modal isOpen={isOpen} toggle={toggle} backdrop="static" aria-labelledby="login-modal-title">
    <ModalHeader toggle={toggle}>Login</ModalHeader>
    <Form>
      <ModalBody>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input type="email" id="email" bind:value={email} on:blur={validateEmail} />
            {#if emailError}
              <p style="color: red;">{emailError}</p>
            {/if}
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" id="password" bind:value={password} />
          </FormGroup>
        
          {#if loginFailed}
            <p style="color: red;">Login failed. Please check your credentials.</p>
          {/if}
    
      </ModalBody>
      <ModalFooter>
        <Button color="primary" type="submit" on:click={handleLogin}
        disabled={!email || !password || emailError!=''}>Login</Button>
        <Button color="secondary" on:click={toggle}>Cancel</Button>
      </ModalFooter>
    </Form>
  </Modal>
  