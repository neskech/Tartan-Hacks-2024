import React from "react";
import { Card, CardBody } from "react-bootstrap";

type DisplayCardProps = {
  title: string;
  text: string;
};

export default function DisplayCard({ title, text }: DisplayCardProps) {
  return (
    <Card className="m-4">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{text}</Card.Text>
      </Card.Body>
    </Card>
  );
}
