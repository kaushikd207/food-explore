import React, { useState } from "react";
import Flow from "./components/Flow";
import Sidebar from "./components/Sidebar";
import { fetchCategories, fetchMealsByCategory, fetchMealDetails } from "./api";
import dagre from "dagre";
import { FaGlobe } from "react-icons/fa";
import { MdOutlineNoMeals } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";
import { FaShare } from "react-icons/fa";

// Function to arrange nodes using dagre layout
const layoutNodes = (nodes, edges) => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "LR", align: "UL", nodesep: 100, edgesep: 50 });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((node) => {
    g.setNode(node.id, { width: 172, height: 36 });
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
        x: nodeWithPosition.x,
        y: nodeWithPosition.y,
      },
    };
  });
};

// Function to arrange nodes using vertical layout
const layoutVerticalNodes = (nodes, edges) => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "TB", align: "UL", nodesep: 100, edgesep: 50 }); // Vertical layout for categories
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((node) => {
    g.setNode(node.id, { width: 172, height: 36 });
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
        x: nodeWithPosition.x,
        y: nodeWithPosition.y,
      },
    };
  });
};

const createNode = (id, label, IconComponent, backgroundColor) => ({
  id,
  data: {
    label: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <IconComponent style={{ marginRight: "8px" }} />
        {label}
      </div>
    ),
  },
  position: { x: 0, y: 0 },
  style: {
    background: backgroundColor,
    borderRadius: "5px",
    fontWeight: "bold",
  },
});

// Function to create edges between nodes
const createEdge = (source, target, color = "#00aaff") => ({
  id: `edge-${source}-${target}`,
  source,
  target,
  animated: true,
  style: { stroke: color },
});

const App = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const handleNodeClick = async (event, node) => {
    const nodeId = node.id;

    if (nodeId === "start") {
      const categories = await fetchCategories();

      const categoryNodes = categories?.map((cat) =>
        createNode(cat.strCategory, cat.strCategory, BiCategoryAlt, "#e0f7fa")
      );

      //  vertical edges between categories
      const categoryEdges = [];
      for (let i = 0; i < categoryNodes.length - 1; i++) {
        categoryEdges.push(
          createEdge(categoryNodes[i].id, categoryNodes[i + 1].id, "#00aaff")
        );
      }

      setNodes((prevNodes) =>
        layoutVerticalNodes(
          [...prevNodes, ...categoryNodes],
          [...edges, ...categoryEdges]
        )
      );
      setEdges((prevEdges) => [...prevEdges, ...categoryEdges]);
    } else if (
      !nodeId.startsWith("meal-") &&
      !nodeId.startsWith("view-") &&
      isNaN(nodeId)
    ) {
      const meals = await fetchMealsByCategory(nodeId);

      //  "View Meals" node
      const viewMealsNode = createNode(
        `view-meals-${nodeId}`,
        "View Meals",
        FaShare,
        "#fff9c4"
      );

      //  meal nodes
      const mealNodes = meals?.map((meal) =>
        createNode(
          `meal-${meal.idMeal}`,
          meal.strMeal,
          MdOutlineNoMeals,
          "#ffebee"
        )
      );

      //  edges between category node and "View Meals" node
      const viewMealsEdges = [createEdge(nodeId, viewMealsNode.id, "#ff5722")];

      //  edges between "View Meals" node and meal nodes
      const mealEdges = mealNodes?.map((mealNode) =>
        createEdge(viewMealsNode.id, mealNode.id, "#ff5722")
      );

      setNodes((prevNodes) =>
        layoutNodes(
          [...prevNodes, viewMealsNode, ...mealNodes],
          [...edges, ...viewMealsEdges, ...mealEdges]
        )
      );
      setEdges((prevEdges) => [...prevEdges, ...viewMealsEdges, ...mealEdges]);
    } else if (nodeId.startsWith("meal-")) {
      const viewNodes = [
        createNode(
          `view-ingredients-${nodeId}`,
          "View Ingredients",
          FaShare,
          "#dcedc8"
        ),
        createNode(`view-tags-${nodeId}`, "View Tags", FaShare, "#dcedc8"),
        createNode(
          `view-details-${nodeId}`,
          "View Details",
          FaShare,
          "#dcedc8"
        ),
      ];

      const viewEdges = viewNodes.map((viewNode) =>
        createEdge(nodeId, viewNode.id, "#4caf50")
      );

      setNodes((prevNodes) =>
        layoutNodes([...prevNodes, ...viewNodes], [...edges, ...viewEdges])
      );
      setEdges((prevEdges) => [...prevEdges, ...viewEdges]);
    } else if (nodeId.startsWith("view-")) {
      const mealId = nodeId.split("-")[3];
      if (nodeId.includes("details")) {
        const meal = await fetchMealDetails(mealId);
        setSelectedMeal(meal); // Set meal data for Sidebar
      }
    }
  };

  return (
    <>
      <div className="h-10 border border-b-2 border-b-grey">
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
    </>
  );
};

export default App;
