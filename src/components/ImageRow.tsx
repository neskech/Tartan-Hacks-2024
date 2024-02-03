import Image from "next/image";

export interface ImageRowProps {
  imageUrls: string[];
}

function ImageRow(props: ImageRowProps) {
  return (
    <div className="flex flex-row">
      {props.imageUrls.map((url, i) => (
        <img
          src={url}
          alt="Generated image"
          key={i}
          className="mx-2 rounded-md"
        />
      ))}
    </div>
  );
}

export default ImageRow;
