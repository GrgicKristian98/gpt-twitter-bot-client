<script setup>

</script>

<template>
  <header>
    <h1>Create a Chat GPT <span class="twitter-text">Twitter</span> bot</h1>
  </header>
</template>

<style lang="scss" scoped>
header {
  display: flex;
  flex-direction: column;
  margin: 10px auto 10px auto;
  align-items: center;
  text-align: center;
  width: 100%;

  h1 {
    font-size: 5rem;
    font-weight: 500;
    cursor: default;
  }

  .twitter-text {
    color: #26a7de;
  }
}

@media (max-width: 688px) {
  header {
    h1 {
      font-size: 4rem;
    }
  }
}
</style>