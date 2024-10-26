import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY }) as any;

export async function POST(req: Request) {
  try {
    const { ingredients } = await req.json();

    const prompt = `Generate a detailed recipe using these ingredients: ${ingredients.join(', ')}. 
    Return the response in JSON format, with no additional text:
    {
      "name": "string",
      "ingredients": ["string", "string", ...],
      "instructions": "string",
      "cookingTime": "string",
      "difficulty": "medium" | "hard" | "easy"
    }`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-groq-8b-8192-tool-use-preview",
    });

    let recipeString = completion.choices[0]?.message?.content?.trim();

    recipeString = recipeString?.replace(/^.*{/, "{") ?? "";
    const recipe = JSON.parse(recipeString);

    const randomNum = Math.floor(Math.random() * 1000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        recipe.name
    )}?seed=${randomNum}&width=512&height=512&nologo=True`;

    return NextResponse.json({
      name: recipe.name,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      cookingTime: recipe.cookingTime,
      difficulty: recipe.difficulty,
      imageUrl,
    });
  } catch (error) {
    console.error('Error generating recipe:', error);
    return NextResponse.json({ error: 'Failed to generate recipe' }, { status: 500 });
  }
}
