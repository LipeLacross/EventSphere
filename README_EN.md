## 🌐 [Versão em Português](README.md)

# EventSphere

**EventSphere** is a modern platform for event promotion and management, featuring an interactive calendar, detailed event pages, attendee registration, and integrated maps to facilitate event discovery and participation. The project is built with cutting-edge web technologies to ensure speed, accessibility, and an excellent user experience.

---

## 🔨 Project Features

- **Home Page:** Highlights upcoming events and provides easy navigation.
- **Interactive Calendar:** Displays events by date, with filters by category and location.
- **Event Listing:** Shows all upcoming and past events with summary cards.
- **Event Details:** Complete event page with description, date, time, address, interactive map, and registration button.
- **Event Registration:** Form with validation, confirmation, and secure storage of registrations.
- **Integrated Map:** Displays event location on a map (Mapbox), with route planning.
- **Administration:** Restricted area for creating, editing, and deleting events, as well as viewing registrations.
- **Image Upload:** Allows adding images to events.
- **Email Notifications:** Sends automatic confirmation emails to registrants.
- **Responsiveness & Accessibility:** Layout adapts to any device, with a focus on accessibility.

---

### Visual Example

![chrome-capture-2025-6-15](https://github.com/user-attachments/assets/64cbf9f9-a10b-4c70-b241-79c8ee527082)
![Screenshot_15-6-2025_2916_supabase com](https://github.com/user-attachments/assets/a6e44d1a-4c3f-441d-805c-65c379873026)

## ✔️ Techniques and Technologies Used

- **Frontend:** [Nuxt.js 3 (Vue 3)](https://nuxt.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [Nuxt UI](https://ui.nuxt.com/)
- **Backend/API:** Nuxt Server API (`/server/api`)
- **Database:** [Supabase](https://supabase.com/) (can be adapted for Firebase, MongoDB, etc.)
- **Maps:** [Mapbox](https://mapbox.com/) (or Google Maps/Leaflet)
- **State Management:** [Pinia](https://pinia.vuejs.org/) (optional)
- **Hosting:** Vercel, Netlify, or similar
- **Other:** Authentication, image upload, email sending (Nodemailer)

---

## 📁 Project Structure

```
my-event-app/
├── LICENSE
├── README.md
├── README_EN.md
├── app.config.ts
├── app.vue
├── assets/
│   └── css/
│   └── favicon.ico
├── components/
│   ├── events/
│   │   ├── Calendar.vue
│   │   ├── EventCard.vue
│   │   ├── EventDetails.vue
│   │   ├── EventForm.vue
│   │   └── Map.vue
│   └── ui/
│       └── RegistrationForm.vue
├── composables/
├── content.config.ts
├── database.types.ts
├── error.vue
├── eslint.config.mjs
├── ideas.txt
├── middleware/
│   └── admin.ts
├── nuxt.config.ts
├── package-lock.json
├── package.json
├── pages/
│   ├── admin/
│   │   ├── index.vue
│   │   └── registrations.vue
│   ├── confirm.vue
│   ├── events/
│   │   ├── [id].vue
│   │   └── index.vue
│   ├── index.vue
│   └── login.vue
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── server/
│   └── api/
│       ├── events/
│       │   └── [id].ts
│       ├── events.get.ts
│       ├── events.ts
│       ├── mail.ts
│       ├── registrations.post.ts
│       └── registrations.ts
│   └── tsconfig.json
├── stores/
│   └── events.ts
├── tailwind.config.js
├── tsconfig.json
└── types/
    └── index.ts
```

---

## 🛠️ How to Run the Project

To start the project locally, follow these steps:

1. **Make sure Node.js is installed:**
   - [Node.js](https://nodejs.org/) is required. Check with:
     ```
     node -v
     ```
   - If not installed, download and install the recommended version.

2. **Clone the Repository:**
   ```
   git clone [YOUR_REPOSITORY_URL]
   cd my-event-app
   ```

3. **Configure environment variables:**
   - Create a `.env` file at the root and add:
     ```
     NUXT_PUBLIC_SUPABASE_URL=...
     NUXT_PUBLIC_SUPABASE_KEY=...
     NUXT_PUBLIC_MAPBOX_KEY=...
     SMTP_HOST=...
     SMTP_USER=...
     SMTP_PASS=...
     ```

4. **Install dependencies:**
   ```
   npm install
   ```

5. **Run the project in development mode:**
   ```
   npm run dev
   ```
   - The site will be available at [http://localhost:3000](http://localhost:3000).

---

## 🌐 Deploy

- **Vercel:**  
  - Log in at [vercel.com](https://vercel.com/), connect the repository, and follow the standard deploy flow.
  - Set environment variables in the Vercel dashboard.
- **Netlify:**  
  - Log in at [netlify.com](https://netlify.com/), connect the repository, set environment variables, and publish.
- **Other:**  
  - The project is compatible with any service that runs Node.js/Nuxt.js applications.

---

## 📢 Notes

- The project is easily adaptable to other databases or map services.
- For production, review authentication rules and sensitive variables.
- See complete code examples in the `/components/`, `/pages/`, and `/server/api/` folders.

