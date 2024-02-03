import React, { useEffect } from "react";
import { Button, Card, CardBody } from "react-bootstrap";
import ImageRow from "./ImageRow";
import LoadingImageRow from "./loadingImageRow";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";

type DisplayCardProps = {
  title: string;
  text: string;
  imageUrls: string[] | number;
  isSelected: boolean;
  isStreaming: boolean;
  onTextChange: (newText: string) => void;
  onGPTGenerate: () => void;
  onDelete: () => void;
};

export default function DisplayCard(props: DisplayCardProps) {
  useEffect(() => {
    props.onTextChange(props.text);
  }, [props.text]);

  return (
    <div className="border-1 relative top-[0vh] m-8 h-fit rounded-[2rem] bg-gray-50 shadow-sm">
      <div className="flex flex-row p-4">
        <div>
          <p className="text-wrap p-3">{props.text}</p>
          {typeof props.imageUrls == "number" ? (
            <LoadingImageRow numImages={props.imageUrls} />
          ) : (
            <ImageRow imageUrls={props.imageUrls} />
          )}
        </div>
        <div className="ml-auto flex flex-col border-l-2 pl-4">
          <Button
            className="my-4 ml-auto bg-red-700"
            onClick={(_) => props.onDelete()}
            color="danger"
          >
            <DeleteOutlineOutlinedIcon />
          </Button>
          <Button
            className="my-4 mr-auto"
            onClick={(_) => props.onGPTGenerate()}
          >
            <AddPhotoAlternateOutlinedIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
