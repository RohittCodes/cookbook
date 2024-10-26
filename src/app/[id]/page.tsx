"use client";

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Clock, ChefHat, Utensils } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import useRecipeStore from "@/hooks/recipe"
import Image from 'next/image';

export default function RecipePage({ params }: { params: { id: string } }) {
    const recipes = useRecipeStore(state => state.recipes)
    const recipe = recipes.find(recipe => recipe.id === params.id)


    if (!recipe) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/" passHref>
                <Button variant="ghost" className="mb-4">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back to Recipes
                </Button>
            </Link>
            <Card className="overflow-hidden">
                <div className="relative h-64 sm:h-96">
                    <Image
                        src={recipe.imageUrl || "/placeholder.svg?height=400&width=800"}
                        alt={recipe.name}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">{recipe.name}</CardTitle>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {recipe.cookingTime && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {recipe.cookingTime}
                            </Badge>
                        )}
                        {recipe.difficulty && (
                            <Badge variant="outline" className="flex items-center gap-1">
                                <ChefHat className="w-3 h-3" />
                                {recipe.difficulty}
                            </Badge>
                        )}
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <Utensils className="w-3 h-3" />
                            {recipe.ingredients.length} ingredients
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
                        <ul className="list-disc list-inside space-y-1">
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Instructions</h2>
                        <p className="whitespace-pre-wrap">{recipe.instructions}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}