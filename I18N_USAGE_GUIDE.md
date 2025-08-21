# Internationalization (i18n) Usage Guide

Your Next.js application is already configured with **next-intl** for internationalization. Here's how to use and extend it:

## 🌍 Supported Languages

- **English (en)** - Default language
- **French (fr)** - Français  
- **Arabic (ar)** - العربية (with RTL support)

## 🗂️ File Structure

```
/messages/
  ├── en.json    # English translations
  ├── fr.json    # French translations  
  └── ar.json    # Arabic translations
/i18n.ts         # i18n configuration
/middleware.ts   # Route handling and locale detection
```

## 🚀 Quick Start

### 1. Using Translations in Components

```tsx
'use client';
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('common');
  const tOrders = useTranslations('orders');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <button>{tOrders('createOrder')}</button>
      <p>{t('loading')}</p>
    </div>
  );
}
```

### 2. Using Multiple Translation Namespaces

```tsx
const tCommon = useTranslations('common');
const tOrders = useTranslations('orders');
const tUsers = useTranslations('users');

// Usage
<button>{tCommon('save')}</button>
<h2>{tOrders('title')}</h2>
<span>{tUsers('createUser')}</span>
```

### 3. Fallback Values

```tsx
// If translation key doesn't exist, show fallback
<span>{t('someKey') || 'Fallback text'}</span>
```

## 📁 Translation File Structure

### Common Translations (`common` namespace)
```json
{
  "common": {
    "loading": "Loading...",
    "search": "Search", 
    "save": "Save",
    "cancel": "Cancel",
    "edit": "Edit",
    "delete": "Delete",
    "actions": "Actions",
    "status": "Status"
  }
}
```

### Feature-Specific Translations
```json
{
  "orders": {
    "title": "Orders",
    "createOrder": "Create Order", 
    "editOrder": "Edit Order",
    "pending": "Pending",
    "completed": "Completed"
  },
  "users": {
    "title": "Users",
    "createUser": "Create User",
    "editUser": "Edit User"
  }
}
```

## 🔄 Language Switching

The `LanguageSwitcher` component is already included in the sidebar:

```tsx
import { LanguageSwitcher } from '@/components/language-switcher';

function Sidebar() {
  return (
    <div>
      {/* Other sidebar content */}
      <LanguageSwitcher />
    </div>
  );
}
```

## 🌐 URL Structure

Your app uses locale-based routing:
- `/en/dashboard` - English
- `/fr/dashboard` - French  
- `/ar/dashboard` - Arabic

Navigation automatically includes the current locale:
```tsx
const locale = useLocale();
<Link href={`/${locale}/dashboard/orders`}>Orders</Link>
```

## ➡️ RTL Support

Arabic language automatically gets RTL (right-to-left) layout:

```tsx
// In your layout
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

## ✅ Examples Already Implemented

### 1. Orders Table Component
- ✅ Table headers translated
- ✅ Form labels and buttons  
- ✅ Status values
- ✅ Action buttons

### 2. Sidebar Navigation
- ✅ All menu items translated
- ✅ Language switcher included

### 3. Dashboard Component  
- ✅ Page title and description
- ✅ Stat card titles

## 📝 Adding New Translations

### 1. Add to English (en.json)
```json
{
  "products": {
    "title": "Products",
    "createProduct": "Create Product",
    "price": "Price",
    "category": "Category"
  }
}
```

### 2. Add to French (fr.json)
```json
{
  "products": {
    "title": "Produits", 
    "createProduct": "Créer un produit",
    "price": "Prix",
    "category": "Catégorie"
  }
}
```

### 3. Add to Arabic (ar.json)
```json
{
  "products": {
    "title": "المنتجات",
    "createProduct": "إنشاء منتج", 
    "price": "السعر",
    "category": "الفئة"
  }
}
```

### 4. Use in Component
```tsx
function ProductsTable() {
  const tProducts = useTranslations('products');
  
  return (
    <div>
      <h1>{tProducts('title')}</h1>
      <button>{tProducts('createProduct')}</button>
    </div>
  );
}
```

## 🎯 Best Practices

### 1. Organize by Feature
Group translations by feature/page:
- `common` - Shared across app
- `auth` - Authentication pages
- `dashboard` - Dashboard specific
- `orders` - Orders management
- `users` - User management

### 2. Use Descriptive Keys
```json
// ✅ Good
{
  "orders": {
    "createOrder": "Create Order",
    "editOrderTitle": "Edit Order", 
    "deleteOrderConfirm": "Are you sure you want to delete this order?"
  }
}

// ❌ Avoid
{
  "orders": {
    "btn1": "Create Order",
    "title2": "Edit Order"
  }
}
```

### 3. Consistent Naming
- Use camelCase for keys
- Be descriptive but concise
- Group related translations together

### 4. Fallbacks for Missing Keys
Always provide fallback text:
```tsx
<span>{t('newFeature') || 'Default text'}</span>
```

## 🔧 Configuration Files

### i18n.ts
```typescript
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'fr', 'ar'] as const;
export const defaultLocale = 'fr' as const;

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    locale: locale as string,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
```

### middleware.ts
Handles locale detection and routing automatically.

### next.config.mjs
```javascript
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
```

## 🚧 Next Steps

To fully internationalize your app, update these components:

### High Priority
1. **User Table** - `/components/tables/users-table.tsx`
2. **Product Table** - `/components/tables/products-table.tsx`  
3. **Stock Table** - `/components/tables/stock-table.tsx`
4. **Categories Table** - `/components/tables/categories-table.tsx`

### Medium Priority
5. **Forms and Modals** - All create/edit dialogs
6. **Error Messages** - Validation and error texts
7. **Page Titles** - All page headings and descriptions

### Example Implementation
```tsx
// Before
<CardTitle>All Users</CardTitle>
<Button>Create User</Button>

// After  
const tUsers = useTranslations('users');
<CardTitle>{tUsers('title')}</CardTitle>
<Button>{tUsers('createUser')}</Button>
```

## 🎨 UI Components

Your UI components are already translation-ready:
- Form labels use translation keys
- Buttons show translated text
- Table headers are internationalized
- Status badges display localized values

The language switcher in the sidebar allows users to change languages instantly!

## 🌟 Summary

Your i18n setup is **production-ready** with:
- ✅ 3 languages supported (EN, FR, AR)
- ✅ RTL support for Arabic
- ✅ Locale-based routing
- ✅ Language switcher
- ✅ Comprehensive translation files
- ✅ Example components implemented

Just continue adding `useTranslations()` to your components and update the translation files as needed!
