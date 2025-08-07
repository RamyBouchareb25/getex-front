"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslations, useLocale } from 'next-intl';
import SalamiLoadingAnimation from "@/components/ui/salami-loading";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [email, setEmail] = useState("");
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email") as string;
      
      // TODO: Replace with actual API call to your backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send reset email");
      }

      setSuccessMessage(`${t('resetInstructions')} ${email}`);
      setEmail(email);
    } catch (error) {
      console.error("Forgot password error:", error);
      setErrorMessage(error instanceof Error ? error.message : t('failedToProcess'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t('forgotPasswordTitle')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('forgotPasswordDescription')}
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
          
          {successMessage && (
            <Alert className="mb-4 border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>{tCommon('success')}</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {!successMessage ? (
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
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                    {t('sending')}
                  </>
                ) : (
                  t('sendResetLink')
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                {t('checkEmailInstructions')}
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSuccessMessage("");
                  setEmail("");
                }}
              >
                {t('sendAnotherEmail')}
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href={`/${locale}/auth/login`}
              className="inline-flex items-center text-sm text-blue-600 hover:underline"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t('backToLogin')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
