<script setup>
import {ref, reactive, markRaw, onMounted, onUnmounted} from 'vue';
import {Icon} from "@iconify/vue";
import Dialog from "./Dialog.vue";
import TweetNow from "./TweetNow.vue";
import CreateBot from "./CreateBot.vue";
import Embeds from "./Embeds.vue";
import TweetAPI from "../api/tweetAPI.js";

const GET_TWEETS_ERROR_MSG = 'An error occurred while getting your recent tweets. Try reloading the page.';
const POST_TWEET_ERROR_MSG = 'An error occurred while posting your tweet. Please try again later.';

const showExplanation1 = ref(false);
const showExplanation2 = ref(false);
const loading = ref(false);
const errorMsg = ref(null);
const currentDot = ref(1);

const embeds = reactive([]);

const dialogState = reactive({
  component: null,
  show: false,
});

function openDialog(component) {
  dialogState.show = true;
  dialogState.component = markRaw(component);
}

function reloadWidgets() {
  if (window.twttr && window.twttr.widgets) {
    window.twttr.widgets.load();
  }
}

async function getTweetsForUser() {
  await TweetAPI
      .getTweetsForUser()
      .then((returnedEmbeds) => {
        embeds.splice(0, embeds.length, ...returnedEmbeds);
      })
      .catch(() => {
        errorMsg.value = GET_TWEETS_ERROR_MSG;
      });
}

async function handleTweet(tweetText) {
  errorMsg.value = null;
  loading.value = true;
  try {
    const returnedEmbeds = await TweetAPI.postTweet(tweetText);
    embeds.splice(0, embeds.length, ...returnedEmbeds);
    reloadWidgets();
  } catch (error) {
    errorMsg.value = POST_TWEET_ERROR_MSG;
  } finally {
    loading.value = false;
  }
}

let dotInterval;
onMounted(async () => {
  await getTweetsForUser();
  reloadWidgets();

  dotInterval = setInterval(() => {
    currentDot.value = currentDot.value % 3 + 1;
  }, 400);
});

onUnmounted(() => {
  clearInterval(dotInterval);
});
</script>

<template>
  <p class="button-desc">Post a tweet or create a new Twitter bot.</p>
  <div v-if="!loading" class="button-container">
    <button
        @click="openDialog(TweetNow)"
        @mouseover="showExplanation1 = true"
        @mouseout="showExplanation1 = false"
    >
      <Icon class="icon" icon="eva:twitter-outline" width="110"/>
      <transition name="fade-slide-left">
        <div v-show="showExplanation1" class="modal left">
          <p>Post a tweet now</p>
        </div>
      </transition>
    </button>
    <button
        @click="openDialog(CreateBot)"
        @mouseover="showExplanation2 = true"
        @mouseout="showExplanation2 = false"
    >
      <Icon class="icon" icon="fluent:bot-add-20-filled" width="110"/>
      <transition name="fade-slide-right">
        <div v-show="showExplanation2" class="modal right">
          <p>Create a new Twitter bot</p>
        </div>
      </transition>
    </button>
  </div>
  <div v-else class="loading-container">
    <div class="spinner"></div>
    <div class="loading-text">
      <span>Generating and posting tweet, this might take some time</span>
      <span class="dot" v-for="i in 3" :key="i" :style="{ animationDelay: `${(i - 1) * 0.4}s` }">.</span>
    </div>
  </div>
  <p v-if="errorMsg !== null" class="error-text">{{ errorMsg }}</p>
  <Embeds :embeds="embeds"/>
  <Dialog
      :show="dialogState.show"
      :component="dialogState.component"
      @send-tweet="handleTweet"
      @update:show="dialogState.show = $event"
  />
</template>

<style lang="scss" scoped>
.button-desc {
  font-size: 2rem;
  font-weight: 300;
  margin-bottom: 2rem;
  text-align: center;
}

.button-container {
  display: flex;
  flex-direction: row;

  button:first-child {
    margin-right: 100px;
  }

  button {
    margin-top: 20px;
    background-color: #000000;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    position: relative;
    border-radius: 100%;
    color: #ffffff;
    border: none;
    padding: 8px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);

    &:hover {
      color: #26a7de;
      transform: scale(1.1);
      box-shadow: 0 0 50px rgba(0, 0, 0, 0.4);
    }

    .modal {
      position: absolute;
      background-color: #fff;
      border: 1px solid #ccc;
      padding: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      width: 200px;
      z-index: 1000;
      transition: all 0.2s ease-in-out;

      p {
        color: #26a7de;
        font-size: 1.3rem;
        font-weight: 600;
        margin: 0;
      }
    }

    .left {
      top: 50%;
      left: -220px;
      transform: translateY(-50%);
    }

    .right {
      top: 50%;
      right: -220px;
      transform: translateY(-50%);
    }
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .loading-text {
    margin-top: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;

    .dot {
      opacity: 0;
      animation: fade-in-out 1.2s infinite;

      &:nth-child(1) {
        animation-delay: 0s;
      }

      &:nth-child(2) {
        animation-delay: 0.4s;
      }

      &:nth-child(3) {
        animation-delay: 0.8s;
      }
    }
  }
}

@keyframes fade-in-out {
  0%, 100% {
    opacity: 0;
  }
  25%, 75% {
    opacity: 1;
  }
}

.fade-slide-left-enter-active,
.fade-slide-left-leave-active {
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
}

.fade-slide-left-enter-from,
.fade-slide-left-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-slide-right-enter-active,
.fade-slide-right-leave-active {
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
}

.fade-slide-right-enter-from,
.fade-slide-right-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@media (max-width: 688px) {
  .button-desc {
    font-size: 1.5rem;
  }

  .button-container {
    button {
      width: 100px;
      height: 100px;

      .modal {
        display: none;
      }

      .icon {
        width: 80px;
        height: 80px;
      }
    }
  }

  .loading-container {
    .loading-text {
      font-size: 1.2rem;
    }
  }
}
</style>