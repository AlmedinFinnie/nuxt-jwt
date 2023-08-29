<script setup>
import { useAuthStore } from "~/stores/useAuthStore";
const auth = useAuthStore();

definePageMeta({
  middleware: ["auth-guard"],
});

async function fetchProfileData() {
  if (process.client) {
    const { data, error } = await auth.getUser();

    if (data.value) {
      console.log("data", data.value);
    } else {
      console.log("error", error.value);
    }
    // const req = await auth.getUser();

    // console.log("req", req);
  }
}
</script>
<template>
  <div @click="fetchProfileData" class="max-w-screen-xl mx-auto p-4">
    Fetch data
  </div>
</template>
<style scoped></style>
