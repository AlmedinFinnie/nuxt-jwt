import { useAuthStore } from "~/stores/useAuthStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore();
  console.log("to", to);
  console.log("from", from);
  let loggedIn: boolean = false;

  //   console.log(await auth.loggedIn);
  loggedIn = auth.loggedIn;
  if (process.client) {
    let token: string | null = localStorage.getItem("access_token");
    console.log("token yep", token);
  }
  if (!loggedIn) {
    if (process.client) {
      const { data, error }: any = await auth.getUser();
      if (data.value) {
        console.log("req", data.value);
        auth.user = data.value;
        auth.loggedIn = true;
        auth.access_token = window.localStorage.getItem("access_token");
        loggedIn = true;
        return navigateTo("/dashboard");
      } else {
        return navigateTo("/");
      }
    }
  }
});
