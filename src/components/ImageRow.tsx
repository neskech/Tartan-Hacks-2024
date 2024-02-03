import Image from "next/image";

export interface ImageRowProps {
  imageUrls: string[];
}

function ImageRow(props: ImageRowProps) {
  return (
    <div className="flex h-full w-full flex-row justify-center gap-6 p-1">
      {props.imageUrls.map((url, i) => (
        <Image
          key={i}
          className="h-full rounded-md"
          width={300}
          height={300}
          src={url}
          alt={"Generated Image"}
        />
      ))}
    </div>
  );
}

export default ImageRow;
