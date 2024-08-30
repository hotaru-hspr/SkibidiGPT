<script>
  import { onMount } from "svelte";
  import { GoogleGenerativeAI } from "@google/generative-ai";

  let inputText = "";
  let askLLM;
  let convos = [];

  onMount(async () => {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    askLLM = async (text) => {
      convos = [...convos, { type: 'user', text }];
      convos = [...convos, { type: 'bot', text: '...' }];

      try {
        const result = await Promise.race([
          model.generateContent(
            `You're a bot tuned to talk in Gen-Z slang and lingo, referencing popular Gen-Z things like Skibidi Toilet, Sigma males, memes, and other things termed as Brainrot. Answer this assuming yourself to be a Gen-Z Skibidi Sigma: '${text}'`
          ),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 10000)
          )
        ]);

        const response = await result.response;
        const responseText = await response.text();

        convos = [
          ...convos.slice(0, -1),
          { type: 'bot', text: responseText }
        ];
      } catch (error) {
        convos = [
          ...convos.slice(0, -1),
          { type: 'bot', text: "Uh oh, we got lost there..." }
        ];
      }
    };
  });

  function handleEnter(event) {
    if (event.key === "Enter") {
      handleSend();
    }
  }

  function handleSend() {
    if (inputText.trim()) { 
      askLLM(inputText);
      inputText = "";
    }
  }
</script>

<div class="flex flex-col h-screen w-screen">
  <div class="ml-10 mt-10 text-xl flex justify-between items-center">
    <a class="hover:text-blue-300" href="https://www.youtube.com/shorts/tzD9OxAHtzU">👨🏻🚽 <b>Skibidi</b>GPT</a>
    <a href="https://github.com/hotaru-hspr/SkibidiGPT"><img src="github.webp" alt="GitHub" class="w-8 h-8 mr-12" /></a>
  </div>
  
  <div class="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-[#EDF0FF]/5 to-transparent mt-10 ml-10 mr-10 rounded-3xl">
    {#each convos as convo}
      <div class="mb-4 {convo.type === 'user' ? 'text-right' : ''}">
        <p class="text-gray-300 px-4 py-2 bg-[#EDF0FF]/10 rounded-xl inline-block {convo.type === 'user' ? '' : 'bg-[#EDF0FF]/20'}">
          {convo.text}
        </p>
      </div>
    {/each}
  </div>

  <div class="p-2 m-10 rounded-xl flex items-center">
    <input 
      class="bg-[#1E3345] flex-1 px-4 py-2 rounded-xl" 
      placeholder="🚽 Feelin' skibidi? Let's yap!" 
      on:keypress={handleEnter}
      bind:value={inputText} 
    />
    <button 
      class="ml-2 rounded-xl p-2 bg-[#0A2234] w-16" 
      on:click={handleSend}>
      Send
    </button>
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
