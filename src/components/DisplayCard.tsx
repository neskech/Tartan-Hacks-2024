import React from "react";
import { Button, Card, CardBody } from "react-bootstrap";
import ImageRow from "./ImageRow";
import LoadingImageRow from "./loadingImageRow";

type DisplayCardProps = {
  title: string;
  text: string;
  imageUrls: string[] | number;
  isSelected: boolean;
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
            <Button className="mr-auto" onClick={(_) => props.onGPTGenerate()}>
              AI Fill
            </Button>
          )}
        </div>
        <Card.Text className="text-pretty">{props.text}</Card.Text>
        { typeof props.imageUrls == 'number' ? 
          }
      </Card.Body>
    </Card>
  );
}

