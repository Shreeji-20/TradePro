from jose import jwt
def verify_jwt(jwtoken: str) -> bool:
        
        SECRET_KEY = "7Sk+17BJXnzbQVdssAEPCBysGjuJ46vqW9TZe7nsE4enH0csxEwkTucFqIl3FzqWGGPoHwECBjUJiMyTMzfJ0g=="
        ALGORITHM = "HS256"
        # print(jwtoken)
        try:
            payload = jwt.decode(jwtoken,SECRET_KEY ,algorithms=[ALGORITHM],audience="authenticated")
            user_id: str = payload.get("sub")
            print(payload)
            # if user_id is None:
            #     raise credentials_exception
        except Exception as e:
            print(e)
        
verify_jwt("eyJhbGciOiJIUzI1NiIsImtpZCI6IldTSXgySk56VXBlMEMwSjciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL212cXR2cXFxdmN5aWxhZG5pdHFkLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJjYmUzNGI1My1hYjkwLTQ3MGMtODNkNC00YjgzNGY5OGQ3ZTciLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ4OTU4MDA1LCJpYXQiOjE3NDg5NTQ0MDUsImVtYWlsIjoiZGhydXZpc29uaTI3MTJAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6ImRocnV2aXNvbmkyNzEyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6ImNiZTM0YjUzLWFiOTAtNDcwYy04M2Q0LTRiODM0Zjk4ZDdlNyJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzQ4OTU0NDA1fV0sInNlc3Npb25faWQiOiJkZWMzODJlZi05OGMwLTQzMzgtODQxMy0yODc2NjQzMzZhMmEiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.tJ89BrbFZA5AIR3KhVrXxauqfPpHZJsIf3yMx1EbsOI")