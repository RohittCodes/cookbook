"use client";

import { ChefHat, Clock, Utensils, Trash2, Eye } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link";
import Image from "next/image";

interface RecipeCardProps {
  id: string
  name: string
  ingredients: string[]
  instructions: string
  imageUrl: string
  cookingTime?: string
  difficulty?: string
  onDelete: (id: string) => void
}

const RecipeCard = ({ id, name, ingredients, instructions, imageUrl, cookingTime, difficulty, onDelete }: RecipeCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg flex flex-col justify-between">
      <div className="aspect-video relative overflow-hidden">
        <Image src={imageUrl || "/placeholder.svg?height=200&width=300"} alt={name} className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-opacity-30 flex items-end">
          <div className="w-full p-4">
            <h3 className="font-bold text-lg line-clamp-1 rounded-md w-fit px-2 bg-primary-foreground text-primary-background
            ">{name}</h3>
            <div className="flex items-center gap-2 mt-2">
              {cookingTime && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {cookingTime}
                </Badge>
              )}
              {difficulty && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <ChefHat className="w-3 h-3" />
                  {difficulty}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Utensils className="w-4 h-4" />
          <span>{ingredients.length} ingredients</span>
        </div>
        <p className="text-sm line-clamp-3">{instructions}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this recipe?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the recipe &ldquo;{name}&rdquo;.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Link href={`/${id}`} passHref>
            <Button variant="secondary" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View
            </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default RecipeCard