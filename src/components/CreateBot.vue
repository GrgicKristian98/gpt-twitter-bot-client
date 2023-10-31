<script setup>
import {onMounted, reactive, ref} from 'vue';
import {Icon} from "@iconify/vue";
import ExecutionAPI from "../api/executionAPI.js";

const MAX_AMOUNT_OF_EXECUTIONS = 4;

const SAVE_EXECUTION_ERROR_MSG = 'An error occurred while creating a new Twitter bot. Please try again later.';
const UPDATE_EXECUTION_ERROR_MSG = 'An error occurred while updating your Twitter bot. Please try again later.';
const DELETE_EXECUTION_ERROR_MSG = 'An error occurred while deleting your Twitter bot. Please try again later.';
const GET_EXECUTIONS_ERROR_MSG = 'An error occurred while retrieving existing bots. Please try again later.';

const MAX_AMOUNT_OF_EXECUTIONS_ERROR_MSG = 'You can only create a maximum of 4 Twitter bots.';
const EMPTY_FIELD_ERROR_MSG = 'Please fill out all fields before saving the bot.';

const errorMsg = ref(null);

const items = reactive([]);

const addItem = () => {
  errorMsg.value = null;

  if (items.length >= MAX_AMOUNT_OF_EXECUTIONS) {
    errorMsg.value = MAX_AMOUNT_OF_EXECUTIONS_ERROR_MSG;
    return;
  }

  items.push({
    id: null,
    topic: '',
    executionTime: '',
    enabled: true,
    saved: false,
  });
};

const removeItem = (index) => {
  errorMsg.value = null;

  if (items[index].id !== null) {
    deleteExecution(index);
  } else {
    items.splice(index, 1);
  }
};

const toggleBotSaved = (index) => {
  items[index].saved = false;
};

const toggleBotEnabled = (index) => {
  items[index].enabled = !items[index].enabled;
};

const saveItem = (index) => {
  errorMsg.value = null;

  if (!checkExecution(items[index])) {
    errorMsg.value = EMPTY_FIELD_ERROR_MSG;
    return;
  }

  if (items[index].id === null) {
    createNewExecution(index);
  } else {
    updateExecution(index);
  }
}

function removeSecondsFromTime(time) {
  if (time.length === 5) {
    return time;
  }
  return time.substring(0, time.length - 3);
}

function checkExecution(execution) {
  return !(execution.executionTime === null
      || execution.executionTime === ''
      || execution.topic === null
      || execution.topic === '');
}

async function createNewExecution(index) {
  await ExecutionAPI.saveExecution({
    topic: items[index].topic,
    executionTime: items[index].executionTime,
    enabled: items[index].enabled,
  }).then((newExecution) => {
    items[index].id = newExecution.id;
    items[index].saved = true;
    errorMsg.value = null;
  }).catch(() => {
    errorMsg.value = SAVE_EXECUTION_ERROR_MSG;
  });
}

async function updateExecution(index) {
  await ExecutionAPI.updateExecution({
    id: items[index].id,
    topic: items[index].topic,
    executionTime: removeSecondsFromTime(items[index].executionTime),
    enabled: items[index].enabled,
  }).then(() => {
    items[index].saved = true;
    errorMsg.value = null;
  }).catch(() => {
    errorMsg.value = UPDATE_EXECUTION_ERROR_MSG;
  });
}

async function deleteExecution(index) {
  await ExecutionAPI
      .deleteExecution(items[index].id).then((result) => {
        console.log("result: " + result);
        if (result === true || result === 'true') {
          items.splice(index, 1);
          errorMsg.value = null;
        } else {
          errorMsg.value = DELETE_EXECUTION_ERROR_MSG;
        }
      }).catch(() => {
        errorMsg.value = DELETE_EXECUTION_ERROR_MSG;
      });
}

async function getExecutions() {
  await ExecutionAPI
      .getExecutionsForUser().then((returnedExecutions) => {
        returnedExecutions.forEach((execution) => {
          items.push({
            id: execution.id,
            topic: execution.topic,
            executionTime: removeSecondsFromTime(execution.executionTime),
            enabled: execution.enabled,
            saved: true,
          });
        });
      }).catch(() => {
        errorMsg.value = GET_EXECUTIONS_ERROR_MSG;
      });
}

onMounted(async () => {
  await getExecutions();
});
</script>

