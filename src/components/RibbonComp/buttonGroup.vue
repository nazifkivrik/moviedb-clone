<script setup>
import { ref, toRefs } from "vue"

const props = defineProps(['buttonNames'])
const { buttonNames } = toRefs(props)

const whichOneSelected = ref(buttonNames.value[0])
const emits = defineEmits(['whichOne'])
function buttonClick(event) {
    emits('whichOne', event.target.value)
    whichOneSelected.value = event.target.value


}

</script>

<template>
    <div class="buttonGroup">
        <input type="button" :value="buttonName" class="eachButton" v-for="(buttonName, index) in props.buttonNames"
            :key="index" @click="buttonClick" :class="[(whichOneSelected === buttonName) ? 'clickedButton' : '']">
    </div>
</template>

<style scoped>
.buttonGroup {
    display: flex;
    margin-left: 25px;
}

.eachButton {
    height: 35px;
    border-right: none;
    border-left: none;
    border-width: .5px;
    background-color: white;
    cursor: pointer;
    ;

}

.eachButton:first-child {
    border-left: solid;
    border-bottom-left-radius: 17.5px;
    border-top-left-radius: 17.5px;
}

.eachButton:last-child {
    border-right: solid;
    border-bottom-right-radius: 17.5px;
    border-top-right-radius: 17.5px;
}

.clickedButton {
    background-color: #032541;
    color: #1bd2af
}
</style>

