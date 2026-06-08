from fastapi import FastAPI, Header, HTTPException
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

def get_user_id(authorization: str) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ")[1]
    result = supabase.auth.get_user(token)
    if not result.user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return str(result.user.id)



class ChallengeCreate(BaseModel):
    habitName: str
    type: str
    duration: int
    entryFee: int
    prizePool: int
    daysRemaining: int
    status: str
@app.get("/health") # run this function when the user goes to /health (decorator)
def health():
    return {"status": "ok"}

@app.get("/api/challenges")
def get_challenges(authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    result = supabase.table("challenges").select("*, players(*)").eq("user_id", user_id).execute()
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
            "players": [
                {
                    "id": str(p["id"]),
                    "name": p["name"],
                    "streak": p["streak"],
                    "checkedInToday": p["checked_in_today"],
                }
                for p in row["players"]
            ]
        })
    return challenges

@app.post("/api/challenges")
def create_challenge(challenge: ChallengeCreate, authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    challenge_result = supabase.table("challenges").insert({
        "habit_name": challenge.habitName,
        "type": challenge.type,
        "duration": challenge.duration,
        "entry_fee": challenge.entryFee,
        "prize_pool": challenge.prizePool,
        "days_remaining": challenge.daysRemaining,
        "status": challenge.status,
        "user_id": user_id,
    }).execute()

    challenge_id = challenge_result.data[0]["id"]

    # create a player row for the challenge creator
    supabase.table("players").insert({
        "challenge_id": challenge_id,
        "user_id": user_id,
        "name": "You",
        "streak": 0,
        "checked_in_today": False,
    }).execute()

    return challenge_result.data[0]

@app.delete("/api/challenges/{id}")
def delete_challenge(id: str, authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    supabase.table("challenges").delete().eq("id", id).eq("user_id", user_id).execute()
    return {"message": "Challenge deleted"}


@app.post("/api/challenges/{challenge_id}/checkin")
def checkin(challenge_id: str, authorization: str = Header(None)):
    user_id = get_user_id(authorization)

    result = supabase.table("players").select("id, streak")\
        .eq("challenge_id", challenge_id)\
        .eq("user_id", user_id)\
        .execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Player not found")

    player = result.data[0]
    supabase.table("players")\
        .update({"streak": player["streak"] + 1, "checked_in_today": True})\
        .eq("id", player["id"])\
        .execute()
    return {"message": "checked in"}
    


