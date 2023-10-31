<script setup>
import {onMounted, onUnmounted, ref} from 'vue';
import {Icon} from "@iconify/vue";

const NO_TOPIC_MSG = 'Please enter a topic.';
const SHORT_TOPIC_MSG = 'Please enter a longer topic.';
const LONG_TOPIC_MSG = 'Please enter a shorter topic.';

const inputText = ref('');
const errorMsg = ref(null);

const emit = defineEmits(['send-tweet', 'update:show']);

const sendTweet = () => {
  if (isInputTextValid()) {
    emit('send-tweet', inputText.value);
    emit('update:show');
  }
};

const setPlaceholderText = () => {
  const inputElement = document.querySelector('.dialog-content-row input');
  if (window.innerWidth <= 700) {
    inputElement.placeholder = 'Add a topic...';
  } else {
    inputElement.placeholder = 'Add a topic you want to tweet about...';
  }
};

function isInputTextValid() {
  if (!inputText || inputText.value.length === 0) {
    errorMsg.value = NO_TOPIC_MSG;
    return false;
  }

  if (inputText.value.length <= 2) {
    errorMsg.value = SHORT_TOPIC_MSG;
    return false;
  }

  if (inputText.value.length > 30) {
    errorMsg.value = LONG_TOPIC_MSG;
    return false;
  }

  return true;
}

onMounted(() => {
  window.addEventListener('resize', setPlaceholderText);
  setPlaceholderText();
});

onUnmounted(() => {
  window.removeEventListener('resize', setPlaceholderText);
});
</script>

<template>
  <div class="dialog-content">
    <h1>Post a tweet</h1>
    <div class="dialog-content-row">
      <input
          type="text"
          v-model="inputText"
          placeholder="Add a topic you want to tweet about..."
          @keyup.enter="sendTweet"
      />
      <button @click="sendTweet">
        <Icon icon="bxs:send" width="80"/>
      </button>
    </div>
    <p v-if="errorMsg !== null" class="error-text">{{ errorMsg }}</p>
  </div>
</template>

<style lang="scss" scoped>
.dialog-content {
  display: flex;
  flex-direction: column;
  padding: 20px;
  align-items: center;

  h1 {
    font-size: 3em;
    margin-bottom: 20px;
    text-align: center;
  }

  .dialog-content-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 20px;
    width: 100%;

    input {
      padding: 10px;
      border: 1px solid #BBBBBB;
      border-radius: 10px;
      outline: none;
      width: 500px;
      height: 75px;
      font-size: 1.5em;
      margin-right: 0;
      transition: all 0.2s ease-in-out;

      &:focus {
        border: 1px solid #474747;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
      }

      &::placeholder {
        color: #696969;
      }
    }

    button {
      border: none;
      background-color: transparent;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      position: relative;

      &:hover {
        color: #26a7de;
        border-radius: 10px;
        transform: scale(1.1);
      }
    }
  }
}

@media (max-width: 700px) {
  .dialog-content {
    .dialog-content-row {
      flex-direction: column;

      input {
        width: 100%;
      }
    }
  }
}
</style>