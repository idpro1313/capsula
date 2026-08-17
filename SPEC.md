# 🫧 КАПСУЛА — Спецификация проекта

> Виртуальные питомцы в Telegram с Gacha, уходом и эволюцией

---

## 1. Концепт и Видение

**Капсула** — это коллекционная игра с виртуальными питомцами, встроенная в Telegram. Игроки покупают капсулы за Stars, получают случайных питомцев с разной редкостью, ухаживают за ними, эволюционируют и торгуют с другими игроками. Игра сочетает удовлетворение от гатчи-механики, заботу о виртуальном питомце и социальное взаимодействие через торговлю.

**Ощущение:** Азарт от вскрытия капсулы + нежность от заботы о питомце + гордость от редкой коллекции.

---

## 2. Дизайн-язык

### Эстетика
- **Направление:** Мягкий готча-стиль с элементами kawaii. Напоминает виртуальные игрушки 90-х (Tamagotchi, Gashapon).
- **Референсы:** Gachapon, Tamagotchi, Axie Infinity, Genshin Impact wish system

### Цветовая палитра
```
Primary:        #7C3AED (фиолетовый — мистика капсулы)
Secondary:      #EC4899 (розовый — мягкость, забота)
Accent:         #F59E0B (золотой — редкость, ценность)
Background:     #0F0F23 (тёмный космос — как внутри капсулы)
Surface:        #1A1A2E (карточки, модалки)
Text Primary:   #FFFFFF
Text Secondary: #A1A1AA
Success:        #10B981
Danger:         #EF4444
```

### Редкости (визуальная идентификация)
```
⚪ Обычный (Common)    — #A1A1AA серый, 60% шанс
🟢 Необычный (Uncommon)— #22C55E зелёный, 25% шанс
🔵 Редкий (Rare)       — #3B82F6 синий, 10% шанс
🟣 Эпический (Epic)    — #A855F7 фиолетовый, 4% шанс
🟡 Легендарный (Legend)— #F59E0B золотой, 1% шанс
🌈 Мифический (Mythic) — градиент радуги, <0.1% шанс
```

### Типографика
- **Заголовки:** Inter Bold / 700
- **Основной текст:** Inter Regular / 400
- **Акценты:** Inter Semibold / 600
- **Эмодзи и иконки:** Native emoji + Lucide icons

### Анимации
- **Вскрытие капсулы:** 2-3 секунды "встряхивания", затем вылет питомца с искрами
- **Получение питомца:** fade-in + scale от 0.5 до 1 + glow-эффект для редких
- **Кормление:** bounce-анимация питомца, "+1" к стату
- **Эволюция:** flash + morphing-эффект, смена формы

---

## 3. Структура данных

### User (Пользователь)
```typescript
{
  id:            UUID
  telegram_id:   bigint (unique)
  username:      string?
  first_name:    string
  stars_balance: integer (default: 0)
  created_at:    datetime
  updated_at:    datetime
}
```

### Pet (Питомец)
```typescript
{
  id:           UUID
  owner_id:     UUID (FK User)
  name:         string
  type:         PetType enum
  rarity:       Rarity enum
  generation:   integer (default: 1)
  level:        integer (default: 1)
  experience:   integer (default: 0)
  stats: {
    hunger:     integer (0-100, default: 50)
    happiness:  integer (0-100, default: 50)
    energy:     integer (0-100, default: 50)
  }
  evolved_from: UUID? (FK Pet, для цепочки эволюции)
  is_tradable:  boolean (default: true,锁定 24ч после покупки)
  created_at:   datetime
}
```

### Item (Предмет)
```typescript
{
  id:          UUID
  type:        ItemType enum // food, toy, boost
  name:        string
  description: string
  effect:      JSON { stat: string, value: number, duration?: number }
  image_url:   string
  price_stars: integer?
}
```

### Inventory (Инвентарь)
```typescript
{
  id:       UUID
  user_id:  UUID (FK User)
  item_id:  UUID (FK Item)
  quantity: integer (default: 1)
}
```

