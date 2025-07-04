from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
import os

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        if not self.verify_jwt(request.cookies.get("access_token")):
                print("error")
                raise HTTPException(status_code=403, detail="Invalid token or expired token.")
        else:
            return request.cookies.get("access_token")

    def verify_jwt(self, jwtoken: str) -> bool:
        try:
            SECRET_KEY = "7Sk+17BJXnzbQVdssAEPCBysGjuJ46vqW9TZe7nsE4enH0csxEwkTucFqIl3FzqWGGPoHwECBjUJiMyTMzfJ0g=="
            ALGORITHM = "HS256"
            payload = jwt.decode(jwtoken,SECRET_KEY ,algorithms=[ALGORITHM],audience="authenticated")
            
            user_id: str = payload.get("sub")
           
            if user_id is None:
                raise Exception("credentials Exception")
            else: return True
        except Exception:
            return False
