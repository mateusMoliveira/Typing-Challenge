<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { timeLeft, challengeStarted, showSuccessModal, showFailureModal, formData, startChallenge, resetChallenge, submitChallenge } from '$lib/stores';

  let formDisabled = true;
  let viewCandidateDisabled = true;

  $: {
      formDisabled = !$challengeStarted;
      viewCandidateDisabled = !$challengeStarted;
  }

  function closeSuccessModal() {
      showSuccessModal.set(false);
      resetChallenge();
  }

  function closeFailureModal() {
      showFailureModal.set(false);
      resetChallenge();
  }

  function viewCandidateInfo() {
      goto('/candidate');
  }

  onMount(() => {
    // Instead of resetting the challenge, check if it's already started
    if (!$challengeStarted) {
      resetChallenge();
    }
  });

  function handleModalOutsideClick(event: MouseEvent, modalType: 'success' | 'failure') {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-overlay')) {
      if (modalType === 'success') {
        closeSuccessModal();
      } else {
        closeFailureModal();
      }
    }
  }
</script>

<div class="mx-auto p-12 font-bold text-white">
  <h1 class="text-4xl mb-4 p-8 rounded-lg shadow-xl flex justify-center bg-gray-800 border-gray-700 border-3">Desafio</h1>
  <div class="relative rounded-lg shadow-xl flex justify-center bg-gray-800 border-gray-700 border-3">
    <form on:submit|preventDefault={submitChallenge} class="space-y-4">
      <div>
        <label for="name" class="block px-4 py-2">Nome:</label>
        <input type="text" id="name" bind:value={$formData.name} required class="rounded-lg border-1 border-gray-600 focus:border-blue-500 input input-bordered w-md" disabled={formDisabled} />
      </div>
      <div>
        <label for="phone" class="block px-4 py-2">Telefone:</label>
        <input type="tel" id="phone" bind:value={$formData.phone} required class="rounded-lg border-1 border-gray-600 focus:border-blue-500 input input-bordered w-md" disabled={formDisabled} />
      </div>
      <div>
        <label for="email" class="block px-4 py-2">Email:</label>
        <input type="email" id="email" bind:value={$formData.email} required class="rounded-lg border-1 border-gray-600 focus:border-blue-500 input input-bordered w-md mb-4" disabled={formDisabled} />
      </div>
      {#if !$challengeStarted && !$showFailureModal}
        <button type="button" on:click={startChallenge} class="btn btn-primary focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-4 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Iniciar Desafio</button>
      {:else if $challengeStarted}
        {#if $timeLeft > 0}
          <div class="text-2xl font-bold mb-4">Tempo Restante: {Math.floor($timeLeft / 60)}:{($timeLeft % 60).toString().padStart(2, '0')}</div>
          <button type="submit" class="btn btn-primary px-6 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-4 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Enviar</button>
        {:else}
          <button type="button" on:click={startChallenge} class="btn btn-primary focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-4 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Iniciar Desafio</button>
        {/if}
      {/if}
      <button on:click={viewCandidateInfo} class="btn btn-secondary text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-4 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 absolute top-5 right-5" disabled={viewCandidateDisabled}>Ver informações do candidato</button>
    </form>
  </div>


  {#if $showSuccessModal}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="fixed inset-0 flex items-center justify-center z-50" on:click={(e) => handleModalOutsideClick(e, 'success')}>
    <div class="modal-overlay fixed inset-0 bg-black opacity-50"></div>
      <div class="modal-container bg-gray-800 w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div class="modal-content py-4 text-left px-6">
          <div class="flex justify-between items-center pb-3">
            <p class="text-2xl font-bold text-white">Successo!</p>
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button on:click={closeSuccessModal} class="modal-close cursor-pointer z-50">
              <svg class="fill-current text-white" width="18" height="18" viewBox="0 0 18 18">
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </button>
          </div>
        <p class="text-white">Desafio finalizado com sucesso!</p>
      </div>
    </div>
  </div>
  {/if}

  {#if $showFailureModal}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="fixed inset-0 flex items-center justify-center z-50" on:click={(e) => handleModalOutsideClick(e, 'failure')}>
    <div class="modal-overlay fixed inset-0 bg-black opacity-50"></div>
      <div class="modal-container bg-gray-800 w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div class="modal-content py-4 text-left px-6">
          <div class="flex justify-between items-center pb-3">
            <p class="text-2xl font-bold text-white">Falha!</p>
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button on:click={closeFailureModal} class="modal-close cursor-pointer z-50">
              <svg class="fill-current text-white" width="18" height="18" viewBox="0 0 18 18">
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </button>
          </div>
        <p class="text-white">Desafio finalizado com falha!</p>
      </div>
    </div>
  </div>
{/if}
</div>