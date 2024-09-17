import axios from "axios";

const API_BASE = "https://www.themealdb.com/api/json/v1/1";

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE}/categories.php`);
    return response.data.categories ? response.data.categories.slice(0, 5) : [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const fetchMealsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_BASE}/filter.php?c=${category}`);
    console.log("MealBycategories", response); // Debugging line to check API response
    return response.data.meals ? response.data.meals.slice(0, 5) : [];
  } catch (error) {
    console.error("Error fetching meals by category:", error);
    return [];
  }
};

export const fetchMealDetails = async (mealId) => {
  try {
    const response = await axios.get(`${API_BASE}/lookup.php?i=${mealId}`);
    console.log("mealDetails", response);
    return response.data.meals ? response.data.meals[0] : null;
  } catch (error) {
    console.error("Error fetching meal details:", error);
    return null;
  }
};
