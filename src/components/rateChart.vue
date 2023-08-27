<script setup>
import { computed } from "vue"
const props = defineProps(['popularity'])


const CircleColor = computed(() => {
    if (props.popularity >= 70) { return "#21d07a" }
    else if (75 > props.popularity && props.popularity >= 50) { return "Yellow" }
    else return "Red"
})

const progressCircle = computed(() => {
    return `conic-gradient(${CircleColor.value} ${props.popularity * 3.6}deg, gray 0deg)`
})



</script>

<template>
    <div class="rateChart">
        <div class="circularRate" :style="{ 'background': progressCircle }">
            <span class="rateValue">{{ props.popularity }} <span class="percentage">%</span></span>
        </div>
    </div>
</template>

<style scoped>
.rateChart {
    display: inline-flex;
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background: white;
    flex-direction: column;
    align-items: center;

}

.circularRate {
    position: relative;
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background: conic-gradient(#21d07a 3.6deg, #ededed 0deg);
    display: flex;
    align-items: center;
    justify-content: center;
}

.circularRate::before {
    content: '';
    position: absolute;
    height: 80%;
    width: 80%;
    border-radius: 50%;
    background-color: black;
}

.rateValue {
    position: relative;
    color: white;
    font-size: 15px;
    display: flex;
}

.percentage {
    font-size: 7px;
    margin-top: 3px;
}
</style>