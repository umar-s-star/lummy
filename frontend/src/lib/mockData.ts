import type { Category, Dish, Review, Branch, Order, Promo } from '../types';

export const CATEGORIES: Category[] = [
  { id:'1', nameRu:'Авторские десерты', nameUz:'Mualliflik desertlari', nameUzCyrl:'Муаллифлик десертлари', slug:'desserts', icon:'🍰', isActive:true, order:1 },
  { id:'2', nameRu:'Торты',             nameUz:'Tortlar',               nameUzCyrl:'Тортлар',               slug:'cakes',    icon:'🎂', isActive:true, order:2 },
  { id:'3', nameRu:'Кофе',              nameUz:'Qahva',                 nameUzCyrl:'Қаҳва',                 slug:'coffee',   icon:'☕', isActive:true, order:3 },
  { id:'4', nameRu:'Завтраки',          nameUz:'Nonushta',              nameUzCyrl:'Нонушта',               slug:'breakfast',icon:'🥐', isActive:true, order:4 },
  { id:'5', nameRu:'Основные блюда',    nameUz:'Asosiy taomlar',        nameUzCyrl:'Асосий таомлар',        slug:'mains',    icon:'🍽️', isActive:true, order:5 },
  { id:'6', nameRu:'Салаты',            nameUz:'Salatlar',              nameUzCyrl:'Салатлар',              slug:'salads',   icon:'🥗', isActive:true, order:6 },
  { id:'7', nameRu:'Напитки',           nameUz:'Ichimliklar',           nameUzCyrl:'Ичимликлар',            slug:'drinks',   icon:'🥤', isActive:true, order:7 },
  { id:'8', nameRu:'Чай',              nameUz:'Choy',                  nameUzCyrl:'Чой',                   slug:'tea',      icon:'🍵', isActive:true, order:8 },
];

const IMG = (id: string) => `https://images.unsplash.com/photo-${id}?w=600&q=80&fit=crop`;

