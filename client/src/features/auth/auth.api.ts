import api from "../../api/client";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  expiredAtMs: number;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
};

export const loginApi = async (data: LoginPayload): Promise<LoginResponse> => {
  try {
    const res = await api.post("/auth/login", data);
    if (!res.data.accessToken) {
      throw new Error(res.data.message || "Invalid credentials");
    }
    return {
      accessToken: res.data.accessToken,
      expiredAtMs: res.data.expiredAtMs,
      user: res.data.user,
    };
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message || "An error occurred during login.",
    );
  }
};
