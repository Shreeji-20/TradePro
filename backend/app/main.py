from fastapi import FastAPI
from app.auth import supabase_auth
from app.trading.routes import trading_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="Trading Backend")
origins = [
    "http://localhost:5173",  # your React frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],             # Allow all HTTP methods
    allow_headers=["*"],             # Allow all headers
)
# Include routers
app.include_router(supabase_auth.router, prefix="/auth")
app.include_router(trading_router, prefix="/trade")

@app.get("/")
async def root():
    return {"message": "Trading App is running 🚀"}

@app.get("/greet")
async def greet():
    return {"message":"Hello There !"}


