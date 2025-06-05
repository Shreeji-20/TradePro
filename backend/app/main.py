from fastapi import FastAPI
from app.auth import supabase_auth
from app.trading.routes import trading_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="Trading Backend")
origins = [
    "http://localhost:5173", 
   
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           
    allow_credentials=True,
    allow_methods=["*"],             
    allow_headers=["*"],             
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


