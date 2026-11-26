import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Lang = 'uz' | 'ru' | 'en'
export const LANGS: { id: Lang; label: string; name: string }[] = [
  { id: 'uz', label: 'UZ', name: "O'zbekcha" },
  { id: 'ru', label: 'RU', name: 'Русский' },
  { id: 'en', label: 'EN', name: 'English' },
]

type ProjectText = { short: string; description: string; features: string[] }

const en = {
  meta: { title: 'Jonibek "Ranger" — Frontend Developer & Creative Web Designer' },
  nav: { home: 'Home', about: 'About', skills: 'Skills', projects: 'Projects', contact: 'Contact', hire: 'Hire me', open: 'Open menu', close: 'Close menu', top: 'Ranger, back to top', lang: 'Language' },
  loader: 'INITIALIZING EXPERIENCE...',
  hero: {
    aria: 'Introduction',
    badge: 'AVAILABLE FOR PROJECTS',
    hello: "HELLO, I'M JONIBEK.",
    role1: 'FRONTEND DEVELOPER',
    role2: 'CREATIVE WEB DESIGNER',
    desc: 'I build modern, interactive and beautiful digital experiences.',
    explore: 'Explore my work',
    contact: 'Contact me',
    scroll: 'Scroll to About',
  },
  about: {
    kicker: 'About me',
    t1: 'Turning Ideas',
    t2: 'Into',
    t2a: 'Reality',
    text: "I'm Jonibek, a Frontend Developer from Uzbekistan. I enjoy transforming creative ideas into modern digital experiences. I'm constantly learning new technologies and improving my development skills.",
    aka: 'aka',
    portrait: 'Portrait of Jonibek',
    labels: { name: 'Name', role: 'Role', country: 'Country', specialty: 'Specialty', brand: 'Brand' },
    values: { role: 'Frontend Developer', country: 'Uzbekistan', specialty: 'Web Development' },
  },
  skills: { kicker: 'My skills', t1: 'Technologies', t2: 'I Work', t2a: 'With', desc: 'The tools I use every day to design, build and ship fast, animated interfaces.' },
  projects: {
    kicker: 'My projects',
    t1: 'Some Of My',
    t2: 'Recent',
    t2a: 'Works',
    desc: 'Selected projects, from esports platforms to 3D stores and Telegram bots. Scroll to explore, click a card for details.',
    all: 'All projects on GitHub',
    live: 'Live demo',
    source: 'Source code',
    open: (title: string) => `Open details for ${title}`,
    openLabel: 'OPEN',
    shot: (title: string) => `Screenshot of ${title}`,
    tech: 'Technologies',
    features: 'Key features',
    stack: 'Stack',
    close: 'Close project details',
    items: {
      esports: { short: 'Esports tournament platform', description: 'An esports tournament platform with team management, tournament organization and live streaming, built for PUBG scrims and leagues.', features: ['Team creation & management', 'Tournament organization', 'Live match streaming', 'Stats & leaderboards'] },
      loftmir: { short: 'Premium furniture store', description: 'A premium furniture website with 3D product visualization and a modern shopping experience for a Tashkent loft furniture brand.', features: ['Interactive 3D product viewer', 'Smooth scroll animations', 'Product catalog & cart', 'Multi-language UI'] },
      menu: { short: 'Digital restaurant menu', description: 'A modern digital restaurant menu that guests open by scanning a QR code, with clear food presentation, categories, search and a cart.', features: ['QR code access', 'Categories & search', 'Cart and ordering', 'Light & dark theme'] },
      kutubxona: { short: 'Telegram library bot', description: 'A Telegram library bot for accessing and managing digital books: browse the catalog, search by title and receive books right inside Telegram.', features: ['Book catalog & search', 'Books delivered in chat', 'Admin book management', 'SQLite storage'] },
    } as Record<string, ProjectText>,
  },
  contact: {
    kicker: 'Contact',
    lines: ["LET'S BUILD", 'SOMETHING', 'AMAZING.'],
    desc: "Have an interesting idea? Let's turn it into reality.",
    form: 'Contact form',
    name: 'Your name',
    email: 'Your email',
    message: 'Tell me about your project',
    send: 'Send message',
    sending: 'Sending',
    note: 'Goes straight to my Telegram.',
    location: 'Location',
    country: 'Uzbekistan',
    errName: 'Please enter your name (at least 2 characters).',
    errEmail: 'Please enter a valid email, e.g. you@example.com.',
    errMessage: 'Tell me a bit more (at least 10 characters).',
    fix: 'Please fix the highlighted fields.',
    sent: "Message sent! I'll get back to you soon.",
    alt: (handle: string) => `You can also reach me on Telegram: @${handle}.`,
    server: {
      400: 'Some fields are not valid.',
      429: 'Too many messages. Please try again in a few minutes.',
      503: 'The form is temporarily unavailable.',
      other: 'Something went wrong.',
      offline: 'No connection. Please check your internet.',
    } as Record<string, string>,
  },
  process: {
    kicker: 'How I work',
    t1: 'From idea',
    t2a: 'to launch',
    desc: 'A clear process, so you always know what happens next.',
    steps: [
      { title: 'Idea', desc: 'We discuss your goals, audience and features, and agree on a plan and a deadline.' },
      { title: 'Design', desc: 'I design the look and the user flow, then refine it together with your feedback.' },
      { title: 'Development', desc: 'I build a fast, responsive site or app with clean code and smooth animations.' },
      { title: 'Launch', desc: 'I deploy it, connect the domain and stay in touch for fixes and updates.' },
    ],
  },
  stats: { projects: 'Projects on GitHub', tech: 'Technologies', platforms: 'Platforms: web, mobile, bots' },
  sound: { on: 'Sound on', off: 'Sound off' },
  footer: { built: 'Built with React, Three.js & GSAP.', top: 'Back to top' },
}

