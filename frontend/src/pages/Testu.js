import React from 'react';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBBtn } from 'mdb-react-ui-kit';
import {Card, Button} from "react-bootstrap"
export default function Testu() {
  return (
    <Card style={{ width: '18rem' }} color={"black"}>
    <Card.Img variant="top" src="https://i.ytimg.com/vi/wNYl4ZCZDAI/hqdefault.jpg" width={"100%"}/>
    <Card.Body>
      <Card.Title>Card Title</Card.Title>
      <Card.Text>
        Some quick example text to build on the card title and make up the bulk of
        the card's content.
      </Card.Text>
      <Button variant="primary">Go somewhere</Button>
    </Card.Body>
  </Card>
  );
}