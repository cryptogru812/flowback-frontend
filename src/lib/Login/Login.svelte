<script lang="ts">
	import TextInput from '../Generic/TextInput.svelte';
	import { fetchRequest } from '../FetchRequest';
	import type { StatusMessageInfo } from '$lib/Generic/GenericFunctions';
	import { _ } from 'svelte-i18n';
	import StatusMessage from '$lib/Generic/StatusMessage.svelte';
	import Loader from '$lib/Generic/Loader.svelte';
	import { statusMessageFormatter } from '$lib/Generic/StatusMessage';
	import { goto } from '$app/navigation';
	import Button from '$lib/Generic/Button.svelte';
	import CheckboxButtons from '$lib/Generic/CheckboxButtons.svelte';
	// import { userInfo } from '$lib/Generic/GenericFunctions';

	let username: string,
		password: string,
		status: StatusMessageInfo,
		loading = false,
		remainLoggedIn = false;

	export let selectedPage: string;

	const logIn = async () => {
		loading = true;
		const { json, res } = await fetchRequest('POST', 'login', { username, password }, false);
		loading = false;

		if (!res.ok) status = { message: json.detail.non_field_errors[0], success: false };
		else if (json?.token) {
			await localStorage.setItem('token', json.token);

			//Checks if user has selected the "Remain logged in" button and acts accordingly
			if (remainLoggedIn) await localStorage.removeItem('sessionExpirationTime');
			else
				await localStorage.setItem(
					'sessionExpirationTime',
					//A session is set to 24 hours with "1000 * 3600 * 24"
					(new Date().getTime() + 1000 * 3600 * 24).toString()
				);

			{
				const { json } = await fetchRequest('GET', 'user');
				localStorage.setItem('userId', json.id);
				localStorage.setItem('userName', json.username);
			}

			goto('/home');
		} else {
			status = statusMessageFormatter(res, json, 'There was a problem logging in');
		}
	};
</script>

<Loader bind:loading>
	<form class="p-6 gap-6 flex flex-col items-center" on:submit|preventDefault={logIn}>
		<TextInput label={'Email'} bind:value={username} required name="email" />
		<div class="w-full">
			<TextInput
				label={'Password'}
				bind:value={password}
				type={'password'}
				required
				name="password"
			/>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<div class="flex justify-between items-end">
				<CheckboxButtons
					Class="cursor-pointer"
					label=""
					labels={[{ label: 'Remain logged in', checked: false, id: 1 }]}
					onChange={(e) => (remainLoggedIn = !remainLoggedIn)}
				/>
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="cursor-pointer hover:underline text-gray-400"
					on:click={() => (selectedPage = 'ForgotPassword')}
					on:keydown
					tabindex="0"
				>
					{$_('Forgot password?')}
				</div>
			</div>
		</div>

		<hr class="border-b-1 border-gray-300 w-full mt-6" />

		<Button
			type="submit"
			buttonStyle="primary-light"
			disabled={username === '' || password === ''}
			Class="w-[250px]">{$_('Login')}</Button
		>

		<StatusMessage bind:status />
	</form>
</Loader>
