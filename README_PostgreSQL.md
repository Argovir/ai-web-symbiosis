# Настройка PostgreSQL для проекта AI Web Symbiosis

## Требования
- PostgreSQL 12+
- Node.js 16+

## 1. Установка PostgreSQL

### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### macOS (с Homebrew):
```bash
brew install postgresql
brew services start postgresql
```

### Windows:
Скачайте и установите с [postgresql.org](https://www.postgresql.org/download/windows/)

## 2. Настройка базы данных

Создайте пользователя и базу данных:

```bash
sudo -u postgres psql
```

В psql выполните (от имени postgres):
```sql
CREATE USER admin WITH PASSWORD 'your_password';
CREATE DATABASE ai_web_symbiosis OWNER admin;
GRANT ALL PRIVILEGES ON DATABASE ai_web_symbiosis TO admin;
\q
```

Или если пользователь admin уже существует, просто создайте базу данных:
```sql
CREATE DATABASE ai_web_symbiosis OWNER admin;
GRANT ALL PRIVILEGES ON DATABASE ai_web_symbiosis TO admin;
```

## 3. Настройка backend

1. Перейдите в папку backend:
```bash
cd backend
```

2. Установите зависимости:
```bash
npm install
```

3. Настройте переменные окружения в `backend/.env`:
```env
PORT=3001
DATABASE_URL=postgresql://admin:your_password@localhost:5432/ai_web_symbiosis
JWT_SECRET=160c2f8cc2147bce1c7b494a3cf7c3b73e3f8de4e38467353e6627b1128d2d44
```

4. Инициализируйте базу данных (это пересоздаст таблицы):
```bash
psql -U admin -d ai_web_symbiosis -f backend/init.sql
```

Или выполните SQL из `backend/init.sql` вручную в psql:
```bash
psql -U admin -d ai_web_symbiosis
\i backend/init.sql
```

**Внимание:** Скрипт удалит существующие таблицы и создаст их заново!

## 4. Запуск

### Backend:
```bash
cd backend
npm run dev
```

### Frontend:
```bash
npm run dev
```

## 5. Доступ

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Админ доступ

- Email: admin@example.com
- Пароль: admin

## Структура базы данных

- `profiles` - профили пользователей
- `site_settings` - настройки сайта
- `portfolio_projects` - проекты портфолио
- `blog_posts` - статьи блога

## API Endpoints

### Auth
- `POST /api/auth/login` - вход
- `POST /api/auth/update-password` - смена пароля

### Data
- `GET /api/site-settings` - настройки сайта
- `GET /api/portfolio-projects` - опубликованные проекты
- `GET /api/blog-posts` - опубликованные статьи

### Admin (требует авторизации)
- `GET /api/admin/portfolio-projects` - все проекты
- `POST /api/admin/portfolio-projects` - создать проект
- `PATCH /api/admin/portfolio-projects/:id` - обновить проект
- `DELETE /api/admin/portfolio-projects/:id` - удалить проект

Аналогично для blog-posts, profiles, site-settings.

## Безопасность

- Пароли хешируются с bcrypt
- JWT токены для авторизации
- CORS настроен для localhost
