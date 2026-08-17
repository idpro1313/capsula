# 📡 Capsula API Documentation

## Base URL
```
Production: https://api.capsula.game
Development: http://localhost:3000
```

## Authentication

Telegram Mini App authentication uses `initData` from Telegram WebApp.

### Headers
```
Authorization: Bearer <init_data>
Content-Type: application/json
```

---

## Users

### Get Current User
```
GET /api/users/me
```

**Response:**
```json
{
  "id": "uuid",
  "telegramId": "123456789",
  "username": "username",
  "firstName": "First",
  "starsBalance": 500,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Update User
```
PATCH /api/users/me
```

**Request:**
```json
{
  "firstName": "New Name"
}
```

---

## Pets

### List User's Pets
```
GET /api/pets
```

**Query Parameters:**
- `limit` (optional): Number of pets to return (default: 20)
- `offset` (optional): Pagination offset
- `rarity` (optional): Filter by rarity

**Response:**
```json
{
  "pets": [
    {
      "id": "uuid",
      "name": "Стелла",
      "type": "STIRLING",
      "rarity": "RARE",
      "level": 5,
      "experience": 45,
      "hunger": 80,
      "happiness": 65,
      "energy": 50,
      "isTradable": true
    }
  ],
  "total": 15
}
```

### Get Pet Details
```
GET /api/pets/:id
```

### Create Pet (via Capsule)
```
POST /api/pets
```

**Request:**
```json
{
  "capsuleType": "medium"
}
```

**Response:**
```json
{
  "pet": {
    "id": "uuid",
    "name": "Огненёк",
    "type": "FLAMIKIN",
    "rarity": "UNCOMMON",
    "level": 1,
    "hunger": 50,
    "happiness": 50,
    "energy": 50
  },
  "starsSpent": 50
}
```

### Update Pet Stats
```
PATCH /api/pets/:id
```

**Request:**
```json
{
  "action": "feed" | "play" | "rest" | "wash",
  "itemId": "uuid"  // optional, if using item
}
```

### Evolve Pet
```
POST /api/pets/:id/evolve
```

**Response:**
```json
{
  "evolved": true,
  "newPet": {
    "id": "uuid",
    "name": "Огненёк II",
    "level": 6,
    "generation": 2
  }
}
```

---

## Capsules

### Get Available Capsules
```
GET /api/capsules
```

**Response:**
```json
{
  "capsules": [
    {
      "id": "small",
      "name": "Малая капсула",
      "price": 10,
      "count": 1,
      "rarities": ["COMMON", "UNCOMMON", "RARE"]
    }
  ]
}
```

### Open Capsule
```
POST /api/capsules/open
```

**Request:**
```json
{
  "type": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "pet": {
    "id": "uuid",
    "name": "Росинка",
    "type": "DROPLET",
    "rarity": "RARE"
  },
  "newBalance": 450
}
```

---

## Inventory

### Get User Inventory
```
GET /api/inventory
```

**Response:**
```json
{
  "items": [
    {
      "id": "uuid",
      "type": "FOOD",
      "name": "Ягоды",
      "quantity": 10,
      "effect": {
        "stat": "hunger",
        "value": 20
      }
    }
  ]
}
```

### Use Item
```
POST /api/inventory/:itemId/use
```

**Request:**
```json
{
  "petId": "uuid"
}
```

---

## Mini-Games

### Play Game
```
POST /api/games/play
```

**Request:**
```json
{
  "gameType": "catch_star",
  "score": 75,
  "boostUsed": {
    "magnet": true,
    "time": false
  }
}
```

**Response:**
```json
{
  "score": 75,
  "rewards": {
    "food": 2
  },
  "newBalance": 12
}
```

### Get Leaderboard
```
GET /api/games/leaderboard
```

**Query Parameters:**
- `limit` (optional): Number of entries (default: 20)

**Response:**
```json
{
  "entries": [
    {
      "rank": 1,
      "userId": "uuid",
      "firstName": "Player",
      "totalLevel": 150,
      "bestPetRarity": "LEGENDARY"
    }
  ]
}
```

---

## Trading

### List Active Trades
```
GET /api/trades
```

**Query Parameters:**
- `status`: ACTIVE | COMPLETED | CANCELLED (default: ACTIVE)
- `limit`: Number of results
- `offset`: Pagination

### Create Trade
```
POST /api/trades
```

**Request:**
```json
{
  "petId": "uuid",
  "priceStars": 50  // optional, null for gift
}
```

### Accept Trade
```
POST /api/trades/:id/accept
```

### Cancel Trade
```
POST /api/trades/:id/cancel
```

---

## Economy

### Get Balance
```
GET /api/economy/balance
```

**Response:**
```json
{
  "starsBalance": 500
}
```

### Daily Reward
```
POST /api/economy/daily
```

**Response:**
```json
{
  "rewarded": true,
  "streak": 5,
  "starsEarned": 5,
  "newBalance": 505
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Недостаточно звёзд"
  }
}
```

### Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing auth |
| `NOT_FOUND` | 404 | Resource not found |
| `INSUFFICIENT_BALANCE` | 400 | Not enough Stars |
| `PET_NOT_TRADABLE` | 400 | Pet is locked (24h) |
| `EVOLUTION_NOT_POSSIBLE` | 400 | Requirements not met |
| `VALIDATION_ERROR` | 400 | Invalid request data |

---

## WebSocket (Real-time)

For real-time updates (trades, gifts):

```
wss://api.capsula.game/ws
```

**Authentication:**
```json
{
  "type": "auth",
  "data": "<init_data>"
}
```

**Events:**
- `trade:new` — New trade created
- `trade:completed` — Trade completed
- `gift:received` — Gift received from another player