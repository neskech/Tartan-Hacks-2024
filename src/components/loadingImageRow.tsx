import CircularProgress from "@mui/material-next/CircularProgress";

export interface LoadingImageRowProps {
  numImages: number;
}

function LoadingImageRow(props: LoadingImageRowProps) {
  return (
    <div className="flex h-full w-full flex-row justify-center gap-6 p-1">
      {new Array(props.numImages).fill(0).map((_, i) => (
        <div
          key={i}
          className="flex flex-col justify-center items-center rounded-sm border-1 border-solid border-slate-100 bg-slate-100 p-2 w-[300px] h-[300px]"
        >
          <CircularProgress  color='primary' key={i} className="h-[50%] w-[50%] opacity-60" />
        </div>
      ))}
    </div>
  );
}

export default LoadingImageRow;
