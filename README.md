# CodeShare Platform 🚀

A modern web platform where developers can share code snippets, tag them by language and topic, and get basic time complexity estimates.

## ✨ Features

- ✅ **CRUD Operations**: Create, Read, Update, Delete code snippets
- ✅ **Authentication**: Secure email/password-based auth with NextAuth.js
- ✅ **Tagging System**: Organize snippets by language and custom tags
- ✅ **Public Profiles**: Every user has a public profile showcasing their snippets
- ✅ **Shareable URLs**: Share snippets and tag collections via URLs
- ✅ **Time Complexity Analyzer**: Basic algorithm to estimate O(n) complexity
- ✅ **SEO Optimized**: Dynamic meta tags for better search visibility
- ✅ **Internationalization**: Support for English and Vietnamese
- ✅ **Mobile Responsive**: Fully responsive design with mobile-first approach
- ✅ **Syntax Highlighting**: Beautiful code display with Prism.js

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS + shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Deployment**: Vercel
- **Code Highlighting**: react-syntax-highlighter

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or use Supabase)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd codeshare-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your database credentials:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/codeshare"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   ```
   http://localhost:3000
   ```

## 🚀 Deployment (Vercel)

1. Push your code to GitHub

2. Import project in Vercel

3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (your production URL)
   - `NEXTAUTH_SECRET`

4. Deploy!

## 📁 Project Structure

```
codeshare-platform/
├── app/
│   ├── api/            # API routes
│   ├── snippets/       # Snippet pages
│   ├── profile/        # User profiles
│   ├── login/          # Auth pages
│   └── page.tsx        # Homepage
├── components/
│   └── ui/             # shadcn components
├── lib/
│   ├── prisma.ts       # Database client
│   ├── auth.ts         # NextAuth config
│   └── utils.ts        # Utilities
├── prisma/
│   └── schema.prisma   # Database schema
└── locales/            # i18n translations
```

## 🎯 Key Features Explained

### Time Complexity Analyzer
The platform includes a simple regex-based analyzer that detects:
- `O(1)` - Constant time operations
- `O(n)` - Single loops
- `O(n²)` - Nested loops
- `O(n log n)` - Sorting algorithms
- `O(log n)` - Binary search patterns

### SEO Implementation
- Dynamic meta tags for each snippet
- Open Graph tags for social sharing
- Semantic HTML structure
- Proper heading hierarchy

### Internationalization
- Support for English (`/en`) and Vietnamese (`/vi`)
- Automatic locale detection
- Easy to extend with more languages

## 📝 API Routes

- `GET /api/snippets` - List all snippets (with filters)
- `POST /api/snippets` - Create new snippet (auth required)
- `GET /api/snippets/[id]` - Get single snippet
- `PUT /api/snippets/[id]` - Update snippet (auth required, owner only)
- `DELETE /api/snippets/[id]` - Delete snippet (auth required, owner only)
- `POST /api/auth/register` - User registration

## 🔒 Security

- Passwords hashed with bcrypt
- Protected API routes with NextAuth
- CSRF protection built-in
- SQL injection prevention with Prisma

## 📱 Responsive Design

All pages are fully responsive and tested on:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)
- Large screens (1440px+)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your portfolio or learning.

## 👤 Author

Your Name - [GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Built with Next.js and TailwindCSS
- UI components from shadcn/ui
- Icons from Lucide React