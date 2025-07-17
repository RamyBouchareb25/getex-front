"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      console.log("SignIn result:", result);
      if (result?.error) {
        let message = result.error;
        if (result.error.includes("CredentialsSignin")) {
          message = t('invalidCredentials');
        } else if (result.error === "ADMIN_ONLY") {
          message = t('adminOnly');
        }
        setErrorMessage(message);
      } else if (result?.ok) {
        const redirectUrl = searchParams.get("callbackUrl") || `/${locale}/dashboard`;
        router.push(redirectUrl);
      } else {
        setErrorMessage(t('unexpectedError'));
      }
    } catch (error) {
      setErrorMessage(t('invalidCredentials'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t('adminLogin')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('enterCredentials')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{tCommon('error')}</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('password')}</Label>
                <Link
                  href={`/${locale}/auth/forgot-password`}
                  className="text-xs text-blue-600 hover:underline"
                >
                  {t('forgotPassword')}
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={t('passwordPlaceholder')}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                  {t('signingIn')}
                </>
              ) : (
                t('signIn')
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <p className="w-full">
            {t('termsAndPrivacy')}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
