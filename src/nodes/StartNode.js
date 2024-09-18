import { Handle } from "@xyflow/react";
import LanguageIcon from "@mui/icons-material/Language";

export default function StartNode({ data }) {
  return (
    <div className="flex items-center bg-gray-100 text-gray-800 border border-gray-300 rounded px-2 py-1 shadow-md h-10 mx-3">
      <div className="flex justify-center items-center bg-gray-600 rounded-md w-6 h-6 mr-2">
        <LanguageIcon sx={{ color: "white", height: "16px" }} />
      </div>

      <span
        className="font-bold text-sm text-gray-600"
        style={{ fontFamily: "Manrope" }}
      >
        {data.label}
      </span>

      <Handle
        type="source"
        position="right"
        style={{ background: "transparent", border: "0px" }}
      />
    </div>
  );
}
