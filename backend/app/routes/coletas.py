from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models import Coleta, User
from app.schemas import ColetaCreate, ColetaOut, AceitarColetaIn, ResponderPropostaIn

router = APIRouter(prefix="/coletas", tags=["coletas"])


@router.post("/", response_model=ColetaOut)
def create_coleta(
    coleta: ColetaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_coleta = Coleta(**coleta.model_dump(), user_id=current_user.id)
    db.add(db_coleta)
    db.commit()
    db.refresh(db_coleta)
    return db_coleta


@router.get("/me", response_model=list[ColetaOut])
def get_my_coletas(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Coleta)
        .filter(Coleta.user_id == current_user.id)
        .order_by(Coleta.created_at.desc())
        .all()
    )


@router.get("/disponiveis", response_model=list[ColetaOut])
def get_disponiveis(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Coleta)
        .filter(Coleta.status == "pending", Coleta.user_id != current_user.id)
        .order_by(Coleta.created_at.desc())
        .all()
    )


@router.get("/aceitas", response_model=list[ColetaOut])
def get_aceitas(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from sqlalchemy.orm import aliased
    Solicitante = aliased(User)
    rows = (
        db.query(Coleta, Solicitante.name)
        .join(Solicitante, Solicitante.id == Coleta.user_id)
        .filter(Coleta.coletor_id == current_user.id)
        .order_by(Coleta.created_at.desc())
        .all()
    )
    result = []
    for coleta, nome in rows:
        out = ColetaOut.model_validate(coleta)
        out.solicitante_nome = nome
        result.append(out)
    return result


@router.post("/{coleta_id}/concluir", response_model=ColetaOut)
def concluir_coleta(
    coleta_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    coleta = db.query(Coleta).filter(Coleta.id == coleta_id).first()
    if not coleta:
        raise HTTPException(status_code=404, detail="Coleta não encontrada")
    if coleta.coletor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sem permissão")
    if coleta.status != "accepted":
        raise HTTPException(status_code=400, detail="Coleta não está no estado correto")

    coleta.status = "completed"
    db.commit()
    db.refresh(coleta)
    return coleta


@router.post("/{coleta_id}/aceitar", response_model=ColetaOut)
def aceitar_coleta(
    coleta_id: int,
    body: AceitarColetaIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    coleta = db.query(Coleta).filter(Coleta.id == coleta_id).first()
    if not coleta:
        raise HTTPException(status_code=404, detail="Coleta não encontrada")
    if coleta.user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Você não pode aceitar sua própria coleta")
    if coleta.status != "pending":
        raise HTTPException(status_code=400, detail="Coleta não está mais disponível")

    coleta.coletor_id = current_user.id
    coleta.valor_aceito = body.valor_aceito
    coleta.status = "accepted" if body.valor_aceito == coleta.value else "negotiating"
    db.commit()
    db.refresh(coleta)
    return coleta


@router.post("/{coleta_id}/responder", response_model=ColetaOut)
def responder_proposta(
    coleta_id: int,
    body: ResponderPropostaIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    coleta = db.query(Coleta).filter(Coleta.id == coleta_id).first()
    if not coleta:
        raise HTTPException(status_code=404, detail="Coleta não encontrada")
    if coleta.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sem permissão")
    if coleta.status != "negotiating":
        raise HTTPException(status_code=400, detail="Não há proposta pendente nesta coleta")

    if body.aceitar:
        coleta.status = "accepted"
    else:
        coleta.status = "pending"
        coleta.coletor_id = None
        coleta.valor_aceito = None

    db.commit()
    db.refresh(coleta)
    return coleta
