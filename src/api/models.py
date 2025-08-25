from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(120),nullable=False)
    phone: Mapped[str] = mapped_column(String(120),nullable=False) # maybe change to int later (check api)
    fname: Mapped[str] = mapped_column(String(120),nullable=False)
    lname: Mapped[str] = mapped_column(String(120),nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False, default="Customer")


    def serialize(self):
        return {
            "id": self.id,
            "first": self.fname,
            "last": self.lname,
            "email": self.email,
            "phone": self.phone
            # do not serialize the password, its a security breach
        }
    
class Staff(db.Model):
    __tablename__ = "staff"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    role: Mapped[str] = mapped_column(String(120), nullable=False)
    bio: Mapped[str] = mapped_column(Text, nullable=False, default="")
    photo_url: Mapped[str] = mapped_column(String(500), nullable=True)
    booking_url: Mapped[str] = mapped_column(String(500), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "role": self.role,
            "bio": self.bio,
            "photoUrl": self.photo_url,
            "bookingUrl": self.booking_url,
        }