# Plutus

<p align="center">
  <img src="./docs/logo.png" alt="Plutus logo" width="50%"/>
</p>

## What is Plutus?

Plutus is a project with the primary objective to develop an intuitive platform where users and communities can showcase their projects and, through seamless integration with [Open Collective](https://opencollective.com/), secure funding for their initiatives or contribute to projects they find compelling. Plutus streamlines the process of discovering, sharing, and financially supporting a diverse range of projects.

---
> **Fun Fact:** The name "Plutus" is derived from the Greek god of wealth, symbolizing the platform's mission to facilitate financial support for projects and communities.

## Built With

* [![Next][Next.js]][Next-url]

* [![React][React.js]][React-url]

* [![Bun][Bun-img]][Bun-url]

* [![PostgreSQL][PostgreSQL-img]][PostgreSQL-url]

* [![OpenCollective][OpenCollective-img]][OpenCollective-url]



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
  | `GITHUB_CLIENT_ID` | GitHub OAuth application client ID |
  | `GITHUB_CLIENT_SECRET` | GitHub OAuth application client secret |
  | `MEILI_INDEX` |  |
  | `MEILI_MANAGE_KEY` |  |
  | `MEILI_MASTER_KEY` |  |
  | `MEILI_SEARCH_KEY` |  |
  | `MEILI_URL` |  |
  | `NEXT_PUBLIC_GITHUB_ENABLED` | Enable GitHub authentication (`true` or `false`) |
  | `NEXT_PUBLIC_MEILI_INDEX` |  |
  | `NEXT_PUBLIC_MEILI_SEARCH_KEY` | Public Meilisearch search key |
  | `NEXT_PUBLIC_MEILI_URL` | Public URL of your Meilisearch instance |
  | `NEXT_PUBLIC_OAUTH_ENABLED` | Enable OAuth authentication (`true` or `false`) |
  | `OAUTH_CLIENT_ID` | OAuth provider client ID |
  | `OAUTH_CLIENT_SECRET` | OAuth provider client secret |
  | `OAUTH_DISCOVERY_URL` |  |
  | `OPEN_COLLECTIVE_COLLECTIVE_URL` | URL of your Open Collective page |
  | `OPEN_COLLECTIVE_ENDPOINT` | Open Collective GraphQL API endpoint |
  | `OPEN_COLLECTIVE_TOKEN` | Open Collective API token |
  | `RESEND_API_KEY` |  |
  | `RESEND_BASE_URL` |  |
  | `RESEND_FROM_EMAIL` |  |
  | `S3_BUCKETNAME` | Name of your S3 bucket |
  | `S3_CLIENT` | S3-compatible storage provider name (cloudflare, backblaze, custom) |
  | `S3_KEY` | S3 secret access key |
  | `S3_KEY_ID` | S3 access key ID |
  | `S3_PUBLIC_URL` | Public URL used to serve uploaded files |
  | `S3_REGION` | Region where your S3 bucket is hosted |

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

<!-- MARKDOWN LINKS & IMAGES -->
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Bun-img]: https://img.shields.io/badge/BUN-grey?style=for-the-badge&logo=Bun&logoColor=FAF4EA&logoSize=auto
[Bun-url]: https://bun.com/
[PostgreSQL-img]: https://img.shields.io/badge/PostgreSQL-white?style=for-the-badge&logo=postgresql&logoColor=blue&logoSize=auto
[PostgreSQL-url]: https://www.postgresql.org/
[OpenCollective-img]: https://img.shields.io/badge/open%20collective-white?style=for-the-badge&logo=opencollective&logoColor=lightblue&logoSize=auto
[OpenCollective-url]: https://opencollective.com/
