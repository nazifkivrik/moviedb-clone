<script setup>
const MenuItems = ["Movies", "TV Shows", "Person", "More"]
import appLink from './appLink.vue';
</script>

<template>
    <header>
        <div class="logoandmenu">

            <div class="logo">
                <appLink to="/">TMDB-C</appLink>
            </div>
            <nav>
                <h1 v-for="(item, index) in MenuItems" :key="index">{{ item }}</h1>

            </nav>
        </div>
        <div class="othermenus"><icon-lib icon="fa-solid fa-plus" size="lg" /><icon-lib
                icon="fa-solid fa-circle-half-stroke" size="lg" /><icon-lib icon="fa-solid fa-bell"
                size="lg" /><button>N</button>
        </div>
    </header>
</template>

<style scoped> header {
     display: flex;
     flex-direction: row;
     justify-content: space-between;
     align-items: center;
     background-color: #032541;
     color: white;
     min-width: 700px;
     max-width: 100%;
 }

 .logoandmenu {
     display: flex;
     flex-direction: row;
     justify-content: space-between;
     align-items: center;
     width: 500px;

 }

 .logo {
     font-size: large;
     font-weight: 600;
     margin-left: 50px;

 }

 .logo a {
     color: white;
     font-size: large;
     text-decoration: none;
 }


 nav h1 {

     display: inline-flex;
     font-size: large;
     margin-left: 10px;
 }

 .othermenus {
     display: flex;
     column-gap: 30px;
     margin-right: 30px;
     align-items: center;
     justify-content: center;

 }

 .othermenus button {
     background-color: lightblue;
     color: white;
     width: 35px;
     height: 35px;
     border-radius: 50%;
 }
</style>