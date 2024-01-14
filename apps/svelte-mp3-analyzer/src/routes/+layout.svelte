<script>
    import "../app.css";
    import Navbar from "$lib/components/navbar.svelte"
    import Footer from "$lib/components/footer.svelte"
</script>

<div class="h-screen bg-slate-100">
    <Navbar/>
    <main class="pt-40 pb-20 bg-slate-100">
        <slot/>
    </main>
    <Footer/>
</div>
