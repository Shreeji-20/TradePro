from fastapi import APIRouter, HTTPException ,Response
from pydantic import BaseModel , UUID4
from uuid import UUID
from app.db.supabase_client import supabase
import requests
router = APIRouter()

class SignupRequest(BaseModel):
    email: str
    password: str
    clientId: str
    apikey: str
    totp: str
    pin: str
    
class LoginRequest(BaseModel):
    email: str
    password: str
    
class accessToken(BaseModel):
    access_token: str

@router.post("/signup")
def signup(data: SignupRequest):
    try:
        response = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password
        })
        response = response.dict()
        user = response['user']

        payload = data.dict()
        payload['id'] = str(user["id"])
        payload.pop("password")
        response2 = supabase.table('Angelone_creds').insert(
            payload
        ).execute()
        
        if "error" in response:
            raise HTTPException(status_code=400, detail=response["error"]["message"])
        if "error" in response2:
            raise HTTPException(status_code=400, detail=response2["error"]["message"])
        
        return {"message": "User signed up"}
    except Exception as e:
        return {"error":f"{e}","code":400}

@router.post("/login")
def login(response: Response,data: LoginRequest):
    try:
        login_response = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password
        })
        if not login_response.session:
            raise HTTPException(status_code=400, detail="Invalid credentials")
        
        smartapi_login_res = requests.post("http://127.0.0.1:8000/trade/login",json={"email": data.email})
        smartapi_login_res = smartapi_login_res.json()

        if 'code' in smartapi_login_res and smartapi_login_res.get('code') == 400:
            raise Exception(smartapi_login_res.get('error'))
        
        response.set_cookie(
            key="access_token",
            value=login_response.session.access_token,
            httponly=True,          # JS cannot access this cookie
            secure=True,            # only over HTTPS
            samesite="strict",      # prevent CSRF
            max_age=60*15           # 15 minutes expiry
        )
        return {"message": "Logged in successfully"}
    except Exception as e:
        return {"error":f"{e}","code":400}


@router.post("/user")
def get_user_email(access_token: accessToken):
    user = supabase.auth.get_user(access_token)
    return user.user if user.user else None


