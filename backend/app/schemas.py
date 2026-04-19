from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


class ColetaCreate(BaseModel):
    address: str
    waste_type: str
    waste_label: str
    waste_icon: str
    value: float


class ColetaOut(BaseModel):
    id: int
    address: str
    waste_type: str
    waste_label: str
    waste_icon: str
    value: float
    status: str
    coletor_id: Optional[int] = None
    valor_aceito: Optional[float] = None
    solicitante_nome: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class AceitarColetaIn(BaseModel):
    valor_aceito: float


class ResponderPropostaIn(BaseModel):
    aceitar: bool