### Trade (Обмен)
```typescript
{
  id:         UUID
  seller_id:  UUID (FK User)
  buyer_id:   UUID? (FK User, null пока active)
  pet_id:     UUID (FK Pet)
  status:     TradeStatus enum // active, completed, cancelled
  price_stars:integer? (опционально, для продажи за Stars)
  created_at: datetime
  completed_at: datetime?
}
```

### DailyReward (Ежедневная награда)
```typescript
{
  id:        UUID
  user_id:   UUID (FK User)
  streak:    integer (дни подряд)
  last_claim:datetime
  reward:    JSON { type: string, value: number }
}
```

---

## 4. Игровые механики

### 4.1 Gacha-система (Капсулы)

**Типы капсул:**
| Тип капсулы | Цена (Stars) | Содержимое |
|-------------|--------------|------------|
| 🎁 Малая | 10 ⭐ | 1 питомец (Common-Uncommon) |
| 🎁 Средняя | 50 ⭐ | 3 питомца (Common-Rare) |
| 🎁 Большая | 100 ⭐ | 5 питомцев + гарантия Rare |
| 🎁 Золотая | 500 ⭐ | 1 питомец, гарантия Epic+ |

**Редкость (шанс):**
```
Малая:    Common 70%, Uncommon 25%, Rare 5%
Средняя:  Common 60%, Uncommon 25%, Rare 12%, Epic 3%
Большая:  Common 50%, Uncommon 30%, Rare 15%, Epic 4%, Legendary 1%
Золотая:  Rare 50%, Epic 35%, Legendary 14%, Mythic 1%
```

**Типы питомцев (v1.0):**
- 🌟 Стиллинг (Stirling) — звездный дух
- 🔥 Флэмкин (Flamikin) — огненный лисёнок
- 💧 Дропли (Droplet) — водяной кот
- 🌿 Гровли (Growly) — лесной медвежонок
- ⚡ Спаркл (Sparkle) — электрический ёжик
- 🌙 Лунарик (Lunarik) — лунный кролик

### 4.2 Статы и уход

**Три основных статы:**
- 🍖 Голод (Hunger): 0-100. Падает на 5 каждые 2 часа. При 0 — уровень питомца не растёт.
- 😊 Счастье (Happiness): 0-100. Падает на 3 каждые 3 часа. Влияет на шанс редкой эволюции.
- ⚡ Энергия (Energy): 0-100. Падает на 2 каждый час. Нужна для мини-игр.

**Действия игрока:**
| Действие | Стоимость | Эффект |
|----------|-----------|--------|
| 🫐 Покормить | 1 еда | +20 Hunger |
| 🎾 Поиграть | 1 игрушка | +15 Happiness |
| 💤 Отдохнуть | 2 часа | +30 Energy |
| 🛁 Помыть | 10 ⭐ или +50 Happiness | +10 ко всем статам, удаляет "грязь" |

### 4.3 Эволюция

**Уровни эволюции:**
```
1 ★ Базовый     → 2 ★ Росток     (уровень 5 + Hunger>80)
2 ★ Росток      → 3 ★ Взрослый   (уровень 15 + Happiness>80)
3 ★ Взрослый    → 4 ★ Чемпион    (уровень 30 + Energy>90)
4 ★ Чемпион     → 5 ★ Легенда    (уровень 50 + все статы 100)
```

**Опыт (XP):**
- За каждую единицу ухода: +10 XP
- За прохождение мини-игры: +50 XP
- Бонус за статы > 90: x1.5 XP

### 4.4 Мини-игры

**"Поймай звезду" (MVP):**
- Игрок ловит падающие звёзды 30 секунд
- Поймал — +1 очко
- Очки конвертируются в еду (10 очков = 1 еда)
- Можно купить магнит-буст за Stars (x2 очки 1 игра)

**Бусты (покупаются за Stars):**
| Буст | Цена | Эффект |
|------|------|--------|
| 🧲 Магнит | 5 ⭐ | x2 очки в мини-игре |
| ⚡ Ускорение | 10 ⭐ | +15 секунд игры |
| 🍖 Фурминут | 20 ⭐ | x3 еда за игру |