type Dict = typeof en

const uz: Dict = {
  meta: { title: 'Jonibek "Ranger" — Frontend dasturchi va kreativ veb-dizayner' },
  nav: { home: 'Bosh sahifa', about: 'Men haqimda', skills: "Ko'nikmalar", projects: 'Loyihalar', contact: 'Aloqa', hire: 'Ishga olish', open: 'Menyuni ochish', close: 'Menyuni yopish', top: 'Ranger, tepaga qaytish', lang: 'Til' },
  loader: 'TAYYORLANMOQDA...',
  hero: {
    aria: 'Tanishuv',
    badge: "LOYIHALARGA TAYYORMAN",
    hello: 'SALOM, MEN JONIBEK.',
    role1: 'FRONTEND DASTURCHI',
    role2: 'KREATIV VEB-DIZAYNER',
    desc: 'Zamonaviy, interaktiv va chiroyli raqamli tajribalar yarataman.',
    explore: "Ishlarimni ko'rish",
    contact: "Bog'lanish",
    scroll: "Men haqimda bo'limiga o'tish",
  },
  about: {
    kicker: 'Men haqimda',
    t1: "G'oyalarni",
    t2: '',
    t2a: 'hayotga aylantiraman',
    text: "Men Jonibek, O'zbekistonlik frontend dasturchiman. Kreativ g'oyalarni zamonaviy raqamli tajribalarga aylantirish menga yoqadi. Doimo yangi texnologiyalarni o'rganib, mahoratimni oshirib boraman.",
    aka: 'taxallusi',
    portrait: 'Jonibekning surati',
    labels: { name: 'Ism', role: 'Kasbi', country: 'Davlat', specialty: "Yo'nalish", brand: 'Brend' },
    values: { role: 'Frontend dasturchi', country: "O'zbekiston", specialty: 'Veb-dasturlash' },
  },
  skills: { kicker: "Ko'nikmalarim", t1: 'Men ishlatadigan', t2: '', t2a: 'texnologiyalar', desc: 'Tez va animatsiyali interfeyslarni loyihalash, yaratish va chiqarish uchun har kuni ishlatadigan vositalarim.' },
  projects: {
    kicker: 'Loyihalarim',
    t1: "So'nggi",
    t2: '',
    t2a: 'ishlarim',
    desc: "Esport platformalaridan 3D do'konlar va Telegram botlargacha tanlangan loyihalar. Ko'rish uchun pastga suring, batafsil ma'lumot uchun kartani bosing.",
    all: "GitHub'dagi barcha loyihalar",
    live: 'Jonli demo',
    source: 'Manba kodi',
    open: (title: string) => `${title} haqida batafsil`,
    openLabel: 'OCHISH',
    shot: (title: string) => `${title} skrinshoti`,
    tech: 'Texnologiyalar',
    features: 'Asosiy imkoniyatlar',
    stack: 'Texnologiyalar',
    close: 'Loyiha oynasini yopish',
    items: {
      esports: { short: 'Esport turnir platformasi', description: "PUBG skrimlari va ligalari uchun jamoalarni boshqarish, turnirlar tashkil qilish va jonli efirga ega esport turnir platformasi.", features: ['Jamoa yaratish va boshqarish', 'Turnirlarni tashkil qilish', "Matchlarni jonli ko'rsatish", 'Statistika va reytinglar'] },
      loftmir: { short: "Premium mebel do'koni", description: "Toshkentdagi loft mebel brendi uchun mahsulotlarning 3D ko'rinishi va zamonaviy xarid tajribasiga ega premium mebel sayti.", features: ["Interaktiv 3D mahsulot ko'rinishi", 'Silliq skroll animatsiyalari', 'Mahsulotlar katalogi va savat', "Ko'p tilli interfeys"] },
      menu: { short: 'Raqamli restoran menyusi', description: "Mehmonlar QR kodni skanerlab ochadigan zamonaviy raqamli menyu: chiroyli taom taqdimoti, bo'limlar, qidiruv va savat.", features: ['QR kod orqali kirish', "Bo'limlar va qidiruv", 'Savat va buyurtma', "Yorug' va qorong'i mavzu"] },
      kutubxona: { short: 'Telegram kutubxona boti', description: "Raqamli kitoblardan foydalanish va ularni boshqarish uchun Telegram bot: katalogni ko'rish, nom bo'yicha qidirish va kitobni to'g'ridan-to'g'ri Telegram'da olish.", features: ['Kitoblar katalogi va qidiruv', 'Kitoblar chatga yuboriladi', 'Admin uchun kitob boshqaruvi', "SQLite ma'lumotlar bazasi"] },
    },
  },
  contact: {
    kicker: 'Aloqa',
    lines: ['KELING,', 'AJOYIB NARSA', 'YARATAMIZ.'],
    desc: "Qiziqarli g'oyangiz bormi? Keling, uni hayotga tatbiq etamiz.",
    form: 'Aloqa formasi',
    name: 'Ismingiz',
    email: 'Emailingiz',
    message: 'Loyihangiz haqida yozing',
    send: 'Xabar yuborish',
    sending: 'Yuborilmoqda',
    note: "To'g'ridan-to'g'ri Telegram'imga keladi.",
    location: 'Manzil',
    country: "O'zbekiston",
    errName: 'Ismingizni kiriting (kamida 2 ta belgi).',
    errEmail: "To'g'ri email kiriting, masalan: siz@example.com.",
    errMessage: 'Batafsilroq yozing (kamida 10 ta belgi).',
    fix: "Belgilangan maydonlarni to'g'rilang.",
    sent: 'Xabar yuborildi! Tez orada javob beraman.',
    alt: (handle: string) => `Telegram orqali ham yozishingiz mumkin: @${handle}.`,
    server: {
      400: "Ba'zi maydonlar noto'g'ri to'ldirilgan.",
      429: "Juda ko'p xabar yuborildi. Bir necha daqiqadan keyin urinib ko'ring.",
      503: 'Forma vaqtincha ishlamayapti.',
      other: 'Nimadir xato ketdi.',
      offline: "Internet aloqasi yo'q. Ulanishni tekshiring.",
    },
  },
  process: {
    kicker: 'Qanday ishlayman',
    t1: "G'oyadan",
    t2a: 'ishga tushirishgacha',
    desc: 'Aniq jarayon: har doim keyingi qadam nima ekanini bilasiz.',
    steps: [
      { title: "G'oya", desc: "Maqsadlaringiz, auditoriya va kerakli imkoniyatlarni muhokama qilamiz, reja va muddatni kelishib olamiz." },
      { title: 'Dizayn', desc: "Ko'rinish va foydalanuvchi yo'lini chizaman, keyin fikringiz asosida birga takomillashtiramiz." },
      { title: 'Dasturlash', desc: 'Toza kod va silliq animatsiyalar bilan tez ishlaydigan, moslashuvchan sayt yoki ilova yarataman.' },
      { title: 'Ishga tushirish', desc: "Saytni internetga chiqaraman, domenni ulayman va tuzatish hamda yangilanishlar uchun aloqada bo'laman." },
    ],
  },
  stats: { projects: "GitHub'dagi loyihalar", tech: 'Texnologiyalar', platforms: 'Platformalar: veb, mobil, botlar' },
  sound: { on: 'Ovoz yoqilgan', off: "Ovoz o'chirilgan" },
  footer: { built: 'React, Three.js va GSAP bilan yaratilgan.', top: 'Tepaga qaytish' },
}

