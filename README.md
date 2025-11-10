# 🚀 C&L SEO Lead Finder

**Find local businesses with SEO issues to generate leads**

Built by C&L Page Services

## 🎯 Two Versions Available

### 🐍 Python CLI (Simple & Quick)
**Perfect for quick searches and automation**
- Command-line tool
- Immediate results
- No setup required (just API keys)
- Easy to schedule with cron
- [→ See PYTHON_README.md](PYTHON_README.md)

### 🌐 Next.js Web App (Full Featured)
**Beautiful UI with database and automation**
- Modern web interface
- Database storage
- Automation scheduling
- Results dashboard
- [↓ Setup instructions below](#-getting-started)

---

## ✨ Features (Next.js Web Version)

- 🔍 **Manual Search** - Find SEO leads on-demand by location and industry
- ⏰ **Automation** - Schedule weekly lead generation runs
- 📊 **Results Dashboard** - View, filter, and export your leads
- 🔒 **Password Protection** - Secure access to the tool
- 🎨 **Beautiful UI** - Glassmorphic design with smooth animations
- ⚡ **Real-time SEO Analysis** - Uses Google PageSpeed Insights API

---

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Google Places API** - Business discovery
- **PageSpeed Insights API** - SEO scoring

---

## 🚀 Getting Started (Next.js Web Version)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and add your API keys:

```bash
GOOGLE_PLACES_API_KEY=your_key_here
PSI_API_KEY=your_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Default Password:** `sequel123` or `admin`

---

## 📁 Project Structure

```
cl-seo-auto/
├── app/
│   ├── api/search/          # API route for lead search
│   ├── search/              # Manual search page
│   ├── automation/          # Automation config page
│   ├── results/             # Results dashboard
│   └── page.tsx             # Landing page
├── components/
│   └── PasswordGate.tsx     # Authentication component
└── .env                     # API keys (not in git)
```

---

## 🔑 API Keys Needed

1. **Google Places API** - Get at [Google Cloud Console](https://console.cloud.google.com/)
2. **PageSpeed Insights API** - Same as above

*Note: You can use the same API keys from the old Streamlit project!*

---

## 🌐 Deployment

### Deploy to Vercel:

1. Push to GitHub (already done!)
2. Go to [vercel.com](https://vercel.com)
3. Import the `CL-SEO-AUTO` repository
4. Add environment variables in Vercel dashboard
5. Deploy!

---

## 🎯 How It Works

1. **User enters location & industry** (or uses auto-discovery)
2. **Google Places API** finds businesses in that area
3. **PageSpeed Insights API** analyzes each website's SEO
4. **Results are scored** (0-100) based on SEO quality
5. **Leads are categorized** as Hot (70+), Warm (50-69), or Cold (<50)

---

## 📝 To-Do

- [ ] Add database for persistent lead storage
- [ ] Implement actual automation scheduler
- [ ] Add email discovery (Hunter.io integration)
- [ ] Add export to Google Sheets
- [ ] Add Slack notifications
- [ ] Improve SEO scoring algorithm

---

## 🔗 Related Projects

- **Old Streamlit Version**: `seo_lead_finder/` (still running at cl-seo.com)
- **C&L Page**: `candlpage/` (cl-page.com)

---

Built with 💜 by C&L Page Services
