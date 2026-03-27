from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    address: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int; name: str; email: str
    phone: Optional[str] = None; address: Optional[str] = None
    is_admin: bool; created_at: datetime
    class Config: from_attributes = True

class Token(BaseModel):
    access_token: str; token_type: str; user: UserOut

class RestaurantCreate(BaseModel):
    name: str; location: str; cuisine_type: str
    description: Optional[str] = None; image_url: Optional[str] = None
    delivery_time: Optional[str] = "30-45 min"; min_order: Optional[float] = 0.0

class RestaurantOut(BaseModel):
    id: int; name: str; location: str; cuisine_type: str
    description: Optional[str] = None; image_url: Optional[str] = None
    rating: float; delivery_time: str; min_order: float; is_active: bool
    class Config: from_attributes = True

class MenuItemCreate(BaseModel):
    restaurant_id: int; name: str; description: Optional[str] = None
    price: float; category: Optional[str] = None; image_url: Optional[str] = None
    is_available: Optional[bool] = True; is_veg: Optional[bool] = False

class MenuItemOut(BaseModel):
    id: int; restaurant_id: int; name: str; description: Optional[str] = None
    price: float; category: Optional[str] = None; image_url: Optional[str] = None
    is_available: bool; is_veg: bool
    class Config: from_attributes = True

class CartAdd(BaseModel):
    menu_item_id: int; quantity: int = 1

class CartItemOut(BaseModel):
    id: int; menu_item_id: int; quantity: int; menu_item: MenuItemOut
    class Config: from_attributes = True

class CartOut(BaseModel):
    items: List[CartItemOut]; total: float

class OrderCreate(BaseModel):
    delivery_address: str
    notes: Optional[str] = None
    promo_code: Optional[str] = None

class OrderItemOut(BaseModel):
    id: int; menu_item_id: int; quantity: int
    unit_price: float; subtotal: float; menu_item: MenuItemOut
    class Config: from_attributes = True

class OrderOut(BaseModel):
    id: int; user_id: int; restaurant_id: int; status: str
    total_amount: float; delivery_address: str; payment_status: str
    stripe_session_id: Optional[str] = None; promo_code: Optional[str] = None
    discount_amount: float; notes: Optional[str] = None
    created_at: datetime; items: List[OrderItemOut] = []
    class Config: from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: str

class PaymentSessionOut(BaseModel):
    session_id: str; url: str

class ReviewCreate(BaseModel):
    restaurant_id: int; rating: int; comment: Optional[str] = None

class ReviewOut(BaseModel):
    id: int; user_id: int; restaurant_id: int
    rating: int; comment: Optional[str] = None
    created_at: datetime; user: UserOut
    class Config: from_attributes = True
