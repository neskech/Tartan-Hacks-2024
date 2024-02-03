import Image from "next/image";

export interface ImageRowProps {
  imageUrls: string[];
}

function ImageRow(props: ImageRowProps) {
  return (
    <div className="flex flex-row justify-between h-full w-full p-1">
      {props.imageUrls.map((url, i) => (
        <ImageElement url={url} key={i} />
      ))}
    </div>
  );
}

interface ImageProps {
  url: string;
}
function ImageElement(props: ImageProps) {
  return (
    <Image className="rounded-md h-full" width={100} height={100} src={props.url} alt={"Generated Image"} />
  );
}

export default ImageRow;
