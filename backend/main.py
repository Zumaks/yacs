#!/usr/bin/python3
from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
import os

from routers import user_router, auth_router, corequisite_router


# --- Initialize FastAPI App ---
app = FastAPI()

# --- Add Middleware ---
app.add_middleware(SessionMiddleware, secret_key=os.environ.get("SECRET_KEY", "dev_secret_key"))

# --- Include Routers ---
app.include_router(user_router.router)
app.include_router(auth_router.router)
app.include_router(corequisite_router.router)


# --- Root Endpoint ---
@app.get('/')
async def root():
    """Confirms the API is running."""
    return {"message": "YACS API is Up!"}
