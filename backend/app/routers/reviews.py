from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.order import Review
from app.models.restaurant import Restaurant
from app.schemas.schemas import ReviewCreate, ReviewOut

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.post("", response_model=ReviewOut, status_code=201)
def create_review(data: ReviewCreate, db: Session=Depends(get_db), user=Depends(get_current_user)):
    if not 1 <= data.rating <= 5: raise HTTPException(400, "Rating must be 1-5")
    r = db.query(Restaurant).filter(Restaurant.id==data.restaurant_id).first()
    if not r: raise HTTPException(404, "Restaurant not found")
    existing = db.query(Review).filter(Review.user_id==user.id, Review.restaurant_id==data.restaurant_id).first()
    if existing:
        existing.rating = data.rating; existing.comment = data.comment; db.commit(); db.refresh(existing)
        _update_rating(db, r); return existing
    rev = Review(user_id=user.id, **data.model_dump())
    db.add(rev); db.commit(); db.refresh(rev); _update_rating(db, r); return rev

def _update_rating(db, restaurant):
    reviews = db.query(Review).filter(Review.restaurant_id==restaurant.id).all()
    if reviews: restaurant.rating = round(sum(r.rating for r in reviews)/len(reviews),1); db.commit()

@router.get("/restaurant/{rid}", response_model=List[ReviewOut])
def get_reviews(rid: int, db: Session=Depends(get_db)):
    return db.query(Review).filter(Review.restaurant_id==rid).order_by(Review.created_at.desc()).all()
