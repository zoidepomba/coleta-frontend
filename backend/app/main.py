from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routes import auth, coletas
from app import models  # garante que todos os modelos sejam registrados antes do create_all

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ColetaApp API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(coletas.router)


@app.get("/health")
def health():
    return {"status": "ok"}
