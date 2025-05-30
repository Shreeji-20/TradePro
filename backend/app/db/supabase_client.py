import os
from supabase import create_client
from dotenv import load_dotenv
load_dotenv()

# SUPABASE_URL = os.getenv("SUPABASE_URL")
# SUPABASE_KEY = os.getenv("SUPABASE_KEY")

SUPABASE_URL="https://mvqtvqqqvcyiladnitqd.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12cXR2cXFxdmN5aWxhZG5pdHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NDI3NTYsImV4cCI6MjA2MjIxODc1Nn0.EB7qJtyXaDTO2TyE6RVfIgb4Jw1TJ5f4twfLeKCCAnc"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
