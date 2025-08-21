import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
export const locales = ["en", "fr", "ar"] as const;
export const defaultLocale = "fr" as const;

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const requestLocaleString = await requestLocale;
  
  // Use requestLocale if locale is undefined, then fall back to default
  const finalLocale = locale || requestLocaleString || defaultLocale;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(finalLocale as any)) notFound();
  

  return {
    locale: finalLocale as string,
    messages: (await import(`./messages/${finalLocale}.json`)).default,
  };
});
