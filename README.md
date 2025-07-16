# Deliveri: Delivery Management System

## Описание

Deliveri — это веб-приложение для управления и анализа доставок. Проект состоит из двух частей:
- **Backend**: Django + Django REST Framework (папка `deliveri_backend`)
- **Frontend**: React + Vite + MUI (папка `frontend`)

---

## Пример .env для backend (Django, PostgreSQL)

Создайте файл `.env` в корне проекта (рядом с `manage.py`) и добавьте:

```
SECRET_KEY=your_secret_key_here
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:5173

# Настройки PostgreSQL:
DB_NAME=deliveri_db
DB_USER=deliveri_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

**Пояснения:**
- `SECRET_KEY` — секретный ключ Django (уникальный для каждого проекта)
- `DEBUG` — режим отладки (True для разработки, False для продакшена)
- `ALLOWED_HOSTS` — список разрешённых хостов через запятую
- `CORS_ALLOWED_ORIGINS` — адреса фронтенда, которым разрешён доступ к API
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` — параметры подключения к PostgreSQL

---

## Пример .env для frontend (React)

В папке `frontend` создайте файл `.env`:

```
VITE_API_URL=http://127.0.0.1:8000
VITE_ACCESS_TOKEN=your_jwt_token_here
```

---

## Зависимости

### Backend (Django)
Установлены в `requirements.txt`:
```
Django>=3.2,<5.0
djangorestframework>=3.13.0
djangorestframework-simplejwt>=5.2.2
python-dotenv
django-cors-headers
psycopg2-binary
```

### Frontend (React)
Установлены в `frontend/package.json`:
- @emotion/react
- @emotion/styled
- @mui/icons-material
- @mui/lab
- @mui/material
- @mui/x-charts
- @mui/x-data-grid
- axios
- react
- react-dom
- react-router-dom
- recharts

---

## Как развернуть проект локально

### 1. Клонируйте репозиторий
```bash
git clone <ваш-репозиторий>
cd Deliveri
```

### 2. Backend (Django)

#### Установка зависимостей
Рекомендуется использовать виртуальное окружение:
```bash
python -m venv venv
source venv/Scripts/activate
```

#### Настройка базы данных PostgreSQL
- Установите PostgreSQL и создайте базу/пользователя
- Заполните .env (см. пример выше)

#### Миграции и запуск
```bash
python manage.py migrate
python manage.py runserver
```

#### Переменные окружения (опционально)
- Для настройки JWT, CORS и других параметров используйте файл `.env` или переменные окружения.

### 3. Frontend (React)

#### Установка зависимостей
```bash
cd frontend
npm install
```

#### Запуск в режиме разработки
```bash
npm run dev
```

#### Сборка для продакшена
```bash
npm run build
```

### 4. Использование
- Фронтенд будет доступен по адресу, который покажет Vite (обычно http://localhost:5173)
- Бэкенд — http://127.0.0.1:8000
- В React-приложении укажите правильный адрес API (например, через переменные окружения или прямо в коде)
---

## Примечания
- Для работы авторизации и CORS убедитесь, что в Django настроены соответствующие параметры (`CORS_ALLOWED_ORIGINS` и т.д.).
- Для деплоя используйте Vercel (frontend) и Render (backend) — см. инструкции выше.
---

## Мобильное приложение

Папка `deliveri-mobile` содержит экспериментальную версию мобильного приложения. 
⚠️ На данный момент оно находится в разработке и не предназначено для использования в продакшене.
