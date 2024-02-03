import Image from "next/image";

export interface ImageRowProps {
  imageUrls: string[];
}

function ImageRow(props: ImageRowProps) {
  return (
    <div className="flex h-full w-full flex-row justify-between p-1">
      {props.imageUrls.map((url, i) => (
        <Image
          key={i}
          className="h-full rounded-md"
          width={100}
          height={100}
          src={url}
          alt={"Generated Image"}
        />
      ))}
    </div>
  );
}

export default ImageRow;
