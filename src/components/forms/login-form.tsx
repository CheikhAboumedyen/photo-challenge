"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        rememberMe: true,
      });

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (result) => {
      if (result.user) {
        toast.success("Login successful!");
        router.push("/home");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Login failed");
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    mutation.mutate(values);
  };

  const handleLoginWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/home",
    });
  };

  return (
    <div className={cn("flex flex-col gap-6 items-center")}>
      <Card className="w-full max-w-md border-none shadow-pv bg-white/70 backdrop-blur-lg rounded-pv">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold text-pv-primary">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-500">
            Login to your{" "}
            <span className="text-pv-secondary font-medium">PixiVerse</span>{" "}
            account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className="text-gray-700">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...form.register("email")}
                  className="border-gray-300 focus:border-pv-primary focus:ring-pv-primary/30"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password" className="text-gray-700">
                    Password
                  </FieldLabel>
                  <a
                    href="/forgot-password"
                    className="text-sm text-pv-primary hover:underline"
                  >
                    Forgot?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                  className="border-gray-300 focus:border-pv-primary focus:ring-pv-primary/30"
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </Field>

              <Field>
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-pv-primary hover:bg-pv-secondary text-pv-primary transition shadow-pv"
                >
                  {mutation.isPending ? "Logging in..." : "Login"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLoginWithGoogle}
                  className="w-full mt-3 flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
                >
                  <FcGoogle className="w-5 h-5" />
                  Login with Google
                </Button>

                <FieldDescription className="text-center mt-5 text-gray-600">
                  Don’t have an account?{" "}
                  <a
                    href="/signup"
                    className="text-pv-primary font-medium hover:underline"
                  >
                    Sign up
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
