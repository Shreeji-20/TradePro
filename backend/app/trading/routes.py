from fastapi import APIRouter, Depends, HTTPException ,Request ,Cookie
from pydantic import BaseModel
from app.trading.smartapi_client import SmartAPIClient
from app.db.supabase_client import supabase
import traceback
from app.trading.ws_feed import Websocket
from threading import Thread
import json
from typing import Optional
from app.auth.jwt_bearer import JWTBearer
trading_router = APIRouter(dependencies=[Depends(JWTBearer())])  # << secure all routes

web_socket = None

class OrderRequest(BaseModel):
    email: str
    symbol: str
    quantity: int
    side: str  
    order_type: str
    price:str
   
class LoginRequest(BaseModel):  
    email: str
    
class WebsocketSubscribe(BaseModel):
    email:str
    symbol:str
    exchangeType: int
    exchange :str
    mode:int
    correlation_id:str

class liveData(BaseModel):
    token: str
    
class SearchScrip(BaseModel):
    email:str
    symbol:str
    exchange:str

class NewOrder(BaseModel):
    client_code: str
    stockSymbol: str
    quantity: int
    orderType: str
    priceType: str 
    limitPrice: float
    numOfLimits: int
    expiryMinutes: int
    priceUpdateInterval: int
    qtyPerLimit:int
    remainingQty:int
    status:str
    id: Optional[int]
    
class OrderKey(BaseModel):
    id:Optional[int]
    
class GainersLosers(BaseModel):
    datatype:str
    
    
def get_client_by_email(email: str):
    response = supabase.table("Angelone_creds").select("*").eq("email", email).execute()
    if not response.data:
        raise Exception("No credentials found")
    
    creds = response.data[0]
    client = SmartAPIClient(
        client_code=creds.get("clientId"),
        password=creds.get("pin"),
        totp=creds.get("totp"),
        apikey=creds.get("apikey")
    )
    client.obj.refresh_token = creds.get("refresh_token")
    client.obj.access_token = creds.get("access_token")
    client.obj.feed_token = creds.get("feed_token")
  
    return client

@trading_router.post("/login")
def login(demat: LoginRequest):
    try: 
        
        response = supabase.table("Angelone_creds").select('*').eq("email",demat.email).execute()
        data = response.data[0]
        client = SmartAPIClient(data['clientId'],data['pin'],data['totp'],data['apikey'])
      
        res = client.login(demat.email)
        print(res)
        if res.get('code') == 200:
            return res
        else:
            raise Exception(res.get("error"))
    except Exception as e:
        # print(e)
        print(traceback.format_exc())
        return {"error":f"{e}","code":400}


@trading_router.post("/place-order")
def place_order(order: OrderRequest):
    try:
        print(order)
        client = get_client_by_email(order.email)
        result = client.place_order(
            order_type=order.order_type,
            side=order.side,
            symbol=order.symbol,
            qty=order.quantity,
            product_type = "DELIVERY",
            price = order.price
            
        )
        print("Result : ",result)
        if result is not None and 'code' in result and result['code'] == 400:
            raise Exception(result['error'])
        return {"message": "Order placed", "order_id": result}
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=400, detail=str(e))


@trading_router.post("/profile")
def get_profile(email:LoginRequest):
    try:
        client = get_client_by_email(email.email)
        # client.login()
        result = client.get_profile()
        rms = client.obj.rmsLimit()
        if 'status' in result and result['status'] != True:
            raise Exception(result['message'])
        return {"message": result,"rms":rms}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    
