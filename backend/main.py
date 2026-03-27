from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base, SessionLocal
from app.core.security import get_password_hash
from app.routers import auth, restaurants, cart, orders, payments, reviews

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FoodRush API",
    description="Online Food Ordering & Delivery System",
    version="1.0.0",
)

app.add_middleware(CORSMiddleware,
    allow_origins=["http://localhost:5173","http://localhost:3000","*"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(auth.router)
app.include_router(restaurants.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(payments.router)
app.include_router(reviews.router)

@app.get("/", tags=["Health"])
def root():
    return {"message": "FoodRush API running", "docs": "/docs", "version": "1.0.0"}

@app.on_event("startup")
def seed():
    from app.models.user import User
    from app.models.restaurant import Restaurant, MenuItem
    db = SessionLocal()
    try:
        if db.query(User).count() > 0:
            return
        db.add(User(name="Admin User", email="admin@foodapp.com",
                    hashed_password=get_password_hash("admin123"), is_admin=True))
        db.add(User(name="John Doe", email="user@foodapp.com",
                    hashed_password=get_password_hash("user123"),
                    phone="9876543210", address="123 MG Road, Hyderabad"))
        db.flush()
        restaurants_data = [
            {"name":"Biryani House","location":"Banjara Hills, Hyderabad","cuisine_type":"Hyderabadi",
             "description":"Authentic Hyderabadi Dum Biryani since 1985","rating":4.5,
             "image_url":"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500","delivery_time":"25-35 min","min_order":150.0},
            {"name":"Pizza Paradise","location":"Jubilee Hills, Hyderabad","cuisine_type":"Italian",
             "description":"Wood-fired pizzas and fresh pasta","rating":4.2,
             "image_url":"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500","delivery_time":"30-40 min","min_order":200.0},
            {"name":"Burger Barn","location":"Madhapur, Hyderabad","cuisine_type":"American",
             "description":"Gourmet burgers crafted with love","rating":4.3,
             "image_url":"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500","delivery_time":"20-30 min","min_order":100.0},
            {"name":"Sushi Sakura","location":"Gachibowli, Hyderabad","cuisine_type":"Japanese",
             "description":"Fresh sushi and authentic Japanese cuisine","rating":4.6,
             "image_url":"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500","delivery_time":"35-45 min","min_order":300.0},
            {"name":"Taco Fiesta","location":"Kondapur, Hyderabad","cuisine_type":"Mexican",
             "description":"Authentic Mexican street food","rating":4.1,
             "image_url":"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500","delivery_time":"25-35 min","min_order":150.0},
        ]
        menus = [
            [{"name":"Chicken Dum Biryani","price":220,"category":"Biryani","is_veg":False,"description":"Slow-cooked aromatic rice","image_url":"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300"},
             {"name":"Mutton Biryani","price":280,"category":"Biryani","is_veg":False,"description":"Premium mutton in basmati rice","image_url":"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300"},
             {"name":"Veg Biryani","price":160,"category":"Biryani","is_veg":True,"description":"Fresh veggies in spiced rice","image_url":"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300"},
             {"name":"Raita","price":40,"category":"Sides","is_veg":True,"description":"Creamy yogurt with mint","image_url":"https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300"},
             {"name":"Gulab Jamun","price":80,"category":"Desserts","is_veg":True,"description":"Sweet milk dumplings","image_url":"https://images.unsplash.com/photo-1666215191955-c4bbc3154e44?w=300"}],
            [{"name":"Margherita Pizza","price":280,"category":"Pizza","is_veg":True,"description":"Classic tomato and mozzarella","image_url":"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300"},
             {"name":"Pepperoni Pizza","price":350,"category":"Pizza","is_veg":False,"description":"Loaded with pepperoni","image_url":"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300"},
             {"name":"BBQ Chicken Pizza","price":380,"category":"Pizza","is_veg":False,"description":"Smoky BBQ with grilled chicken","image_url":"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300"},
             {"name":"Pasta Arrabbiata","price":220,"category":"Pasta","is_veg":True,"description":"Spicy tomato penne","image_url":"https://images.unsplash.com/photo-1551183053-bf91798d21f7?w=300"},
             {"name":"Tiramisu","price":180,"category":"Desserts","is_veg":True,"description":"Italian coffee dessert","image_url":"https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300"}],
            [{"name":"Classic Cheeseburger","price":180,"category":"Burgers","is_veg":False,"description":"Beef patty with cheddar","image_url":"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300"},
             {"name":"Veggie Burger","price":150,"category":"Burgers","is_veg":True,"description":"Crispy veggie patty","image_url":"https://images.unsplash.com/photo-1520072959219-c595dc870360?w=300"},
             {"name":"Bacon Double Burger","price":250,"category":"Burgers","is_veg":False,"description":"Double patty with bacon","image_url":"https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300"},
             {"name":"Loaded Fries","price":120,"category":"Sides","is_veg":True,"description":"Fries with cheese and jalapeños","image_url":"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300"},
             {"name":"Chocolate Shake","price":150,"category":"Drinks","is_veg":True,"description":"Thick chocolate milkshake","image_url":"https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300"}],
            [{"name":"Salmon Nigiri (6pcs)","price":420,"category":"Nigiri","is_veg":False,"description":"Fresh salmon on seasoned rice","image_url":"https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=300"},
             {"name":"California Roll (8pcs)","price":320,"category":"Rolls","is_veg":False,"description":"Crab, avocado, cucumber","image_url":"https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=300"},
             {"name":"Vegetable Maki (6pcs)","price":240,"category":"Rolls","is_veg":True,"description":"Cucumber, avocado, carrot","image_url":"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300"},
             {"name":"Miso Soup","price":120,"category":"Soups","is_veg":True,"description":"Traditional miso with tofu","image_url":"https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300"},
             {"name":"Matcha Ice Cream","price":180,"category":"Desserts","is_veg":True,"description":"Japanese green tea ice cream","image_url":"https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300"}],
            [{"name":"Street Tacos (3pcs)","price":200,"category":"Tacos","is_veg":False,"description":"Soft corn tortillas with chicken","image_url":"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300"},
             {"name":"Bean Burrito","price":220,"category":"Burritos","is_veg":True,"description":"Refried beans and cheese","image_url":"https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300"},
             {"name":"Chicken Quesadilla","price":240,"category":"Quesadillas","is_veg":False,"description":"Grilled tortilla with chicken","image_url":"https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=300"},
             {"name":"Nachos Supreme","price":180,"category":"Sides","is_veg":True,"description":"Chips with salsa and guac","image_url":"https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300"},
             {"name":"Churros with Dip","price":150,"category":"Desserts","is_veg":True,"description":"Golden dough with chocolate dip","image_url":"https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?w=300"}],
        ]
        for i, rd in enumerate(restaurants_data):
            rest = Restaurant(**rd); db.add(rest); db.flush()
            for md in menus[i]:
                db.add(MenuItem(restaurant_id=rest.id, **md))
        db.commit()
        print("Seed data loaded. admin@foodapp.com/admin123  user@foodapp.com/user123")
    except Exception as e:
        print(f"Seed error: {e}"); db.rollback()
    finally:
        db.close()
