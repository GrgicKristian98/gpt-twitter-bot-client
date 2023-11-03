<script setup>
import {Icon} from '@iconify/vue';

const props = defineProps({
  show: {
    required: false,
    default: false,
  },
  component: {
    required: false,
    default: null,
  },
});

const emit = defineEmits(['send-tweet', 'update:show']);

function closeDialog(event) {
  if (event.target === event.currentTarget) {
    emitUpdateShowFalse();
  }
}

function emitUpdateShowFalse() {
  emit('update:show', false);
}

function forwardTweet(event) {
  emit('send-tweet', event);
}
</script>

<template>
  <div
      v-if="props.show"
      class="dialog-overlay"
      @click="closeDialog"
  >
    <div class="dialog">
      <button class="close-button" @click="emitUpdateShowFalse">
        <Icon icon="pajamas:close" class="close-icon" width="40"/>
      </button>
      <component
          :is="props.component"
          @send-tweet="forwardTweet"
          @update:show="emitUpdateShowFalse"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(6px);
  z-index: 1000;
}

.dialog {
  position: relative;
  background: #fff;
  padding: 0;
  border-radius: 8px;
  max-width: 90%;

  .close-button {
    .close-icon {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }
  }
}
</style>