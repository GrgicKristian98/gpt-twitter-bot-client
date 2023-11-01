<script setup>
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import UserAPI from "../api/userAPI.js";
import Login from "../components/Login.vue";
import Main from "../components/Main.vue";

const EXPIRED_SESSION_MSG = 'Your session has expired. Please log in again.';
const GENERAL_ERROR_MSG = 'An error occurred while logging in. Please try again later.';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const tokenValid = ref(false);
const errorMsg = ref(null);

const storedToken = localStorage.getItem('token');

const codeParam = route.query.code;
const stateParam = route.query.state;

function validateUser(token) {
  UserAPI
      .validateUser(token)
      .then(() => {
        tokenValid.value = true;
      })
      .catch((error) => {
        throw error;
      });
}

function executeTwitterLogin(code, state) {
  return UserAPI.executeTwitterLogin(code, state);
}

async function initialize() {
  try {
    if (storedToken) {
      await validateUser(storedToken);
    }

    if (codeParam && stateParam && !tokenValid.value) {
      const token = await executeTwitterLogin(codeParam, stateParam);
      localStorage.setItem('token', token);
      tokenValid.value = true;

      await router.replace({
        name: route.name,
        query: {},
      });
    }
  } catch (error) {
    errorMsg.value = (error.status === 401) ? EXPIRED_SESSION_MSG : GENERAL_ERROR_MSG;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  initialize();
});
</script>

<template>
  <main>
    <div v-if="loading && !tokenValid" class="spinner"></div>
    <Login v-else-if="!loading && !tokenValid" :errorMsg="errorMsg"/>
    <Main v-else/>
  </main>
</template>

<style lang="scss">
main {
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto 20px auto;
  align-items: center;

  .spinner {
    border: 8px solid #f3f3f3;
    border-top: 8px solid #26a7de;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    animation: spin 0.3s linear infinite;
  }

  .error-text {
    color: #C10000;
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    text-align: center;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}

@media (max-width: 688px) {
  main {
    .error-text {
      font-size: 1.2rem;
    }
  }
}
</style>