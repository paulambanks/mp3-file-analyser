<script lang="ts">
    import {Button} from "$lib/components/ui/button";
    import {Label} from "$lib/components/ui/label";
    import {Input} from "$lib/components/ui/input";

    import { enhance } from '$app/forms';
    import type { ActionData } from './$types';
    import { cn } from "$lib/utils";
    import Icon from "@iconify/svelte";

    export let form: ActionData;
</script>

<div class="flex items-center justify-center flex-col">
    <div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-t shadow sm:p-6 md:p-8">
        <form
            enctype="multipart/form-data"
            class="space-y-6"
            method="post"
            use:enhance
            action="?/uploadFile"
        >
            <h5 class="text-xl font-medium text-gray-900">Please select a mp3 sample to calculate the frame count</h5>
            <div class="group">
                <Label for="file_input">Upload file</Label>
                <Input
                    class="cursor-pointer"
                    aria-describedby="file_input_help"
                    id="file_input"
                    type="file"
                    accept="audio/mp3,audio/*;capture=microphone"
                    name="file"
                    required
                />
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">Accepted files: audio/mp3</p>
            </div>
            <Button
                id="file-submit"
                type="submit"
                class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
                Submit
            </Button>
        </form>
    </div>
    {#if form?.ok !== undefined}
        <div class={cn('w-full shadow max-w-sm rounded-b p-4 border-t-4',
            form?.ok === true && "bg-green-100 border-green-400 text-green-700",
            form?.ok === false && "border-red-400 bg-red-100 text-red-700",
            )}
             role="alert"
        >
            <div class="flex">
                <div class="py-1">
                    {#if form?.ok === true}
                        <Icon class="fill-current h-6 w-6 mr-4" icon="zondicons:exclamation-outline" color="#2f855a" />
                    {:else}
                        <Icon class="fill-current h-6 w-6 mr-4" icon="zondicons:exclamation-outline" color="#c53030" />
                    {/if}
                </div>
                <div>
                    {#if form?.ok === true}
                        <p class="font-bold">Frame count performed successfully</p>
                        <p class="text-sm">Filename: {form?.filename}</p>
                        <p class="text-sm">Frame count: {form?.frameCount}</p>
                    {:else}
                        <p class="font-bold">There was an error whilst processing the frame count.</p>
                        <p class="text-sm">Filename: {form?.filename}</p>
                        <p class="text-sm">{form?.message}</p>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</div>
