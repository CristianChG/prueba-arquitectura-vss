# 🚀 Getting Started - VSS Project

Complete guide to set up and start delivering features for the Vacas (VSS) project.

## 📋 Prerequisites

### Required Software
- [x] **Docker Desktop** - For containerized services
- [x] **Docker Compose** - Included with Docker Desktop
- [x] **Node.js 18+** - For frontend development
- [x] **Python 3.11+** - For backend development (optional for local dev)
- [x] **Git** - Version control

### Optional (for local development without Docker)
- PostgreSQL 16
- Redis 7
- AWS Account (for S3 storage)

## 🔧 Initial Setup

### 1. Clone & Navigate
```bash
git clone <your-repo-url>
cd prueba-arquitectura-vss
```

### 2. Create Environment Configuration

Create a `.env` file in the **root directory**:

```bash
touch .env
```

Add the following configuration to `.env`:

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
DATABASE_URL=postgresql://admin:admin@db:5432/vacas

# ============================================
# JWT AUTHENTICATION
# ============================================
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production-min-32-chars
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# ============================================
# AWS S3 STORAGE (Optional - for file uploads)
# ============================================
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=vss-datasets

# ============================================
# CELERY CONFIGURATION
# ============================================
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0

# ============================================
# FLASK CONFIGURATION
# ============================================
FLASK_ENV=development
DEBUG=True
SECRET_KEY=your-flask-secret-key-change-in-production

# ============================================
# CORS CONFIGURATION
# ============================================
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# ============================================
# FRONTEND CONFIGURATION
# ============================================
VITE_API_BASE_URL=http://localhost/api
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

## 🐳 Running with Docker (Recommended)

### Start All Services

```bash
# Start all services (backend, frontend build, db, redis, celery, nginx)
docker-compose up --build
```

### Services Running:
- **Backend API**: http://localhost/api (via nginx)
- **Frontend**: http://localhost (via nginx)
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f celery
```

## 💻 Running Locally (Development)

### Backend Development

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# macOS/Linux:
source .venv/bin/activate
# Windows:
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Update DATABASE_URL in .env for local development
# Change from: postgresql://admin:admin@db:5432/vacas
# To: postgresql://admin:admin@localhost:5432/vacas

# Run Flask development server
python app.py
```

Backend will run on: http://localhost:5000

### Frontend Development

```bash
cd frontend

# Install dependencies (if not done)
npm install

# Run development server
npm run dev
```

Frontend will run on: http://localhost:5173

### Database Setup (Local)

If running locally without Docker:

```bash
# Install PostgreSQL
brew install postgresql@16  # macOS
# or use your OS package manager

# Start PostgreSQL
brew services start postgresql@16

# Create database
createdb vacas

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://yourusername@localhost:5432/vacas
```

### Redis Setup (Local)

```bash
# Install Redis
brew install redis  # macOS

# Start Redis
brew services start redis

# Update CELERY URLs in .env
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

## 🧪 Testing the Setup

### 1. Test Backend Health
```bash
curl http://localhost/api/health
# or locally:
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "version": "1.0.0"
}
```

### 2. Test Frontend
Open browser: http://localhost (Docker) or http://localhost:5173 (local)

### 3. Test Database Connection
```bash
curl http://localhost/api/ping
```

Expected response:
```json
{
  "ok": true,
  "message": "pong"
}
```

## 📦 Project Structure Overview

```
.
├── backend/                 # Python Flask API
│   ├── src/                 # Clean architecture source
│   │   ├── domain/          # Business logic
│   │   ├── infrastructure/  # Database, storage
│   │   ├── presentation/    # API routes, controllers
│   │   └── utils/           # Utilities
│   ├── app.py               # Entry point
│   ├── requirements.txt     # Python dependencies
│   └── ARCHITECTURE.md      # Backend architecture docs
├── frontend/                # React TypeScript app
│   ├── src/                 # Clean architecture source
│   ├── package.json         # Node dependencies
│   └── README.md            # Frontend docs
├── nginx/                   # Reverse proxy config
├── docker-compose.yml       # Docker orchestration
└── .env                     # Environment variables
```

## 🎯 Start Delivering Features

### Feature Development Workflow

#### 1. **Backend Feature** (Example: Add a new endpoint)

```bash
# 1. Create domain entity (if needed)
backend/src/domain/entities/my_entity.py

