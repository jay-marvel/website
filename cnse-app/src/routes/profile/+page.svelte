<script lang="ts">
  import { page } from '$app/stores';
  import api from '$lib/axios';
  //import { onLoad } from 'svelte';
  import { goto } from '$app/navigation'; // SvelteKit's navigation helper
  import { clearToken, token } from '$stores/auth'; // Your token store
  import { ValidateLogin } from '$lib/auth-helper';

  import {Card, CardBody, CardTitle, CardText, Container} from '@sveltestrap/sveltestrap';

  let isLoggedInOk = false;
  let profileDataError = false;
  let profileObj = {
    isPopulated: false,
    firstName: '',
    lastName: '',
    email: '',
    institution: ''
  }

  //run this each time the page is loaded to make sure token is OK
  $: if ($page.url.pathname === '/profile') {
    console.log('profile on-mount:', $token);
    if (!$token) {
      if (typeof window !== 'undefined'){
        goto('/'); // Redirect to login page if not authenticated
      }
    }
    (async()=>{
      isLoggedInOk = await ValidateLogin();
      if (!isLoggedInOk) {
        clearToken();
      } else {
        await loadProfileData()
      };
    })();
  }

  async function loadProfileData() {
    try{
      const response = await api.get('/account/profile');
      if (response.status === 200) {
        let data = response.data.status.user

        profileObj.firstName = data.firstName;
        profileObj.lastName = data.lastName;
        profileObj.email = data.email;
        profileObj.institution = data.institution;
        profileObj.isPopulated = true;

        console.log(profileObj)
      }
      
    }catch (err){
      profileDataError = true;
    }
  }
</script>
  
  <style>
    /* Any styles specific to the about page */
  </style>
  
    {#if isLoggedInOk}

      {#if profileObj.isPopulated}
        <Container class = "my-5">
          <Card>
              <CardBody>
                  <CardTitle>{profileObj.firstName} {profileObj.lastName}</CardTitle>
                  <CardText>Email: {profileObj.email}</CardText>
                  <CardText>Institution: {profileObj.institution}</CardText>
              </CardBody>
          </Card>
        </Container>
      {:else}
          <p>Loading...</p>
      {/if}
    {:else}
      <h4>Your login session expired, please login again!</h4>
    {/if}