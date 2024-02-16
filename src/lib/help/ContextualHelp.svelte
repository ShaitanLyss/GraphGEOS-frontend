<script>
	import { fade, fly } from 'svelte/transition';
</script>

<div
	transition:fade={{ duration: 200 }}
	class="w-full overflow-x-auto bg-surface-50-950-token border-t select-none
      border-surface-200-700-token flex justify-center gap-4 text-xs p-1.5 text-surface-500-400-token"
>
	<div>CTRL + A : Tout sélectionner</div>
	<div>CTRL + Clic : Sélection / Mouvement groupé</div>
	<div>B : Sélection boîte</div>
	<div>DEL : Supprimer</div>
	<div>Shift+R : Renommer graphe</div>
	<div>F, U, S, P : Macro blocs</div>
	<div>V : Variables</div>
	<div>M : Carte</div>
</div>
