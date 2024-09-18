import axios from "axios";

/**
 * Fetches a list of meals based on the provided category.
 * @param {string} category - The category to filter meals by.
 * @returns {Promise<{ topMeals: Array<{ idMeal: string, strMeal: string }>, mealEdge: object }>} - An object containing the top meals and a meal edge.
 */
const FetchMeals = async (category) => {
  try {
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );
    const meals = response.data.meals;

    const filteredMeals = meals.length >= 5 ? meals.slice(0, 5) : meals;

    const mealEdge = {
      id: `me-1`,
      source: "option-1",
      target: "meal-" + filteredMeals[2].idMeal,
      type: "default",
      markerEnd: "url(#arrow)",
    };

    return {
      topMeals: filteredMeals,
      mealEdge,
    };
  } catch (err) {
    throw new Error(err.message || "Unknown error");
  }
};

export default FetchMeals;
