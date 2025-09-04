const marketProfilePictures = [
    '/markets/armacao_supermercado.jpeg',
    '/markets/bahamas_mix.png',
    '/markets/bh_supermercados.png',
    '/markets/carrefour.png',
    '/markets/economart_atacadista.jpeg',
    '/markets/rede_uai.png'
]

// Tipos para os dados
export interface Market {
    id: string;
    name: string;
    address: string;
    phone: string;
    rating: number;
    deliveryFee: number;
    minOrder: number;
    category: string;
    profilePicture: string;
    distance: number;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    unit: string;
    category: string;
    brand: string;
    weight?: string;
    stock: number;
    marketId: string;
    images: string[];
}

// Dados dos mercados
export const markets: Market[] = [
    {
        id: '1',
        name: 'Supermercado São João',
        address: 'Rua das Flores, 123 - Centro',
        phone: '(11) 99999-9999',
        rating: 4.5,
        deliveryFee: 5.90,
        minOrder: 25.00,
        category: 'Supermercado',
        profilePicture: marketProfilePictures[0],
        distance: 1.5
    },
    {
        id: '2',
        name: 'Mercado Popular',
        address: 'Av. Principal, 456 - Vila Nova',
        phone: '(11) 88888-8888',
        rating: 4.2,
        deliveryFee: 3.90,
        minOrder: 20.00,
        category: 'Mercado',
        profilePicture: marketProfilePictures[1],
        distance: 2.5
    },
    {
        id: '3',
        name: 'Atacadão Express',
        address: 'Rua do Comércio, 789 - Jardim',
        phone: '(11) 77777-7777',
        rating: 4.7,
        deliveryFee: 7.90,
        minOrder: 30.00,
        category: 'Atacado',
        profilePicture: marketProfilePictures[2],
        distance: 3.5
    },
    {
        id: '4',
        name: 'Mini Mercado 24h',
        address: 'Travessa da Paz, 321 - Bairro',
        phone: '(11) 66666-6666',
        rating: 4.0,
        deliveryFee: 4.90,
        minOrder: 15.00,
        category: 'Conveniência',
        profilePicture: marketProfilePictures[3],
        distance: 4.5
    },
    {
        id: '5',
        name: 'Supermercado Família',
        address: 'Alameda dos Ipês, 654 - Residencial',
        phone: '(11) 55555-5555',
        rating: 4.3,
        deliveryFee: 6.90,
        minOrder: 22.00,
        category: 'Supermercado',
        profilePicture: marketProfilePictures[4],
        distance: 5.5
    },
    {
        id: '6',
        name: 'Supermercado São João',
        address: 'Rua das Flores, 123 - Centro',
        phone: '(11) 99999-9999',
        rating: 4.5,
        deliveryFee: 5.90,
        minOrder: 25.00,
        category: 'Supermercado',
        profilePicture: marketProfilePictures[5],
        distance: 6.5
    }
];

