# Çok Dilli Yapı (i18n) Dokümantasyonu

Bu klasör, projenin çok dilli yapısı için gerekli dil dosyalarını içerir.

## Desteklenen Diller

- **en** - İngilizce (Varsayılan)
- **tr** - Türkçe
- **ar** - Arapça (RTL desteği ile)

## Dosya Yapısı

```
src/data/dictionaries/
├── en.json          # İngilizce çeviriler
├── tr.json          # Türkçe çeviriler
├── ar.json          # Arapça çeviriler
└── README.md        # Bu dosya
```

## Çeviri Anahtarları

Her dil dosyası aşağıdaki ana kategorileri içerir:

### common

Genel kullanım için ortak terimler:

- `loading`, `error`, `success`
- `save`, `cancel`, `delete`
- `search`, `filter`, `clear`

### navigation

Navigasyon menüsü için:

- `home`, `dashboard`, `about`
- `profile`, `settings`, `logout`

### auth

Kimlik doğrulama için:

- `signIn`, `signUp`, `signOut`
- `email`, `password`, `confirmPassword`

### dashboard

Kontrol paneli için:

- `welcome`, `overview`, `statistics`
- `recentActivity`, `quickActions`

### settings

Ayarlar sayfası için:

- `general`, `appearance`, `language`
- `theme`, `darkMode`, `lightMode`

### errors

Hata mesajları için:

- `required`, `invalidEmail`, `passwordMismatch`
- `serverError`, `networkError`

### validation

Form doğrulama için:

- `required`, `email`, `minLength`, `maxLength`

## Yeni Dil Ekleme

1. Yeni dil dosyası oluşturun (örn: `de.json`)
2. `src/configs/i18n.ts` dosyasına yeni dili ekleyin
3. `src/utils/getDictionary.ts` dosyasına import ekleyin
4. Tüm çeviri anahtarlarını yeni dilde doldurun

## Çeviri Anahtarı Ekleme

Yeni bir çeviri anahtarı eklerken:

1. Tüm dil dosyalarına aynı anahtarı ekleyin
2. Anahtar adını açıklayıcı yapın (örn: `dashboard.recentNotifications`)
3. Nested yapı kullanın (örn: `auth.errors.invalidCredentials`)

## Parametre Interpolasyonu

Çeviri metinlerinde parametre kullanımı:

```json
{
  "validation": {
    "minLength": "Minimum uzunluk {min} karakter olmalıdır",
    "maxLength": "Maksimum uzunluk {max} karakter olmalıdır"
  }
}
```

Kullanım:

```typescript
t('validation.minLength', { min: 8 })
t('validation.maxLength', { max: 50 })
```

## RTL Desteği

Arapça gibi RTL diller için:

- `direction: 'rtl'` olarak ayarlanır
- CSS'te `direction` ve `text-align` özellikleri otomatik uygulanır
- Layout bileşenleri RTL desteği ile uyumludur

## Performans

- Dil dosyaları build time'da import edilir
- Lazy loading desteklenir
- Çeviri anahtarları optimize edilmiştir
- FOUC (Flash of Unstyled Content) önlenmiştir
