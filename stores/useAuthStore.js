import { defineStore } from "pinia";
import { useApiFetch } from "~/composables/useApiFetch";

export const useAuthStore = defineStore("auth", () => {
  const user = ref({});
  const loggedIn = ref(false);
  const access_token = ref();

  // access_token.value = window.localStorage.getItem('access_token');

  // console.log(access_token);

  if (process.client) {
    access_token.value = window.localStorage.getItem("access_token");
  }

  async function fetchUser() {
    const { data, error } = await useApiFetch("auth/user-profile");

    user.value = data.value;
    loggedIn.value = data.value ? true : false;
  }
  async function getUser() {
    const response = await useApiFetch("auth/user-profile");
    // user.value = data.value;

    return response;
  }

  async function login(credentials) {
    const login = await useApiFetch("auth/login", {
      method: "POST",
      body: credentials,
    });

    if (login.status.value === "success") {
      // first we set the login token to the local storage
      access_token.value = login.data.value.access_token;
      window.localStorage.setItem("access_token", access_token.value);

      // then we call the fetch user
      await fetchUser();
    }

    // console.log(request.data.value);

    return login;
  }

  async function getAccessToken() {
    return access_token.value;
  }

  return {
    user,
    login,
    access_token,
    loggedIn,
    getAccessToken,
    fetchUser,
    getUser,
  };
});
