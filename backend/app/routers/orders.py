from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin
from app.models.cart import CartItem
from app.models.order import Order, OrderItem
from app.schemas.schemas import OrderCreate, OrderOut, OrderStatusUpdate

router = APIRouter(prefix="/orders", tags=["Orders"])

PROMO_CODES = {"SAVE10": 0.10, "WELCOME20": 0.20, "FLAT50": None}

@router.post("", response_model=OrderOut, status_code=201)
def place_order(data: OrderCreate, db: Session=Depends(get_db), user=Depends(get_current_user)):
    cart = db.query(CartItem).filter(CartItem.user_id==user.id).all()
    if not cart: raise HTTPException(400, "Cart is empty")
    rid = cart[0].menu_item.restaurant_id
    for ci in cart:
        if ci.menu_item.restaurant_id != rid:
            raise HTTPException(400, "Cart has items from multiple restaurants. Clear cart first.")
    subtotal = sum(ci.menu_item.price * ci.quantity for ci in cart)
    discount = 0.0
    if data.promo_code:
        code = data.promo_code.upper()
        if code in PROMO_CODES:
            rate = PROMO_CODES[code]
            discount = round(subtotal * rate, 2) if rate else min(50.0, subtotal)
    total = round(subtotal - discount, 2)
    order = Order(user_id=user.id, restaurant_id=rid, total_amount=total,
                  delivery_address=data.delivery_address, notes=data.notes,
                  promo_code=data.promo_code, discount_amount=discount)
    db.add(order); db.flush()
    for ci in cart:
        db.add(OrderItem(order_id=order.id, menu_item_id=ci.menu_item_id,
                         quantity=ci.quantity, unit_price=ci.menu_item.price,
                         subtotal=round(ci.menu_item.price * ci.quantity, 2)))
    db.query(CartItem).filter(CartItem.user_id==user.id).delete()
    db.commit(); db.refresh(order); return order

@router.get("", response_model=List[OrderOut])
def get_orders(db: Session=Depends(get_db), user=Depends(get_current_user)):
    return db.query(Order).filter(Order.user_id==user.id).order_by(Order.created_at.desc()).all()

@router.get("/admin/all", response_model=List[OrderOut])
def all_orders(db: Session=Depends(get_db), admin=Depends(get_current_admin), skip: int=0, limit: int=50):
    return db.query(Order).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()

@router.get("/{oid}", response_model=OrderOut)
def get_order(oid: int, db: Session=Depends(get_db), user=Depends(get_current_user)):
    o = db.query(Order).filter(Order.id==oid).first()
    if not o: raise HTTPException(404, "Order not found")
    if o.user_id != user.id and not user.is_admin: raise HTTPException(403, "Access denied")
    return o

@router.patch("/{oid}/status", response_model=OrderOut)
def update_status(oid: int, data: OrderStatusUpdate, db: Session=Depends(get_db), admin=Depends(get_current_admin)):
    o = db.query(Order).filter(Order.id==oid).first()
    if not o: raise HTTPException(404, "Not found")
    valid = ["Placed","Preparing","Out for Delivery","Delivered","Cancelled"]
    if data.status not in valid: raise HTTPException(400, f"Status must be one of: {valid}")
    o.status = data.status; db.commit(); db.refresh(o); return o
