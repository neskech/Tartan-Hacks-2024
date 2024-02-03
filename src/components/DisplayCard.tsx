import React from "react";
import { Card, CardBody } from "react-bootstrap";
import ImageRow from "./ImageRow";

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
        <ImageRow imageUrls={["https://picsum.photos/200", "https://picsum.photos/200", "https://picsum.photos/200", "https://picsum.photos/200"]}></ImageRow>
      </Card.Body>
    </Card>
  );
}
