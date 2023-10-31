<script setup>
import {onMounted} from "vue";

const props = defineProps({
  embeds: {
    required: true,
    default: [],
  },
});

async function loadTwitterWidgets() {
  return new Promise((resolve) => {
    const scriptId = 'twitter-wjs';

    if (document.getElementById(scriptId)) {
      resolve();
    } else {
      const script = document.createElement('script');

      script.id = scriptId;
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      script.onload = () => {
        resolve();
      };

      document.head.appendChild(script);
    }
  });
}

onMounted(() => {
  loadTwitterWidgets();
});
</script>

<template>
  <div v-if="props.embeds.length === 0" class="placeholder">
    No tweets posted yet
  </div>
  <div v-else class="embed-container">
    <div v-for="(embed, index) in props.embeds" :key="index" v-html="embed"></div>
  </div>
</template>

<style lang="scss" scoped>
.embed-container {
  width: auto;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-top: 2.5rem;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 20px;
  padding: 10px;
}

.placeholder {
  width: 100%;
  height: 321px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 20px;
  font-size: 1.5rem;
  color: #555;
  margin-top: 2.5rem;
}

@media (max-width: 1150px) {
  .embed-container {
    flex-direction: column;
  }
}

@media (max-width: 688px) {
  .embed-container {
    flex-direction: column;
    gap: 1vw;
    padding: 1vw;
  }

  .embed-container > div {
    width: 80vw;
    max-width: 100%;
  }

  .placeholder {
    height: 20vh;
    font-size: 3vw;
  }
}

@media (max-width: 372px) {
  .embed-container > div {
    width: 100%;
  }
}
</style>