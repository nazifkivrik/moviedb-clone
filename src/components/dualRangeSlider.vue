<script setup>
  import { ref, onMounted, toRefs } from 'vue'
  const emits = defineEmits(['valArray'])
  const sliderOne = ref()
  const sliderTwo = ref()
  const display1 = ref()
  const display2 = ref()
  const sliderTrack = ref()
  const props = defineProps(['min', 'max', 'step'])
  const { min, max } = toRefs(props)
  let minGap = 0
  function slideOne() {
    if (parseInt(sliderTwo.value.value) - parseInt(sliderOne.value.value) <= minGap) {
      sliderOne.value.value = parseInt(sliderTwo.value.value) - minGap
    }
    fillColor()
    emits('valArray', { min: sliderOne.value.value, max: sliderTwo.value.value })
  }
  function slideTwo() {
    if (parseInt(sliderTwo.value.value) - parseInt(sliderOne.value.value) <= minGap) {
      sliderTwo.value.value = parseInt(sliderOne.value.value) + minGap
    }

    fillColor()
    emits('valArray', { min: sliderOne.value.value, max: sliderTwo.value.value })
  }
  function fillColor() {
    let percent1 = (sliderOne.value.value / max.value) * 100
    let percent2 = (sliderTwo.value.value / max.value) * 100

    sliderTrack.value.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`
  }
  onMounted(() => {
    fillColor()
  })
</script>

<template>
  <div class="wrapper">
    <div class="values">
      <span ref="display1"> {{ min }} </span>
      <span> {{ (max - min) / 2 }} </span>
      <span ref="display2"> {{ max }} </span>
    </div>
    <div class="container">
      <div class="slider-track" ref="sliderTrack"></div>
      <input
        type="range"
        :min="min"
        :max="max"
        :value="min"
        :step="step"
        id="slider-1"
        @input="slideOne($event)"
        ref="sliderOne" />
      <input
        type="range"
        :min="min"
        :max="max"
        :value="max"
        step="step"
        id="slider-2"
        @input="slideTwo()"
        ref="sliderTwo" />
    </div>
  </div>
</template>

<style scoped>
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  .wrapper {
    position: relative;
    height: 50px;
    width: 100%;
    background-color: #ffffff;
  }
  .container {
    position: relative;
    width: 100%;
  }
  input[type='range'] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 100%;
    outline: none;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    background-color: transparent;
    pointer-events: none;
  }
  .slider-track {
    width: 100%;
    height: 5px;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    border-radius: 5px;
  }
  input[type='range']::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    height: 5px;
  }
  input[type='range']::-moz-range-track {
    -moz-appearance: none;
    height: 5px;
  }
  input[type='range']::-ms-track {
    appearance: none;
    height: 5px;
  }
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 1em;
    width: 1em;
    background-color: #3264fe;
    cursor: pointer;
    margin-top: -0.4em;
    pointer-events: auto;
    border-radius: 50%;
  }
  input[type='range']::-moz-range-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 1.7em;
    width: 1.7em;
    cursor: pointer;
    border-radius: 50%;
    background-color: #3264fe;
    pointer-events: auto;
  }
  input[type='range']::-ms-thumb {
    appearance: none;
    height: 1.7em;
    width: 1.7em;
    cursor: pointer;
    border-radius: 50%;
    background-color: #3264fe;
    pointer-events: auto;
  }
  input[type='range']:active::-webkit-slider-thumb {
    background-color: #ffffff;
    border: 3px solid #3264fe;
  }
  .values {
    display: flex;
    justify-content: space-between;
    position: relative;
    top: 30px;
  }
  /* .values {
    background-color: #3264fe;
    width: 32%;
    position: relative;
    margin: auto;
    padding: 10px 0;
    border-radius: 5px;
    text-align: center;
    font-weight: 500;
    font-size: 25px;
    color: #ffffff;
  } */
  /* .values:before {
    content: '';
    position: absolute;
    height: 0;
    width: 0;
    border-top: 15px solid #3264fe;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    margin: auto;
    bottom: -14px;
    left: 0;
    right: 0;
  } */
</style>
