<template>
  <body>
    <router-view></router-view>
  </body>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');

a {
  text-decoration: none;
  color: black;
}

a:hover {
  text-decoration: underline;
}

* {
  font-size: 16px;
  font-family: 'Roboto', sans-serif;
}

body {
  width: 100%;
  padding: 0;
  margin: 0;
}
</style>