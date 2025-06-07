import os
from fastapi import HTTPException
from SmartApi import SmartConnect
import pyotp
from app.db.supabase_client import supabase
from pydantic import BaseModel
from datetime import datetime
import traceback
from logzero import logger
# import db


class SmartAPIClient:
    
    def __init__(self, client_code=None, password=None, totp=None,apikey=None):
        self.api_key = apikey
        self.client_code = client_code
        self.password = password
        self.totp = totp 
        self.totp2 = pyotp.TOTP(self.totp).now()
        self.obj = SmartConnect(self.api_key)
    
    def login(self,email):
        try:
            data = self.obj.generateSession(self.client_code, self.password, self.totp2)
            if 'status' in data and not data.get('status',[]):
                raise Exception(data.get('message', 'Unknown error'))
            
            self.obj.generateToken(data['data']['refreshToken'])
            response = supabase.table("Angelone_creds").update({
                "refresh_token":self.obj.refresh_token,
                "auth_token":self.obj.access_token,
                "feed_token":self.obj.feed_token,
                "access_token":self.obj.access_token,
                "created_at":datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }).eq("clientId",self.client_code).execute()
            
            if "error" in response:
                raise HTTPException(status_code=400, detail=response["error"]["message"])
            return {"message": "Login and token update successful","code":200}
        except Exception as e:
            print(traceback.format_exc())
            return {"error":f"{e}","code":400}

    def get_symbol_token(self, symbol_name, exchange="NSE"):
        search_result = self.obj.searchScrip(exchange=exchange, searchscrip=symbol_name)
        print("search result : ",search_result)
        if search_result["data"]:
            return search_result["data"][0]["symboltoken"]
        else:
            raise Exception(f"Symbol {symbol_name} not found!")

    def place_order(self, symbol, qty, side, price="0",order_type="MARKET", product_type="DELIVERY"):
        try:
            if order_type == "LIMIT" and price == "0":
                raise Exception("Price should be greater than 0 for limit orders")
            symbol_token = self.get_symbol_token(symbol)
            params = {
                "variety": "NORMAL",
                "tradingsymbol": symbol,
                "symboltoken": symbol_token,
                "transactiontype": side,
                "exchange": "NSE",
                "ordertype":order_type,
                "producttype": product_type,
                "duration": "DAY",
                "price": price,
                "squareoff": "0",
                "stoploss": "0",
                "quantity": f"{qty}"
            }
            order = self.obj.placeOrder(params)
            print("orderhere : ",order)
            if order is not None:
                return order
        except Exception as e:
          return {"error":f"{e}","code":400}
      
    def modify_order(self,symbol,orderId,price,orderType,quantity,exchange):
        symbol_token = self.get_symbol_token(symbol)
        params = {
            "variety":"NORMAL",
            "orderid":str(orderId) or "",
            "ordertype":orderType or "MARKET",
            "producttype":"DELIVERY",
            "duration":"DAY",
            "price":str(price) or "0",
            "quantity":quantity or "1",
            "tradingsymbol":symbol or "SBIN-EQ",
            "symboltoken":symbol_token or "3045",
            "exchange":exchange or "NSE"
            }
        order = self.obj.modifyOrder(params)
        print("Update order response : ",order)
        return order
    def get_profile(self):
        res = self.obj.getProfile(self.obj.refresh_token)
        # print(res)
        return res
