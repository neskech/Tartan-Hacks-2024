import React from "react";
import { Card, CardBody } from "react-bootstrap";

export default function DisplayCard() {
  return (
    <Card className="">
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
