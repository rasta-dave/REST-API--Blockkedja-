# Blockchain REST API

En Node.js blockchain-applikation med REST API som implementerar grundläggande blockchain-funktionalitet med Proof of Work mining.

## Funktioner

- **Blockchain med Proof of Work** - Mining med konfigurerbar svårighetsgrad
- **REST API** - Komplett API för blockchain-operationer
- **Transaktionshantering** - Stöd för komplexa transaktionsobjekt
- **Persistens** - Automatisk sparning till JSON-fil
- **Validering** - Blockkedjeintegritet och proof-of-work verifiering

## Installation

```bash
# Klona projektet
git clone <repository-url>
cd REST-API--Blockkedja-

# Installera dependencies
npm install

# Skapa nödvändiga mappar
mkdir -p data logs

# Starta utvecklingsserver
npm run dev
```

## API Endpoints

### Blockchain Operations

```
GET    /api/v1/blockchain           # Hämta hela blockkedjan
GET    /api/v1/blockchain/:index    # Hämta specifikt block
GET    /api/v1/blockchain/validate  # Validera kedjan
POST   /api/v1/blockchain           # Skapa nytt block
POST   /api/v1/blockchain/transaction  # Skapa transaktion
```

## Användning

### Hämta blockkedjan

```bash
curl http://localhost:3000/api/v1/blockchain
```

### Skapa transaktion

```bash
curl -X POST http://localhost:3000/api/v1/blockchain/transaction \
  -H "Content-Type: application/json" \
  -d '{
    "from": "Alice",
    "to": "Bob",
    "amount": 100,
    "description": "Payment for services"
  }'
```

### Skapa block med data

```bash
curl -X POST http://localhost:3000/api/v1/blockchain \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "message": "Custom block data",
      "type": "general"
    }
  }'
```

## Teknisk Implementation

- **Arkitektur**: MVC pattern med Repository layer
- **Mining**: SHA-256 Proof of Work algoritm
- **Validering**: Blockchain integrity checks
- **Felhantering**: Centraliserad error handling och loggning
- **Testing**: TDD med 50+ tester (Vitest)
- **Moduler**: ES6 modules (.mjs)

## Scripts

```bash
npm start      # Produktionsläge
npm run dev    # Utvecklingsläge (nodemon)
npm test       # Kör alla tester
```

## Projektstruktur

```
src/
├── models/           # Blockchain, Block, Transaction klasser
├── controllers/      # API request handlers
├── routes/          # Express routes
├── repositories/    # Data persistence layer
├── middleware/      # Error handling, logging
└── utilities/       # Helper functions
```

## Miljövariabler

Skapa `config/settings.env`:

```
NODE_ENV=development
PORT=3000
```