### 4.5 Торговля

**Правила:**
- Питомец доступен для трейда через 24 часа после получения
- Обмен через Telegram-бот: создаётся oferta, другой игрок принимает
- Можно продать за Stars другому игроку
- Комиссия платформы: 5%

**Flow:**
1. Продавец: `/trade` → выбирает питомца → указывает цену (или 0 для безвозмездного)
2. Бот создаёт trade offer, публикует в канал/список
3. Покупатель: `/buy` → видит список → выбирает → оплачивает Stars
4. Питомец переводится, Stars зачисляются продавцу

---

## 5. Структура проекта

```
capsula/
├── apps/
│   ├── bot/                    # Telegram Bot (Grammy + Node.js)
│   │   ├── src/
│   │   │   ├── index.ts        # Entry point
│   │   │   ├── commands/        # /start, /menu, /profile
│   │   │   ├── handlers/       # Callback handlers
│   │   │   ├── services/       # Game logic
│   │   │   └── keyboards/      # Inline keyboards
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                    # Mini App (React + Vite)
│       ├── src/
│       │   ├── main.tsx
│       │   ├── App.tsx
│       │   ├── components/      # UI components
│       │   ├── pages/          # Screens
│       │   ├── hooks/          # Custom hooks
│       │   ├── stores/         # Zustand stores
│       │   └── api/            # API client
│       ├── public/
│       ├── package.json
│       └── vite.config.ts
│
├── packages/
│   └── shared/                  # Shared types & utils
│       ├── src/
│       │   ├── types/
│       │   └── constants/
│       └── package.json
│
├── docs/
│   └── API.md                   # API documentation
│
├── docker-compose.yml           # PostgreSQL + App
├── .env.example
├── README.md
└── package.json                 # Workspace root
```

---

## 6. API Endpoints

### Authentication
```
GET  /api/auth/telegram -> { user_id, token }
POST /api/auth/verify    -> { success: boolean }
```

### Users
```
GET  /api/users/me              -> User
GET  /api/users/:id             -> User (public info)
PATCH /api/users/me              -> User (update profile)
```

### Pets
```
GET    /api/pets                -> Pet[] (my pets)
GET    /api/pets/:id            -> Pet
POST   /api/pets                -> Pet (create via capsule)
PATCH  /api/pets/:id            -> Pet (feed, play, rest)
POST   /api/pets/:id/evolve     -> Pet (evolve if possible)
```

### Inventory
```
GET  /api/inventory             -> InventoryItem[]
POST /api/inventory/:itemId/use -> { success, newStats }
```

### Capsules
```
POST /api/capsules/open          -> { pet, capsule }
GET  /api/capsules/types         -> CapsuleType[]
```

### Mini-games
```
POST /api/games/play             -> { score, rewards }
GET  /api/games/leaderboard      -> LeaderboardEntry[]
```

### Trading
```
GET  /api/trades                -> Trade[] (active)
POST /api/trades                -> Trade (create)
POST /api/trades/:id/accept     -> Trade (complete)
POST /api/trades/:id/cancel     -> Trade (cancel)
```

### Economy
```
POST /api/economy/buy-stars     -> { stars_balance }
GET  /api/economy/balance       -> { stars_balance }
```

---

## 7. Telegram Bot Commands

| Команда | Описание |
|---------|----------|
| `/start` | Приветствие + быстрый старт |
| `/menu` | Главное меню (inline keyboard) |
| `/profile` | Профиль + баланс Stars |
| `/inventory` | Список питомцев |
| `/capsules` | Магазин капсул |
| `/trade` | Торговля питомцами |
| `/game` | Мини-игра |
| `/help` | Справка |

---

## 8. Mini App Screens

1. **Splash** — логотип + загрузка
2. **Onboarding** — приветствие, разрешения
3. **Main Menu** — быстрые действия: открыть капсулу, питомцы, магазин
4. **Inventory** — сетка питомцев с фильтрами
5. **Pet Card** — детальный вид питомца + действия
6. **Capsule Opening** — анимированное вскрытие
7. **Shop** — покупка капсул, бустов, еды
8. **Mini-game** — "Поймай звезду"
9. **Trade** — создание/просмотр офферов
10. **Leaderboard** — топ игроков
11. **Settings** — профиль, уведомления

