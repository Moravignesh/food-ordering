from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.cart import CartItem
from app.models.restaurant import MenuItem
from app.schemas.schemas import CartAdd, CartOut, CartItemOut

router = APIRouter(prefix="/cart", tags=["Cart"])

@router.post("/add", response_model=CartItemOut)
def add_to_cart(data: CartAdd, db: Session=Depends(get_db), user=Depends(get_current_user)):
    item = db.query(MenuItem).filter(MenuItem.id==data.menu_item_id, MenuItem.is_available==True).first()
    if not item: raise HTTPException(404, "Item not found or unavailable")
    existing = db.query(CartItem).filter(CartItem.user_id==user.id, CartItem.menu_item_id==data.menu_item_id).first()
    if existing:
        existing.quantity += data.quantity; db.commit(); db.refresh(existing); return existing
    ci = CartItem(user_id=user.id, menu_item_id=data.menu_item_id, quantity=data.quantity)
    db.add(ci); db.commit(); db.refresh(ci); return ci

@router.get("", response_model=CartOut)
def get_cart(db: Session=Depends(get_db), user=Depends(get_current_user)):
    items = db.query(CartItem).filter(CartItem.user_id==user.id).all()
    total = round(sum(i.menu_item.price * i.quantity for i in items), 2)
    return {"items": items, "total": total}

@router.delete("/remove/{item_id}")
def remove_from_cart(item_id: int, db: Session=Depends(get_db), user=Depends(get_current_user)):
    ci = db.query(CartItem).filter(CartItem.id==item_id, CartItem.user_id==user.id).first()
    if not ci: raise HTTPException(404, "Cart item not found")
    db.delete(ci); db.commit(); return {"message": "Removed"}

@router.patch("/update/{item_id}", response_model=CartItemOut)
def update_cart_item(item_id: int, quantity: int, db: Session=Depends(get_db), user=Depends(get_current_user)):
    ci = db.query(CartItem).filter(CartItem.id==item_id, CartItem.user_id==user.id).first()
    if not ci: raise HTTPException(404, "Not found")
    if quantity <= 0:
        db.delete(ci); db.commit(); raise HTTPException(200, "Removed")
    ci.quantity = quantity; db.commit(); db.refresh(ci); return ci

@router.delete("/clear")
def clear_cart(db: Session=Depends(get_db), user=Depends(get_current_user)):
    db.query(CartItem).filter(CartItem.user_id==user.id).delete()
    db.commit(); return {"message": "Cart cleared"}
