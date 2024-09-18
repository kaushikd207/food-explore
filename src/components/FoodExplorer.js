import React, { useState } from "react";
import { ReactFlow, Controls, Background } from "@xyflow/react";
import StartNode from "../nodes/StartNode";
import EntityNode from "../nodes/EntityNode";
import OptionNode from "../nodes/OptionNode";
import "@xyflow/react/dist/style.css";
import "../index.css";
import FetchCategories from "../utils/FetchCategories";
import FetchMeals from "../utils/FetchMeals";
import FetchIngredients from "../utils/FetchIngridients";
import FetchTags from "../utils/FetchTags";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import FetchMealDetails from "../utils/FetchMealDetails";

const initialNodes = [
  {
    id: "1",
    position: { x: 250, y: 0 },
    data: { label: "Explore" },
    type: "startNode",
  },
];

const initialEdges = [];

const nodeTypes = {
  startNode: StartNode,
  entityNode: EntityNode,
  optionNode: OptionNode,
};

const FoodExplorer = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [mealDetails, setMealDetails] = useState(null);
  const [mealLoading, setMealLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const onNodeClick = async (event, node) => {
    closeSidebar();

    if (node.id === "1") {
      try {
        const data = await FetchCategories();
        const newCategories = data.topCategories.map((category, index) => ({
          id: "category-" + category.idCategory,
          position: { x: 500, y: -140 + index * 70 },
          data: { label: category.strCategory, type: "category" },
          type: "entityNode",
          sourcePosition: "right",
          targetPosition: "left",
        }));

        setNodes([...initialNodes, ...newCategories]);
        setEdges(data.categoryEdges);
      } catch (error) {
        console.log(error);
      }
    } else if (node.type === "entityNode" && node.data.type === "category") {
      const newNodes = nodes.filter(
        (n) =>
          n.type !== "optionNode" &&
          n.data.type !== "meal" &&
          n.data.type !== "ingredient" &&
          n.data.type !== "tags"
      );
      const newEdges = edges.filter((e) => e.id !== "oe-1" && e.id !== "me-1");

      const optionNode = {
        id: "option-1",
        position: { x: node.position.x + 200, y: node.position.y + 5 },
        data: { label: "View Meals", category: node.data.label },
        type: "optionNode",
        sourcePosition: "right",
        targetPosition: "left",
      };

      const optionEdge = {
        id: "oe-1",
        source: node.id,
        target: optionNode.id,
        type: "default",
        markerEnd: "url(#arrow)",
      };

      setNodes([...newNodes, optionNode]);
      setEdges([...newEdges, optionEdge]);
    } else if (node.type === "optionNode" && node.id === "option-1") {
      const existingMeals = nodes.find((n) => n.data.type === "meal");

      if (!existingMeals) {
        try {
          const data = await FetchMeals(node.data.category);
          const newMeals = data.topMeals.map((meal, index) => {
            const mealNode = {
              id: "meal-" + meal.idMeal,
              position: {
                x: node.position.x + 150,
                y: node.position.y + 140 - index * 100,
              },
              data: { label: meal.strMeal, type: "meal", id: meal.idMeal },
              type: "entityNode",
              sourcePosition: "right",
              targetPosition: "left",
            };
            return mealNode;
          });

          setNodes([...nodes, ...newMeals]);
          setEdges([...edges, data.mealEdge]);
        } catch (error) {
          console.log(error);
        }
      }
    } else if (node.type === "entityNode" && node.data.type === "meal") {
      const existingEdge = edges.find((e) => e.id === "me-1");
      const newEdges = edges.filter(
        (e) =>
          e.id !== "me-1" &&
          e.id !== "oe-2" &&
          e.id !== "oe-3" &&
          e.id !== "oe-4" &&
          !e.id.includes("ingredient") &&
          !e.id.includes("tag")
      );
      const ingredientsNodesRemove = nodes.filter(
        (n) => n.data.type !== "ingredient" && n.data.type !== "tags"
      );

      const mealEdge = {
        ...existingEdge,
        target: node.id,
      };

      const optionNodes = [
        {
          id: "ingredients",
          position: { x: node.position.x + 270, y: node.position.y - 20 },
          data: { label: "View Ingredients", id: node.id },
          type: "optionNode",
          sourcePosition: "right",
          targetPosition: "left",
        },
        {
          id: "tags",
          position: { x: node.position.x + 270, y: node.position.y + 20 },
          data: { label: "View Tags", id: node.id },
          type: "optionNode",
          sourcePosition: "right",
          targetPosition: "left",
        },
        {
          id: "details",
          position: { x: node.position.x + 270, y: node.position.y + 60 },
          data: { label: "View Details", id: node.id },
          type: "optionNode",
          sourcePosition: "right",
          targetPosition: "left",
        },
      ];

      const optionEdges = [
        {
          id: "oe-2",
          source: node.id,
          target: "ingredients",
          type: "default",
          markerEnd: "url(#arrow)",
        },
        {
          id: "oe-3",
          source: node.id,
          target: "tags",
          type: "default",
          markerEnd: "url(#arrow)",
        },
        {
          id: "oe-4",
          source: node.id,
          target: "details",
          type: "default",
          markerEnd: "url(#arrow)",
        },
      ];

      setNodes([...ingredientsNodesRemove, ...optionNodes]);
      setEdges([...newEdges, ...optionEdges, mealEdge]);
    } else if (node.id === "ingredients") {
      const newNodes = nodes.filter(
        (n) => n.data.type !== "tags" && n.data.type !== "ingredient"
      );
      const newEdges = edges.filter(
        (e) => !e.id.includes("ingredient") && !e.id.includes("tag")
      );

      try {
        const data = await FetchIngredients(node.data.id.split("-")[1]);
        const ingredients = data.map((ing, index) => {
          const ingredientNode = {
            id: "ing-" + index,
            position: {
              x: node.position.x + 170,
              y: node.position.y + 140 - index * 70,
            },
            data: { label: ing.name, type: "ingredient" },
            type: "entityNode",
            sourcePosition: "right",
            targetPosition: "left",
          };
          return ingredientNode;
        });

        const ingredientEdges = ingredients.map((ing, index) => ({
          id: "ingredient" + index,
          source: node.id,
          target: ing.id,
          type: "default",
          markerEnd: "url(#arrow)",
        }));

        setNodes([...newNodes, ...ingredients]);
        setEdges([...newEdges, ...ingredientEdges]);
      } catch (err) {
        console.error(err);
      }
    } else if (node.id === "tags") {
      const newNodes = nodes.filter(
        (n) => n.data.type !== "tags" && n.data.type !== "ingredient"
      );
      const newEdges = edges.filter(
        (e) => !e.id.includes("ingredient") && !e.id.includes("tag")
      );

      try {
        const data = await FetchTags(node.data.id.split("-")[1]);
        if (data.length === 0) {
          toast.info("No tags found");
        }
        const tags = data.map((tag, index) => {
          const tagNode = {
            id: "tag-" + index,
            position: {
              x: node.position.x + 170,
              y: node.position.y + 70 - index * 70,
            },
            data: { label: tag.tag, type: "tags" },
            type: "entityNode",
            sourcePosition: "right",
            targetPosition: "left",
          };
          return tagNode;
        });

        const tagEdges = tags.map((tag, index) => ({
          id: "tag" + index,
          source: node.id,
          target: tag.id,
          type: "default",
          markerEnd: "url(#arrow)",
        }));

        setNodes([...newNodes, ...tags]);
        setEdges([...newEdges, ...tagEdges]);
      } catch (err) {
        console.error(err);
      }
    } else if (node.id === "details") {
      setMealLoading(true);
      const newNodes = nodes.filter(
        (n) => n.data.type !== "tags" && n.data.type !== "ingredient"
      );
      const newEdges = edges.filter(
        (e) => !e.id.includes("ingredient") && !e.id.includes("tag")
      );
      setNodes([...newNodes]);
      setEdges([...newEdges]);
      setSidebarOpen(true);

      try {
        const data = await FetchMealDetails(node.data.id.split("-")[1]);
        setMealDetails(data);
        setMealLoading(false);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="">
      <div className="fixed p-2 font-semibold w-full bg-white z-10 shadow-sm">
        <h5>Food Explorer</h5>
      </div>
      <div style={{ width: "100%", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          fitView
          style={{ width: "100%", height: "100%" }}
          nodeTypes={nodeTypes}
        >
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
      <ToastContainer />
      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
        loading={mealLoading}
        details={mealDetails}
      />
    </div>
  );
};

export default FoodExplorer;
