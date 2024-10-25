interface RecipeCardProps {
    name: string;
    ingredients: string[];
    instructions: string;
    imageUrl: string;
}

const RecipeCard = (
    recipe: RecipeCardProps
) => {
    return ( 
        <div className="w-72 h-96 bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-4">
                <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-32 object-cover object-center" />
                <h1 className="text-xl font-semibold">{recipe.name}</h1>
                <ul className="mt-4">
                    {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="mb-2">{ingredient}</li>
                    ))}
                </ul>
                <p className="mt-4">{recipe.instructions}</p>
            </div>
        </div>
     );
}
 
export default RecipeCard;