export const DISHES: Dish[] = [
  { id:'1', nameRu:'Торт «Лесные ягоды»', nameUz:"O'rmon mevali tort", nameUzCyrl:'Ўрмон мевали торт',
    descriptionRu:'Нежный бисквит с кремом из маскарпоне и свежими лесными ягодами. Лёгкий, воздушный, неповторимый.',
    descriptionUz:"Maskarpone kremi va yangi o'rmon mevali yumshoq biskvit.", descriptionUzCyrl:'Маскарпоне крем ва янги ўрмон мевали юмшоқ бисквит.',
    price:85000, oldPrice:100000, image:IMG('1578985545062-69928b1d9587'), gallery:[IMG('1578985545062-69928b1d9587'),IMG('1565958011703-44f9829ba187')],
    weight:350, calories:420, proteins:8, fats:22, carbs:48, allergens:['Глютен','Молоко','Яйца'],
    categoryId:'2', isBestseller:true, isSignature:true, inStock:true, rating:4.9, reviewCount:124 },

  { id:'2', nameRu:'Капучино Signature', nameUz:'Signature Kapuchino', nameUzCyrl:'Signature Капучино',
    descriptionRu:'Двойной эспрессо с нежной молочной пенкой и нотой ванили. Наша фирменная рецептура.',
    descriptionUz:"Vanil ohangi bilan nozik sut ko'pigi va ikki espresso.", descriptionUzCyrl:'Ваниль оҳанги билан нозик сут кўпиги ва икки эспрессо.',
    price:42000, image:IMG('1514362545857-3bc16c4c7d1b'),
    weight:300, calories:180, proteins:6, fats:8, carbs:22,
    categoryId:'3', isBestseller:true, isSignature:true, inStock:true, rating:4.8, reviewCount:89 },

  { id:'3', nameRu:'Эклер «Карамель»', nameUz:'Karamel Ekler', nameUzCyrl:'Карамель Эклер',
    descriptionRu:'Классический заварной эклер с кремом крем-брюле и хрустящей карамелью.',
    descriptionUz:"Krem-brüle kremi va qars-qars karamel bilan klassik choux ekler.", descriptionUzCyrl:'Крем-брюле крем ва қарс-қарс карамель билан классик шу эклер.',
    price:35000, image:IMG('1464305795204-6f5bbfc7fb81'),
    weight:120, calories:320, proteins:5, fats:16, carbs:40,
    categoryId:'1', isNew:true, inStock:true, rating:4.7, reviewCount:56 },

  { id:'4', nameRu:'Яйца Бенедикт', nameUz:'Benedikt tuxumlari', nameUzCyrl:'Бенедикт тухумлари',
    descriptionRu:'Яйца пашот на тостах с голландским соусом и лососем. Лёгкий завтрак.',
    descriptionUz:"Gollanding sousi va losos bilan tostlarda poached tuxum.", descriptionUzCyrl:'Голланд соуси ва лосось билан тостларда poached тухум.',
    price:68000, image:IMG('1542314831-068cd1dbfeeb'),
    weight:280, calories:520, proteins:28, fats:32, carbs:24,
    categoryId:'4', isBestseller:true, inStock:true, rating:4.6, reviewCount:43 },

  { id:'5', nameRu:'Тирамису Lummy', nameUz:'Lummy Tiramisu', nameUzCyrl:'Lummy Тирамису',
    descriptionRu:'Классический тирамису с маскарпоне, кофе эспрессо и какао-пудрой по нашему фирменному рецепту.',
    descriptionUz:"Maskarpone, espresso qahva va kakao kukuni bilan klassik tiramisu.", descriptionUzCyrl:'Маскарпоне, эспрессо қаҳва ва какао куни билан классик тирамису.',
    price:55000, image:IMG('1551024601-bec78aea704b'),
    weight:200, calories:380, proteins:7, fats:20, carbs:42,
    categoryId:'1', isBestseller:true, isSignature:true, inStock:true, rating:4.9, reviewCount:178 },

  { id:'6', nameRu:'Лосось Терияки', nameUz:'Teriyaki Losos', nameUzCyrl:'Терияки Лосось',
    descriptionRu:'Филе лосося в соусе терияки с рисом и свежими овощами.',
    descriptionUz:"Guruch va yangi sabzavotlar bilan teriyaki sousidagi losos.", descriptionUzCyrl:'Гуруч ва янги сабзавотлар билан терияки соусидаги лосось.',
    price:125000, image:IMG('1550617931-e17a7b70dce2'),
    weight:350, calories:480, proteins:38, fats:18, carbs:32,
    categoryId:'5', isNew:true, isSignature:true, inStock:true, rating:4.7, reviewCount:31 },

  { id:'7', nameRu:'Круассан миндальный', nameUz:'Bodomli kruassan', nameUzCyrl:'Бодомли круассан',
    descriptionRu:'Нежный слоёный круассан с миндальным кремом франжипан и хрустящими лепестками.',
    descriptionUz:"Xrustli yaproqlar va bodom kremi bilan kruassan.", descriptionUzCyrl:'Хрустли япроқлар ва бодом крем билан круассан.',
    price:28000, image:IMG('1606313564200-e75d5e30ef07'),
    weight:90, calories:380, proteins:8, fats:22, carbs:36,
    categoryId:'4', inStock:true, rating:4.5, reviewCount:67 },

  { id:'8', nameRu:'Матча Латте', nameUz:'Matcha Latte', nameUzCyrl:'Матча Латте',
    descriptionRu:'Японский зелёный чай матча с нежным молочным вспениванием. Освежающий и полезный.',
    descriptionUz:"Yumshoq sut ko'pigi bilan yapon yashil choy matcha.", descriptionUzCyrl:'Юмшоқ сут кўпиги билан япон яшил чой матча.',
    price:48000, image:IMG('1587668178277-295251f900ce'),
    weight:350, calories:180, proteins:8, fats:6, carbs:24,
    categoryId:'8', isNew:true, inStock:true, rating:4.6, reviewCount:44 },

  { id:'9', nameRu:'Чизкейк «Нью-Йорк»', nameUz:'Nyu-York Chizkeyk', nameUzCyrl:'Нью-Йорк Чизкейк',
    descriptionRu:'Классический нью-йоркский чизкейк с крем-чизом на хрустящей основе из печенья.',
    descriptionUz:"Pechene asosida krem-chiz bilan klassik Nyu-York chizkeygi.", descriptionUzCyrl:'Печене асосида крем-чиз билан классик Нью-Йорк чизкейки.',
    price:62000, image:IMG('1563805042-7684c019e1cb'),
    weight:180, calories:450, proteins:9, fats:28, carbs:44,
    categoryId:'1', isBestseller:true, inStock:true, rating:4.8, reviewCount:92 },

  { id:'10', nameRu:'Греческий салат', nameUz:'Grek salati', nameUzCyrl:'Грек салати',
    descriptionRu:'Свежие овощи, оливки, фета и оригинальный греческий соус.',
    descriptionUz:"Yangi sabzavotlar, zaytun, feta va original grek sousi.", descriptionUzCyrl:'Янги сабзавотлар, зайтун, фета ва оригинал грек соуси.',
    price:55000, image:IMG('1488477181946-6428a0291777'),
    weight:300, calories:220, proteins:8, fats:14, carbs:16,
    categoryId:'6', inStock:true, rating:4.4, reviewCount:28 },

  { id:'11', nameRu:'Макарон ассорти', nameUz:'Makaron assortimenti', nameUzCyrl:'Макарон ассортименти',
    descriptionRu:'Набор из 6 французских макарон: малина, фисташка, шоколад, ваниль, лимон, карамель.',
    descriptionUz:"6 ta fransuz makaroni: malina, pistache, shokolad, vanil, limon, karamel.", descriptionUzCyrl:'6 та франсуз макарони: малина, писташе, шоколад, ваниль, лимон, карамель.',
    price:72000, image:IMG('1571877227200-a0d98ea607e9'),
    weight:120, calories:480, proteins:6, fats:18, carbs:68,
    categoryId:'1', isBestseller:true, isSignature:true, inStock:true, rating:4.9, reviewCount:210 },

  { id:'12', nameRu:'Флэт Уайт', nameUz:'Flat White', nameUzCyrl:'Флэт Уайт',
    descriptionRu:'Ристретто с горячим молоком 1:2. Насыщенный кофейный вкус.',
    descriptionUz:"1:2 nisbatida issiq sut bilan ristretto.", descriptionUzCyrl:'1:2 нисбатида иссиқ сут билан ристретто.',
    price:38000, image:IMG('1514362545857-3bc16c4c7d1b'),
    weight:180, calories:120, proteins:5, fats:5, carbs:10,
    categoryId:'3', inStock:true, rating:4.7, reviewCount:55 },
];

