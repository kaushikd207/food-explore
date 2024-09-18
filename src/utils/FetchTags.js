import axios from "axios";

/**
 * Fetches tags for a meal based on the provided meal ID.
 * @param {string} mealId - The ID of the meal to fetch tags for.
 * @returns {Promise<Array<{ tag: string }>>} - A promise that resolves to an array of tags.
 */
const FetchTags = async (mealId) => {
  try {
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    const meal = response.data.meals[0];

    const tags = [];

    const tagsString = meal.strTags;
    if (tagsString) {
      const tagsArray = tagsString
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");
      tagsArray.forEach((tag) => {
        tags.push({ tag });
      });
    }

    return tags;
  } catch (err) {
    throw new Error(err.message || "Unknown error");
  }
};

export default FetchTags;