---

## 9. MVP Roadmap

### Phase 1: Core Loop (2 недели)
- [ ] Telegram Bot с командами
- [ ] Регистрация пользователей
- [ ] Gacha-система (капсулы)
- [ ] Базовая забота (кормление)
- [ ] Простая база данных

### Phase 2: Engagement (1 неделя)
- [ ] Мини-игра "Поймай звезду"
- [ ] Система уровней и XP
- [ ] Инвентарь предметов
- [ ] Ежедневные награды

### Phase 3: Social (1 неделя)
- [ ] Эволюция питомцев
- [ ] Торговля между игроками
- [ ] Лидерборд
- [ ] Telegram Stars интеграция

### Phase 4: Polish (0.5 недели)
- [ ] Mini App UI
- [ ] Анимации
- [ ] Уведомления
- [ ] Балансировка

---

## 10. Баланс и экономика

### Начальные ресурсы
- Новый игрок получает: 50 Stars бонус + 1 бесплатная малая капсула

### Ежедневный вход
- Вход в игру: +5 Stars
- streak 7 дней: +20 Stars
- streak 30 дней: +100 Stars

### Магазин Stars (рекомендуемые цены Telegram)
```
50 ⭐  -> $0.50
500 ⭐ -> $5.00
1000 ⭐ -> $10.00
```

### Расход Stars (внутриигровые)
```
Малая капсула:      10 ⭐
Средняя капсула:    50 ⭐
Большая капсула:    100 ⭐
Золотая капсула:    500 ⭐
Магнит-буст:        5 ⭐
Ускорение:          10 ⭐
Большая еда:        15 ⭐
Мытьё питомца:      10 ⭐
```

---

## 11. Технический стек

| Компонент | Технология |
|-----------|------------|
| **Bot Framework** | Grammy (Node.js) + Express |
| **Language** | TypeScript |
| **Database** | PostgreSQL + Prisma ORM |
| **Mini App** | React + Vite + TailwindCSS |
| **State Management** | Zustand |
| **Telegram SDK** | @twa/sdk |
| **Payments** | Telegram Stars |
| **Container** | Docker + Docker Compose |
| **CI/CD** | GitHub Actions |

---

## 12. Деплой в Docker

### Структура файлов

```
capsula/
├── docker-compose.yml          # Production (webhook mode)
├── docker-compose.dev.yml      # Development (long-polling)
├── .env.example                # Environment template
├── .dockerignore               # Build exclusions
├── apps/
│   └── bot/
│       └── Dockerfile          # Multi-stage build
```

### Переменные окружения

| Переменная | Обязательно | Описание |
|------------|-------------|----------|
| `BOT_TOKEN` | Да | Токен бота от @BotFather |
| `WEBHOOK_URL` | Prod | Public HTTPS URL для webhooks |
| `WEBHOOK_PATH` | Нет | Путь webhook (default: `/webhook`) |
| `POSTGRES_PASSWORD` | Да | Пароль PostgreSQL |
| `DATABASE_URL` | Auto | Генерируется автоматически |

### Запуск (Production)

```bash
# 1. Клонировать и настроить
git clone <repo>
cd capsula
cp .env.example .env
# Редактировать .env: BOT_TOKEN, WEBHOOK_URL, POSTGRES_PASSWORD

# 2. Собрать и запустить
docker-compose up -d --build

# 3. Миграции БД
docker-compose exec bot npx prisma migrate deploy

# 4. Проверить
curl http://localhost:3000/health
```

### Запуск (Development)

```bash
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml logs -f
```

### Health Check

```bash
# HTTP health
curl http://localhost:3000/health
# {"status":"ok","timestamp":"2025-01-17T00:00:00.000Z"}

# Docker health status
docker-compose ps
```

---

*Document version: 1.0.0*
*Last updated: 2025-01-17*