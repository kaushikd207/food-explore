import { Handle } from "@xyflow/react";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import AlbumOutlinedIcon from "@mui/icons-material/AlbumOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";

export default function EntityNode({ data }) {
  return (
    <div
      className={`flex items-center text-gray-800 border border-gray-300 rounded px-2 py-4 shadow-md ${
        data.type === "meal"
          ? "h-16 w-56"
          : data.type === "ingredient"
          ? "h-12 w-36"
          : "h-10 w-36"
      }`}
    >
      <Handle
        type="target"
        position="left"
        style={{ background: "transparent", border: "0px" }}
      />

      <div
        className={`flex justify-center items-center ${
          data.type === "meal"
            ? "bg-cyan-600"
            : data.type === "ingredient"
            ? "bg-purple-600"
            : data.type === "tags"
            ? "bg-yellow-600"
            : "bg-rose-600"
        } rounded-md w-6 h-6 mr-2`}
      >
        {data.type === "meal" ? (
          <AlbumOutlinedIcon sx={{ color: "white", height: "16px" }} />
        ) : data.type === "ingredient" ? (
          <ArticleOutlinedIcon sx={{ color: "white", height: "16px" }} />
        ) : data.type === "tags" ? (
          <LocalOfferOutlinedIcon sx={{ color: "white", height: "16px" }} />
        ) : (
          <RestaurantIcon sx={{ color: "white", height: "16px" }} />
        )}
      </div>

      <span
        className="font-bold text-sm text-gray-600 capitalize"
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
