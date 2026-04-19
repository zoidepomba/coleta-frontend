from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Coleta(Base):
    __tablename__ = "coletas"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    address = Column(String, nullable=False)
    waste_type = Column(String, nullable=False)
    waste_label = Column(String, nullable=False)
    waste_icon = Column(String, nullable=False)
    value = Column(Float, nullable=False)
    status = Column(String, default="pending")
    coletor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    valor_aceito = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
