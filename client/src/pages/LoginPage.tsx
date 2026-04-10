import { Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLogin } from "../features/auth/auth.hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginSchema,
  type LoginFormValues,
} from "../features/auth/auth.schema";

//used this for debugging an issue
// import { useEffect } from "react";

//ui imports
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";


export const LoginPage = () => {
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = (data: LoginFormValues) => {
    setServerError(null);
    loginMutation.mutate(data, {
      onSuccess: () => navigate("/dashboard", { replace: true }),
      onError: (err: any) => {
        setServerError(err.message ?? " Invalid credentials. Please try again.");
      },
    });
  };

  //used this for debugging an issue
  // useEffect(() => {
  //   console.log("STATUS:", {
  //     isError: loginMutation.isError,
  //     isPending: loginMutation.isPending,
  //     isSuccess: loginMutation.isSuccess,
  //     error: loginMutation.error,
  //   });
  // }, [loginMutation.isError, loginMutation.isPending, loginMutation.isSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-lg min-w-[220px]">
        <Card className="border bg-card shadow-xl rounded-2xl">
          <CardHeader className="text-center space-y-4 pb-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 shadow-sm">
              <Lock className="h-5 w-5 text-white" />
            </div>

            <div className="space-y-1">
              <CardTitle className="text-2xl font-semibold">
                Welcome back
              </CardTitle>

              <CardDescription className="text-sm text-muted-foreground">
                Sign in to your dashboard
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* ERROR */}
              {serverError && (
                <div className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-700">
                  {serverError}
                </div>
              )}

              {/* EMAIL */}
              <div className="space-y-2">
                <Label>Email</Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input
                    type="email"
                    className="pl-9 h-11 rounded-lg"
                    placeholder="admin@example.com"
                    {...register("email")}
                    onChange={(e) => {
                      register("email").onChange(e); // keep handler
                      setServerError(null);
                    }}
                  />
                </div>

                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <Label>Password</Label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input
                    type="password"
                    className="pl-9 h-11 rounded-lg"
                    placeholder="password123"
                    {...register("password")}
                    onChange={(e) => {
                      register("password").onChange(e);
                      setServerError(null);
                    }}
                  />
                </div>

                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* BUTTON */}
              <Button
                type="submit"
                className="bg-blue-700 text-white hover:bg-blue-600/90 w-full h-11 text-sm font-medium rounded-lg shadow-sm disabled:opacity-50 disabled:pointer-events-none"
                disabled={!isValid || loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
