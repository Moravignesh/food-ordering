from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class Restaurant(Base):
    __tablename__ = "restaurants"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    location = Column(String(300), nullable=False)
    cuisine_type = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    rating = Column(Float, default=0.0)
    delivery_time = Column(String(50), default="30-45 min")
    min_order = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    menu_items = relationship("MenuItem", back_populates="restaurant", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="restaurant")

class MenuItem(Base):
    __tablename__ = "menu_items"
    id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    category = Column(String(100), nullable=True)
    image_url = Column(String(500), nullable=True)
    is_available = Column(Boolean, default=True)
    is_veg = Column(Boolean, default=False)
    restaurant = relationship("Restaurant", back_populates="menu_items")
    cart_items = relationship("CartItem", back_populates="menu_item")
    order_items = relationship("OrderItem", back_populates="menu_item")
