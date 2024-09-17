import React, { useState } from "react";
import Flow from "./components/Flow";
import Sidebar from "./components/Sidebar";
import { fetchCategories, fetchMealsByCategory, fetchMealDetails } from "./api";
import dagre from "dagre";

// Function to arrange nodes using dagre layout with horizontal alignment
const layoutNodes = (nodes, edges) => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "LR", align: "UL", nodesep: 100 }); // Left-to-right (LR) layout with 100px node separation
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((node) => {
    g.setNode(node.id, { width: 172, height: 36 }); // Set node width and height
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  return nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x, // Adjusts x-coordinates for horizontal alignment
        y: nodeWithPosition.y, // Sets y-coordinates
      },
    };
  });
};

const App = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const handleNodeClick = async (event, node) => {
    const nodeId = node.id;
    if (nodeId === "start") {
      const categories = await fetchCategories();
      const categoryNodes = categories.map((cat) => ({
        id: cat.strCategory,
        data: { label: cat.strCategory },
        position: { x: 0, y: 0 }, // Initial position, dagre will adjust it
        style: {
          background: "#00aaff",
          color: "#fff",
          borderRadius: "5px",
        },
      }));
      const newEdges = categoryNodes.map((node) => ({
        id: `edge-${nodeId}-${node.id}`,
        source: nodeId,
        target: node.id,
        animated: true,
        style: { stroke: "#00aaff" },
      }));
      setNodes((prevNodes) =>
        layoutNodes([...prevNodes, ...categoryNodes], [...edges, ...newEdges])
      );
      setEdges((prevEdges) => [...prevEdges, ...newEdges]);
    } else if (nodeId && !nodeId.startsWith("meal-") && !Number(nodeId)) {
      console.log("nodeId && !meal");
      const meals = await fetchMealsByCategory(nodeId);
      const mealNodes = meals.map((meal) => ({
        id: meal.idMeal,
        data: { label: meal.strMeal },
        position: { x: 0, y: 0 }, // Initial position, dagre will adjust it
        style: { background: "#ff5722", color: "#fff", borderRadius: "5px" },
      }));
      const newEdges = mealNodes.map((node) => ({
        id: `edge-${nodeId}-${node.id}`,
        source: nodeId,
        target: node.id,
        animated: true,
        style: { stroke: "#ff5722" },
      }));
      setNodes((prevNodes) =>
        layoutNodes([...prevNodes, ...mealNodes], [...edges, ...newEdges])
      );
      setEdges((prevEdges) => [...prevEdges, ...newEdges]);
    } else {
      handleMealClick(nodeId);
      console.log("invoking functionn");
    }
  };

  const handleMealClick = async (mealId) => {
    const meal = await fetchMealDetails(mealId);
    setSelectedMeal(meal);
  };

  return (
    <div className="relative flex">
      <Flow nodes={nodes} edges={edges} onNodeClick={handleNodeClick} />
      <Sidebar meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
      <div className="absolute top-4 left-4">
        <button
          onClick={() => handleNodeClick(null, { id: "start" })}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Explore
        </button>
      </div>
    </div>
  );
};

export default App;
