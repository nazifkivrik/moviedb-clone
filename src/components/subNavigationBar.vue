<script setup>

import appLink from './appLink.vue';




</script>


<template>
    <div class="subNav">
        <ul class="Menus">
            <li class="header overview"><span>Overview</span>
                <div class="container">
                    <ul>
                        <li><app-link :to="`/${$route.params.type}/${$route.params.id}`">Main</app-link></li>
                        <li><app-link :to="`/${$route.params.type}/${$route.params.id}/titles`">Alternative
                                Titles</app-link></li>
                        <li><app-link :to="`/${$route.params.type}/${$route.params.id}/cast`">Cast&Crew</app-link></li>
                        <li v-if="$route.params.type === 'tv'">Episode Groups</li>
                        <li v-if="$route.params.type === 'tv'">Seasons</li>
                        <li v-if="$route.params.type === 'movie'"><app-link
                                :to="`/${$route.params.type}/${$route.params.id}/release_dates`">Release Dates</app-link>
                        </li>
                        <li><app-link
                                :to="`/${$route.params.type}/${$route.params.id}/translations`">Translations</app-link></li>
                        <li> </li>
                        <li>Changes</li>
                        <li>Report</li>
                        <li>Edit</li>
                    </ul>
                </div>
            </li>
            <li class="header media"><span>Media</span>
                <div class="container">
                    <ul>
                        <li><app-link
                                :to="`/${$route.params.type}/${$route.params.id}/images/backdrops`">Backdrops</app-link>
                        </li>
                        <li>Logos</li>
                        <li>Posters</li>
                        <li>Videos</li>
                    </ul>
                </div>
            </li>

            <li class="header fandom"><span>Fandom</span>
                <div class="container">
                    <ul>
                        <li>Discussions</li>
                        <li>Reviews</li>
                    </ul>
                </div>
            </li>
            <li class="header share"><span>Share</span>
                <div class="container">
                    <ul>
                        <li>Share Link</li>
                        <li>Facebook</li>
                        <li>Twitter</li>
                    </ul>
                </div>
            </li>
        </ul>

    </div>
</template>


<style scoped>
.subNav {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

}

ul {
    list-style: none;
    padding-inline-start: 0;
    cursor: pointer;
}

.header {
    overflow: hidden;
    height: 20px;
    width: 100px;
    display: flex;
    flex-direction: column;


}

.overview {
    position: relative;
    z-index: 70;

}

.media {
    position: relative;
    z-index: 80;
}

.fandom {
    position: relative;
    z-index: 90;
}

.share {
    position: relative;
    z-index: 95;
}

.header:hover {
    overflow: visible;
}




.Menus .container li:hover {
    text-decoration: underline;
}

.Menus .container li {
    padding-top: 5px;


}

.container {
    background-color: white;
    border-radius: 5px;
    padding: 15px;
    width: 142px;
}

.container ul li {
    margin-left: 15px;
}


.Menus {
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: 20px;
    column-gap: 10px;
    width: max-content;
}





span {
    font-size: larger;
}

span:hover {
    text-decoration: underline;
}
</style>