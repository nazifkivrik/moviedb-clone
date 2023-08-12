<script setup>
import { toRefs, onMounted, ref, computed } from "vue"
import buttonGroup from './buttonGroup.vue';
import carosuel from "./carosuelComp.vue"
const props = defineProps({ 'buttonNames': Array, 'header': String, 'list': Object })
const { buttonNames, header, list } = toRefs(props)
const listIndex = ref(buttonNames.value[0])
onMounted(() => {

    console.log()

})
const carosuelArray = computed(() => {
    return list.value[listIndex.value]
})
</script>


<template>
    <div class="ribbon">
        <div class="innerRibbon">
            <div class="header">
                <h1>{{ header }}</h1>
                <buttonGroup :button-names="buttonNames" @which-one="(value) => listIndex = value" class="buttonGroup" />
            </div>


            <div class="carosuel">
                <carosuel :carosuelArray="carosuelArray" v-if="carosuelArray !== null && carosuelArray !== undefined" />
            </div>

        </div>





    </div>
</template>



<style scoped>
.ribbon {
    display: flex;
    justify-content: center;
    width: 100%;
}

.innerRibbon {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 85vw;
}


.header {
    display: block;
    width: 100%;
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;
    height: 50px;
}

.header h1 {
    margin: 0;
    margin-left: 15px;
    display: inline-block;
}

.buttonGroup {
    display: inline-block;
}




.carosuel {
    height: 350px;
    width: 1000px;
    display: inline-flex;
    overflow-x: scroll;
    overflow-y: hidden;
}
</style>