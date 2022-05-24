<script>
	import NavMenu from './NavMenu.svelte';
	import WhatIsIt from './WhatIsIt.svelte';
</script>

<header
	class="header flex items-center mx-auto px-4 md:px-14 mt-6 mb-8 md:mb-14 md:mt-8 max-w-[1190px]"
>
	<div class="logo__icon">
		<a href="/">
			<picture>
				<source srcset="img/logo.svg" type="image/webp" />
				<img src="img/logo.svg" alt="Mail Minder Logo" /></picture
			>
		</a>
	</div>
	<h1 class="logo__label">Mail Minder</h1>
	<div class="ml-2">
		<WhatIsIt />
	</div>
	<NavMenu />
</header>
