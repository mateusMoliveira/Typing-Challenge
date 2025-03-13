<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { timeLeft, challengeStarted, formData } from '$lib/stores';

  let storedData = { name: '', phone: '', email: '' };

  onMount(() => {
      const savedData = localStorage.getItem('candidateData');
      if (savedData) {
          storedData = JSON.parse(savedData);
      }
  });

  function backToChallenge() {
      goto('/');
  }
</script>

<div class="mx-auto p-12 font-bold text-white h-screen bg-gradient-to-b from-black to-gray-950">
<h1 class="text-4xl mb-4 p-8 rounded-lg shadow-xl flex justify-center bg-gray-800 border-gray-700 border-3">Informações do Candidato</h1>
<div class="relative rounded-lg shadow-xl flex flex-col items-center justify-center bg-gray-800 border-gray-700 border-3 p-8">
  {#if $challengeStarted}
    <p class="mb-4"><strong>Nome:</strong> {$formData.name || 'Not provided'}</p>
    <p class="mb-4"><strong>Telefone:</strong> {$formData.phone || 'Not provided'}</p>
    <p class="mb-4"><strong>Email:</strong> {$formData.email || 'Not provided'}</p>
    <p class="mb-4"><strong>Tempo Restante:</strong> {Math.floor($timeLeft / 60)}:{($timeLeft % 60).toString().padStart(2, '0')}</p>
  {:else}
    <p class="mb-4"><strong>Nome:</strong> {storedData.name || 'Not provided'}</p>
    <p class="mb-4"><strong>Telefone:</strong> {storedData.phone || 'Not provided'}</p>
    <p class="mb-4"><strong>Email:</strong> {storedData.email || 'Not provided'}</p>
  {/if}
  <button on:click={backToChallenge} class="btn btn-secondary text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-4 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 absolute top-5 right-5">De volta ao desafio</button>
</div>
</div>