<script setup>
  import { toRefs } from 'vue'
  import buttonGroup from './buttonGroup.vue'
  import carosuel from './carosuelComp.vue'
  const props = defineProps({ buttonNames: Array, header: String, carosuelArray: Array })
  const { buttonNames, header, carosuelArray } = toRefs(props)

  const emits = defineEmits(['which-one-selected'])
</script>

<template>
  <div class="ribbon">
    <div class="innerRibbon">
      <div class="header">
        <h1>{{ header }}</h1>
        <buttonGroup
          :button-names="buttonNames"
          @which-one="(value) => emits('which-one-selected', value)"
          class="buttonGroup" />
      </div>

      <div class="carosuel">
        <carosuel :carosuelArray="carosuelArray" v-if="carosuelArray.length > 0" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .ribbon {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .innerRibbon {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: 100%;
  }
  .carosuel {
    width: 100%;
  }
  .header {
    display: inline-flex;
    flex-direction: row;
    width: max-content;
    margin-bottom: 1.7em;
    height: max-content;
  }

  .header h1 {
    margin: 0;
    margin-left: 15px;
    font-size: 1.7em;
    font-weight: 500;
  }
</style>