<template>
  <div class="dialog-content">
    <h1>Create or update a Twitter bot</h1>
    <button @click="addItem" class="add-btn">
      <Icon class="robot-icon" icon="octicon:dependabot-16" width="90"/>
      <Icon class="add-icon" icon="fluent:add-12-filled" width="40"/>
    </button>
    <p v-if="errorMsg !== null" class="error-text">{{ errorMsg }}</p>
    <transition-group name="list" tag="ul">
      <li v-for="(item, index) in items" :key="index" class="list-item">
        <button @click="toggleBotEnabled(index)" :disabled="item.saved">
          <Icon class="icon" :icon="item.enabled ? 'mdi:robot' : 'mdi:robot-dead'" width="50"/>
        </button>
        <input class="topic-input" v-model="item.topic" :disabled="item.saved" placeholder="Add a topic..."/>
        <input class="time-input" v-model="item.executionTime" type="time" :disabled="item.saved"/>
        <button @click="saveItem(index)" v-if="!item.saved">
          <Icon class="icon" icon="material-symbols:save" width="50"/>
        </button>
        <button @click="toggleBotSaved(index)" v-if="item.saved">
          <Icon class="icon" icon="material-symbols:edit" width="50"/>
        </button>
        <button @click="removeItem(index)">
          <Icon class="icon" icon="material-symbols:delete" width="50"/>
        </button>
      </li>
    </transition-group>
  </div>
</template>

<style lang="scss" scoped>
.dialog-content {
  display: flex;
  flex-direction: column;
  padding: 20px;
  align-items: center;
  margin: auto;
  border-radius: 8px;

  h1 {
    font-size: 3em;
    margin-bottom: 20px;
    text-align: center;
  }

  .add-btn {
    position: relative;
    padding: 10px 20px;
    border: none;
    background-color: transparent;
    color: #000000;
    cursor: pointer;
    font-size: 1em;
    transition: all 0.2s ease-in-out;

    .add-icon {
      position: absolute;
      top: 10px;
      right: -10px;
    }

    &:hover {
      color: #26a7de;
      transform: scale(1.1);
    }
  }

  .error-text {
    margin-bottom: 30px;
  }

  ul {
    width: 100%;
    padding: 0;
  }

  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fcfcfc;
    padding: 10px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    border-radius: 10px;

    input {
      border: 1px solid #BBBBBB;
      border-radius: 10px;
      outline: none;
      height: 60px;
      padding: 10px;
      font-size: 1.3em;
      transition: all 0.2s ease-in-out;
      margin-right: 10px;

      &:focus {
        border: 1px solid #474747;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
      }

      &::placeholder {
        color: #696969;
      }

      &:disabled {
        background-color: #e0e0e0;
        border: 1px solid #999999;
        color: #777777;
      }
    }

    button {
      padding: 10px;
      background-color: transparent;
      border: none;
      cursor: pointer;
      transition: color 0.2s ease-in-out;

      &:first-child {
        margin-right: 10px;

        &:disabled {
          cursor: default;

          svg {
            color: #777777;
          }
        }
      }

      &:hover {
        color: #26a7de;
      }
    }
  }

  .list-enter-active, .list-leave-active {
    transition: all 0.3s ease;
  }

  .list-enter-from, .list-leave-to {
    opacity: 0;
    transform: translateY(-30px);
  }
}

@media (max-width: 840px) {
  .dialog-content {
    .list-item {
      .topic-input {
        width: 30%;
      }
    }
  }
}

@media (max-width: 640px) {
  .dialog-content {
    h1 {
      font-size: 2.5em;
    }

    .add-btn {
      .robot-icon {
        width: 80px;
        height: 80px;
      }

      .add-icon {
        width: 35px;
        height: 35px;
        top: 5px;
        right: -5px;
      }
    }
  }
}

@media (max-width: 500px) {
  .dialog-content {
    h1 {
      font-size: 2em;
    }

    .add-btn {
      .robot-icon {
        width: 60px;
        height: 60px;
      }

      .add-icon {
        width: 25px;
        height: 25px;
        top: 5px;
        right: -5px;
      }
    }

    .list-item {
      input {
        font-size: 1em;
        height: auto;
      }

      button {
        padding: 0;

        .icon {
          width: 35px;
          height: 35px;
        }
      }
    }
  }
}
</style>
