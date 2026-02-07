# Materialize - Material Next.js Admin Template

Materialize is a premium Material-UI Next.js admin template that provides a comprehensive solution for building modern web applications.

## 🌟 Features

- **Modern Tech Stack**: Built with Next.js 15, React 18, and Material-UI 6
- **TypeScript Support**: Full TypeScript support for better development experience
- **Responsive Design**: Mobile-first responsive design approach
- **Dark/Light Themes**: Multiple theme options with system preference detection
- **Internationalization (i18n)**: Multi-language support with RTL support
- **Customizable Layouts**: Horizontal and vertical navigation layouts
- **Performance Optimized**: Built with performance in mind
- **SEO Friendly**: Optimized for search engines

## 🌍 Internationalization (i18n)

This template includes a robust internationalization system with the following features:

### Supported Languages

- **English (en)** - Default language
- **Turkish (tr)** - Türkçe
- **Arabic (ar)** - العربية (with RTL support)

### Key Features

- **Automatic Language Detection**: Detects user's browser language
- **Cookie Persistence**: Remembers user's language preference
- **RTL Support**: Full support for right-to-left languages
- **Parameter Interpolation**: Dynamic content in translations
- **HOC Support**: Higher-order components for easy integration
- **Performance Optimized**: No FOUC issues

### Usage Examples

#### Using the Hook

```typescript
import { useI18n } from '@/contexts/i18nContext'

function MyComponent() {
  const { t, locale, direction, changeLocale } = useI18n()

  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1>
      <p>{t('validation.minLength', { min: 8 })}</p>
      <button onClick={() => changeLocale('tr')}>
        {t('settings.language')}
      </button>
    </div>
  )
}
```

#### Using HOC

```typescript
import { withTranslation } from '@/hocs/TranslationWrapper'

function MyComponent({ t, locale }) {
  return <div>{t('common.loading')}</div>
}

export default withTranslation(MyComponent)
```

#### Language Switcher Component

```typescript
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

// Different variants available
<LanguageSwitcher variant="button" size="large" />
<LanguageSwitcher variant="dropdown" size="small" />
<LanguageSwitcher variant="menu" />
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd materialize-admin-v13.7.0/next-version/typescript-version/starter-kit
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── @core/                 # Core functionality
│   ├── components/        # Core components
│   ├── contexts/          # Context providers
│   ├── hooks/            # Custom hooks
│   ├── styles/           # Core styles
│   ├── theme/            # Theme configuration
│   └── utils/            # Utility functions
├── @layouts/              # Layout components
├── @menu/                 # Menu components
├── app/                   # Next.js app directory
├── components/            # Shared components
├── configs/               # Configuration files
├── data/                  # Static data
│   └── dictionaries/      # i18n language files
├── hooks/                 # Custom hooks
├── types/                 # TypeScript types
├── utils/                 # Utility functions
└── views/                 # Page components
```

## 🎨 Customization

### Adding New Languages

1. Create a new language file in `src/data/dictionaries/`
2. Add the language configuration in `src/configs/i18n.ts`
3. Import the dictionary in `src/utils/getDictionary.ts`

### Adding New Translation Keys

1. Add the key to all language files
2. Use nested structure for better organization
3. Support parameter interpolation when needed

### Theme Customization

The template includes a comprehensive theme system that can be customized through:

- `src/configs/themeConfig.ts`
- `src/configs/primaryColorConfig.ts`
- `src/@core/theme/` directory

## 📱 Responsive Design

The template is built with a mobile-first approach and includes:

- Responsive breakpoints
- Touch-friendly interactions
- Adaptive layouts for different screen sizes

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

### Code Quality

- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Consistent code style

## 📄 License

This is a commercial template. Please refer to the license terms for usage rights.

## 🤝 Support

For support and questions:

- Check the documentation
- Review the code examples
- Contact the development team

## 🔄 Updates

Stay updated with the latest features and improvements by:

- Following the changelog
- Checking for updates regularly
- Reviewing the documentation

---

Built with ❤️ using Next.js, React, and Material-UI
