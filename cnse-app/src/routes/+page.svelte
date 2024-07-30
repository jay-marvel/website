
<h1>Welcome to the Cloud Native Engineering Explorer</h1>
<p>This is our main page</p>
<p> Your goal is to flush out a nice landing page and replace this one</p>

<Row>
    <Col>
      <Button color="primary" outline>Hello World!</Button>
      <Fa icon={faBars} />
    </Col>
</Row>
<Accordion stayOpen>
  <AccordionItem header="About">Fallbrook</AccordionItem>
  <AccordionItem header="Why Contribute">
    Buena Vista Elementary
  </AccordionItem>
  <AccordionItem header="Featured Projects">UCSB Library</AccordionItem>
</Accordion>

<script lang="ts">
import { Accordion, AccordionItem } from '@sveltestrap/sveltestrap';
import { Button, Col, Row, Icon } from '@sveltestrap/sveltestrap';
import { Fa } from 'svelte-fa';
import { faBars } from '@fortawesome/free-solid-svg-icons';

//about
//why
//use accordion
</script>