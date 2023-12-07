<script setup>
  import { toRefs, ref, onMounted } from 'vue'
  const props = defineProps({
    dropdownArr: { type: Array, required: true },
    defaultVal: { type: [String, Object, Array], required: true },
    objectKey: { type: String, required: false }
  })
  const { dropdownArr, defaultVal, objectKey } = toRefs(props)
  const emits = defineEmits(['selectedVal'])
  const selected = ref()
  const searchString = ref('')
  const collapse = ref(false)
  function setSelected(item) {
    selected.value = item
    emits('selectedVal', item)
    collapse.value = !collapse.value
  }
  onMounted(() => {
    selected.value = defaultVal.value
  })
</script>

<template>
  <template v-if="objectKey">
    <template v-if="dropdownArr && selected">
      <div class="dropdown" v-click-outside="() => (collapse = false)">
        <div class="select-btn" @click="collapse = !collapse">
          <span>{{ selected[objectKey] }}</span>
          <span><icon-lib icon="fa-caret-down" /></span>
        </div>

        <div class="content" v-if="collapse">
          <div class="search">
            <input type="text" v-model="searchString" placeholder="Search" />
            <icon-lib icon="fa-solid fa-magnifying-glass"></icon-lib>
          </div>
          <ul class="options">
            <li v-for="item in dropdownArr" :key="item" @click="setSelected(item)">
              {{ item[objectKey] }}
            </li>
          </ul>
        </div>
      </div>
    </template>
  </template>
  <template v-else>
    <div class="dropdown" v-click-outside="() => (collapse = false)">
      <div class="select-btn" @click="collapse = !collapse">
        <span>{{ selected }}</span>
        <span><icon-lib icon="fa-caret-down" /></span>
      </div>

      <div class="content" v-if="collapse">
        <div class="search">
          <input type="text" v-model="searchString" placeholder="Search" />
          <icon-lib icon="fa-solid fa-magnifying-glass"></icon-lib>
        </div>
        <ul class="options">
          <li v-for="item in dropdownArr" :key="item" @click="setSelected(item)">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </template>

  <!-- <template v-else>
    <div class="dropdown collapse" v-click-outside="(e) => e.target.classList.add(collapse)">
      <h3 @click="(e) => e.target.parentElement.classList.toggle('collapse')">
        {{ selected[objectKey] }} <icon-lib icon="fa-caret-down" size="l" />
      </h3>
      <div class="content">
        <div class="search">
          <input type="text" v-model="searchString" />
          <icon-lib icon="fa-solid fa-magnifying-glass"></icon-lib>
        </div>
        <ul>
          <li v-for="item in dropdownArr" :key="item" @click="setSelected(item, $event)">
            {{ item[objectKey] }}
          </li>
        </ul>
      </div>
    </div>
  </template> -->
</template>

<style scoped lang="scss">
  .dropdown {
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: white;
    color: black;
    z-index: 750;
    .select-btn {
      background-color: white;
      color: black;
      padding: 3px 5px;
      cursor: pointer;
    }

    .content {
      display: flex;
      position: absolute;
      height: 140px;
      width: 160px;
      padding: 10px;
      background-color: white;
      top: 30px;
      left: -30px;
      justify-content: start;
      .search {
        position: absolute;
        display: flex;
        align-items: center;

        input {
          height: 1.3em;
          border-radius: 8px;
          outline: none;
          width: 140px;
        }
        svg {
          color: black;
          position: absolute;
          right: 5px;
          pointer-events: none;
        }
      }
      .options {
        position: absolute;
        top: 40px;
        width: max-content;
        z-index: 800;
        background-color: white;
        list-style: none;
        li {
          cursor: pointer;
        }
      }
    }
  }
</style>
