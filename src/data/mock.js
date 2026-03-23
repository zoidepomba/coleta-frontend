// Dados mockados centralizados do ColetaApp

export const WASTE_TYPES = [
  {
    id: 'domestic',
    icon: '🗑️',
    title: 'Lixo doméstico',
    subtitle: 'Sacos comuns, resíduos do dia a dia',
    available: true,
  },
  {
    id: 'bulk',
    icon: '📦',
    title: 'Grandes volumes',
    subtitle: 'Em breve',
    available: false,
  },
  {
    id: 'electronics',
    icon: '🔌',
    title: 'Eletrônicos',
    subtitle: 'Em breve',
    available: false,
  },
];

export const PROVIDERS = [
  {
    id: 1,
    name: 'João Mendes',
    initials: 'JM',
    avatarBg: '#E1F5EE',
    avatarColor: '#0F6E56',
    rating: 5,
    reviews: 48,
    distance: '0,8 km',
    eta: '~20 min',
    price: 15,
    badgeBg: '#E1F5EE',
    badgeColor: '#0F6E56',
    topRated: true,
  },
  {
    id: 2,
    name: 'Ana Souza',
    initials: 'AS',
    avatarBg: '#E6F1FB',
    avatarColor: '#185FA5',
    rating: 4,
    reviews: 31,
    distance: '1,2 km',
    eta: '~35 min',
    price: 12,
    badgeBg: '#E6F1FB',
    badgeColor: '#185FA5',
    topRated: false,
  },
  {
    id: 3,
    name: 'Roberto Lima',
    initials: 'RL',
    avatarBg: '#FAEEDA',
    avatarColor: '#854F0B',
    rating: 4,
    reviews: 12,
    distance: '2,1 km',
    eta: '~50 min',
    price: 10,
    badgeBg: '#FAEEDA',
    badgeColor: '#854F0B',
    topRated: false,
  },
];

export const PAYMENT_METHODS = [
  { id: 'pix', label: 'Pix', icon: '⚡' },
  { id: 'credit', label: 'Cartão de crédito', icon: '💳' },
  { id: 'debit', label: 'Cartão de débito', icon: '🏦' },
];

export const APP_FEE = 2;