# 2. Define repository interface
backend/src/domain/repositories/i_my_repository.py

# 3. Create use case
backend/src/domain/usecases/my_usecase.py

# 4. Implement repository adapter
backend/src/infrastructure/adapters/my_repository_adapter.py

# 5. Create controller
backend/src/presentation/controllers/my_controller.py

# 6. Define routes
backend/src/presentation/routes/my_routes.py

# 7. Wire dependencies in app_factory.py
backend/src/app_factory.py

# 8. Test locally
python backend/app.py

# 9. Test with Docker
docker-compose up --build backend
```

See [backend/ARCHITECTURE.md](backend/ARCHITECTURE.md) for detailed examples.

#### 2. **Frontend Feature** (Example: Add a new page)

```bash
# 1. Create component
frontend/src/presentation/components/pages/MyPage.tsx

# 2. Add route
frontend/src/app/routes/index.tsx

# 3. Create use case (if needed)
frontend/src/domain/usecases/MyUseCase.ts

# 4. Add API endpoint
frontend/src/infrastructure/api/MyAPI.ts

# 5. Test
npm run dev

# 6. Build
npm run build
```

### Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add my feature"

# 3. Push to remote
git push origin feature/my-feature

# 4. Create Pull Request on GitHub
```

## 🔑 Important Notes

### Security
- ⚠️ **Change all secret keys in production!**
- ⚠️ Never commit `.env` file to git (already in `.gitignore`)
- ⚠️ Use strong JWT secrets (32+ characters)

### Database Migrations
Currently using SQLAlchemy with `create_all_tables()`. For production, consider:
- Alembic for migrations
- Backup strategies

### AWS S3 Setup (Optional)
If you need file upload features:

1. Create S3 bucket in AWS Console
2. Create IAM user with S3 access
3. Add credentials to `.env`
4. Update bucket name in `.env`

### CORS Configuration
Update `CORS_ORIGINS` in `.env` to match your frontend URL.

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find and kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port in app.py
app.run(port=5001)
```

### Docker Build Fails
```bash
# Clean Docker cache
docker-compose down -v
docker system prune -a
docker-compose up --build
```

### Database Connection Error
```bash
# Restart PostgreSQL service
docker-compose restart db

# Check database logs
docker-compose logs db
```

### Module Import Errors
```bash
# Backend - reinstall dependencies
cd backend
pip install -r requirements.txt

# Frontend - reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps

1. ✅ **Set up environment** - Follow steps above
2. ✅ **Test all services** - Verify everything works
3. 📖 **Read architecture docs**:
   - [Backend Architecture](backend/ARCHITECTURE.md)
   - [Frontend README](frontend/README.md)
4. 🎯 **Start building features**:
   - Create your first endpoint
   - Build your first component
5. 🧪 **Write tests**:
   - Backend: pytest
   - Frontend: Jest + React Testing Library
6. 🚀 **Deploy** (future):
   - Set up CI/CD pipeline
   - Deploy to cloud provider

## 🤝 Development Best Practices

- Follow clean architecture principles
- Write unit tests for use cases
- Use meaningful commit messages
- Keep dependencies updated
- Document complex logic
- Review code before merging

## 📞 Getting Help

- Check [backend/ARCHITECTURE.md](backend/ARCHITECTURE.md) for backend patterns
- Check [frontend/README.md](frontend/README.md) for frontend patterns
- Review existing code examples in `src/`

---

**You're all set! Start building amazing features! 🎉**
