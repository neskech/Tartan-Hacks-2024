import React from "react";
import { Button, Card, CardBody } from "react-bootstrap";
import ImageRow from "./ImageRow";

type DisplayCardProps = {
  title: string;
  text: string;
  isSelected: boolean;
  isStreaming: boolean;
  onTextChange: (newText: string) => void;
  onGPTGenerate: () => void;
  onDelete: () => void;
};

export default function DisplayCard(props: DisplayCardProps) {
  return (
    <Card className="relative top-[0vh] rounded-md">
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <div className="flex flex-row items-center justify-center">
          <Button className="mr-auto" onClick={(_) => props.onDelete()}>
            Delete
          </Button>

          {props.text.length === 0 && (
            <Button className="mr-auto" disabled={props.isStreaming} onClick={(_) => props.onGPTGenerate()}>
              AI Fill
            </Button>
          )}
        </div>
        <Card.Text className="text-pretty" contentEditable={true}>{props.text}</Card.Text>
        <ImageRow imageUrls={["https://picsum.photos/200", "https://picsum.photos/200", "https://picsum.photos/200", "https://picsum.photos/200"]}></ImageRow>
      </Card.Body>
    </Card>
  );
}
