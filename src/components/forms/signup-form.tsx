// src/components/forms/signup-form.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";

// 1?,?- Validation schema
const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters")
      .regex(
        /^[\p{L}\p{M}' -]+$/u,
        "Name can only contain letters, spaces, apostrophes, and hyphens"
      ),
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
  const t = useTranslations("Auth");

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
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
        name: values.name.trim(),
        callbackURL: "/home",
      });

      if (error?.code === "USER_ALREADY_EXISTS")
        throw new Error(t("errorEmailExists"));

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: async (result, values) => {
      if (result.user) {
        toast.success(t("toastSignupSuccess"));
        router.push("/verify-email");
      }
    },
    onError: (err: any) => {
      toast.error(err.message || t("toastSignupFailed"));
    },
  });

  const onSubmit = (values: SignupFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Card className="overflow-hidden border border-nav-border/50 bg-panel/90 text-brand-foreground shadow-[0_25px_60px_rgba(2,6,23,0.75)]">
      <CardHeader className="space-y-3 text-center">
        <CardTitle className="text-3xl font-semibold">{t("signupFormTitle")}</CardTitle>
        <CardDescription className="text-sm text-muted">
          {t("signupFormSubtitle")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-white/90">
              {t("nameLabel")}
            </label>
            <Input
              id="name"
              type="text"
              placeholder={t("namePlaceholder")}
              {...form.register("name")}
              className="h-12 border-nav-border/50 bg-transparent text-brand-foreground placeholder:text-white/40 focus-visible:border-brand-primary focus-visible:ring-brand-primary/40"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-400">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-white/90">
              {t("emailLabel")}
            </label>
            <Input
              id="email"
              type="text"
              placeholder={t("emailPlaceholder")}
              {...form.register("email")}
              className="h-12 border-nav-border/50 bg-transparent text-brand-foreground placeholder:text-white/40 focus-visible:border-brand-primary focus-visible:ring-brand-primary/40"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-400">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-white/90">
              {t("passwordLabel")}
            </label>
            <Input
              id="password"
              type="password"
              placeholder={t("passwordPlaceholder")}
              {...form.register("password")}
              className="h-12 border-nav-border/50 bg-transparent text-brand-foreground placeholder:text-white/40 focus-visible:border-brand-primary focus-visible:ring-brand-primary/40"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-400">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm" className="text-sm font-medium text-white/90">
              {t("confirmPasswordLabel")}
            </label>
            <Input
              id="confirm"
              type="password"
              placeholder={t("confirmPasswordPlaceholder")}
              {...form.register("confirm")}
              className="h-12 border-nav-border/50 bg-transparent text-brand-foreground placeholder:text-white/40 focus-visible:border-brand-primary focus-visible:ring-brand-primary/40"
            />
            {form.formState.errors.confirm && (
              <p className="text-sm text-red-400">
                {form.formState.errors.confirm.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-full bg-brand-gradient text-base font-semibold text-brand-on-primary transition hover:opacity-90"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? t("signUpSubmitting") : t("signUpButton")}
          </Button>
        </form>

        <p className="text-center text-sm text-white/70">
          {t("alreadyHaveAccount")} {" "}
          <Link href="/login" className="font-semibold text-white hover:text-brand-accent">
            {t("backToLoginLink")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}