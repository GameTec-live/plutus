# Plutus

> [!NOTE]
> Logo will be added here soon along with the initial design of the platform.

## What is Plutus?

Plutus is a project with the primary objective to develop an intuitive platform where users and communities can showcase their projects and, through seamless integration with [Open Collective](https://opencollective.com/), secure funding for their initiatives or contribute to projects they find compelling. Plutus streamlines the process of discovering, sharing, and financially supporting a diverse range of projects.

---
> **Fun Fact:** The name "Plutus" is derived from the Greek god of wealth, symbolizing the platform's mission to facilitate financial support for projects and communities.

## Getting Started

Plutus is a [Next.js](https://nextjs.org/) application using [Bun](https://bun.sh/) as the runtime environment. It leverages [Neon DB](https://neon.tech/) or PostgreSQL for database management, [Drizzle ORM](https://orm.drizzle.team/) for database interactions, and integrates with [Open Collective](https://opencollective.com/) for funding functionalities. The frontend is built with React and styled using Tailwind CSS.

### Prerequisites

- [Bun](https://bun.sh/) (v1.0 or later)
- [Neon DB](https://neon.tech/) account or a PostgreSQL database
- [Git](https://git-scm.com/)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/GameTec-live/plutus.git
   cd plutus
   ```

2. **Set up your database**
   - Create a [Neon DB](https://neon.tech/) project, or
   - Set up a local PostgreSQL database

3. **Configure environment variables**
   
   Copy the example environment file and fill in the required values:
   ```bash
   cp example.env .env
   ```
   
   Required environment variables:
   | Variable | Description |
   |----------|-------------|
   | `DATABASE_URL` | Your Neon DB or PostgreSQL connection string |
   | `BETTER_AUTH_SECRET` | Secret key for authentication (generate a secure random string) |
   | `BETTER_AUTH_URL` | Your application URL (e.g., `http://localhost:3000` for development) |

4. **Install dependencies**
   ```bash
   bun install
   ```

5. **Run database migrations** (if applicable)
   ```bash
   bun run drizzle-kit push
   ```

6. **Start the development server**
   ```bash
   bun run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

### Production Deployment

#### Option 1: Vercel (Recommended)

1. Push your code to a GitHub repository
2. Import the project in [Vercel](https://vercel.com/)
3. Configure the environment variables in the Vercel dashboard
4. Deploy with:
   ```bash
   vercel --prod
   ```

#### Option 2: Docker

1. Configure your `.env` file with production values
2. Build and run with Docker Compose:
   ```bash
   docker compose up -d
   ```

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start the development server |
| `bun run build` | Build the application for production |
| `bun run start` | Start the production server |
| `bun run lint` | Run ESLint to check for code issues |

## Documentation

**COMING SOON**