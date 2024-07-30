<script lang="ts">
  import { Alert, Button, Form, FormGroup, Label, Input } from '@sveltestrap/sveltestrap';
  import api from '$lib/axios'; // Import Axios instance

  let envProfile = {
    name: '',
    keywords: '',
    description: '',
    contributors: '',
    exploit_directions: '',
    install_instructions: '',
    link: ''
  };

  let errors = {
    name: '',
    keywords: '',
    description: '',
    contributors: '',
    exploit_directions: '',
    install_instructions: '',
    link: ''
  };

  let duplicateName = false;

  const validateInput = () => {
    let isOK = true;
    errors = {
      name: '',
      keywords: '',
      description: '',
      contributors: '',
      exploit_directions: '',
      install_instructions: '',
      link: ''
    };

    if (!envProfile.name) {
      isOK = false;
      errors.name = 'Name is required';
    }
    if (!envProfile.keywords) {
      isOK = false;
      errors.keywords = 'Keywords are required';
    }
    if (!envProfile.description) {
      isOK = false;
      errors.description = 'Description is required';
    }
    if (!envProfile.contributors) {
      isOK = false;
      errors.contributors = 'Contributors are required';
    }
    if (!envProfile.exploit_directions) {
      isOK = false;
      errors.exploit_directions = 'Exploit instructions are required';
    }
    if (!envProfile.install_instructions) {
      isOK = false;
      errors.install_instructions = 'Install instructions are required';
    }
    if (!envProfile.link) {
      isOK = false;
      errors.link = 'Link is required';
    }

    return isOK;
  };
  const seeInfo = () => {
    console.log(envProfile)
    console.log(duplicateName)
  }
    async function handleCreate() {
    let API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

    if (!validateInput()) {
      return;
    }

    try {
      const response = await api.post('/enviroment/create', {
          name: envProfile.name,
          keywords: envProfile.keywords.split(',').map(keyword => keyword.trim()) ,
          description: envProfile.description,
          contributors: envProfile.contributors,
          exploit_directions: envProfile.exploit_directions,
          install_instructions: envProfile.install_instructions,
          link: envProfile.link
        });
      if (response.status == 200) {
        console.log('Environment created successfully:', response.data);
        duplicateName = false;
        // Reset form after successful creation
        envProfile = {
          name: '',
          keywords: '',
          description: '',
          contributors: '',
          exploit_directions: '',
          install_instructions: '',
          link: ''
        };
      } 
    } catch (error) {
      console.error('Creation error:', error);
      if (error.response.data.message === 'Environment name already exists') {
        duplicateName = true;
      }
    }
  }
</script>

<Form>
  <FormGroup>
    <Label for="name">Environment Name</Label>
    <Input 
      type="text" 
      id="name" 
      value={envProfile.name}
      on:input={(e) => envProfile.name = e.target.value}
      invalid={!!errors.name}
    />
    {#if errors.name}
      <Alert color="danger">{errors.name}</Alert>
    {/if}
  </FormGroup>
  <FormGroup>
    <Label for="contributors">Contributors</Label>
    <Input 
      type="text" 
      id="contributors" 
      value={envProfile.contributors}
      on:input={(e) => envProfile.contributors = e.target.value}
      invalid={!!errors.contributors}
    />
    {#if errors.contributors}
      <Alert color="danger">{errors.contributors}</Alert>
    {/if}
  </FormGroup>
  <FormGroup>
    <Label for="keywords">Keywords</Label>
    <Input 
      type="text" 
      id="keywords" 
      value={envProfile.keywords}
      on:input={(e) => envProfile.keywords = e.target.value}
      invalid={!!errors.keywords}
    />
    {#if errors.keywords}
      <Alert color="danger">{errors.keywords}</Alert>
    {/if}
  </FormGroup>
  <FormGroup>
    <Label for="description">Description</Label>
    <Input 
      type="text" 
      id="description" 
      value={envProfile.description}
      on:input={(e) => envProfile.description = e.target.value}
      invalid={!!errors.description}
    />
    {#if errors.description}
      <Alert color="danger">{errors.description}</Alert>
    {/if}
  </FormGroup>
  
  <FormGroup>
    <Label for="exploit_directions">Exploit Instructions</Label>
    <Input 
      type="text" 
      id="exploit_directions" 
      value={envProfile.exploit_directions}
      on:input={(e) => envProfile.exploit_directions = e.target.value}
      invalid={!!errors.exploit_directions}
    />
    {#if errors.exploit_directions}
      <Alert color="danger">{errors.exploit_directions}</Alert>
    {/if}
  </FormGroup>
  <FormGroup>
    <Label for="install_instructions">Install Instructions</Label>
    <Input 
      type="text" 
      id="install_instructions" 
      value={envProfile.install_instructions}
      on:input={(e) => envProfile.install_instructions = e.target.value}
      invalid={!!errors.install_instructions}
    />
    {#if errors.install_instructions}
      <Alert color="danger">{errors.install_instructions}</Alert>
    {/if}
  </FormGroup>
  <FormGroup>
    <Label for="link">Link</Label>
    <Input 
      type="text" 
      id="link" 
      value={envProfile.link}
      on:input={(e) => envProfile.link = e.target.value}
      invalid={!!errors.link}
    />
    {#if errors.link}
      <Alert color="danger">{errors.link}</Alert>
    {/if}
  </FormGroup>
  {#if duplicateName}
    <Alert color="danger">Environment name already exists</Alert>
  {/if}
  <Button color="primary" type="submit" on:click={handleCreate}>Create Environment</Button>
  <Button color="primary" type="submit" on:click={seeInfo}>See info</Button>
</Form>