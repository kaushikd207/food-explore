import React, { useState } from "react";
import Flow from "./components/Flow";
import Sidebar from "./components/Sidebar";
import { fetchCategories, fetchMealsByCategory, fetchMealDetails } from "./api";
import dagre from "dagre";
import { FaGlobe, FaShare } from "react-icons/fa";
import { MdOutlineNoMeals } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";

// Function to arrange nodes using dagre layout with horizontal alignment
const layoutNodes = (nodes, edges) => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "LR", align: "UL", nodesep: 100 });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((node) => {
    g.setNode(node.id, { width: 172, height: 36 });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  return nodes?.map((node) => {
    const nodeWithPosition = g.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x,
        y: nodeWithPosition.y,
      },
    };
  });
};

// Helper function to create nodes with consistent styling and icons
const createNode = (id, label, Icon, additionalStyle = {}) => ({
  id,
  data: {
    label: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Icon style={{ marginRight: "8px" }} />
        {label}
      </div>
    ),
  },
  position: { x: 0, y: 0 },
  style: {
    background: "white",
    borderRadius: "5px",
    fontWeight: "bold",
    ...additionalStyle,
  },
});

// Helper function to create edges with consistent styling
const createEdge = (source, target, stroke = "#00aaff") => ({
  id: `edge-${source}-${target}`,
  source,
  target,
  animated: true,
  style: { stroke },
});

const App = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null); // Meal data for the Sidebar

  const handleNodeClick = async (event, node) => {
    const nodeId = node.id;

    // When clicking the 'Explore' button to fetch categories
    if (nodeId === "start") {
      const categories = await fetchCategories();
      const categoryNodes = categories?.map((cat) =>
        createNode(cat.strCategory, cat.strCategory, BiCategoryAlt)
      );
      const newEdges = categoryNodes?.map((categoryNode) =>
        createEdge(nodeId, categoryNode.id)
      );

      setNodes((prevNodes) =>
        layoutNodes([...prevNodes, ...categoryNodes], [...edges, ...newEdges])
      );
      setEdges((prevEdges) => [...prevEdges, ...newEdges]);

      // When clicking a category node to fetch meals
    } else if (
      !nodeId.startsWith("meal-") &&
      !nodeId.startsWith("view-") &&
      isNaN(nodeId)
    ) {
      const meals = await fetchMealsByCategory(nodeId);
      const mealNodes = meals?.map((meal) =>
        createNode(`meal-${meal.idMeal}`, meal.strMeal, MdOutlineNoMeals)
      );
      const newEdges = mealNodes?.map((mealNode) =>
        createEdge(nodeId, mealNode.id, "#ff5722")
      );

      setNodes((prevNodes) =>
        layoutNodes([...prevNodes, ...mealNodes], [...edges, ...newEdges])
      );
      setEdges((prevEdges) => [...prevEdges, ...newEdges]);

      // When clicking a meal node to show "View" options
    } else if (nodeId.startsWith("meal-")) {
      const viewNodes = [
        createNode(`view-ingredients-${nodeId}`, "View Ingredients", FaShare),
        createNode(`view-tags-${nodeId}`, "View Tags", FaShare),
        createNode(`view-details-${nodeId}`, "View Details", FaShare),
      ];

      const viewEdges = viewNodes.map((viewNode) =>
        createEdge(nodeId, viewNode.id, "#4caf50")
      );

      setNodes((prevNodes) =>
        layoutNodes([...prevNodes, ...viewNodes], [...edges, ...viewEdges])
      );
      setEdges((prevEdges) => [...prevEdges, ...viewEdges]);

      // When clicking a "View Details" node to fetch meal details
    } else if (nodeId.startsWith("view-")) {
      const mealId = nodeId.split("-")[3];
      if (nodeId.includes("details")) {
        const meal = await fetchMealDetails(mealId);
        setSelectedMeal(meal);
      }
    } else {
      console.log("Node clicked:", nodeId);
    }
  };

  return (
    <div>
      <div className="h-10 border-b-2 border-gray-300">
        <p className="mt-1 ml-2">Food Explorer</p>
      </div>
      <div className="relative flex">
        <Flow nodes={nodes} edges={edges} onNodeClick={handleNodeClick} />
        <Sidebar meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
        <div className="absolute top-4 left-4">
          <button
            onClick={() => handleNodeClick(null, { id: "start" })}
            className="flex items-center px-4 py-2 text-black rounded-lg shadow-md transition"
          >
            <FaGlobe className="mr-2" />
            Explore
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
