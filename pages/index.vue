<script setup>
import { onMounted } from "vue";
import { initFlowbite } from "flowbite";

// initialize components based on data attribute selectors
onMounted(() => {
  initFlowbite();
});

// import { useAuthStore } from "~/stores/useAuthStore";
// const auth = useAuthStore();

// const userData = ref({
//   email: "valdrin.nasufi@finnie.consulting",
//   password: "password",
// });

// const fetchWelcomeDevelopers = async () => {
//   const { data } = await useApiFetch("welcome_developers");

//   console.log("data", data.value);
// };

// fetchWelcomeDevelopers();

// const access_token = await auth.getAccessToken();

// console.log("access_token", access_token);

// const handleLogin = async () => {
//   //   const { error } = await auth.login(userData.value);
//   const request = await auth.login(userData.value);

//   //   console.log("error", error);
//   console.log("request", request);
// };

// handleLogin();
</script>
<template>
  <div class="max-w-screen-xl mx-auto my-12">
    <HomepageDummyContent />
  </div>
</template>
<style scoped></style>
