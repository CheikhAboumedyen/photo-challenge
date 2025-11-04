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

// 1️- Validation schema
const signupSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string().min(8, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: SignupFormValues) => {
      const { data, error } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.email.split("@")[0],
        callbackURL: "/",
      });

      if (error?.code === "USER_ALREADY_EXISTS")
        throw new Error("Email already exists");

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (result) => {
      if (result.user) {
        toast.success("Signup successful!");
        router.push("/"); // signup successful
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "Login failed");
      toast.error("right here");
    },
  });

  const onSubmit = (values: SignupFormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="w-[380px] shadow-md">
        <CardHeader>
          <CardTitle className="text-center">Create a new account</CardTitle>
          <CardDescription className="text-center">
            Enter your details below to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="text"
                  type="text"
                  placeholder="m@example.com"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="confirm">Confirm Password</FieldLabel>
                <Input
                  id="confirm"
                  type="password"
                  {...form.register("confirm")}
                />
                {form.formState.errors.confirm && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.confirm.message}
                  </p>
                )}
              </Field>

              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Signing up..." : "Sign up"}
                </Button>
                <FieldDescription className="text-center mt-3">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="underline hover:text-primary transition cursor-pointer"
                  >
                    <a href="/login">Login</a>
                  </button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
