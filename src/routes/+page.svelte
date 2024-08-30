<script>
  import { onMount } from "svelte";
  import { GoogleGenerativeAI } from "@google/generative-ai";

  onMount(async () => {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const fetchData = async () => {
      const prompt = "Hello, what do you know about skibidi toilet?";
      const result = await model.generateContent("You're a bot tuned to talk in Gen-Z slang and lingo, referencing popular Gen-Z things like Skibidi Toilet, Sigma males, memes, and other things termed as Brainrot. Answer this assuming yourself to be a Gen-Z Skibidi Sigma: '" + prompt + "'");
      const text = await result.response.text();
      console.log(text);
    };

    fetchData();
  });
</script>

<div class="flex flex-col h-screen w-screen">
  <div class="ml-10 mt-10 text-xl hover:text-blue-300 flex justify-between items-center">
    <a href="https://www.youtube.com/shorts/tzD9OxAHtzU ">👨🏻🚽 SkibidiGPT</a>
    <a href="https://github.com/hotaru-hspr/SkibidiGPT"><img src="github.webp" alt="GitHub" class="w-8 h-8 mr-12" /></a>
  </div>
  
  <!-- User's message -->
  <div class="flex-1 overflow-y-auto p-4 bg-[#1E3345] mt-10 ml-10 mr-10 rounded-3xl">
    <div class="mb-4 text-right">
      <p class="text-gray-300 px-4 py-2 bg-[#0A2F47] rounded-xl inline-block">Skibidi</p>
    </div>
    <!-- Response from LLM -->
    <div class="mb-2">
      <p class="p-2 rounded-lg inline-block">Brr Skibidi Dop Dop Dop Yes Yes</p>
    </div>
  </div>

  <div class="p-2 m-10 rounded-xl flex items-center">
    <input class="border border-white bg-[#1E3345] flex-1 px-4 py-2 rounded-xl" placeholder="🚽 Feelin' skibidi? Let's yap!"/>
    <button class="ml-2 rounded-xl p-2 bg-[#0A2234] w-16">Send</button>
  </div>  
</div>


<style lang="postcss">
  :global(html, body) {
    background: linear-gradient(180deg, #002F4A, #000D1C);
    background-attachment: fixed;
  }

  :global(body) {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }
</style>
