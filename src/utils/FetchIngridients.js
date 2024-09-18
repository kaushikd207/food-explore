import axios from "axios";

const FetchIngredients = async (mealId) => {
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

    return ingredients.length >= 5 ? ingredients.slice(0, 5) : ingredients;
  } catch (err) {
    throw new Error(err.response ? err.response.data : "Unknown error");
  }
};

export default FetchIngredients;
