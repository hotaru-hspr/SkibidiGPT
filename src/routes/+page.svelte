<script>
  import { onMount } from "svelte";
  import { GoogleGenerativeAI } from "@google/generative-ai";

  let inputText = "";
  let askLLM;
  let convos = [];
  let convoEnd;

  onMount(async () => {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    askLLM = async (text) => {
      convos = [...convos, { type: 'user', text }];
      scrollToBottom();
      convos = [...convos, { type: 'bot', text: '...' }];
      scrollToBottom();

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
        scrollToBottom();
      } catch (error) {
        convos = [
          ...convos.slice(0, -1),
          { type: 'bot', text: "Uh oh, we got lost there..." }
        ];
        scrollToBottom();
      }
    };
  });

  function handleEnter(event) {
    if (event.key === "Enter" && inputText != "") {
      document.getElementById("welcome").style.display = 'none';
      handleSend();
    }
  }

  function handleSend() {
    if (inputText.trim()) { 
      askLLM(inputText);
      inputText = "";
    }
  }

  function scrollToBottom() {
    convoEnd.scrollIntoView({ behavior: "smooth" });
  }

</script>

<div class="flex flex-col h-screen w-screen">
  <div class="ml-10 mt-10 text-xl flex justify-between items-center">
    <a class="hover:text-blue-300" href="https://www.youtube.com/shorts/tzD9OxAHtzU">👨🏻🚽 <b>Skibidi</b>GPT</a>
    <a href="https://github.com/hotaru-hspr/SkibidiGPT">
      <svg class="w-8 h-8 mr-12 fill-current text-white hover:text-blue-300" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)"/>
      </svg>
    </a>
  </div>  

  <div class="relative flex flex-col h-full overflow-y-auto p-4 bg-gradient-to-b from-[#EDF0FF]/5 to-transparent mt-10 ml-10 mr-10 rounded-3xl">
    <div class="flex-1">
      {#each convos as convo}
        <div class={`mb-4 ${convo.type === 'user' ? 'text-right' : ''}`}>
          <div class={`flex items-start ${convo.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            {#if convo.type === 'bot'}
              <img src="bot.webp" alt="Bot" class="w-6 h-6 rounded-full mr-2" style="align-self: flex-start;" />
            {/if}
            <p class="text-gray-300 px-4 py-2 bg-[#EDF0FF]/10 rounded-xl inline-block ${convo.type === 'user' ? '' : 'bg-[#EDF0FF]/20'} max-w-[700px]" style="max-width: 60%;">
              {convo.text}
            </p>
            {#if convo.type === 'user'}
              <img src="user.webp" alt="User" class="w-6 h-6 rounded-full ml-2" style="align-self: flex-start;" />
            {/if}
          </div>
        </div>
      {/each}
      <div bind:this={convoEnd}></div>
    </div>
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="text-center" id="welcome">
        <p class="text-3xl">
          Welcome to <b>Skibidi</b>GPT.
        </p>
        <p class="text-l mt-5 text-gray-200">
          Talk to your personal Gen-Z brainrot Chatbot, if your younger brother wasn't enough.
        </p>
      </div>
    </div>
  </div>

  <div>
    <div class="p-2 mt-10 ml-10 mr-10 mb-5 rounded-xl flex items-center">
      <input 
        class="bg-[#1E3345] flex-1 px-4 py-2 rounded-xl outline-none" 
        placeholder="🚽 Feelin' skibidi? Let's yap!" 
        on:keypress={handleEnter}
        bind:value={inputText} 
      />
      <button 
        class="ml-2 rounded-xl p-2 bg-[#0A2234] hover:bg-[#EDF0FF]/10 items-center" 
        on:click={handleSend}>
        <img src="send.webp" alt="Send" class="w-auto h-5 ml-0.5" />
      </button>
    </div>
    <div class="mb-4 text-gray-500 text-center">
      Warning: Brainrot ahead. Proceed with caution!
    </div>  
  </div>
</div>

<style lang="postcss">
  :global(html, body) {
    background: linear-gradient(180deg, #002F4A, #000D1C);
    background-attachment: fixed;
    height: 100%;
  }

  :global(body) {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }
</style>