// Gerar produtos fictícios
export const products: Product[] = [
    // Frutas e Verduras
    {
        id: '1',
        name: 'Banana Prata (kg)',
        description: 'Banana prata fresca e madura, ideal para consumo imediato',
        price: 4.99,
        unit: 'kg',
        category: 'Frutas e Verduras',
        brand: 'Produtor Local',
        weight: '1kg',
        stock: 50,
        marketId: '1',
        images: ['https://picsum.photos/256/256?random=1', 'https://picsum.photos/256/256?random=2']
    },
    {
        id: '2',
        name: 'Maçã Gala (kg)',
        description: 'Maçã gala crocante e suculenta, rica em fibras',
        price: 6.99,
        unit: 'kg',
        category: 'Frutas e Verduras',
        brand: 'Produtor Local',
        weight: '1kg',
        stock: 30,
        marketId: '1',
        images: ['https://picsum.photos/256/256?random=3', 'https://picsum.photos/256/256?random=4']
    },
    {
        id: '3',
        name: 'Alface Crespa',
        description: 'Alface crespa fresca e crocante, perfeita para saladas',
        price: 2.49,
        unit: 'unidade',
        category: 'Frutas e Verduras',
        brand: 'Produtor Local',
        weight: '1 unidade',
        stock: 25,
        marketId: '2',
        images: ['https://picsum.photos/256/256?random=5']
    },
    {
        id: '4',
        name: 'Tomate Cereja (bandeja)',
        description: 'Tomate cereja doce e saboroso, ideal para saladas',
        price: 8.99,
        unit: 'bandeja',
        category: 'Frutas e Verduras',
        brand: 'Produtor Local',
        weight: '300g',
        stock: 20,
        marketId: '2',
        images: ['https://picsum.photos/256/256?random=6', 'https://picsum.photos/256/256?random=7']
    },
    {
        id: '5',
        name: 'Cenoura (kg)',
        description: 'Cenoura fresca e crocante, rica em vitamina A',
        price: 3.99,
        unit: 'kg',
        category: 'Frutas e Verduras',
        brand: 'Produtor Local',
        weight: '1kg',
        stock: 40,
        marketId: '3',
        images: ['https://picsum.photos/256/256?random=8']
    },

    // Carnes e Frios
    {
        id: '6',
        name: 'Carne Bovina (kg)',
        description: 'Carne bovina de primeira qualidade, macia e saborosa',
        price: 29.99,
        unit: 'kg',
        category: 'Carnes e Frios',
        brand: 'Frigorífico Premium',
        weight: '1kg',
        stock: 15,
        marketId: '1',
        images: ['https://picsum.photos/256/256?random=9', 'https://picsum.photos/256/256?random=10']
    },
    {
        id: '7',
        name: 'Frango Inteiro (kg)',
        description: 'Frango inteiro fresco, ideal para assar ou cozinhar',
        price: 12.99,
        unit: 'kg',
        category: 'Carnes e Frios',
        brand: 'Granja São Pedro',
        weight: '1kg',
        stock: 25,
        marketId: '1',
        images: ['https://picsum.photos/256/256?random=11']
    },
    {
        id: '8',
        name: 'Presunto Fatiado (200g)',
        description: 'Presunto fatiado fino, perfeito para sanduíches',
        price: 7.99,
        unit: '200g',
        category: 'Carnes e Frios',
        brand: 'Sadia',
        weight: '200g',
        stock: 30,
        marketId: '2',
        images: ['https://picsum.photos/256/256?random=12']
    },
    {
        id: '9',
        name: 'Queijo Mussarela (500g)',
        description: 'Queijo mussarela derretido, ideal para pizzas',
        price: 15.99,
        unit: '500g',
        category: 'Carnes e Frios',
        brand: 'Itambé',
        weight: '500g',
        stock: 20,
        marketId: '3',
        images: ['https://picsum.photos/256/256?random=13', 'https://picsum.photos/256/256?random=14']
    },
    {
        id: '10',
        name: 'Salsicha (500g)',
        description: 'Salsicha tradicional, perfeita para cachorro-quente',
        price: 9.99,
        unit: '500g',
        category: 'Carnes e Frios',
        brand: 'Perdigão',
        weight: '500g',
        stock: 35,
        marketId: '4',
        images: ['https://picsum.photos/256/256?random=15']
    },

    // Laticínios
    {
        id: '11',
        name: 'Leite Integral (1L)',
        description: 'Leite integral fresco e nutritivo',
        price: 4.99,
        unit: '1L',
        category: 'Laticínios',
        brand: 'Itambé',
        weight: '1L',
        stock: 40,
        marketId: '1',
        images: ['https://picsum.photos/256/256?random=16']
    },
    {
        id: '12',
        name: 'Iogurte Natural (170g)',
        description: 'Iogurte natural sem açúcar, rico em probióticos',
        price: 3.99,
        unit: '170g',
        category: 'Laticínios',
        brand: 'Danone',
        weight: '170g',
        stock: 50,
        marketId: '2',
        images: ['https://picsum.photos/256/256?random=17']
    },
    {
        id: '13',
        name: 'Manteiga (200g)',
        description: 'Manteiga sem sal, ideal para culinária',
        price: 8.99,
        unit: '200g',
        category: 'Laticínios',
        brand: 'Aviação',
        weight: '200g',
        stock: 25,
        marketId: '3',
        images: ['https://picsum.photos/256/256?random=18'] 
    },

    // Grãos e Cereais
    {
        id: '14',
        name: 'Arroz Branco (5kg)',
        description: 'Arroz branco tipo 1, grãos longos e soltos',
        price: 22.99,
        unit: '5kg',
        category: 'Grãos e Cereais',
        brand: 'Camil',
        weight: '5kg',
        stock: 30,
        marketId: '1',
        images: ['https://picsum.photos/256/256?random=18']
    },
    {
        id: '15',
        name: 'Feijão Carioca (1kg)',
        description: 'Feijão carioca de qualidade, rico em proteínas',
        price: 6.99,
        unit: '1kg',
        category: 'Grãos e Cereais',
        brand: 'Camil',
        weight: '1kg',
        stock: 45,
        marketId: '2',
        images: ['https://picsum.photos/256/256?random=19']
    },
    {
        id: '16',
        name: 'Aveia em Flocos (500g)',
        description: 'Aveia em flocos finos, rica em fibras',
        price: 5.99,
        unit: '500g',
        category: 'Grãos e Cereais',
        brand: 'Quaker',
        weight: '500g',
        stock: 35,
        marketId: '3',
        images: ['https://picsum.photos/256/256?random=20']
    },

    // Bebidas
    {
        id: '17',
        name: 'Refrigerante Coca-Cola (2L)',
        description: 'Refrigerante Coca-Cola original, 2 litros',
        price: 8.99,
        unit: '2L',
        category: 'Bebidas',
        brand: 'Coca-Cola',
        weight: '2L',
        stock: 60,
        marketId: '1',
        images: ['https://picsum.photos/256/256?random=21', 'https://picsum.photos/256/256?random=22']
    },
    {
        id: '18',
        name: 'Suco de Laranja (1L)',
        description: 'Suco de laranja natural, sem conservantes',
        price: 6.99,
        unit: '1L',
        category: 'Bebidas',
        brand: 'Del Valle',
        weight: '1L',
        stock: 30,
        marketId: '2',
        images: ['https://picsum.photos/256/256?random=23']
    },
    {
        id: '19',
        name: 'Água Mineral (500ml)',
        description: 'Água mineral natural, garrafa de 500ml',
        price: 2.49,
        unit: '500ml',
        category: 'Bebidas',
        brand: 'Crystal',
        weight: '500ml',
        stock: 100,
        marketId: '4',
        images: ['https://picsum.photos/256/256?random=24']
    },

    // Limpeza
    {
        id: '20',
        name: 'Detergente Líquido (500ml)',
        description: 'Detergente líquido para louças, remove gordura',
        price: 4.99,
        unit: '500ml',
        category: 'Limpeza',
        brand: 'Ypê',
        weight: '500ml',
        stock: 40,
        marketId: '1',
        images: ['https://picsum.photos/256/256?random=25']
    },
    {
        id: '21',
        name: 'Sabão em Pó (1kg)',
        description: 'Sabão em pó para roupas, remove manchas',
        price: 12.99,
        unit: '1kg',
        category: 'Limpeza',
        brand: 'Omo',
        weight: '1kg',
        stock: 25,
        marketId: '2',
        images: ['https://picsum.photos/256/256?random=26']
    },
    {
        id: '22',
        name: 'Papel Higiênico (30m)',
        description: 'Papel higiênico macio, 30 metros',
        price: 6.99,
        unit: '30m',
        category: 'Limpeza',
        brand: 'Neve',
        weight: '30m',
        stock: 50,
        marketId: '3',
        images: ['https://picsum.photos/256/256?random=27']
    },

    // Higiene Pessoal
    {
        id: '23',
        name: 'Shampoo (400ml)',
        description: 'Shampoo para todos os tipos de cabelo',
        price: 15.99,
        unit: '400ml',
        category: 'Higiene Pessoal',
        brand: 'Head & Shoulders',
        weight: '400ml',
        stock: 30,
        marketId: '1',
        images: ['https://picsum.photos/256/256?random=28']
    },
    {
        id: '24',
        name: 'Escova de Dentes',
        description: 'Escova de dentes com cerdas macias',
        price: 8.99,
        unit: '1 unidade',
        category: 'Higiene Pessoal',
        brand: 'Colgate',
        weight: '1 unidade',
        stock: 45,
        marketId: '2',
        images: ['https://picsum.photos/256/256?random=29']
    },
    {
        id: '25',
        name: 'Desodorante (150ml)',
        description: 'Desodorante antitranspirante, 48h de proteção',
        price: 12.99,
        unit: '150ml',
        category: 'Higiene Pessoal',
        brand: 'Rexona',
        weight: '150ml',
        stock: 35,
        marketId: '4',
        images: ['https://picsum.photos/256/256?random=30']
    },

    // Congelados
    {
        id: '26',
        name: 'Pizza Margherita (400g)',
        description: 'Pizza margherita congelada, massa fina',
        price: 18.99,
        unit: '400g',
        category: 'Congelados',
        brand: 'Sadia',
        weight: '400g',
        stock: 20,
        marketId: '1',
        images: ['https://picsum.photos/256/256?random=31']
    },
    {
        id: '27',
        name: 'Hambúrguer (400g)',
        description: 'Hambúrguer de carne bovina, 4 unidades',
        price: 16.99,
        unit: '400g',
        category: 'Congelados',
        brand: 'Seara',
        weight: '400g',
        stock: 30,
        marketId: '3',
        images: ['https://picsum.photos/256/256?random=32']
    },

    // Enlatados
    {
        id: '28',
        name: 'Atum em Conserva (170g)',
        description: 'Atum em conserva de óleo, rico em ômega-3',
        price: 7.99,
        unit: '170g',
        category: 'Enlatados',
        brand: 'Gomes da Costa',
        weight: '170g',
        stock: 40,
        marketId: '2',
        images: ['https://picsum.photos/256/256?random=33']
    },
    {
        id: '29',
        name: 'Milho Verde (170g)',
        description: 'Milho verde em conserva, doce e crocante',
        price: 4.99,
        unit: '170g',
        category: 'Enlatados',
        brand: 'Quero',
        weight: '170g',
        stock: 35,
        marketId: '3',
        images: ['https://picsum.photos/256/256?random=34']
    },

    // Padaria
    {
        id: '30',
        name: 'Pão Francês (500g)',
        description: 'Pão francês fresco, crocante por fora e macio por dentro',
        price: 3.99,
        unit: '500g',
        category: 'Padaria',
        brand: 'Padaria Local',
        weight: '500g',
        stock: 60,
        marketId: '5',
        images: ['https://picsum.photos/256/256?random=35']
    },
    {
        id: '31',
        name: 'Bolo de Chocolate (400g)',
        description: 'Bolo de chocolate caseiro, fofinho e saboroso',
        price: 12.99,
        unit: '400g',
        category: 'Padaria',
        brand: 'Padaria Local',
        weight: '400g',
        stock: 15,
        marketId: '5',
        images: ['https://picsum.photos/256/256?random=36']
    }
];

// Função para obter produtos por mercado
export function getProductsByMarket(marketId: string): Product[] {
    return products.filter(product => product.marketId === marketId);
}

// Função para obter mercado por ID
export function getMarketById(marketId: string): Market {
    return markets.find(market => market.id === marketId) || markets[0];
}

// Função para obter produtos por categoria
export function getProductsByCategory(category: string): Product[] {
    return products.filter(product => product.category === category);
}

// Função para buscar produtos por nome
export function searchProducts(query: string): Product[] {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.brand.toLowerCase().includes(lowercaseQuery)
    );
}
