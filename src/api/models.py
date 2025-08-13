from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()

class User(db.Model):
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