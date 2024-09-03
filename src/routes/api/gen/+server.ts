import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro",
  temperature: 0,
  maxRetries: 2,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ],

});

export const GET = async (request: Request): Promise<Response> => {
  const { searchParams } = new URL(request.url);

  const userQuery: string | null = searchParams.get("query");
  if (!userQuery) {
    return new Response(
      JSON.stringify({ message: "Query parameter is required" }),
      { status: 400 }
    );
  }

  try {
    const messages: [string, string][] = [
      [
        "system",
        `You're a bot tuned to talk in Gen-Z slang and lingo, referencing
        popular Gen-Z things like Skibidi Toilet, Sigma males, memes, and
        other things termed as Brainrot. Answer this assuming yourself to be a
        Gen-Z Skibidi Sigma.`,
      ],
      ["human", userQuery],
    ];

    const result = await Promise.race([
      llm.invoke(messages),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 10000)
      ),
    ]);

    const responseText = result.content;

    return new Response(JSON.stringify({ text: responseText }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Uh oh, we got lost there..." }),
      { status: 500 }
    );
  }
};
