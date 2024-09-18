import React from "react";

const Sidebar = ({ meal, onClose }) => {
  if (!meal) return null;

  return (
    <div className="w-1/4 h-screen bg-white p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{meal.strMeal}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>
      <img
        src={meal.strMealThumb}
        alt={meal.strMeal}
        className="w-full h-48 object-cover mb-4 rounded-md"
      />
      <div className="flex flex-wrap gap-2 mb-4">
        {meal.strTags &&
          meal.strTags.split(",").map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-500 text-white rounded-full text-sm"
            >
              {tag.trim()}
            </span>
          ))}
      </div>
      <div className="mb-4">
        <p>
          <strong>Category:</strong> {meal.strCategory}
        </p>
        <p>
          <strong>Area:</strong> {meal.strArea}
        </p>
        <p>
          <strong>YouTube:</strong>{" "}
          <a
            href={meal.strYoutube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {meal.strYoutube}
          </a>
        </p>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Instructions</h3>
        <p className="text-gray-700">
          {meal.strInstructions.slice(0, 200) + "..."}
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
