import React from "react";
import { Card, CardBody } from "react-bootstrap";

type DisplayCardProps = {
  title: string;
  text: string;
};

export default function DisplayCard({ title, text }: DisplayCardProps) {
  return (
    <Card className="border-10 relative top-[0vh] rounded-md">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text className="text-pretty">{text}</Card.Text>
      </Card.Body>
    </Card>
  );
}
