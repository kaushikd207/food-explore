import React from "react";

const Sidebar = ({ meal, onClose }) => {
  if (!meal) return null;

  return (
    <div className="w-1/4 h-screen bg-white shadow-lg p-4 absolute right-0 top-0 ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{meal.strMeal}</h2>
        <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
          X
        </button>
      </div>
      <img
        src={meal.strMealThumb}
        alt={meal.strMeal}
        className="w-full h-40 object-cover mb-4 rounded-md shadow"
      />
      <div className="flex gap-2">
        {meal.strTags &&
          meal.strTags.split(",").map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-500 text-white rounded-lg text-sm"
            >
              {tag}
            </span>
          ))}
      </div>
      <div className="">
        <p>
          Categorie:- <span>{meal.strCategory || "NA"}</span>
        </p>
        <p>
          Area:- <span>{meal.strArea || "NA"}</span>
        </p>
        <p>
          Youtube:-
          <a className="underline" href={meal.strYoutube} target="_blank">
            {meal.strYoutube || "NA"}
          </a>
        </p>
        <p>
          Source:-
          <a className="underline" href={meal.strSource} target="_blank">
            {meal.strSource || "NA"}
          </a>
        </p>
      </div>
      <p className="text-gray-700 mb-4 border-[2px] border-gray-400 rounded-sm p-2">
        <strong>Instructions:</strong>{" "}
        {meal.strInstructions.slice(0, 400) + "..."}
      </p>
    </div>
  );
};

export default Sidebar;
