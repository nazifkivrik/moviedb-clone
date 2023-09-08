<script setup>
  import { ref, toRefs } from 'vue'

  const props = defineProps(['buttonNames'])
  const { buttonNames } = toRefs(props)

  const whichOneSelected = ref(0)
  const emits = defineEmits(['whichOne'])
  function buttonClick(index) {
    emits('whichOne', index)
    whichOneSelected.value = index
  }
</script>

<template>
  <div class="buttonGroup">
    <input
      type="button"
      :value="buttonName"
      class="eachButton"
      v-for="(buttonName, index) in buttonNames"
      :key="index"
      @click="buttonClick(index)"
      :class="[whichOneSelected === index ? 'clickedButton' : '']" />
  </div>
</template>

<style scoped>
  .buttonGroup {
    display: flex;
    margin-left: 25px;
  }

  .eachButton {
    height: 2.3em;
    border-right: none;
    border-left: none;
    border-width: 0.5px;
    background-color: white;
    cursor: pointer;
  }

  .eachButton:first-child {
    border-left: solid;
    border-bottom-left-radius: 1.15em;
    border-top-left-radius: 1.15em;
  }

  .eachButton:last-child {
    border-right: solid;
    border-bottom-right-radius: 1.15em;
    border-top-right-radius: 1.15em;
  }

  .clickedButton {
    background-color: #032541;
    color: #1bd2af;
  }
</style>
