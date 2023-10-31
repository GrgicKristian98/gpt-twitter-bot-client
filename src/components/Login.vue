<script setup>
import {onMounted, reactive, ref} from "vue";
import UserAPI from "../api/userAPI.js";
import {Icon} from "@iconify/vue";
import Embeds from "./Embeds.vue";
import TweetAPI from "../api/tweetAPI.js";

const GET_TWEETS_ERROR_MSG = 'An error occurred while getting the recent tweets. Try reloading the page.';
const DEFAULT_ERROR_MSG = 'An error occurred while logging in. Please try again later.';

const props = defineProps({
  errorMsg: {
    required: false,
    default: null,
  },
});

const loading = ref(false);
const errorMsg = ref(null);

const embeds = reactive([]);

if (props.errorMsg) {
  errorMsg.value = props.errorMsg;
}

const handleLogin = () => {
  loading.value = true;
  getTwitterLoginUrl().then(url => {
    window.location.href = url;
  }).catch(() => {
    errorMsg.value = DEFAULT_ERROR_MSG;
  }).finally(() => {
    loading.value = false;
  });
};

function reloadWidgets() {
  if (window.twttr && window.twttr.widgets) {
    window.twttr.widgets.load();
  }
}

async function getTwitterLoginUrl() {
  return await UserAPI.getTwitterLoginUrl();
}

async function getTweets() {
  await TweetAPI
      .getTweets()
      .then((returnedEmbeds) => {
        embeds.splice(0, embeds.length, ...returnedEmbeds);
      })
      .catch(() => {
        errorMsg.value = GET_TWEETS_ERROR_MSG;
      });
}

onMounted(async () => {
  await getTweets();
  reloadWidgets();
});
</script>

<template>
  <p class="login-text">Log in using your <span class="twitter-text">Twitter</span> account.</p>
  <button v-if="!loading" @click="handleLogin">
    <Icon class="icon" icon="material-symbols:login" width="110"/>
  </button>
  <div v-else class="spinner"></div>
  <p v-if="errorMsg !== null" class="error-text">{{ errorMsg }}</p>
  <Embeds :embeds="embeds"/>
</template>

<style lang="scss" scoped>
.login-text {
  font-size: 2rem;
  font-weight: 300;
  margin-bottom: 2rem;
  text-align: center;
}

.twitter-text {
  color: #26a7de;
  font-weight: 600;
}

button {
  background-color: #000000;
  cursor: pointer;
  border-radius: 100%;
  padding: 12px;
  color: #ffffff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  transition: all 0.2s ease-in-out;
  border: none;

  &:hover {
    color: #26a7de;
    transform: scale(1.1);
    box-shadow: 0 0 50px rgba(0, 0, 0, 0.4);
  }
}

@media (max-width: 688px) {
  .login-text {
    font-size: 1.5rem;
  }

  button {
    width: 100px;
    height: 100px;

    .icon {
      width: 70px;
      height: 70px;
    }
  }
}
</style>