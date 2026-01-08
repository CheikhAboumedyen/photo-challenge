"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const t = useTranslations("Auth");

  const loginSchema = z.object({
    email: z.string().email(t("loginInvalidEmail")),
    password: z.string().min(8, t("loginPasswordMin")),
  });

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
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
        const role = (result.user as typeof result.user & { role?: string })
          ?.role;
        const destination = role === "admin" ? "/admin" : "/home";
        toast.success(t("toastWelcomeBack"));
        router.push(destination);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || t("toastLoginFailed"));
    },
  });

  const onSubmit = (values: LoginFormValues) => mutation.mutate(values);

  const handleLoginWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/home",
    });
  };

  return (
    <Card className="overflow-hidden border border-nav-border/50 bg-panel/90 text-brand-foreground shadow-[0_25px_60px_rgba(2,6,23,0.75)]">
      <CardHeader className="space-y-3 text-center">
        <CardTitle className="text-3xl font-semibold">
          {t("loginFormTitle")}
        </CardTitle>
        <p className="text-sm text-muted">{t("loginFormSubtitle")}</p>
      </CardHeader>

      <CardContent className="space-y-5">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-white/90"
            >
              {t("emailLabel")}
            </label>
            <Input
              id="email"
              type="email"
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
            <div className="flex items-center justify-between text-sm">
              <label htmlFor="password" className="font-medium text-white/90">
                {t("passwordLabel")}
              </label>
              <Link
                href="/forgot-password"
                className="text-white/70 transition hover:text-white"
              >
                {t("forgotPasswordLink")}
              </Link>
            </div>
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

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="h-12 w-full rounded-full bg-brand-gradient text-base font-semibold text-brand-on-primary transition hover:opacity-90"
          >
            {mutation.isPending ? t("loginSubmitting") : t("loginButton")}
          </Button>
        </form>

        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleLoginWithGoogle}
            className="h-12 w-full rounded-full border-nav-border/60 bg-transparent text-white/90 hover:bg-white/5"
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            {t("loginContinueGoogle")}
          </Button>
          <p className="text-center text-sm text-white/70">
            {t("loginNewToPixi")}{" "}
            <Link
              href="/signup"
              className="font-semibold text-white hover:text-brand-accent"
            >
              {t("createAccountLink")}
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
