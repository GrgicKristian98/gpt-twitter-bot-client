<script setup>
import {RouterView} from 'vue-router';
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <Header/>
  <RouterView/>
  <Footer/>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@100;200;300;400;500&display=swap');

:root {
  /* Fonts */
  --font-babas-neue: 'Bebas Neue', sans-serif;
  --font-montserrat: 'Montserrat', sans-serif;

  /* Colors */

  /* Text colors */

  /* Other colors */

  /* Spacing */
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  font-family: var(--font-montserrat);

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-babas-neue);
  }
}
</style>