@trading_router.get("/orderbook")
def get_orderbook(email:LoginRequest):
    try:
        client = get_client_by_email(email.email)
        # client.login()
        result = client.obj.orderBook()
        if result['status'] != True:
            raise Exception(result['message'])
        return {"message": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 
    
    
@trading_router.get("/positions")
def get_positions(email:LoginRequest):
    try:
        client = get_client_by_email(email.email)
        # client.login()
        result = client.obj.position()
        if result['status'] != True:
            raise Exception(result['message'])
        return {"message": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 
    
    
@trading_router.get("/holdings")
def get_holdings(email:LoginRequest):
    try:
        client = get_client_by_email(email.email)
        # client.login()
        result = client.obj.allholding()
        if result['status'] != True:
            raise Exception(result['message'])
        return {"message": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 
    
    
@trading_router.post("/start-feed")
def start_feed(email:LoginRequest):
    try:
        print(email.email)
        global web_socket
        if not web_socket:
            client = get_client_by_email(email.email)
            web_socket = Websocket(client.obj.feed_token,client.client_code,client.obj.access_token,client.api_key)
            thread = Thread(target=web_socket.start_websocket)
            thread.daemon = True
            thread.start()
            return {"message": "WebSocket started","code":200}
        else:
            return {"message": "WebSocket already running","code":201}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@trading_router.get("/websocketdata")
def live_data():
    try:
        global web_socket
        if not web_socket:
            return {"code":300}
        data = web_socket.live_data_dict
        if data:
            return {"data":data,"code":200}
        else:
           return {"message":"Data error","code":201}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    
@trading_router.get("/websocketdata_raw")
def raw_live_data():
    try:
        global web_socket
        if not web_socket:
            return {"code":300}
        data = web_socket.live_data_dict
        if data:
            return {"data":data,"code":200}
        else:
           return {"message":"Data error","code":201}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    
    
@trading_router.get("/terminatesocket")
def terminatesocket():
    try:
        global web_socket
        web_socket.sws.close_connection()
        web_socket.shutdown_requested = True
        return None
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    
@trading_router.post("/subscribe")
def socketsubscribe(data:WebsocketSubscribe):
    try:
        
        global web_socket
        client = get_client_by_email(data.email)
        token = client.get_symbol_token(data.symbol,data.exchange)
        tokens = [f"{token}"]
        if tokens[0] not in web_socket.subscribed_token_list:
            token_list =[
                {
                    "exchangeType":data.exchangeType,
                    "tokens":tokens
                }
            ]
            web_socket.sws.subscribe(data.correlation_id,data.mode,token_list)
            web_socket.subscribed_token_list.append(tokens[0])
            return {"message":f"Successfully subscribed token:{tokens[0]} for socket data","token":tokens[0],"code":200}
        else:
            return {"message":f"token:{tokens[0]} is already Subscribed","code":201,"token":tokens[0]}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    
@trading_router.post("/searchscrip")
def search_scrip(scrip:SearchScrip):
    try:
        client = get_client_by_email(scrip.email)
        symbol_list = client.get_symbol_token(scrip.symbol,scrip.exchange)
        # with open("nifty.nfo.json",'w') as file:
        #     file.write(json.dumps(symbol_list))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@trading_router.post("/addorder")
def add_order(order: NewOrder):
    try:
        response = supabase.table('stock_orders').insert({
            "stock_name":order.stockSymbol,
            "quantity":order.quantity,
            "order_type":order.orderType,
            "price_type":order.priceType,
            "custom_price":str(order.limitPrice),
            "limit_count":order.numOfLimits,
            "order_timeout":order.expiryMinutes,
            "price_refresh":order.priceUpdateInterval,
            "client_id":order.client_code,
            "remainingQty":order.remainingQty,
            "status":order.status,
            "qtyPerLimit":order.qtyPerLimit,
            "Unique_id":order.id,
            "updated_at":None
        }).execute()
        if response.data:
            return {"message":"Order Created Successfully","code":200}
            
    except Exception as e:
        return {"error":e,"code":400}
        # raise HTTPException(status_code=400, detail=str(e))
        
        
@trading_router.post("/deleteorder")
def delete_order(id:OrderKey):
    try:
        response = supabase.table("stock_orders").delete().eq("Unique_id",str(id.id)).execute()
        print(response)
        return {"message":"stock removed successfully"}
    except Exception as e:
        return {"error":e,"code":400}


@trading_router.post("/gainerslosers")
def get_gainers_losers(params:GainersLosers):
    try:
        client = get_client_by_email("dhruvisoni2712@gmail.com")
        params123 = {
    "datatype":"PercPriceGainers", 
    "expirytype":"NEXT" 
} 
        data = client.obj.gainersLosers(params123)
        print(data)
        return data
    except Exception as e:
        print(traceback.format_exc())
        return {"error":e,"code":400}