from fastapi import APIRouter, HTTPException
from pydantic import BaseModel , UUID4
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
    id:str
    

class LoginRequest(BaseModel):
    email: str
    password: str
    
class accessToken(BaseModel):
    access_token: str

@router.post("/signup")
def signup(data: SignupRequest):
    response = supabase.auth.sign_up({
        "email": data.email,
        "password": data.password
    })

    print("res : ", response.json())
    # if response.error:
    #     print("Signup error:", response.error)
    #     raise Exception(response["error"])
    # else:
    #     user = response.user
    #     user_id = user.id  # Supabase auth user ID
    # id = UUID4(data.id)
    # payload = data.dict()
    # payload.pop("password")
    # payload['id'] = id
    # payload['id'] = user_id
    # print(response)
    response2 = supabase.table('Angelone_creds').insert({
        "email":data.email,
        "clientId":data.clientId,
        "apikey":data.apikey,
        "totp":data.totp,
        "pin":data.pin,
        "auth_token":"",
        "refresh_token":"",
        "feed_token":"",
        "access_token":"",
        "created_at":None
    }).execute()

    # response2 = supabase.table('Angelone_creds').insert(
    #     payload
    # ).execute()
    
    if "error" in response:
        raise HTTPException(status_code=400, detail=response["error"]["message"])
    if "error" in response2:
        raise HTTPException(status_code=400, detail=response2["error"]["message"])
    
    return {"message": "User signed up"}

@router.post("/login")
def login(data: LoginRequest):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password
        })
        if not response.session:
            raise HTTPException(status_code=400, detail="Invalid credentials")
        
        res = requests.post("http://127.0.0.1:8000/trade/login",json={"email": data.email})
        res = res.json()

        if res.get('code') == 400:
            raise Exception(res.get('error'))
        # else:
        user = supabase.auth.get_user(response.session.access_token)
        print(user.user)
        return {"access_token": response.session.access_token}
    except Exception as e:
        return {"error":f"{e}","code":400}

@router.post("/user")
def get_user_email(access_token: accessToken):
    user = supabase.auth.get_user(access_token)
    return user.user if user.user else None
