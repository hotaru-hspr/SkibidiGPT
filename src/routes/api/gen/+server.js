// server.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the GoogleGenerativeAI instance
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Define the API route
export const GET = async (request) => {
  const { searchParams } = new URL(request.url);

  // Get the user query from the query parameters
  const userQuery = searchParams.get('query');
  if (!userQuery) {
    return new Response(JSON.stringify({ message: 'Query parameter is required' }), { status: 400 });
  }

  try {
    // Generate the response from the model
    const result = await Promise.race([
      model.generateContent(`You're a bot tuned to talk in Gen-Z slang and lingo, referencing popular Gen-Z things like Skibidi Toilet, Sigma males, memes, and other things termed as Brainrot. Answer this assuming yourself to be a Gen-Z Skibidi Sigma: '${userQuery}'`),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 10000))
    ]);

    const response = await result.response;
    const responseText = await response.text();

    return new Response(JSON.stringify({ text: responseText }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Uh oh, we got lost there..." }), { status: 500 });
  }
};
