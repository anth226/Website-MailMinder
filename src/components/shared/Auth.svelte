<script>
	import { supabase } from '@utils/supabaseClient';
	import { notification, showLogin } from '@stores/sessionStore';
	import { tick } from 'svelte';

	let email = '';
	let emailInput; // use with bind:this to focus element

	// focus email field when auth modal opens
	$: $showLogin, focusEmailField();
	const focusEmailField = async () => {
		if (showLogin && emailInput) {
			await tick();
			emailInput.focus();
		}
	};

	const toggleShowLogin = async () => {
		showLogin.set(!$showLogin);
		//console.log(emailInput);
	};

	const handleLogin = async () => {
		showLogin.set(false);
		notification.set('Check your email for login link.');
		try {
			const { error } = await supabase.auth.signIn(
				{ email },
				{
					redirectTo: import.meta.env.VITE_SUPABASE_REDIRECT_URL
				}
			);
			if (error) throw error;
		} catch (error) {
			notification.set(error.error_description || error.message);
			console.error(error.error_description || error.message);
		} finally {
			email = '';
		}
	};
</script>

<div>
	<div class="page-popup login-popup" class:active={$showLogin} on:click={toggleShowLogin}>
		<div class="login-popup__content" on:click|stopPropagation={() => {}}>
			<form action="" class="login-form" on:submit|preventDefault={handleLogin}>
				<div class="login-form__email email">
					<input
						autocomplete="on"
						type="email"
						name="email"
						class="input"
						bind:this={emailInput}
						placeholder="Your email address"
						bind:value={email}
						required
					/>
				</div>
				<button id="login-btn" type="submit" class="login__button button"> Login </button>
			</form>
		</div>
	</div>
</div>
