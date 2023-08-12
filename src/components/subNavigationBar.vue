<script setup>
const props = defineProps({ 'type': String })
const mediaType = checkType()
function checkType() {
    if (props.type === 'MovieView') { return false }
    else return true
}

</script>


<template>
    <div class="subNav"></div>
    <ul class="Menus">
        <li class="header"><span>Overview</span>
            <div class="container">
                <ul>
                    <li>Main</li>
                    <li>Alternative Titles</li>
                    <li>Cast&Crew</li>
                    <li v-if="mediaType">Episode Groups</li>
                    <li v-if="mediaType">Seasons</li>
                    <li v-if="mediaType">Release Dates</li>
                    <li>Translations</li>
                    <li> </li>
                    <li>Changes</li>
                    <li>Report</li>
                    <li>Edit</li>
                </ul>
            </div>
        </li>
        <li class="header"><span>Media</span>
            <div class="container">
                <ul class="media">
                    <li>Backdrops</li>
                    <li>Logos</li>
                    <li>Posters</li>
                    <li>Videos</li>
                </ul>
            </div>
        </li>

        <li class="header"><span>Fandom</span>
            <div class="container">
                <ul class="fandom">
                    <li>Discussions</li>
                    <li>Reviews</li>
                </ul>
            </div>
        </li>
        <li class="header"><span>Share</span>
            <div class="container">
                <ul class="share">
                    <li>Share Link</li>
                    <li>Facebook</li>
                    <li>Twitter</li>
                </ul>
            </div>
        </li>
    </ul>
</template>


<style scoped>
ul {
    list-style: none;
    padding-inline-start: 0;
    cursor: pointer;
}

.header {
    overflow: hidden;
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


.Menus {
    display: flex;
    flex-direction: row;
    justify-content: center;
    column-gap: 60px;
    height: 20px;
}




span {
    font-size: larger;
}

span:hover {
    text-decoration: underline;
}
</style>