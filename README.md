# Aura Canvas

A sleek and robust MERN-stack platform designed for artists to showcase their creativity and art enthusiasts to purchase premium artwork and subscriptions. Built with a decoupled architecture utilizing a Next.js frontend and an Express.js backend, seamlessly connected via high-performance API proxies.

---

## Live URL
* **Frontend (UI):** [https://aura-canvas-client.vercel.app](https://aura-canvas-client.vercel.app)
* **Backend (API Gateway):** [https://aura-canvas-server.onrender.com](https://aura-canvas-server.onrender.com)

---

## Project Purpose
**Aura Canvas** bridges the gap between digital/physical art creators and collectors. The primary objective is to build a highly secure, lightning-fast web application where users can discover artwork, artists can manage their sales dashboard, and payments are securely handled without facing modern cross-domain security (CORS) bottlenecks.

---

## Key Features

* **Advanced Decoupled Architecture:** Utilizes Next.js `rewrites` to proxy client-side requests (`/api/*`) directly to an isolated Express backend, eliminating standard multi-origin CORS errors.
* **Hybrid Authentication (Better-Auth + JWT):** Secure authentication managed via **Better-Auth** with token-based session tracking integrated smoothly inside Next.js edge-friendly Middleware.
* **Role-Based Protected Dashboards:** Granular route protection separating view configurations for Admin, Artist, and standard Users (`/dashboard/:path*`).
* **Interactive Art Gallery & Browsing:** dynamic data-fetching routes allowing seamless filtering, pagination, and structural rendering of individual artworks.
* **Secure Checkout Flows:** Dedicated payment pathways supporting artwork checkouts and dynamic tiered subscription modeling.payment system stripe.

---

## Tech Stack & NPM Packages Used

### Frontend (Next.js Client)
| Package | Purpose |
| :--- | :--- |
| `next` | Production React framework for server-side rendering and routing |
| `better-auth` | Core authentication engine client |
| `react` / `react-dom` | UI foundation layer |

### ⚡ Backend (Express Server)
| Package | Purpose |
| :--- | :--- |
| `express` | Fast, minimalist web framework for node endpoints |
| `better-auth` | Server-side authentication handler and schema provider |
| `cors` | Fallback cross-origin resource sharing layer (scoped exclusively) |
| `mongodb` / `mongoose` | Object Data Modeling (ODM) for database management |

---

## Installation and Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/Najmul-Huda70/aura-canvas-client.git](https://github.com/Najmul-Huda70/aura-canvas-client.git)
cd aura-canvas-client