from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token, get_current_user
from app.models.user import User
from app.schemas.schemas import UserRegister, UserLogin, UserOut, Token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=201)
def register(data: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(400, "Email already registered")
    user = User(name=data.name, email=data.email,
                hashed_password=get_password_hash(data.password),
                phone=data.phone, address=data.address)
    db.add(user); db.commit(); db.refresh(user)
    return {"access_token": create_access_token({"sub": str(user.id)}), "token_type": "bearer", "user": user}

@router.post("/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(401, "Invalid email or password")
    if not user.is_active:
        raise HTTPException(403, "Account deactivated")
    return {"access_token": create_access_token({"sub": str(user.id)}), "token_type": "bearer", "user": user}

@router.get("/me", response_model=UserOut)
def me(current_user=Depends(get_current_user)):
    return current_user
