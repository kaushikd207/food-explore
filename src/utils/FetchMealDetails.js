import axios from "axios";

/**
 * Fetches details of a meal by its ID.
 * @param {string} mealId - The ID of the meal to fetch.
 * @returns {Promise<{ idMeal: string, strMeal: string, strCategory: string, strArea: string, strInstructions: string, strMealThumb: string, strTags: string[] | null, strYoutube: string, ingredients: Array<{ name: string, measure: string }>, source: string | null }>} - An object containing the meal details.
 */
const FetchMealDetails = async (mealId) => {
  try {
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    const meal = response.data.meals[0];

    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
      const ingredientName = meal[`strIngredient${i}`];
      const ingredientMeasure = meal[`strMeasure${i}`];

      if (ingredientName && ingredientName.trim() !== "") {
        ingredients.push({
          name: ingredientName,
          measure: ingredientMeasure ? ingredientMeasure.trim() : "",
        });
      }
    }

    const tags = meal.strTags ? meal.strTags.split(",") : null;

    return {
      idMeal: meal.idMeal,
      strMeal: meal.strMeal,
      strCategory: meal.strCategory,
      strArea: meal.strArea,
      strInstructions: meal.strInstructions,
      strMealThumb: meal.strMealThumb,
      strTags: tags,
      strYoutube: meal.strYoutube,
      ingredients,
      source: meal.strSource,
    };
  } catch (err) {
    throw new Error(err.message || "Unknown error");
  }
};

export default FetchMealDetails;
