## 🌐 [English Version of README](README_EN.md)

# EventSphere

O **EventSphere** é uma plataforma moderna para divulgação e gestão de eventos, com calendário interativo, páginas detalhadas de eventos, inscrição de participantes e mapas integrados para facilitar a descoberta e participação em eventos. O projeto foi desenvolvido com tecnologias web de ponta para garantir velocidade, acessibilidade e uma excelente experiência do usuário[3][4].

---

## 🔨 Funcionalidades do Projeto

- **Página Inicial:** Destaque dos próximos eventos e navegação fácil.
- **Calendário Interativo:** Visualização dos eventos por data, com filtros por categoria e localização.
- **Listagem de Eventos:** Exibição de todos os eventos futuros e passados, com cards resumidos.
- **Detalhe do Evento:** Página completa com descrição, data, horário, endereço, mapa interativo e botão de inscrição.
- **Inscrição em Eventos:** Formulário com validação, confirmação e armazenamento seguro das inscrições.
- **Mapa Integrado:** Visualização do local do evento no mapa (Mapbox), com possibilidade de traçar rota.
- **Administração:** Área restrita para cadastrar, editar e remover eventos, além de visualizar inscrições.
- **Upload de Imagens:** Permite adicionar imagens aos eventos.
- **Notificações por E-mail:** Envio automático de confirmação para inscritos.
- **Responsividade e Acessibilidade:** Layout adaptável a qualquer dispositivo, com foco em acessibilidade.

---

### Exemplo Visual do Projeto

> **Veja na pasta `/components/events/` exemplos dos principais componentes visuais, como calendário, cards e formulários.  
> O layout segue o padrão Nuxt UI, com design moderno e responsivo.**

---

## ✔️ Técnicas e Tecnologias Utilizadas

- **Frontend:** [Nuxt.js 3 (Vue 3)](https://nuxt.com/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/), [Nuxt UI](https://ui.nuxt.com/)
- **Backend/API:** Nuxt Server API (`/server/api`)
- **Banco de Dados:** [Supabase](https://supabase.com/) (pode ser adaptado para Firebase, MongoDB, etc.)
- **Mapas:** [Mapbox](https://mapbox.com/) (ou Google Maps/Leaflet)
- **Gerenciamento de Estado:** [Pinia](https://pinia.vuejs.org/) (opcional)
- **Hospedagem:** Vercel, Netlify ou similar
- **Outros:** Autenticação, upload de imagens, envio de e-mails (Nodemailer)

---

## 📁 Estrutura do Projeto

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

## 🛠️ Como abrir e rodar o projeto

Para iniciar o projeto localmente, siga os passos abaixo:

1. **Certifique-se de que o Node.js está instalado:**
   - O [Node.js](https://nodejs.org/) é necessário para rodar o projeto. Verifique com:
     ```
     node -v
     ```
   - Caso não esteja instalado, baixe e instale a versão recomendada.

2. **Clone o repositório:**
   ```
   git clone [URL_DO_SEU_REPOSITÓRIO]
   cd my-event-app
   ```

3. **Configure as variáveis de ambiente:**
   - Crie um arquivo `.env` na raiz do projeto e adicione:
     ```
     NUXT_PUBLIC_SUPABASE_URL=...
     NUXT_PUBLIC_SUPABASE_KEY=...
     NUXT_PUBLIC_MAPBOX_KEY=...
     SMTP_HOST=...
     SMTP_USER=...
     SMTP_PASS=...
     ```

4. **Instale as dependências:**
   ```
   npm install
   ```

5. **Rode o projeto em modo de desenvolvimento:**
   ```
   npm run dev
   ```
   - O site estará disponível em [http://localhost:3000](http://localhost:3000).

---

## 🌐 Deploy

- **Vercel:**  
  - Faça login em [vercel.com](https://vercel.com/), conecte o repositório e siga o fluxo padrão de deploy.
  - Defina as variáveis de ambiente no painel da Vercel.
- **Netlify:**  
  - Faça login em [netlify.com](https://netlify.com/), conecte o repositório, configure as variáveis de ambiente e publique.
- **Outros:**  
  - O projeto é compatível com qualquer serviço que rode aplicações Node.js/Nuxt.js.

---

## 📢 Observações

- O projeto é facilmente adaptável para outros bancos de dados ou serviços de mapas.
- Para produção, revise as regras de autenticação e variáveis sensíveis.
- Veja exemplos completos de código nos arquivos das pastas `/components/`, `/pages/` e `/server/api/`[3][4][5].

=