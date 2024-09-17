import React from "react";

const Sidebar = ({ meal, onClose }) => {
  if (!meal) return null;
  console.log(meal);
  return (
    <div className="fixed right-0 top-0 w-1/3 h-full bg-white shadow-lg p-6 border-l border-gray-200 overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 px-3 py-1 bg-gray-300 rounded-lg text-gray-700 hover:bg-gray-400 transition"
      >
        Close
      </button>
      <h2 className="text-2xl font-bold mb-4">{meal.strMeal}</h2>
      <img
        src={`${meal.strMealThumb}/preview`}
        alt={meal.strMeal}
        className="w-full rounded-lg shadow-md"
      />
      <h6>Category: {meal?.strCategory}</h6>
      <h6>Area: {meal?.strArea}</h6>
      <h6>
        Youtube:
        <a href={meal?.strYoutube} target="_blank">
          {meal?.strYoutube}
        </a>
      </h6>
      <h6>
        Recipe:
        <a href={meal?.strSorce} target="_blank">
          {meal?.strSource}
        </a>
      </h6>
      <p className="text-gray-700 mb-4">{meal.strInstructions}</p>
    </div>
  );
};

export default Sidebar;
