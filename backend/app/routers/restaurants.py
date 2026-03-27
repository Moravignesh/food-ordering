from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.restaurant import Restaurant, MenuItem
from app.schemas.schemas import RestaurantCreate, RestaurantOut, MenuItemCreate, MenuItemOut

router = APIRouter(tags=["Restaurants"])

@router.post("/restaurants", response_model=RestaurantOut, status_code=201)
def create_restaurant(data: RestaurantCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    r = Restaurant(**data.model_dump()); db.add(r); db.commit(); db.refresh(r); return r

@router.get("/restaurants", response_model=List[RestaurantOut])
def list_restaurants(search: Optional[str]=Query(None), cuisine: Optional[str]=Query(None),
                     skip: int=0, limit: int=20, db: Session=Depends(get_db)):
    q = db.query(Restaurant).filter(Restaurant.is_active == True)
    if search: q = q.filter(Restaurant.name.ilike(f"%{search}%"))
    if cuisine: q = q.filter(Restaurant.cuisine_type.ilike(f"%{cuisine}%"))
    return q.offset(skip).limit(limit).all()

@router.get("/restaurants/{rid}", response_model=RestaurantOut)
def get_restaurant(rid: int, db: Session=Depends(get_db)):
    r = db.query(Restaurant).filter(Restaurant.id == rid).first()
    if not r: raise HTTPException(404, "Restaurant not found")
    return r

@router.post("/menu-items", response_model=MenuItemOut, status_code=201)
def create_menu_item(data: MenuItemCreate, db: Session=Depends(get_db), admin=Depends(get_current_admin)):
    if not db.query(Restaurant).filter(Restaurant.id == data.restaurant_id).first():
        raise HTTPException(404, "Restaurant not found")
    item = MenuItem(**data.model_dump()); db.add(item); db.commit(); db.refresh(item); return item

@router.get("/restaurants/{rid}/menu", response_model=List[MenuItemOut])
def get_menu(rid: int, category: Optional[str]=Query(None), db: Session=Depends(get_db)):
    if not db.query(Restaurant).filter(Restaurant.id == rid).first():
        raise HTTPException(404, "Restaurant not found")
    q = db.query(MenuItem).filter(MenuItem.restaurant_id == rid, MenuItem.is_available == True)
    if category: q = q.filter(MenuItem.category.ilike(f"%{category}%"))
    return q.all()

@router.put("/menu-items/{iid}", response_model=MenuItemOut)
def update_menu_item(iid: int, data: MenuItemCreate, db: Session=Depends(get_db), admin=Depends(get_current_admin)):
    item = db.query(MenuItem).filter(MenuItem.id == iid).first()
    if not item: raise HTTPException(404, "Not found")
    for k, v in data.model_dump().items(): setattr(item, k, v)
    db.commit(); db.refresh(item); return item
