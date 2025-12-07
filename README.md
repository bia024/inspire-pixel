<div align="center">

![InspirePixel Hero](./public/hero-screenshot.png)

# 🎨 InspirePixel

### _Where landscapes turn into inspiration_

[![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883?style=for-the-badge&logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**A premium visual inspiration platform** featuring stunning landscapes, exclusive content, and a seamless Pro experience.

[🚀 Live Demo](#) • [📖 Documentation](#features) • [💎 Go Pro](#pro-features)

</div>

---

## ✨ Features

### 🎯 Core Features

- **🖼️ Curated Gallery** - High-quality landscape photography
- **🔍 Smart Search** - Find inspiration instantly with debounced search
- **❤️ Favorites System** - Save and organize your favorite images
- **📱 Fully Responsive** - Seamless experience across all devices
- **🌙 Modern UI/UX** - Glassmorphism, gradients, and smooth animations
- **🤖 AI Descriptions** - Automatic image descriptions powered by Hugging Face

### 💎 Pro Features

- **🔓 Premium Content** - Access exclusive high-resolution images
- **⬇️ 4K Downloads** - Download images in full quality
- **🎨 Pro Gallery** - Exclusive collection from Unsplash API
- **✉️ Email Validation** - LGPD-compliant Pro activation
- **🏆 Pro Badge** - Visual distinction with premium branding

### 🤖 AI-Powered Features

- **🧠 Hugging Face Integration** - Free AI image captioning using VIT-GPT2 model
- **📝 Smart Fallbacks** - 30+ categories with creative descriptions when API unavailable
- **💾 Intelligent Caching** - LocalStorage caching prevents repeated API calls
- **🎯 Category Detection** - Automatic category extraction from image URLs
- **⚡ Real-time Generation** - Instant description generation with loading states

### 🔐 Authentication System

- **📧 Email Validation** - Secure user registration
- **🔒 Password Protection** - Minimum 6 characters
- **💾 Persistent Sessions** - Stay logged in across sessions
- **🎫 Pro Upgrade Flow** - Seamless transition to premium

### 📬 Newsletter Integration

- **✉️ Firebase Google Forms** - Automated email confirmations
- **✅ Email Validation** - Regex-based validation
- **💾 Fallback Storage** - LocalStorage backup
- **🎨 Premium Design** - Gradient form with animations

---

## 🤖 AI Description System

### How It Works

1. **Primary AI Generation** - Uses Hugging Face's VIT-GPT2 model for intelligent image captioning
2. **Smart Category Detection** - Automatically extracts image categories from URLs (nature, architecture, people, etc.)
3. **Creative Fallbacks** - When API fails, provides category-specific creative descriptions
4. **Intelligent Caching** - Stores descriptions in localStorage to prevent redundant API calls
5. **Real-time UI** - Shows loading states and instant feedback

### Supported Categories

The system supports 30+ image categories with unique creative descriptions:

- **Nature**: "Majestic natural scenery showcasing the harmony between earth and sky"
- **Architecture**: "Impressive architectural marvel showcasing human ingenuity and design"
- **People**: "Captivating portrait revealing the depth of human emotion and character"
- **Abstract**: "Intriguing abstract composition exploring form, color, and texture"
- **City**: "Vibrant urban landscape capturing the energy of modern city life"
- **Animals**: "Fascinating wildlife portrait showcasing animal grace and natural behavior"
- **Food**: "Appetizing culinary creation showcasing gastronomic artistry and flavor"
- **Technology**: "Innovative technological marvel demonstrating human progress and ingenuity"
- **Travel**: "Exotic destination capturing the allure of adventure and exploration"
- **Sports**: "Dynamic athletic moment capturing the intensity of competitive spirit"
- **Fashion**: "Elegant fashion statement showcasing style and contemporary trends"
- **Landscape**: "Breathtaking panoramic vista celebrating the grandeur of natural landscapes"
- **Portrait**: "Compelling portrait study revealing personality and human depth"
- **Black & White**: "Timeless monochromatic composition emphasizing form and contrast"
- **Wallpaper**: "Versatile background design offering aesthetic and functional appeal"
- **Background**: "Versatile backdrop design providing clean and functional aesthetics"
- **Macro**: "Intricate macro study revealing hidden details and microscopic beauty"
- **Aerial**: "Spectacular aerial perspective showcasing geographical patterns and scale"
- **Vintage**: "Nostalgic vintage composition evoking historical charm and character"
- **Minimalist**: "Clean minimalist composition celebrating simplicity and essential forms"
- **Ocean**: "Majestic ocean vista celebrating the power and beauty of marine landscapes"
- **Forest**: "Lush forest landscape celebrating biodiversity and natural harmony"
- **Mountain**: "Majestic mountain landscape showcasing geological grandeur and scale"
- **Beach**: "Idyllic beach scene celebrating coastal tranquility and natural beauty"
- **Flower**: "Delicate floral composition celebrating botanical beauty and color diversity"
- **Car**: "Sleek automotive design showcasing engineering excellence and style"
- **Building**: "Impressive architectural structure showcasing design innovation and purpose"
- **Art**: "Creative artistic composition showcasing imaginative expression and vision"
- **Music**: "Dynamic musical composition celebrating rhythm, melody, and artistic expression"
- **Dance**: "Graceful dance composition celebrating movement, rhythm, and human expression"

---

## 🛠️ Tech Stack

### Frontend

- **Vue 3** - Composition API with `<script setup>`
- **Vue Router** - SPA navigation with guards
- **Vite** - Lightning-fast build tool
- **SCSS** - Advanced styling with variables

### Libraries & APIs

- **@iconify/vue** - 200,000+ icons
- **Hugging Face** - Free AI image captioning API
- **Firebase** - Firebase integration for authentication and storage
- **Unsplash API** - High-quality image source (Pro)
- **Spotify Web API** - Music integration for an immersive experience

### Code Quality

- **Semantic HTML** - `<main>`, `<section>`, `<article>`, `<nav>`
- **Accessibility** - ARIA labels, roles, keyboard navigation
- **Clean Architecture** - Composables, reusable components
- **Modern Patterns** - Reactive state, computed properties

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/bia024/ipx.git
cd inspirapixel

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your API credentials to .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_key
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_HF_API_KEY=your_hugging_face_api_key
```

---

## 📂 Project Structure

```
inspirapixel/
├── src/
│   ├── assets/          # Images and static files
│   ├── components/      # Reusable Vue components
│   │   ├── Header.vue
│   │   ├── Hero.vue
│   │   ├── Gallery.vue
│   │   ├── Footer.vue
│   │   ├── AuthModal.vue
│   │   ├── ToastNotification.vue
│   │   └── BackToActions.vue
│   ├── composables/     # Vue composables
│   │   ├── useAuth.js
│   │   ├── useToast.js
│   │   ├── useLLM.js
│   │   └── useUnsplash.js (planned)
│   ├── views/           # Page components
│   │   ├── HomeView.vue
│   │   ├── ModeSelectionView.vue
│   │   ├── ContactView.vue
│   │   ├── InstitutionalView.vue
│   │   ├── PrivacyPolicyView.vue
│   │   ├── TermsView.vue
│   │   └── CopyrightView.vue
│   ├── router/          # Vue Router config
│   ├── App.vue          # Root component
│   └── main.js          # Entry point
├── public/              # Public assets
└── index.html           # HTML template
```

---

## 🎨 Key Components

### 🏠 Hero Section

- Split-screen layout with search and Pro showcase
- Debounced search with URL sync
- Animated premium card with call-to-action

### 🖼️ Gallery

- Lazy loading with Intersection Observer
- Premium content locking for Free users
- Favorites system with localStorage
- Responsive grid layout
- AI-powered description generation

### 🔐 Authentication Modal

- Tab-based UI (Login/Register)
- Real-time validation
- Toast notifications
- Smooth animations

### 📧 Newsletter Form

- Email validation
- Firebase integration
- Loading states
- Success/error feedback

---

## 💎 Pro Mode

### How It Works

1. **Select Pro** - Choose Pro plan on mode selection page
2. **Login Required** - Must be authenticated to upgrade
3. **Email Validation** - Email must match account (LGPD compliance)
4. **Confirmation** - Receive validation email
5. **Unlock Content** - Access premium features instantly

### Pro Benefits

| Feature           | Free       | Pro          |
| ----------------- | ---------- | ------------ |
| Gallery Access    | ✅ Limited | ✅ Full      |
| Image Quality     | Standard   | 4K           |
| Downloads         | ❌         | ✅ Unlimited |
| Exclusive Content | ❌         | ✅           |
| Pro Badge         | ❌         | ✅           |
| Priority Support  | ❌         | ✅           |

---

## 🎯 Roadmap

- [x] Core gallery functionality
- [x] Authentication system
- [x] Pro/Free mode distinction
- [x] Newsletter integration
- [x] Semantic HTML refactoring
- [x] AI-powered image descriptions
- [ ] Unsplash API integration
- [ ] Image lightbox/modal
- [ ] Backend API
- [ ] Payment integration
- [ ] User dashboard
- [ ] Social sharing

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👩‍💻 Author

**Bianca Caetano - Software Engineer Student**

Passionate about crafting immersive digital experiences that inspire creativity and innovation using Vue.js, Vite, and modern web technologies.

- GitHub: [@bia024](https://github.com/bia024)
- Project: [InspirePixel](inspire-pixel-kcho.vercel.app/)

---

## 🙏 Acknowledgments

- Images from [Unsplash](https://unsplash.com)
- Icons from [Iconify](https://iconify.design)
- AI descriptions powered by [Hugging Face](https://huggingface.co)
- Email service by [Firebase](https://firebase.google.com/)
- Built with ❤️ using Vue 3 and Vite

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Made with 💜 by Bianca Caetano**

[Back to Top ↑](#-inspirepixel)

</div>
