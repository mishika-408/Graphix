# Graphix
### Making mathematics visual, interactive, and easier to explore.

Graphix is an interactive mathematics application designed to connect algebra with geometry through visualising maths. It helps users explore mathematical equations through 2D and 3D graphs and solve equations.

## About the Project

Mathematics can become increasingly abstract as equations grow more complex. This makes mathematics difficult to understand at a higher level, and causes many people to dislike mathematics, and even be afraid of it.

Graphix was created to make these concepts easier to understand by connecting symbolic mathematical expressions with visual representations.

The goal is to make mathematics more easy to explore, and to understand, helping users see the relationships behind equations rather than relying on symbols alone. Maths should become an approachable subject for all, instead of something unreachable due to the lack of visual aid.

## Features

- **2D Graph Visualisation** — Explores mathematical relationships through two-dimensional graphs.
- **3D Graph Visualisation** — Visualises supported mathematical equations and relationships in three dimensions.
- **Equation Solving** — Solve equations using the application's mathematical tools.
- **Interactive Exploration** — Explore mathematical concepts through a visual interface.

Feature availability depends on the types of equations supported by the application.

## Tech Stack

### Frontend

- **React** — User interface
- **TypeScript** — Type-safe development
- **Vite** — Development server and build tool
- **Plotly.js** — Interactive graph visualisation
- **Math.js** — Mathematical expressions and calculations
- **Tailwind CSS** — Styling
- **Radix UI** — Accessible interface components

### Backend

- **Node.js** — JavaScript runtime
- **Express 5** — API server
- **TypeScript** — Backend development and type-checking
- **Drizzle ORM** — Database access
- **PostgreSQL** — Database
- **Pino** — Application logging

### Development Tools

- **pnpm workspaces** — Monorepo and dependency management
- **esbuild** — Backend bundling

## Project Structure

```text
Graphix/
├── artifacts/
│   ├── graphix/        # Frontend application
│   ├── api-server/     # Backend API server
│   └── mockup-sandbox/ # Mockup/prototype workspace
├── lib/                # Shared libraries and packages
├── scripts/            # Development scripts
├── package.json        # Workspace scripts and configuration
├── pnpm-workspace.yaml
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 24
- pnpm
- PostgreSQL, with a database connection string

### Installation

Clone the repository and enter the project directory:

```bash
git clone https://github.com/mishika-408/Graphix.git
cd Graphix
```

Install dependencies from the repository root:

```bash
pnpm install
```

### Configuration

The backend requires a `DATABASE_URL` environment variable containing a PostgreSQL connection string.

The frontend's Vite configuration also requires `PORT` and `BASE_PATH` environment variables. Configure these according to your local development environment before starting the frontend.

**Note:** The local development setup may require additional configuration to connect the frontend, backend, and database correctly.

## Available Commands

Run these commands from the repository root:

| Command | Purpose |
|---|---|
| `pnpm run typecheck` | Type-check the configured workspace packages |
| `pnpm run build` | Type-check and build eligible workspace packages |
| `pnpm --filter @workspace/api-server run dev` | Build and start the API server in development mode |

The frontend also provides `dev`, `build`, and `serve` scripts through its workspace package.

## Screenshots

Screenshots of the Graphix interface and its visualisation features will be added here.

## Future Improvements

Potential areas for future development include:

- Improving the reliability of 3D visualisations for supported equations.
- Expanding the range of mathematical expressions the application can handle.
- Refining the user experience for exploring complex mathematical concepts.
- Adding further examples and learning-oriented features.

## Motivation

Graphix explores how technology can make abstract mathematics more accessible through visual learning. It brings together mathematical problem-solving, interactive visualisation, and software development in an effort to make equations easier to explore and understand. All in all, it helps the ordinary man understand complex mathematical terms through graphical representation (or graphics), and tries to lessen the fear and stigma associated with maths as a subject.

*Built with curiosity and a love for mathematics.*
