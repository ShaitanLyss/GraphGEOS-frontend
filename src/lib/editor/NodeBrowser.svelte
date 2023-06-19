<script lang="ts">
	import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import Fa from 'svelte-fa';
import { isLoading } from 'svelte-i18n';
</script>

<div class="flex flex-col h-full variant-filled-surface">
    <div class="flex flex-row items-center justify-between p-2">
        <div class="flex flex-row items-center">
            <div class="flex flex-row items-center justify-center w-8 h-8 mr-2 rounded-full bg-primary-500">
                <Fa icon={faSearch} />
            </div>
            <input
                type="text"
                class="flex-grow w-full h-8 px-2 rounded-full bg-primary-500 text-white"
                placeholder="Search"
            />
        </div>
        <!-- <div class="flex flex-row items-center">
            <div class="flex flex-row items-center justify-center w-8 h-8 mr-2 rounded-full bg-primary-500">
                <Fa icon={faFilter} />
            </div>
            <input
                type="text"
                class="flex-grow w-full h-8 px-2 rounded-full bg-primary-500 text-white"
                placeholder="Filter"
            />
        </div> -->
    </div>
    <!-- <div class="flex-grow overflow-y-auto">
        {#if isLoading}
            <div class="flex flex-col items-center justify-center w-full h-full">
                <Icon name="loading" class="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        {:else}
            <div class="flex flex-col items-center justify-center w-full h-full">
                <Icon name="search" class="w-8 h-8 text-primary-500" />
                <p class="mt-2 text-sm text-gray-500">No results found</p>
            </div>
        {/if}
    </div> -->
</div>