const ru: Dict = {
  meta: { title: 'Джонибек "Ranger" — фронтенд-разработчик и креативный веб-дизайнер' },
  nav: { home: 'Главная', about: 'Обо мне', skills: 'Навыки', projects: 'Проекты', contact: 'Контакты', hire: 'Нанять', open: 'Открыть меню', close: 'Закрыть меню', top: 'Ranger, наверх', lang: 'Язык' },
  loader: 'ЗАГРУЗКА...',
  hero: {
    aria: 'Знакомство',
    badge: 'ОТКРЫТ ДЛЯ ПРОЕКТОВ',
    hello: 'ПРИВЕТ, Я ДЖОНИБЕК.',
    role1: 'ФРОНТЕНД-РАЗРАБОТЧИК',
    role2: 'КРЕАТИВНЫЙ ВЕБ-ДИЗАЙНЕР',
    desc: 'Создаю современные, интерактивные и красивые цифровые продукты.',
    explore: 'Смотреть работы',
    contact: 'Связаться',
    scroll: 'Перейти к разделу «Обо мне»',
  },
  about: {
    kicker: 'Обо мне',
    t1: 'Превращаю идеи',
    t2: 'в',
    t2a: 'реальность',
    text: 'Я Джонибек, фронтенд-разработчик из Узбекистана. Мне нравится превращать креативные идеи в современные цифровые продукты. Я постоянно изучаю новые технологии и развиваю свои навыки.',
    aka: 'он же',
    portrait: 'Фото Джонибека',
    labels: { name: 'Имя', role: 'Роль', country: 'Страна', specialty: 'Специализация', brand: 'Бренд' },
    values: { role: 'Фронтенд-разработчик', country: 'Узбекистан', specialty: 'Веб-разработка' },
  },
  skills: { kicker: 'Мои навыки', t1: 'Технологии,', t2: 'с которыми', t2a: 'работаю', desc: 'Инструменты, которые я каждый день использую, чтобы проектировать и запускать быстрые анимированные интерфейсы.' },
  projects: {
    kicker: 'Мои проекты',
    t1: 'Мои',
    t2: 'последние',
    t2a: 'работы',
    desc: 'Избранные проекты: от киберспортивных платформ до 3D-магазинов и Telegram-ботов. Прокручивайте, чтобы смотреть, нажмите на карточку для подробностей.',
    all: 'Все проекты на GitHub',
    live: 'Демо',
    source: 'Исходный код',
    open: (title: string) => `Подробнее о проекте ${title}`,
    openLabel: 'ОТКРЫТЬ',
    shot: (title: string) => `Скриншот ${title}`,
    tech: 'Технологии',
    features: 'Ключевые возможности',
    stack: 'Стек',
    close: 'Закрыть описание проекта',
    items: {
      esports: { short: 'Платформа киберспортивных турниров', description: 'Платформа для киберспортивных турниров с управлением командами, организацией турниров и прямыми трансляциями — для PUBG-скримов и лиг.', features: ['Создание и управление командами', 'Организация турниров', 'Прямые трансляции матчей', 'Статистика и рейтинги'] },
      loftmir: { short: 'Премиальный мебельный магазин', description: 'Премиальный сайт мебели с 3D-визуализацией товаров и современным процессом покупки для ташкентского бренда лофт-мебели.', features: ['Интерактивный 3D-просмотр товаров', 'Плавные анимации при скролле', 'Каталог и корзина', 'Многоязычный интерфейс'] },
      menu: { short: 'Цифровое меню ресторана', description: 'Современное цифровое меню, которое гости открывают по QR-коду: красивая подача блюд, категории, поиск и корзина.', features: ['Доступ по QR-коду', 'Категории и поиск', 'Корзина и заказ', 'Светлая и тёмная тема'] },
      kutubxona: { short: 'Telegram-бот библиотеки', description: 'Telegram-бот библиотеки для доступа к электронным книгам и управления ими: каталог, поиск по названию и получение книг прямо в Telegram.', features: ['Каталог книг и поиск', 'Книги приходят в чат', 'Управление книгами для админа', 'Хранение в SQLite'] },
    },
  },
  contact: {
    kicker: 'Контакты',
    lines: ['ДАВАЙТЕ СОЗДАДИМ', 'ЧТО-ТО', 'ПОТРЯСАЮЩЕЕ.'],
    desc: 'Есть интересная идея? Давайте воплотим её в жизнь.',
    form: 'Форма обратной связи',
    name: 'Ваше имя',
    email: 'Ваш email',
    message: 'Расскажите о проекте',
    send: 'Отправить',
    sending: 'Отправка',
    note: 'Сообщение придёт прямо мне в Telegram.',
    location: 'Локация',
    country: 'Узбекистан',
    errName: 'Введите имя (минимум 2 символа).',
    errEmail: 'Введите корректный email, например you@example.com.',
    errMessage: 'Напишите подробнее (минимум 10 символов).',
    fix: 'Исправьте отмеченные поля.',
    sent: 'Сообщение отправлено! Скоро отвечу.',
    alt: (handle: string) => `Также можно написать в Telegram: @${handle}.`,
    server: {
      400: 'Некоторые поля заполнены неверно.',
      429: 'Слишком много сообщений. Попробуйте через несколько минут.',
      503: 'Форма временно недоступна.',
      other: 'Что-то пошло не так.',
      offline: 'Нет соединения. Проверьте интернет.',
    },
  },
  process: {
    kicker: 'Как я работаю',
    t1: 'От идеи',
    t2a: 'до запуска',
    desc: 'Понятный процесс — вы всегда знаете, что будет дальше.',
    steps: [
      { title: 'Идея', desc: 'Обсуждаем цели, аудиторию и функции, согласуем план и сроки.' },
      { title: 'Дизайн', desc: 'Продумываю внешний вид и сценарии, затем дорабатываем вместе по вашим отзывам.' },
      { title: 'Разработка', desc: 'Создаю быстрый адаптивный сайт или приложение с чистым кодом и плавными анимациями.' },
      { title: 'Запуск', desc: 'Публикую проект, подключаю домен и остаюсь на связи для правок и обновлений.' },
    ],
  },
  stats: { projects: 'Проектов на GitHub', tech: 'Технологий', platforms: 'Платформы: веб, мобайл, боты' },
  sound: { on: 'Звук включён', off: 'Звук выключен' },
  footer: { built: 'Сделано на React, Three.js и GSAP.', top: 'Наверх' },
}

const dicts: Record<Lang, Dict> = { en, uz, ru }

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem('lang') as Lang | null
    if (saved && saved in dicts) return saved
  } catch { /* storage blocked */ }
  const nav = (navigator.language || '').toLowerCase()
  if (nav.startsWith('ru')) return 'ru'
  if (nav.startsWith('uz')) return 'uz'
  return 'en'
}

type Ctx = { lang: Lang; t: Dict; setLang: (l: Lang) => void }
const I18n = createContext<Ctx | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try { localStorage.setItem('lang', l) } catch { /* ignore */ }
  }, [])
  useEffect(() => {
    document.documentElement.lang = lang
    document.title = dicts[lang].meta.title
  }, [lang])
  const value = useMemo(() => ({ lang, t: dicts[lang], setLang }), [lang, setLang])
  return <I18n.Provider value={value}>{children}</I18n.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
  const ctx = useContext(I18n)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}