export const REVIEWS: Review[] = [
  { id:'1', userName:'Анастасия К.', rating:5, text:'Самое красивое место в Ташкенте! Десерты просто невероятные, особенно тирамису.', isApproved:true, createdAt:'2024-03-15' },
  { id:'2', userName:'Dilnoza M.',   rating:5, text:"Lummy — bu mening sevimli joyim. Har safar yangi his-tuyg'ular. Dessertlar ajoyib!", isApproved:true, createdAt:'2024-03-10' },
  { id:'3', userName:'Михаил В.',   rating:4, text:'Отличное кафе с потрясающими десертами. Рекомендую торт с лесными ягодами!', isApproved:true, createdAt:'2024-03-08' },
  { id:'4', userName:'Nilufar T.',  rating:5, text:"Har doim eng yaxshi sifat va xizmat. Tortlar go'zal va maza ham ajoyib.", isApproved:true, createdAt:'2024-03-01' },
  { id:'5', userName:'Сергей П.',   rating:5, text:'Приходим сюда каждую неделю. Атмосфера уникальная, персонал внимательный.', isApproved:false, createdAt:'2024-02-28' },
];

export const BRANCHES: Branch[] = [
  {
    id:'1', name:'Lummy Seoul Mun', address:'Seoul Mun ko`chasi, Toshkent',
    phone:'+998 94 818 68 68', hours:'09:00 – 23:00',
    lat:41.2967, lng:69.2406, isMain:true,
    image:'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&q=80',
    description:'Главный флагманский ресторан в центре города',
  },
  {
    id:'2', name:'Lummy Yunusobod', address:'Юнусобод тумани, Ташкент',
    phone:'+998 94 818 68 70', hours:'10:00 – 22:00',
    lat:41.3270, lng:69.2924, isMain:false,
    image:'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
    description:'Уютный ресторан в Юнусободе',
  },
];

export const PROMOS: Promo[] = [
  { id:'1', titleRu:'Скидка 20% на завтраки', titleUz:"Nonushtaga 20% chegirma",
    descriptionRu:'Каждое утро с 9 до 12', descriptionUz:'Har kuni 9 dan 12 gacha',
    image:'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
    code:'MORNING20', discount:20, isActive:true, expiresAt:'2024-12-31' },
  { id:'2', titleRu:'Торт на заказ', titleUz:"Buyurtmaga tort",
    descriptionRu:'Авторские торты за 3 дня', descriptionUz:'3 kun oldin buyurtma bering',
    image:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
    isActive:true },
];

export const ORDERS: Order[] = [
  { id:'ORD-001', customerName:'Анастасия К.', customerPhone:'+998 90 123 45 67',
    items:[{ dishName:'Тирамису Lummy', quantity:2, price:55000 },{ dishName:'Капучино Signature', quantity:2, price:42000 }],
    status:'delivered', total:194000, deliveryType:'delivery', address:'ул. Амира Темура 15',
    paymentMethod:'click', createdAt:'2024-03-15T12:00:00Z' },
  { id:'ORD-002', customerName:'Dilnoza M.', customerPhone:'+998 91 234 56 78',
    items:[{ dishName:'Торт «Лесные ягоды»', quantity:1, price:85000 }],
    status:'preparing', total:85000, deliveryType:'pickup',
    paymentMethod:'cash', createdAt:'2024-03-16T09:30:00Z' },
  { id:'ORD-003', customerName:'Михаил В.', customerPhone:'+998 97 345 67 89',
    items:[{ dishName:'Лосось Терияки', quantity:1, price:125000 },{ dishName:'Матча Латте', quantity:1, price:48000 }],
    status:'confirmed', total:173000, deliveryType:'delivery', address:'ул. Навои 22',
    paymentMethod:'payme', createdAt:'2024-03-16T11:00:00Z' },
];
