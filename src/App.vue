<script setup>
  import NavigationBar from './components/NavigationBar.vue'
</script>

<template>
  <body>
    <navigation-bar class="navbar" />

    <router-view></router-view>
  </body>
</template>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');

  @media all and (max-width: 600px) {
    * {
      font-size: 10px;
    }
  }
  @media all and (min-width: 600px) {
    * {
      font-size: 12px;
    }
  }
  @media all and (min-width: 768px) {
    * {
      font-size: 14px;
    }
  }
  @media all and (min-width: 992px) {
    * {
      font-size: 16px;
    }
  }
  @media all and (min-width: 1200px) {
    * {
      font-size: 16px;
    }
  }

  a {
    text-decoration: none;
    color: black;
  }

  a:hover {
    text-decoration: underline;
  }

  * {
    font-family: 'Roboto', sans-serif;
    -webkit-tap-highlight-color: transparent;
  }

  body {
    padding: 0;
    margin: 0;
  }
</style>
