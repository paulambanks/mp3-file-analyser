<script>
    import "../app.css";
    import Navbar from "$lib/components/navbar.svelte"
    import Footer from "$lib/components/footer.svelte"
</script>

<div class="h-screen bg-slate-100">
    <Navbar/>
    <main
            class="h-screen lazy-image relative bg-no-repeat bg-contain bg-center pt-40 pb-20"
            style="background-image: url('https://raw.githubusercontent.com/paulambanks/mp3-file-analyser/main/apps/assets/undraw_happy_music_g6wc.svg')"
    >
        <slot/>
    </main>
    <Footer/>
</div>
