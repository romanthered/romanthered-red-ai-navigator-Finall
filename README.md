# RED AI NAVIGATOR

Interaktiver AI Coach der deutschen Anfängern hilft ihre perfekte AI Money Making Methode zu finden.

**WICHTIG:** User nutzen IHREN EIGENEN Claude API Key - du zahlst KEINE API Kosten! ✅

## 🚀 DEPLOYMENT ANLEITUNG (VERCEL)

### STEP 1: Code zu GitHub hochladen

1. Gehe zu github.com
2. Create New Repository: "red-ai-navigator"
3. In deinem Terminal (oder nutze GitHub Desktop):

```bash
cd red-ai-navigator
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DEIN-USERNAME/red-ai-navigator.git
git push -u origin main
```

### STEP 2: Vercel Deployment

1. Gehe zu **vercel.com**
2. Sign up / Login (mit GitHub)
3. Click "Add New Project"
4. Import "red-ai-navigator" Repository
5. Configure Project:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

6. **Environment Variables:** 
   KEINE NÖTIG! User nutzen ihre eigenen API Keys ✅

7. Click "Deploy"
8. Warte 2-3 Minuten

### STEP 3: Custom Domain (navigator.theredcircle.com)

1. Nach Deployment, gehe zu Project Settings
2. Click "Domains"
3. Add Domain: `navigator.theredcircle.com`
4. Vercel zeigt dir DNS Settings

5. **Bei deinem Domain Provider** (wo du theredcircle.com hostest):
   - Gehe zu DNS Settings
   - Add CNAME Record:
     ```
     Type: CNAME
     Name: navigator
     Value: cname.vercel-dns.com
     ```
   - Save

6. Warte 10-30 Minuten für DNS Propagation

### STEP 4: Whop Integration

In Whop App Builder:
```
Base URL: https://navigator.theredcircle.com
Experience path: /
Dashboard path: /
```

---

## 🔑 FÜR DEINE USER (Anleitung die du ihnen gibst)

**"So holst du deinen Claude API Key:"**

1. Gehe zu **console.anthropic.com**
2. Sign up / Login (kostenlos)
3. Gehe zu "API Keys"
4. Create New Key
5. Copy Key (beginnt mit `sk-ant-...`)
6. In RED AI NAVIGATOR: Click "⚙️ Einstellungen"
7. Paste deinen Key
8. Speichern ✅

**Kosten:** ~$0.50-1.00 für den kompletten Kurs (~50 Conversations)

---

## 💻 LOKALES TESTING (Optional)

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env und füge ANTHROPIC_API_KEY ein

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## 📱 FEATURES

- ✅ User bringen EIGENEN API Key (du zahlst nichts!)
- ✅ Settings Page für API Key Management
- ✅ 5-Level Progression System
- ✅ Claude Sonnet 4 Integration
- ✅ Progress Tracking (LocalStorage)
- ✅ Responsive Design
- ✅ Cyberpunk Theme
- ✅ Real-time Chat Interface
- ✅ Educational: User lernt API Nutzung!

---

## 🛠️ TECH STACK

- Next.js 14
- TypeScript
- Tailwind CSS
- Claude Sonnet 4 API (User's Keys)
- Vercel Hosting

---

## 🚨 WICHTIGE NOTIZEN

- **API Kosten**: User zahlt seine eigenen (~$0.50-1.00 für Kurs)
- **No Backend API Key needed**: Alles client-side
- **LocalStorage**: Progress UND API Key im Browser gespeichert
- **Educational Value**: User lernt API Setup als Teil des Kurses!
- **No Login**: Aktuell keine User Authentication

---

Made with 🔥 by Roman The Red
