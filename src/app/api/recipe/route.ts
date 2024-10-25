import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { ingredients } = await req.json();

    const prompt = `Generate a recipe using these ingredients: ${ingredients.join(', ')}. Include a title, ingredients list, and step-by-step instructions.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-groq-8b-8192-tool-use-preview",
    });

    const recipe = completion.choices[0]?.message?.content;

    if (!recipe) {
      throw new Error('Failed to generate recipe');
    }

    // generateImage(recipe);
    const randomNum = Math.floor(Math.random() * 1000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        prompt
    )}?seed=${randomNum}&width=512&height=512&nologo=True`;

    // Parse the generated recipe
    const [name, ...rest] = recipe.split('\n\n');
    const ingredientsList = rest[0].replace('Ingredients:\n', '').split('\n');
    const instructions = rest.slice(1).join('\n\n');

    return NextResponse.json({ name, ingredients: ingredientsList, instructions, imageUrl });
  } catch (error) {
    console.error('Error generating recipe:', error);
    return NextResponse.json({ error: 'Failed to generate recipe' }, { status: 500 });
  }
}