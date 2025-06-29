# 🎉 EventMingle – Unified Event Platform

A powerful web application designed to streamline **event discovery**, **event management**, and **platform governance**, built using **Next.js**, **React**, **Tailwind CSS**, and **PostgreSQL**.

## 🚀 Features

### For Attendees
- **Event Discovery**: Swipe through events or browse with filters
- **RSVP Management**: Easy event registration and calendar sync
- **Split Payments**: Group payment functionality for shared costs
- **Social Features**: Connect with friends and see their activities
- **Personal Dashboard**: Manage events, payments, and communications

### For Organizers
- **Event Management**: Create, edit, and manage events
- **Venue Management**: Handle venue layouts and availability
- **Staff Management**: Assign roles and manage team
- **Resource Management**: Equipment and logistics tracking
- **CRM Integration**: Manage event customers and communications

### For Super Admins
- **Platform Analytics**: KPIs, retention, and ticket sales
- **Moderation Tools**: User reports and content moderation
- **Security Management**: Role permissions and audit logs
- **Integration Management**: Webhooks and API keys
- **Platform Settings**: Branding and terms management

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel
- **UI Components**: Lucide React, Framer Motion
- **Forms**: React Hook Form with Zod validation

## 📁 Project Structure

```
Event-Mingle/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── discover/          # Event discovery page
│   ├── event/             # Event details pages
│   ├── login/             # Authentication pages
│   ├── register/
│   ├── dashboard/         # User dashboard
│   ├── admin/             # Organizer dashboard
│   ├── superadmin/        # Super admin dashboard
│   └── [static-pages]/    # About, contact, terms, privacy
├── components/            # Reusable React components
│   ├── user/              # User-specific components
│   ├── admin/             # Admin-specific components
│   ├── common/            # Shared components
│   ├── payments/          # Payment-related components
│   └── calendar/          # Calendar components
├── lib/                   # Utility libraries
├── types/                 # TypeScript type definitions
├── utils/                 # Helper functions
├── styles/                # Global styles
└── public/                # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/eventmingle.git
   cd eventmingle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables:
   ```
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/eventmingle"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Social Login Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Optional: Payment Processing
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
```

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/yourusername/eventmingle/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Tailwind CSS for the utility-first styling
- All contributors and supporters 