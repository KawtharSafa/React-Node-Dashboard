import { useMutation } from "@tanstack/react-query";
import { loginApi, type LoginPayload, type LoginResponse } from "./auth.api";
import { useAuth } from "./auth.context";

export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: (payload: LoginResponse) => {
      login(payload.accessToken, payload.expiredAtMs);
    },
  });
};
