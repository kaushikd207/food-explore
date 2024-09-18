import React from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const Sidebar = ({ isOpen, closeSidebar, loading, details }) => {
  const splitIntoParagraphs = (text, sentencesPerParagraph) => {
    const sentences = text.split(". ").map((sentence) => sentence.trim());
    const paragraphs = [];
    let currentParagraph = [];

    for (let i = 0; i < sentences.length; i++) {
      currentParagraph.push(sentences[i]);
      if ((i + 1) % sentencesPerParagraph === 0 || i === sentences.length - 1) {
        paragraphs.push(
          currentParagraph.join(". ") + (i < sentences.length - 1 ? "." : "")
        );
        currentParagraph = [];
      }
    }

    return paragraphs;
  };

  return (
    <div
      className={`fixed right-0 top-0 h-full bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out overflow-auto z-20`}
      style={{ width: "30%" }}
    >
      <div className="p-4">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-40 bg-gray-200 rounded mb-4"></div>
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="mt-6">
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <p
                className="text-md font-bold text-neutral-600"
                style={{ fontFamily: "Manrope" }}
              >
                {details.strMeal}
              </p>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={closeSidebar}
              >
                <CloseOutlinedIcon />
              </button>
            </div>
            <hr className="my-2 border-t border-gray-300" />
            <img
              className="w-full h-full object-fit mt-4"
              src={details.strMealThumb}
              alt={details.strMeal}
            />

            <div
              className={`flex flex-wrap gap-2 ${
                details.strTags === null ? "" : "mt-4"
              }`}
            >
              {details.strTags?.map((tag, index) => {
                const hue = Math.floor(Math.random() * 360);
                const randomColor = `hsl(${hue}, 70%, 80%)`;
                const randomBorderColor = `hsl(${hue}, 70%, 40%)`;
                return (
                  <span
                    key={index}
                    className="py-1 px-2 rounded-full text-sm font-semibold text-gray-700"
                    style={{
                      backgroundColor: randomColor,
                      borderColor: randomBorderColor,
                      borderWidth: "2px",
                      borderStyle: "solid",
                    }}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>

            <div className="mt-2">
              <table className="text-left border-collapse table-auto w-full font-semibold">
                <tbody className="text-sm">
                  <tr>
                    <td className="pr-16 text-gray-400">Category</td>
                    <td className="p-1 text-gray-600">Seafood</td>
                  </tr>
                  <tr>
                    <td className="text-gray-400">Area</td>
                    <td className="p-1 text-gray-600">British</td>
                  </tr>
                  <tr>
                    <td className="break-all whitespace-normal text-gray-400">
                      YouTube
                    </td>
                    <td className="p-1 break-all text-gray-600">
                      <a
                        href="https://www.youtube.com/watch?v=xvPR2Tfw5k0"
                        className="text-black-500 underline"
                      >
                        https://www.youtube.com/watch?v=xvPR2Tfw5k0
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="break-all whitespace-normal text-gray-400">
                      Recipe
                    </td>
                    <td className="p-1 break-all text-gray-600">
                      <a
                        href="https://www.bbcgoodfood.com/recipes/7745/baked-salmon-with-fennel-and-tomatoes"
                        className="text-black-500 underline"
                      >
                        https://www.bbcgoodfood.com/recipes/7745/baked-salmon-with-fennel-and-tomatoes
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-2 p-2 border border-gray-300">
              <h3 className="text-sm font-bold text-gray-600">Instructions</h3>
              <div className="mt-2 text-sm text-gray-500 font-semibold font-sans space-y-2 text-justify">
                {splitIntoParagraphs(details.strInstructions, 3).map(
                  (paragraph, index) => (
                    <p key={index} className="break-all">
                      {paragraph}
                    </p>
                  )
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
