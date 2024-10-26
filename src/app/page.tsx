"use client";

import { useEffect, useState } from 'react';
import RecipeCard from "@/components/globals/recipe";
import useRecipeStore from "@/hooks/recipe";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Home() {
  const { recipes, addRecipe, removeRecipe, updateRecipe } = useRecipeStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterOption, setFilterOption] = useState("all")
  const [filteredRecipes, setFilteredRecipes] = useState(recipes)

  useCopilotReadable({
    description: "A list of recipes",
    value: recipes,
  })

  useEffect(() => {
    const filtered = recipes.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm.toLowerCase()))
      
      if (filterOption === "all") return matchesSearch
      if (filterOption === "easy") return matchesSearch && recipe.difficulty === "Easy"
      if (filterOption === "medium") return matchesSearch && recipe.difficulty === "Medium"
      if (filterOption === "hard") return matchesSearch && recipe.difficulty === "Hard"
      return false
    })
    setFilteredRecipes(filtered)
  }, [recipes, searchTerm, filterOption])

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
  }

  useCopilotAction({
    name: "create-recipe",
    description: "Create a new recipe",
    parameters: [
      { name: "name", type: "string", required: true },
      { name: "ingredients", type: "string[]", required: true },
      { name: "instructions", type: "string", required: true },
      { name: "imageUrl", type: "string" },
      { name: "cookingTime", type: "string" },
      { name: "difficulty", type: "string" },
    ],
    handler: async ({ name, ingredients, instructions, imageUrl, cookingTime, difficulty }) => {
      try {
        const generatedRecipe = await generateRecipe(ingredients);
        addRecipe({
          name: generatedRecipe.name || name,
          ingredients: generatedRecipe.ingredients || ingredients,
          instructions: generatedRecipe.instructions || instructions,
          imageUrl: generatedRecipe.imageUrl || imageUrl || "",
          cookingTime: generatedRecipe.cookingTime || cookingTime,
          difficulty: generatedRecipe.difficulty || difficulty,
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
    parameters: [{ name: "id", type: "string", required: true }],
    handler: ({ id }) => {
      removeRecipe(id);
      return "Recipe deleted successfully";
    },
  });

  useCopilotAction({
    name: "update-recipe",
    description: "Update a recipe",
    parameters: [
      { name: "id", type: "string", required: true },
      { name: "name", type: "string" },
      { name: "ingredients", type: "string[]" },
      { name: "instructions", type: "string" },
      { name: "imageUrl", type: "string" },
      { name: "cookingTime", type: "string" },
      { name: "difficulty", type: "string" },
    ],
    handler: ({ id, name, ingredients, instructions, imageUrl, cookingTime, difficulty }) => {
      updateRecipe(id, { name, ingredients, instructions, imageUrl, cookingTime, difficulty });
      return "Recipe updated successfully";
    },
  });

  return (
    <div className="flex bg-background min-h-screen">
      <div className="flex-1 overflow-auto px-8 py-4">
        <div className="mb-6 flex gap-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          </div>
          <Select value={filterOption} onValueChange={setFilterOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isGenerating && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Generating new recipe...</CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                {...recipe}
                onDelete={removeRecipe}
              />
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="p-6 text-center text-muted-foreground">
                {searchTerm || filterOption !== "all"
                  ? "No recipes found matching your search criteria."
                  : "No recipes found. Start by adding a new recipe!"}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <CopilotSidebar />
    </div>
  )
}