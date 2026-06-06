from fastapi import FastAPI
from supabase import create_client
from dotenv import load_dotenv
import os
from pydantic import BaseModel

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

app = FastAPI()

@app.get("/health") # run this function when the user goes to /health (decorator)
def health():
    return {"status": "ok"}

@app.get("/api/challenges")
def get_challenges():
    result = supabase.table("challenges").select("*").execute()
    challenges = []
    for row in result.data:
        challenges.append({
            "id": str(row["id"]),
            "habitName": row["habit_name"],
            "type": row["type"],
            "duration": row["duration"],
            "entryFee": row["entry_fee"],
            "prizePool": row["prize_pool"],
            "daysRemaining": row["days_remaining"],
            "status": row["status"],
            "players": []  
        })
    return challenges


class ChallengeCreate(BaseModel):
    habitName: str
    type: str
    duration: int
    entryFee: int
    prizePool: int
    daysRemaining: int
    status: str

@app.post("/api/challenges")
def create_challenge(challenge: ChallengeCreate): #pyndatic model
    result = supabase.table("challenges").insert({
        "habit_name": challenge.habitName,
        "type": challenge.type,
        "duration": challenge.duration,
        "entry_fee": challenge.entryFee,
        "prize_pool": challenge.prizePool,
        "days_remaining": challenge.daysRemaining,
        "status": challenge.status,
    }).execute()
    return result.data[0]