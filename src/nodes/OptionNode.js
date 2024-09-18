import { Handle } from "@xyflow/react";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";

export default function OptionNode({ data }) {
  return (
    <div className="flex items-center text-gray-800 border border-gray-300 rounded-full px-2 py-1 shadow-md h-6">
      <Handle
        type="target"
        position="left"
        style={{ background: "transparent", border: "0px" }}
      />

      <ReplyOutlinedIcon
        sx={{ color: "green", height: "16px", transform: "scaleX(-1)" }}
      />

      <span
        className="text-gray-600 pr-2"
        style={{ fontFamily: "Manrope", fontSize: "9px" }}
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
