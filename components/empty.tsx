import { File } from "lucide-react";

function Empty() {
  return (
    <div className={`flex flex-col grow w-full justify-center items-center`}>
      <File className="w-20 h-20" />
      <p className="mt-2">No Data</p>
    </div>
  );
}

export default Empty;
