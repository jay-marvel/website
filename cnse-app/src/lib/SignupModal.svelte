<script lang="ts">
  import { Modal, Alert, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from '@sveltestrap/sveltestrap';
  import api from '$lib/axios'; // Import Axios instance
  import { setToken } from '$stores/auth'; // Import the store

  export let isOpen: boolean;
  export let toggle: () => void;
  let loginFailed = false;
  let duplicateEmail = false;

  let accountProfile = {
    firstName : '',
    lastName: '',
    email: '',
    institution: '',
    password: '',
    passwordVerify: ''
  };

  let errors = {
    firstName: '',
    lastName: '',
    email: '',
    institution: '',
    password: '',
    passwordVerify: ''
  };

  
  let email: string = '';
  let password: string = '';
  let emailError = '';
    

  $: disabled = !(email && password && emailError === '');

  const verifyInput = ()=>{
    let isOK = true;
        
        // errors = {
        //     firstName: '',
        //     lastName: '',
        //     email: '',
        //     institution: '',
        //     password: '',
        //     passwordVerify: ''
        // };

        // Basic validation
    if (!accountProfile.firstName) {
      isOK = false;
      errors.firstName = "firstname"
    }
    if (!accountProfile.lastName) {
      isOK = false;
      errors.lastName = 'lastName';
    }
    if (!accountProfile.email) {
      isOK = false;
      errors.email = 'email'
    }
    if (!accountProfile.institution) {
      isOK = false;
      errors.institution = "institution"
    }
    if (!accountProfile.password){
      isOK = false;
      errors.password = "issue with password"
    }
    if (accountProfile.passwordVerify !=accountProfile.password) {
      isOK = false;
      errors.passwordVerify = "passwords don't match"
    }

    console.log('isok', isOK);
    console.log(errors)
    return isOK;
        
  }
    const validateEmail1=  (email: string) => {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      emailError = emailPattern.test(email) ? '' : 'Invalid email address';
    }
    function validateInput(){
        let isOK = true;

        // Basic validation
        if (!accountProfile.firstName) {
            errors.firstName = 'First Name is required';
            isOK = false;
        }
        if (!accountProfile.lastName) {
            errors.lastName = 'Last Name is required';
            isOK = false;
        }
        if (!accountProfile.email) {
            errors.email = 'Email is required';
            isOK = false;
        } 
        if (!accountProfile.institution) {
            errors.institution = 'Institution is required';
            isOK = false;
        }
        if (!accountProfile.password) {
            errors.password = 'Password is required';
            isOK = false;
        }
        if (accountProfile.password !== accountProfile.passwordVerify) {
            errors.passwordVerify = 'Passwords do not match';
            isOK = false;
        }

        return isOK;
    }
    
$: isFirstNameValid = !!accountProfile.firstName;
$: isLastNameValid = !!accountProfile.lastName;
$: isPasswordValid = !!accountProfile.password;
$: arePasswordsMatching = accountProfile.password === accountProfile.passwordVerify;
$: isInstitutionValid = !!accountProfile.institution;
$: isEmailValid = !!accountProfile.email && emailError === "";

$: isOk = isFirstNameValid && isLastNameValid && isPasswordValid && arePasswordsMatching && isInstitutionValid && isEmailValid;

    function validateEmail() {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      emailError = emailPattern.test(accountProfile.email) ? '' : 'Invalid email address';
    }
    function passwordMatch(){
      if (accountProfile.password != accountProfile.passwordVerify){
        errors.passwordVerify = "Passwords don't match"
      } else{
        errors.passwordVerify = ""
      }
    }
    function logStuff(){
      console.log(accountProfile)
    }
    async function handleSignup() {
      // Implement login logic here
      let API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

      // console.log('Username:', email);
      // console.log('Password:', password);
      // console.log('API Server:',API_SERVER_URL);

      try {
        const response = await api.post('/account/create', { 
          //to be edited
          'email':accountProfile.email, 
          'password':accountProfile.password ,
          'firstName': accountProfile.firstName,
          'lastName': accountProfile.lastName,
          'institution': accountProfile.institution
        });
        if (response.status == 200) {
          const { token } = response.data; 
        
          console.log('token:', token)
          setToken(token); // Store the JWT token in the Svelte store
          toggle();
          loginFailed = false;
          duplicateEmail = false;
        }   
        
      } catch (error) {
        console.error('Signup error:', error);
        if (error.response.data.message === 'Email already exists') {
        duplicateEmail = true;
      } else {
        loginFailed = true
        
      }
    }
  }
  
</script>
  
  <Modal isOpen={isOpen} toggle={toggle} backdrop="static" aria-labelledby="login-modal-title">
    <ModalHeader toggle={toggle}>Signup</ModalHeader>
    <Form>
      <ModalBody>
        <FormGroup>
            <Label for="firstName">First Name</Label>
            <Input 
                type="text" 
                id="firstName" 
                value={accountProfile.firstName}
                on:input={(e) => accountProfile.firstName = e.target.value}
                invalid={!!errors.firstName}
            />
            {#if errors.firstName}
                <Alert color="danger">{errors.firstName}</Alert>
            {/if}
        </FormGroup>
        <FormGroup>
            <Label for="lastName">Last Name</Label>
            <Input 
                type="text" 
                id="lastName" 
                value={accountProfile.lastName}
                on:input={(e) => accountProfile.lastName = e.target.value}
                invalid={!!errors.lastName}
            />
            {#if errors.firstName}
                <Alert color="danger">{errors.lastName}</Alert>
            {/if}
        </FormGroup>
        <FormGroup>
            <Label for="institution">Institution</Label>
            <Input 
                type="text" 
                id="institution" 
                value={accountProfile.institution}
                on:input={(e) => accountProfile.institution = e.target.value}
                invalid={!!errors.institution}
            />
            {#if errors.firstName}
                <Alert color="danger">{errors.institution}</Alert>
            {/if}
        </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input type="email" id="email" bind:value={accountProfile.email} on:blur={validateEmail} />
            {#if emailError}
              <p style="color: red;">{emailError}</p>
            {/if}
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input 
                type="password" 
                id="password" 
                value={accountProfile.password}
                on:input={(e) => accountProfile.password = e.target.value}
                invalid={!!errors.password}
            />
            {#if errors.password}
                <Alert color="danger">{errors.password}</Alert>
            {/if}
        </FormGroup>

        <FormGroup>
            <Label for="passwordVerify">Verify Password</Label>
            <Input 
                type="password" 
                id="passwordVerify" 
                value={accountProfile.passwordVerify}
                on:input={(e) => accountProfile.passwordVerify = e.target.value}
                on:blur={passwordMatch}
                invalid={!!errors.passwordVerify}
            />
            {#if errors.passwordVerify}
                <Alert color="danger">{errors.passwordVerify}</Alert>
            {/if}
        </FormGroup>
        
          {#if loginFailed && !duplicateEmail}
            <p style="color: red;">Sign up failed. Please check your credentials.</p>
          {/if}
          {#if duplicateEmail}
            <p style="color: red;">Email is already in use.</p>
          {/if}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" type="submit" on:click={handleSignup}
        disabled={!isOk}>Create</Button>
        <Button color="primary" type="submit" on:click={logStuff}>See info</Button>
        <Button color="secondary" on:click={toggle}>Cancel</Button>
      </ModalFooter>
    </Form>
  </Modal>
  