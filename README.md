# 🫧 КАПСУЛА — Virtual Pets Collection Game

Telegram Mini App + Bot game with Gacha, pet care, evolution and trading mechanics.

## 🎮 Features

- **Gacha System**: Buy capsules for Telegram Stars, get random pets with different rarities
- **Pet Care**: Feed, play, and rest with your pets to keep them happy
- **Evolution**: Level up and evolve pets to stronger forms
- **Mini-games**: Play "Catch the Star" to earn food for your pets
- **Trading**: Exchange pets with other players

## 🏗️ Architecture

```
capsula/
├── apps/
│   ├── bot/          # Telegram Bot (Grammy + Node.js + Express)
│   └── web/          # Mini App (React + Vite)
├── packages/
│   └── shared/       # Shared types & constants
├── docs/
│   └── SPEC.md       # Full specification
├── docker-compose.yml        # Production
├── docker-compose.dev.yml    # Development
└── .env.example
```

---

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Telegram Bot Token (from [@BotFather](https://t.me/BotFather))
- Domain with HTTPS (for production webhooks)

### Option 1: Production Docker (Recommended)

1. **Clone and configure:**
```bash
git clone <repo-url>
cd capsula
cp .env.example .env
```

2. **Edit `.env`:**
```env
BOT_TOKEN=your_bot_token_from_botfather
WEBHOOK_URL=https://your-domain.com
POSTGRES_PASSWORD=your_secure_password
```

3. **Start services:**
```bash
docker-compose up -d --build
```

4. **Setup database:**
```bash
docker-compose exec bot npx prisma migrate deploy
docker-compose exec bot npx prisma generate
```

5. **Set webhook:**
```bash
# The bot will auto-set webhook on startup if WEBHOOK_URL is set
# Or manually:
docker-compose exec bot sh -c "curl -X POST https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${WEBHOOK_URL}/webhook"
```

### Option 2: Development with Docker

```bash
# Start with dev compose (uses long-polling)
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f bot

# Stop
docker-compose -f docker-compose.dev.yml down
```

### Option 3: Local Development

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env

# Start PostgreSQL
docker-compose up -d db

# Setup database
npm run db:generate
npm run db:migrate

# Run bot
npm run dev:bot

# Run web (separate terminal)
npm run dev:web
```

---

## 🐳 Docker Configuration

### Production (`docker-compose.yml`)

- Uses **webhook mode** for Telegram (required for production)
- Auto-restart on failure
- Health checks included
- Non-root user for security
- Secrets via environment variables

### Development (`docker-compose.dev.yml`)

- Uses **long-polling mode** (no HTTPS needed)
- Source code mounted for hot reload
- Exposed ports for debugging

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BOT_TOKEN` | Yes | Telegram bot token from @BotFather |
| `WEBHOOK_URL` | Production | Public HTTPS URL for webhooks |
| `WEBHOOK_PATH` | No | Webhook path (default: `/webhook`) |
| `POSTGRES_PASSWORD` | Yes | PostgreSQL password |
| `DATABASE_URL` | Auto | PostgreSQL connection string |

### Health Check

```bash
# Check bot health
curl http://localhost:3000/health

# Check container status
docker-compose ps
docker-compose exec bot wget --spider http://localhost:3000/health
```

---

## 🔄 Updating

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Run migrations if needed
docker-compose exec bot npx prisma migrate deploy
```

---

## 📱 Bot Commands

| Command | Description |
|---------|-------------|
| `/start` | Start the game |
| `/menu` | Main menu |
| `/profile` | View your profile |
| `/inventory` | List your pets |
| `/capsules` | Shop for capsules |
| `/trade` | Trade pets |
| `/game` | Mini-game |
| `/help` | Help |

---

## 🎁 Capsule Types

| Type | Price | Contents |
|------|-------|----------|
| Small | 10 ⭐ | 1 pet (Common-Uncommon) |
| Medium | 50 ⭐ | 3 pets (Common-Rare) |
| Big | 100 ⭐ | 5 pets + Rare guarantee |
| Golden | 500 ⭐ | 1 pet, Epic+ guarantee |

---

## 🐾 Pet Rarities

- ⚪ **Common** — 60% (small), 50% (big)
- 🟢 **Uncommon** — 25%
- 🔵 **Rare** — 10% (small), 15% (big)
- 🟣 **Epic** — 3-4%
- 🟡 **Legendary** — 1%
- 🌈 **Mythic** — <0.1%

---

## 🛠️ Tech Stack

- **Bot**: Node.js + TypeScript + Grammy + Express
- **Database**: PostgreSQL + Prisma ORM
- **Mini App**: React + Vite + TailwindCSS + Zustand
- **Payments**: Telegram Stars
- **Container**: Docker + Docker Compose

---

## 📄 License

MIT