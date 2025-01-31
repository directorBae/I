import { ClipLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <ClipLoader color="#ffffff" size={50} />
    </div>
  );
};

export default LoadingSpinner;
