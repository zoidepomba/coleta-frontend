# ColetaApp 🗑️

Aplicativo de coleta de lixo doméstico sob demanda — conecta moradores a prestadores de serviço próximos.

---

## Estrutura do projeto

```
coletaapp/
├── src/
│   ├── App.js                  ← Navegação principal
│   ├── theme/
│   │   └── index.js            ← Cores, espaçamentos, tipografia
│   ├── components/
│   │   └── index.js            ← Componentes reutilizáveis (Button, Card, Avatar...)
│   └── screens/
│       ├── HomeScreen.js       ← Tela 1: Escolher tipo de descarte
│       ├── PrestadoresScreen.js← Tela 2: Lista de prestadores próximos
│       ├── ConfirmacaoScreen.js← Tela 3: Resumo + pagamento
│       └── SucessoScreen.js    ← Tela 4: Confirmação com animação
```

---

## Como rodar

### 1. Instalar o Expo CLI
```bash
npm install -g expo-cli
```

### 2. Instalar dependências
```bash
cd coletaapp
npm install
```

### 3. Iniciar o app
```bash
npm start
```

Escaneie o QR code com o app **Expo Go** no seu celular (Android ou iPhone).

---

## Próximos passos para escalar

### Backend
- [ ] API REST (Node.js + Express ou Firebase)
- [ ] Autenticação de usuários (Firebase Auth)
- [ ] Banco de dados para pedidos (Firestore ou PostgreSQL)

### Funcionalidades
- [ ] Mapa em tempo real com localização do prestador
- [ ] Chat entre cliente e prestador
- [ ] Sistema de avaliações pós-coleta
- [ ] Notificações push
- [ ] Painel do prestador (aceitar/recusar pedidos)
- [ ] Histórico de coletas
- [ ] Integração real de pagamento (Stripe, Pagar.me)

### Lançamento
- [ ] Publicar na Play Store (Android)
- [ ] Publicar na App Store (iOS)

---

## Tecnologias usadas

| Tecnologia | Uso |
|---|---|
| React Native + Expo | App mobile multiplataforma |
| React Navigation | Navegação entre telas |
| JavaScript (ES6+) | Linguagem principal |

---

*Desenvolvido como MVP para validação de produto.*
