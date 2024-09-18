import axios from "axios";

const FetchCategories = async () => {
  try {
    const response = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    const categories = response.data.categories;

    const filteredCategories = categories.slice(0, 5);

    const categoryEdges = filteredCategories.map((category) => ({
      id: "e1-" + category.idCategory,
      source: "1",
      target: "category-" + category.idCategory,
      type: "default",
      markerEnd: "url(#arrow)",
    }));

    return {
      topCategories: filteredCategories,
      categoryEdges,
    };
  } catch (err) {
    throw new Error(err.response ? err.response.data : "Unknown error");
  }
};

export default FetchCategories;
