from SmartApi.smartWebSocketV2 import SmartWebSocketV2
from logzero import logger
from collections import defaultdict
import os
from queue import Queue 
import time
import json


class Websocket:
    def __init__(self,feed_token,CLIENT_CODE,AUTH_TOKEN,apikey):
        self.feed_token = feed_token
        self.CLIENT_CODE = CLIENT_CODE
        self.AUTH_TOKEN = AUTH_TOKEN
        self.apikey = apikey
        self.live_data_queue = defaultdict(Queue)
        self.sws = SmartWebSocketV2(self.AUTH_TOKEN, self.apikey, self.CLIENT_CODE, self.feed_token)
        self.shutdown_requested = False
        self.subscribed_token_list = ["26009","26000","26074","26037","99919000","99919012"]
        self.live_data_dict = {}
        
    def get_latest_from_queue(self,token):
        latest_data = None
        try:
            while not self.live_data_queue[token].empty():
                latest_data = self.live_data_queue[token].get_nowait()
        except Exception as e:
            print("Error fetching latest data:", e)
    
        return latest_data
    
    def on_open(self,wsapp):
    
            correlation_id = "abc123"
            mode = 3
            token_list = [
                {
                    "exchangeType": 1,
                    "tokens": ["26009","26000","26074","26037"]
                },
                {
                    "exchangeType": 3,
                    "tokens": ["99919000","99919012"]
                }
            ]
            logger.info("on open")
            self.sws.subscribe(correlation_id, mode, token_list)
    
    def close_connection(self):
        self.shutdown_requested = True
        self.sws.close_connection()
           
        
    def on_data(self,wsapp, message):
        try:
            data = message if isinstance(message, dict) else json.loads(message)
            token = data.get("token")
            if token:
                self.live_data_dict[f'{token}'] = data
                self.live_data_queue[token].put(data)
            else:
                logger.warning("Token not found in data: {}".format(data))
        except Exception as e:
            print(e)
            
    def start_websocket(self):
        def on_error(wsapp, error):
            logger.error("Here : ",error)
            self.close_connection()
            time.sleep(2)

        def on_close(wsapp):
            logger.info("Close")
    
        self.sws.on_open = self.on_open
        self.sws.on_data = self.on_data
        self.sws.on_error = on_error
        self.sws.on_close = on_close
        while not self.shutdown_requested:
            try:
                self.ws = self.sws.connect()  # connect to websocket
                # self.(self.ws)
            except Exception as e:
                if self.shutdown_requested:
                    break  # exit loop if shutdown was requested
                time.sleep(2)  # reconnect delay
        
