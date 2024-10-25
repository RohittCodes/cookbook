"use client";

import { useState } from 'react';
import RecipeCard from "@/components/globals/recipe";
import useRecipeStore from "@/hooks/recipe";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";

export default function Home() {
  const { recipes, addRecipe, removeRecipe, updateRecipe } = useRecipeStore();
  const [isGenerating, setIsGenerating] = useState(false);

  useCopilotReadable({
    description: "A list of recipes",
    value: recipes,
  });

  const generateRecipe = async (ingredients: string[]) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating recipe:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  useCopilotAction({
    name: "create-recipe",
    description: "Create a new recipe",
    parameters: [
      {
        name: "name",
        type: "string",
        required: true,
      },
      {
        name: "ingredients",
        type: "string[]",
        required: true,
      },
      {
        name: "instructions",
        type: "string",
        required: true,
      },
      {
        name: "imageUrl",
        type: "string",
      }
    ],
    handler: async ({ name, ingredients, instructions }) => {
      try {
        const generatedRecipe = await generateRecipe(ingredients);
        addRecipe({
          name: generatedRecipe.name || name,
          ingredients: generatedRecipe.ingredients || ingredients,
          instructions: generatedRecipe.instructions || instructions,
          imageUrl: generatedRecipe.imageUrl || "",
        });
        return "Recipe created successfully";
      } catch (error) {
        console.error('Error creating recipe:', error);
        return "Failed to create recipe";
      }
    },
  });

  useCopilotAction({
    name: "delete-recipe",
    description: "Delete a recipe",
    parameters: [
      {
        name: "id",
        type: "string",
        required: true,
      },
    ],
    handler: ({ id }) => {
      removeRecipe(id);
      return "Recipe deleted successfully";
    },
  });

  useCopilotAction({
    name: "update-recipe",
    description: "Update a recipe",
    parameters: [
      {
        name: "id",
        type: "string",
        required: true,
      },
      {
        name: "name",
        type: "string",
      },
      {
        name: "ingredients",
        type: "string[]",
      },
      {
        name: "instructions",
        type: "string",
      },
      {
        name: "imageUrl",
        type: "string",
      }
    ],
    handler: ({ id, name, ingredients, instructions }) => {
      updateRecipe(id, { name, ingredients, instructions });
      return "Recipe updated successfully";
    },
  });

  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-gray-200 p-4">
        <h1 className="text-2xl font-bold mb-4">Recipes</h1>
        {isGenerating && <p className="text-blue-500 mb-4">Generating recipe...</p>}
        <ul className="space-y-4">
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                name={recipe.name}
                ingredients={recipe.ingredients}
                instructions={recipe.instructions}
                imageUrl={recipe.imageUrl}
              />
            ))
          ) : (
            <p>No recipes found</p>
          )}
        </ul>
      </div>
      <CopilotSidebar />
    </div>
  );
}