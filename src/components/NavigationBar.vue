<script setup>
const MenuItems = ["Movies", "TV Shows", "Person", "More"]

</script>

<template>
    <header>
        <div class="logoandmenu">
            <div class="logo"> TMDB-C</div>
            <nav>
                <h1 v-for="(item, index) in MenuItems" :key="index">{{ item }}</h1>

            </nav>
        </div>
        <div class="othermenus"><button>language</button><button>Theme</button>profie</div>
    </header>
</template>

<style scoped> header {
     display: flex;
     flex-direction: row;
     justify-content: space-between;
     align-items: center;
     background-color: #032541;
     color: white;
 }

 .logoandmenu {
     display: flex;
     flex-direction: row;
     justify-content: space-between;
     align-items: center;
     width: 500px;

 }

 .logo {
     font-size: x-large;
     margin-left: 50px;
 }



 nav h1 {
     font-size: larger;
     display: inline-flex;
     margin-left: 10px;
 }
</style>