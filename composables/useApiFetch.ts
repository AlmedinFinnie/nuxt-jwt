import type { UseFetchOptions, useRouter } from "nuxt/app";

export function useApiFetch<T>(path: string, options: UseFetchOptions<T> = {}) {
  const router: any = useRouter();
  interface ErrorResponse {
    message?: string;
  }

  //   const token = localStorage.getItem("token");
  // let headers: any = {};

  // headers["Accept"] = "application/json" as string;
  let headers = ref({
    Accept: "application/json",
  });
  let token: string | null = "";

  if (process.client) {
    token = window.localStorage.getItem("access_token");
    console.log("token iin useApi", token);

    // headers["Authorization"] = "Bearer " + token;
    headers.value["Authorization"] = "Bearer " + token;
  }
  const defaults: UseFetchOptions<T> = {
    // set user token if connected
    // headers: userAuth.value
    //   ? { Authorization: `Bearer ${userAuth.value}` }
    //   : {},

    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };

  return useFetch("http://localhost:8000/api/" + path, {
    watch: false,
    ...options,
    headers: {
      ...headers.value,
      ...options?.headers,
    },

    onRequest({ request, options }) {
      // Set the request headers
      // options.headers = options.headers || {}
      // options.headers.authorization = '...'
      console.log("onRequest");
    },
    onRequestError({ request, options, error }) {
      // Handle the request errors
      console.log("onRequestError");
    },
    onResponse({ request, response, options }) {
      // Process the response data
      // localStorage.setItem('token', response._data.token)
      console.log("onResponse");
    },
    async onResponseError({ request, response, options }) {
      console.log("request", request);
      console.log("response", response);
      console.log("options", options);

      console.log("request", request);
      console.log("options header", options.headers);
      console.log("options header A", options.headers?.keys);
      console.log("options header A", options.headers?.keys["Authorization"]);
      console.log("options header A", options.headers?.values["Authorization"]);

      // Handle the response errors
      console.group("data");
      const errorMessage = response?._data?.message;
      console.log("errorMessage", errorMessage);
      if (errorMessage === "token expired") {
        console.log("error", errorMessage);

        // Handle token expiration. For example:
        // 1. Try to refresh the token

        const { data, error } = await useFetch(
          "http://localhost:8000/api/" + "auth/refresh",
          {
            method: "POST",
            headers: {
              ...headers.value,
            },
          }
        );
        if (data.value) {
          console.log("data.value", data.value?.access_token);
          window.localStorage.setItem("access_token", data.value?.access_token);
          console.log("Token refreshed and updated in localStorage");

          // headers["Authorization"] = "Bearer " + data.value?.access_token;
          headers.value["Authorization"] = "Bearer " + data.value?.access_token;

          // update the new header

          // request.headers["Authorization"] =
          //   "Bearer " + data.value?.access_token;
        } else if (error.value) {
          console.log("error", error.value.data.message);
          if (error.value.data.message === "The token has been blacklisted") {
            if (process.client) {
              // if token is blacklisted then we remove the access token and then redirect to the login page
              window.localStorage.removeItem("access_token");
              router.push({ path: "/login" });
            }
          }
        }

        console.log("refresh token");
      } else if (errorMessage === "Unauthorized") {
        if (process.client) {
          // if token is blacklisted then we remove the access token and then redirect to the login page
          window.localStorage.removeItem("access_token");
          // send to the /login page

          router.push({ path: "/login" });
        }
      } else {
        // Handle other types of errors
        // throw new myBusinessError()
      }
    },
  });
}
