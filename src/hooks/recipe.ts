import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Recipe = {
    id: string;
    name: string;
    ingredients: string[];
    instructions: string;
    imageUrl: string;
};

interface RecipeStore {
    recipes: Recipe[];
    addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
    updateRecipe: (id: string, updatedRecipe: Partial<Omit<Recipe, 'id'>>) => void;
    removeRecipe: (id: string) => void;
}

const useRecipeStore = create<RecipeStore>()(
    persist((set) => ({
        recipes: [],
        addRecipe: (recipe) => set((state) => ({ recipes: [...state.recipes, { ...recipe, id: Date.now().toString() }] })),
        updateRecipe: (id, updatedRecipe) =>
            set((state) => ({
                recipes: state.recipes.map((recipe) => (recipe.id === id ? { ...recipe, ...updatedRecipe } : recipe)),
            })),
        removeRecipe: (id) => set((state) => ({ recipes: state.recipes.filter((recipe) => recipe.id !== id) })),
    }), {
        name: "recipe-storage",
        storage: createJSONStorage(() => localStorage),
    }));

export default useRecipeStore;