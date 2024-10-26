# CookBook - A Recipe Generating App

## Description
CookBook is a recipe generating app that allows users to search for recipes based on ingredients they have on hand. Users can also save recipes in their personal cookbook for future reference. CookBook uses CopilotKit to generate recipes with the help of GroqAI's API (you can use your own LLM model if you have one or try ChatGPT, Gemini, or any other model).

## Features
- Search for recipes based on ingredients
- Save recipes to your personal cookbook
- Generate recipes with CopilotKit
- Filter recipes

## Screenshots
![Screenshot 2024-10-26 165433](https://github.com/user-attachments/assets/a4057aa7-a97f-47e4-8d1a-265238b545a8)
![Screenshot 2024-10-26 165530](https://github.com/user-attachments/assets/2ef5cdd3-1f71-4419-ab5f-0f6789ebf932)


## Technologies
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [CopilotKit](https://copilotkit.ai)
- [ShadCN](https://ui.shadcn.com)
- [Zustand](https://zustand.docs.pmnd.rs)
- [Groq](https://groq.com)

## Installation

1. Clone the repository
```bash
git clone https://github.com/RohittCodes/cookbook.git
```

2. Install dependencies
```bash
cd cookbook
yarn install
```

3. Create a `.env` file in the root directory and add the following environment variables
```bash
GROQ_API_KEY=YOUR_GROQ_API_KEY
```

4. Run the app
```bash
yarn dev
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
