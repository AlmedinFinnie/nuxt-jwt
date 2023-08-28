<script setup>
import { useAuthStore } from "~/stores/useAuthStore";

const auth = useAuthStore();

async function fetchProfileData() {
  const { data, error } = await auth.getUser();

  if (data.value) {
    console.log("data", data.value);
  } else {
    console.log("error", error.value);
  }
}
</script>
<template>
  <div @click="fetchProfileData">Fetch data</div>
</template>
<style scoped></style>
