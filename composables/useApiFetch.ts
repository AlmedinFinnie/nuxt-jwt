import type { UseFetchOptions, useRouter } from "nuxt/app";

interface QueuedRequest {
  resolve: (value: any) => void;
  reject: (reason: any) => void;
  request: any;
  options: any;
}

export function useApiFetch<T>(path: string, options: UseFetchOptions<T> = {}) {
  const router: any = useRouter();
  const failedRequestsQueue: QueuedRequest[] = [];
  let headers = ref({
    Accept: "application/json",
  });
  let token: string | null = "";

  if (process.client) {
    token = window.localStorage.getItem("access_token");
    console.log("token in useApi", token);
  }

  const defaults: UseFetchOptions<T> = {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };

  return new Promise(async (resolve, reject) => {
    const fetchResult = await useFetch("http://localhost:8000/api/" + path, {
      watch: false,
      ...defaults,
      ...options,
      headers: {
        ...headers.value,
        ...options?.headers,
        Authorization: `Bearer ${token}`,
      },

      onRequest({ request, options }) {
        console.log("onRequest");
      },
      onRequestError({ request, options, error }) {
        console.log("onRequestError");
      },
      onResponse({ request, response, options }) {
        console.log("onResponse");
      },
      async onResponseError({ request, response, options }) {
        const errorMessage = response?._data?.message;

        if (errorMessage === "token expired") {
          console.log("error", errorMessage);

          failedRequestsQueue.push({ resolve, reject, request, options });

          const { data, error } = await useFetch(
            "http://localhost:8000/api/" + "auth/refresh",
            {
              method: "POST",
              headers: {
                ...headers.value,
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (data.value) {
            console.log("data.value", data.value?.access_token);
            window.localStorage.setItem(
              "access_token",
              data.value?.access_token
            );
            token = data.value?.access_token;

            while (failedRequestsQueue.length) {
              const queuedReq = failedRequestsQueue.shift();

              const retryResult = await useFetch(queuedReq.request, {
                ...queuedReq.options,
                headers: {
                  ...queuedReq.options.headers,
                  Authorization: `Bearer ${token}`,
                },
              });

              queuedReq.resolve(retryResult);
            }
          } else if (error.value) {
            console.log("error after refresh", error.value.data.message);
            if (
              error.value.data.message === "The token has been blacklisted" ||
              error.value.data.message ===
                "Token has expired and can no longer be refreshed"
            ) {
              if (process.client) {
                window.localStorage.removeItem("access_token");
                router.push({ path: "/login" });
              }
            }
          }
        } else if (errorMessage === "Unauthorized") {
          if (process.client) {
            window.localStorage.removeItem("access_token");
            router.push({ path: "/login" });
          }
          reject("Unauthorized");
        } else {
          reject("Some other error occurred");
        }
      },
    });

    resolve(fetchResult);
  });
}
