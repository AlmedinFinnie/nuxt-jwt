import type { UseFetchOptions } from "nuxt/app";

export function useApiFetch<T>(path: string, options: UseFetchOptions<T> = {}) {
  interface ErrorResponse {
    message?: string;
  }

  //   const token = localStorage.getItem("token");
  let headers: any = {};

  headers["Accept"] = "application/json" as string;
  let token: string | null = "";

  if (process.client) {
    token = window.localStorage.getItem("access_token");
    console.log("token iin useApi", token);

    headers["Authorization"] = "Bearer " + token;
  }
  const defaults: UseFetchOptions<T> = {
    // set user token if connected
    // headers: userAuth.value
    //   ? { Authorization: `Bearer ${userAuth.value}` }
    //   : {},

    headers: token ? { Authorization: `Bearer ${token}` } : {},

    onResponse(_ctx) {
      // _ctx.response._data = new myBusinessResponse(_ctx.response._data)
      console.log("onResponse", _ctx);
    },

    onResponseError(_ctx) {
      console.log("Entering onResponseError");

      console.log("_ctx", _ctx);

      const errorResponse: ErrorResponse = _ctx.response?._data;
      console.log("asda", errorResponse);

      // Check if the error message is 'token expired'
      if (errorResponse?.message === "token expired") {
        console.log("errorResponse?.message", errorResponse?.message);

        // Handle token expiration. For example:
        // 1. Redirect to login page
        // 2. Try to refresh the token
        // 3. Show a message to the user, etc.
        if (process.client) {
          window.localStorage.removeItem("access_token");
          // Redirect to login or refresh token or show a notification
        }
      } else {
        // Handle other types of errors
        // throw new myBusinessError()
      }
    },
  };

  return useFetch("http://localhost:8000/api/" + path, {
    watch: false,
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    },
  });
}
