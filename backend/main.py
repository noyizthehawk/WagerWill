from fastapi import FastAPI, Header, HTTPException
from supabase import create_client, Client
from dotenv import load_dotenv
import os
from pydantic import BaseModel
import resend

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)
supabase_admin = create_client(
      os.getenv("SUPABASE_URL"),
      os.getenv("SUPABASE_SERVICE_KEY")
  )

resend.api_key = os.getenv("RESEND_API_KEY")

app = FastAPI()

def get_user_id(authorization: str) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ")[1]
    result = supabase.auth.get_user(token)
    if not result.user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return str(result.user.id)

class InviteAccept(BaseModel):
      challenge_id: int

class InviteCreate(BaseModel):
    challenge_id: int
    invited_email: str

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

    # challenges the user owns
    owned = supabase.table("challenges").select("*, players(*)").eq("user_id", user_id).execute()

    # challenges the user was invited to and accepted (is a player in)
    player_rows = supabase.table("players").select("challenge_id").eq("user_id", user_id).execute()
    player_challenge_ids = [str(p["challenge_id"]) for p in player_rows.data]

    invited = []
    if player_challenge_ids:
        invited_result = supabase.table("challenges").select("*, players(*)")\
            .in_("id", player_challenge_ids)\
            .neq("user_id", user_id)\
            .execute()
        invited = invited_result.data

    all_rows = owned.data + invited
    seen = set()
    challenges = []
    for row in all_rows:
        if row["id"] in seen:
            continue
        seen.add(row["id"])
        challenges.append({
            "id": str(row["id"]),
            "userId": str(row["user_id"]),
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

@app.delete("/api/challenges/{id}/leave")
def leave_challenge(id: str, authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    supabase_admin.table("players").delete().eq("challenge_id", id).eq("user_id", user_id).execute()
    return {"message": "Left challenge"}


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
@app.post("/api/invites")
def invite(invite: InviteCreate, authorization: str = Header(None)):
      inviter_id = get_user_id(authorization)

      # check invited email exists in supabase
      users = supabase_admin.auth.admin.list_users()
      emails = [u.email for u in users]
      if invite.invited_email not in emails:
          raise HTTPException(status_code=404, detail="User not found")

      supabase_admin.table("invites").insert({
          "challenge_id": invite.challenge_id,
          "inviter_id": inviter_id,
          "invited_email": invite.invited_email,
          "status": "pending"
      }).execute()

      try:
          result = resend.Emails.send({
              "from": "WagerWill <onboarding@resend.dev>",
              "to": invite.invited_email,
              "subject": "You've been invited to a challenge!",
              "html": f"""
                <h2>You've been challenged!</h2>
                <p>Someone invited you to join a habit challenge on WagerWill.</p>
                <p>Log in to your account to accept the invite.</p>
              """
          })
          print("Resend result:", result)
      except Exception as e:
          print("Resend error:", e)

      return {"message": "Invite sent"}

@app.post("/api/invites/accept")
def accept_invite(invite: InviteAccept, authorization: str = Header(None)):
    user_id = get_user_id(authorization)

    #get user email
    user = supabase_admin.auth.admin.get_user_by_id(user_id)
    user_email = user.user.email

    challenge_id = invite.challenge_id

    # find the pending invite
    invite_row = supabase_admin.table("invites")\
        .select("*")\
        .eq("challenge_id", challenge_id)\
        .eq("invited_email", user_email)\
        .eq("status", "pending")\
        .execute()
    if not invite_row.data:
        raise HTTPException(status_code=404, detail="Invite not found")
    # check if already a player
    existing = supabase_admin.table("players")\
        .select("id")\
        .eq("challenge_id", challenge_id)\
        .eq("user_id", user_id)\
        .execute()

    if existing.data:
        raise HTTPException(status_code=400, detail="Already a player in this challenge")
    # create player row
    supabase_admin.table("players").insert({
        "challenge_id": challenge_id,
        "user_id": user_id,
        "name": user_email,
        "streak": 0,
        "checked_in_today": False,
    }).execute()

    # mark invite as accepted
    supabase_admin.table("invites")\
        .update({"status": "accepted"})\
        .eq("challenge_id", challenge_id)\
        .eq("invited_email", user_email)\
        .execute()

    return {"message": "Invite accepted"}

@app.get("/api/invites")
def get_invites(authorization: str = Header(None)):
    user_id = get_user_id(authorization)

    # get the logged in user's email
    user = supabase_admin.auth.admin.get_user_by_id(user_id)
    user_email = user.user.email

    # get all pending invites for this email
    result = supabase_admin.table("invites")\
        .select("*, challenges(habit_name)")\
        .eq("invited_email", user_email)\
        .eq("status", "pending")\
        .execute()

    return [
        {
            "id": str(row["id"]),
            "challengeId": str(row["challenge_id"]),
            "challengeName": row["challenges"]["habit_name"],
            "status": row["status"],
        }
        for row in result.data
    ]


