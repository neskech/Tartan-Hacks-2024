import CircularProgress from "@mui/material-next/CircularProgress";

export interface LoadingImageRowProps {
  numImages: number;
}

function LoadingImageRow(props: LoadingImageRowProps) {
  return (
    <div className="flex h-full w-full flex-row justify-center gap-6 p-1">
      {new Array(props.numImages).fill(0).map((i) => (
        <div
          key={i as number}
          className="flex flex-col justify-center items-center rounded-sm border-2 border-solid border-slate-200 bg-slate-100 p-2 w-[100px] h-[100px]"
        >
          <CircularProgress  color='primary' key={i as number} className="h-[50%] w-[50%]" />
        </div>
      ))}
    </div>
  );
}

export default LoadingImageRow;
