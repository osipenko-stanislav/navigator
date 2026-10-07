import { checkboxControl, chipControl, contextMenuControl, controlButton, fieldControl, fileControl, linkControl, multiSelectControl, tabControl, toggleControl } from './components/controls.js?v=25'
import { COURSE_CATALOG_SOURCE, courseCatalog } from './components/courses.js?v=2'

const APP_ROOT_URL = new URL('./', import.meta.url)
const ASSET = new URL('./public/assets/', APP_ROOT_URL).href

const goals = [
  { id: 'first-job', category: 'Индустрия', title: 'Найти первую работу или стажировку', kind: 'industry' },
  { id: 'freelance', category: 'Индустрия', title: 'Работать на фрилансе', kind: 'industry' },
  { id: 'change-company', category: 'Индустрия', title: 'Сменить компанию, но не менять специальность', kind: 'industry' },
  { id: 'change-specialty', category: 'Индустрия', title: 'Есть опыт, но хочу работать по другой специальности', kind: 'industry' },
  { id: 'promotion', category: 'Индустрия', title: 'Повысить грейд или зарплату в текущей компании', kind: 'industry' },
  { id: 'study', category: 'Учеба', title: 'Пока не думаю о карьерных изменениях, хочу учиться', kind: 'study' },
  { id: 'business', category: 'Бизнес', title: 'Стать предпринимателем, запустить свой проект', kind: 'business', comingSoon: true },
  { id: 'science', category: 'Наука', title: 'Развиваться в науке, провести исследование совместно с ЦУ', kind: 'science', comingSoon: true },
]

const MAX_GOALS = 2
const SAVED_GOALS_KEY = 'cpk:selected-goals'
const PENDING_GOAL_KEY = 'cpk:pending-goal'
const STUDY_PROGRESS_KEY = 'cpk:study-goal-progress'
const INDUSTRY_PROGRESS_KEY = 'cpk:industry-goal-progress'
const VACANCY_STATE_KEY = 'cpk:industry-vacancies'
const APPLICATIONS_STORAGE_KEY = 'cpk:industry-applications'
const PORTFOLIO_PROFILES_STORAGE_KEY = 'cpk:industry-portfolio-profiles'
const GOAL_FORM_VALUES_KEY = 'cpk:goal-form-values'
const PORTFOLIO_PROFILE_TONES = ['sure-blue', 'sure-pink', 'optimistic-t-yellow', 'care-tiny', 'care-violet', 'expert-blue', 'expert-orange']
const ONBOARDING_KEY = 'cpk:career-onboarding'
const GOAL_SELECTION_KEY = 'cpk:goal-selection-draft'
const SHOW_GOAL_INFO_DIALOG = false
const PLANNER_STORAGE_KEY = 'cpk:study-planner-autumn-2026'
const CURRENT_SEMESTER = 3
const CAREER_SALARY_OPTIONS = ['До 50 000', '50 000–100 000', '100 000–200 000', '200 000–300 000', 'Более 300 000']
const VACANCY_SALARY_OPTIONS = [
  { value: '0', label: 'Не важна' },
  ...[50000, 100000, 150000, 200000, 300000].map((amount) => ({
    value: String(amount),
    label: `${amount.toLocaleString('ru-RU')} ₽`,
  })),
]
const APPLICATION_STATUSES = ['Новый', 'На рассмотрении', 'Интервью', 'Тестовое', 'Тех. собес', 'Оффер', 'Отказ', 'В архиве']

const studyStages = [
  {
    id: 'rhythm',
    title: 'Настроить учебный ритм',
    description: 'Расписание, рабочее пространство и регулярное планирование',
    tasks: [
      ['Собрать единое расписание', 'Добавить пары, дедлайны и личные дела в один календарь'],
      ['Выбрать место для сосредоточенной учебы', 'Подготовить пространство без лишних отвлечений'],
      ['Планировать учебную неделю', 'Каждое воскресенье выделять время на приоритеты'],
    ],
  },
  {
    id: 'foundation',
    title: 'Укрепить академическую базу',
    description: 'Ключевые дисциплины, практика и работа с обратной связью',
    tasks: [
      ['Определить две приоритетные дисциплины', 'Выбрать предметы, которым потребуется больше внимания'],
      ['Закреплять материал после каждой пары', 'Делать короткий конспект и решать одну дополнительную задачу'],
      ['Разбирать обратную связь преподавателей', 'Фиксировать ошибки и проверять, что они не повторяются'],
    ],
  },
  {
    id: 'community',
    title: 'Включиться в университетскую среду',
    description: 'Учебные сообщества, совместные проекты и новые знакомства',
    tasks: [
      ['Выбрать студенческое сообщество', 'Найти клуб или лабораторию по интересующей теме'],
      ['Познакомиться с участниками старших курсов', 'Узнать об их учебном опыте и полезных практиках'],
      ['Принять участие в командном проекте', 'Попробовать новую роль и получить обратную связь'],
    ],
  },
  {
    id: 'portfolio',
    title: 'Собрать учебное портфолио',
    description: 'Лучшие работы, результаты проектов и рефлексия',
    tasks: [
      ['Отобрать три сильные учебные работы', 'Выбрать проекты, которые показывают разные навыки'],
      ['Описать свой вклад в каждый проект', 'Коротко зафиксировать задачу, процесс и результат'],
      ['Запросить рецензию на портфолио', 'Показать подборку преподавателю или наставнику'],
    ],
  },
  {
    id: 'semester',
    title: 'Подготовиться к следующему семестру',
    description: 'Выбор дисциплин, цели на семестр и баланс нагрузки',
    tasks: [
      ['Изучить каталог дисциплин', 'Сравнить программы курсов и ожидаемую нагрузку'],
      ['Сформулировать учебную цель на семестр', 'Выбрать один измеримый результат на ближайшие месяцы'],
      ['Проверить баланс расписания', 'Оставить время на самостоятельную работу и отдых'],
    ],
  },
]

const industryStages = [
  {
    id: 'onboarding',
    title: 'Онбординг',
    description: 'Знакомство с карьерными возможностями и выбор следующих шагов',
    tasks: [
      ['Узнать, какие возможности у меня есть', 'Изучи материалы карьерного трека в хэндбуке', { label: 'Открыть хэндбук' }],
      ['Подписаться на карьерный канал', 'Следи за мероприятиями и вакансиями компаний-партнёров', { label: 'Открыть канал' }],
      ['Узнать, какие шаги делать дальше', 'Запишись на консультацию и обсуди свою карьерную ситуацию', { label: 'Записаться' }],
    ],
  },
  {
    id: 'job-preparation',
    title: 'Подготовка к трудоустройству',
    description: 'Навыки, резюме, интервью и обратная связь от индустрии',
    tasks: [
      ['Изучить материалы в «Карьерной аптечке»', 'Подготовься к выходу на рынок с помощью материалов ЦУ', { label: 'Открыть аптечку' }],
      ['Узнать, какие навыки требуются для моей профессии', 'Сверь свои навыки с профилем специалиста', { label: 'Открыть профиль' }],
      ['Посетить мероприятие компании-партнёра', 'Выбери подходящее мероприятие в карьерном канале', { label: 'Выбрать мероприятие' }],
      ['Записаться на курс «Mock-интервью»', 'Курс поможет системно подготовиться к выходу на рынок труда', { label: 'Открыть курс' }],
      ['Составить резюме с учётом рекомендаций', 'Проверь структуру, содержание и формулировки в резюме', { label: 'Добавить резюме', tab: 'portfolio' }],
      ['Пройти тренировочное техническое собеседование', 'Сначала составь и провалидируй резюме; повторить собеседование можно через два месяца', { label: 'Записаться' }],
      ['Встретиться с экспертом из индустрии', 'Обсуди свою карьерную ситуацию на разовой встрече или серии встреч', { label: 'Найти эксперта' }],
    ],
  },
  {
    id: 'practice',
    title: 'Практический опыт',
    description: 'Задачи от партнёров и проекты для портфолио',
    tasks: [
      ['Решить задачу партнёра в рамках буткемпа', 'Буткемп длится одну-две недели и предполагает самостоятельную работу', { label: 'Выбрать буткемп' }],
      ['Пополнить портфолио проектом в Мастерской Test&Learn', 'Мастерская длится четыре месяца: проект выполняет команда студентов', { label: 'Открыть мастерскую' }],
    ],
  },
  {
    id: 'employment',
    title: 'Трудоустройство',
    description: 'Вакансии партнёров, самостоятельный поиск и персональное сопровождение',
    tasks: [
      ['Откликнуться на вакансию компании-партнёра', 'Выбери подходящую вакансию на странице карьерных возможностей', { label: 'Открыть вакансии', tab: 'vacancies' }],
      ['Откликнуться на вакансию, найденную самостоятельно', 'Добавь внешний отклик, чтобы отслеживать его вместе с остальными', { label: 'Добавить отклик', tab: 'applications', openApplication: true }],
      ['Передать резюме через «рукопожатие»', 'Доступно после тренировочного технического собеседования', { label: 'Передать резюме' }],
    ],
  },
]

const vacancyBrands = {
  lamoda: ['Lamoda Tech', 'brand icons/680aa491b58fa502c244ad70.jpg'],
  ozon: ['Ozon Tech', 'brand icons/681938231cad7f273dd631a8.jpg'],
  alfa: ['Альфа-Банк', 'brand icons/688c82d4347a9edd48e848b6.jpg'],
  sber: ['Сбер', 'brand icons/68b0b63edf5217cb0f5083bb.webp'],
  raiffeisen: ['Райффайзен Банк', 'brand icons/69122e94734f57600f572f9a.webp'],
  mts: ['МТС', 'brand icons/69430c24fa56c22a9fde9d5c.webp'],
  tbank: ['Т-Банк', 'brand icons/696ce8859dd69d6ad43c599f.webp'],
  t2: ['T2', 'brand icons/6976721a0e098845f0a49dbd.webp'],
  yandex: ['Яндекс', 'logo-yandex.svg'],
  cian: ['Циан', 'brand icons/69941701a9484c686c09411b.png'],
  mail: ['VK Tech', 'brand icons/69f8894ce68bed88ef44fcee.png'],
  tutu: ['Туту', 'brand icons/6a05ac3e99c0300a3a352d3b.png'],
  cdek: ['СДЭК', 'brand icons/6a09aa627aaa0a64b13eedc5.png'],
  lemana: ['Лемана ПРО', 'brand icons/6a0db8f4b9142bbdbe0efce2.png'],
  beeline: ['Билайн', 'brand icons/6a460afc2765ca4a2e4a90ad.webp'],
  auchan: ['АШАН', 'brand icons/6a58ddacf5f643cb6d3b241b.png'],
  yandexpay: ['Яндекс Пэй', 'brand icons/6a634aa044dfdcdf0aa66939.png'],
  kion: ['KION', 'brand icons/6ab596c1ea8c6b270facd860.png'],
}

const vacancySeeds = [
  ['tbank', 'Стажёр backend-разработчик'], ['yandex', 'Junior ML Engineer'], ['ozon', 'Стажёр-аналитик данных'],
  ['sber', 'Стажёр frontend-разработчик'], ['alfa', 'Junior Java-разработчик'], ['lamoda', 'Стажёр продуктовый аналитик'],
  ['mts', 'Junior Data Engineer'], ['t2', 'Стажёр системный аналитик'], ['mail', 'Junior Python-разработчик'],
  ['raiffeisen', 'Стажёр бизнес-аналитик'], ['tutu', 'Junior frontend-разработчик'], ['cdek', 'Стажёр QA-инженер'],
  ['lemana', 'Junior UX/UI-дизайнер'], ['beeline', 'Стажёр аналитик данных'], ['auchan', 'Стажёр продуктовый менеджер'],
  ['yandexpay', 'Junior системный аналитик'], ['kion', 'Стажёр контент-аналитик'], ['tbank', 'Junior iOS-разработчик'],
  ['yandex', 'Стажёр разработчик рекомендательных систем'], ['ozon', 'Junior Go-разработчик'], ['sber', 'Стажёр исследователь данных'],
  ['alfa', 'Junior Android-разработчик'], ['lamoda', 'Стажёр UX-исследователь'], ['mts', 'Junior DevOps-инженер'],
  ['t2', 'Стажёр специалист по информационной безопасности'], ['mail', 'Junior C++ разработчик'], ['raiffeisen', 'Стажёр риск-аналитик'],
  ['tutu', 'Стажёр маркетинговый аналитик'], ['cdek', 'Junior backend-разработчик'], ['lemana', 'Стажёр BI-аналитик'],
  ['beeline', 'Junior инженер по тестированию'], ['auchan', 'Стажёр CRM-аналитик'], ['cian', 'Стажёр frontend-разработчик'],
  ['kion', 'Junior продуктовый дизайнер'], ['tbank', 'Стажёр финансовый аналитик'], ['yandex', 'Junior Data Scientist'],
  ['ozon', 'Стажёр менеджер продукта'], ['sber', 'Junior NLP-инженер'], ['alfa', 'Стажёр дизайнер цифровых продуктов'],
  ['lamoda', 'Junior аналитик мобильного приложения'], ['mts', 'Стажёр backend-разработчик'], ['t2', 'Junior продуктовый аналитик'],
  ['mail', 'Стажёр инженер машинного обучения'], ['raiffeisen', 'Junior QA Automation Engineer'], ['tutu', 'Стажёр Python-разработчик'],
  ['cdek', 'Junior аналитик логистических данных'], ['lemana', 'Стажёр менеджер IT-проектов'], ['cian', 'Junior разработчик сервисов'],
  ['auchan', 'Стажёр аналитик цепей поставок'], ['kion', 'Junior frontend-разработчик'],
]

const vacancyDescriptions = {
  development: 'Разработка и улучшение пользовательских сервисов вместе с продуктовой командой.',
  analytics: 'Исследование данных, продуктовых метрик и результатов экспериментов.',
  machine: 'Обучение, оценка и внедрение моделей машинного обучения в продукты компании.',
  design: 'Проектирование понятных сценариев и интерфейсов на основе исследований пользователей.',
  product: 'Работа с пользовательскими проблемами, гипотезами и развитием цифрового продукта.',
}

const vacancyDirections = [
  { label: 'Разработка', value: 'development' },
  { label: 'Аналитика', value: 'analytics' },
  { label: 'ML и Data Science', value: 'machine' },
  { label: 'Дизайн и исследования', value: 'design' },
  { label: 'Управление продуктом', value: 'product' },
  { label: 'Тестирование', value: 'quality' },
  { label: 'Информационная безопасность', value: 'security' },
]

const ONBOARDING_SPECIALTY_OPTIONS = vacancyDirections.map(({ label }) => label)
const normalizeOnboardingSpecialty = (value = '') => value === 'Дизайн' ? 'Дизайн и исследования' : value

const vacancies = vacancySeeds.map(([brandId, title], index) => {
  const [company, logo] = vacancyBrands[brandId]
  const internship = title.startsWith('Стажёр')
  const description = /ML|Data Scientist|машинного|NLP|рекомендательных/i.test(title) ? vacancyDescriptions.machine
    : /аналитик|Data Engineer/i.test(title) ? vacancyDescriptions.analytics
      : /дизайн|UX/i.test(title) ? vacancyDescriptions.design
        : /продукт|менеджер/i.test(title) ? vacancyDescriptions.product
          : vacancyDescriptions.development
  const direction = /ML|Data Scientist|машинного|NLP|рекомендательных|Data Engineer/i.test(title) ? 'machine'
    : /аналитик/i.test(title) ? 'analytics'
      : /дизайн|UX/i.test(title) ? 'design'
        : /продукт|менеджер IT-проектов/i.test(title) ? 'product'
          : /QA|тестирован/i.test(title) ? 'quality'
            : /безопасност/i.test(title) ? 'security'
              : 'development'
  const city = ['Москва', 'Санкт-Петербург', 'Казань', 'Новосибирск'][index % 4]
  const format = ['Гибрид', 'Офис', 'Удалённо'][index % 3]
  const employment = internship && index % 2 ? 'Частичная занятость' : 'Полная занятость'
  const experience = internship ? 'Без опыта' : index % 5 === 0 ? 'Более 1 года' : 'До 1 года'

  return {
    id: `${brandId}-${index + 1}`,
    company,
    logo,
    title,
    salary: internship ? '60 000–90 000 ₽ в месяц' : '100 000–160 000 ₽ в месяц',
    salaryMin: internship ? 60000 : 100000,
    salaryMax: internship ? 90000 : 160000,
    level: index % 4 === 0 ? 'Магистратура' : 'Бакалавриат',
    levelTone: index % 4 === 0 ? 'blue' : 'green',
    tags: [city, format, employment, experience, ...(internship ? ['Стажировка'] : [])],
    description,
    direction,
    partner: index % 3 !== 1,
    isFresh: index < 8,
    fresh: index < 8 ? ['Только что', '5 мин назад', '20 мин назад', '1 ч назад'][index % 4] : `${(index % 4) + 1} дн. назад`,
  }
})

function normalizeApplicationSalary(value = '') {
  if (!value || value === '—') return ''
  if (CAREER_SALARY_OPTIONS.includes(value)) return value
  const numbers = [...String(value).matchAll(/[\d\s ]+/g)]
    .map((match) => Number(match[0].replace(/[\s ]/g, '')))
    .filter(Number.isFinite)
  const amount = numbers.length > 1 ? Math.max(...numbers) : numbers[0]
  if (!amount) return ''
  if (amount < 50000) return CAREER_SALARY_OPTIONS[0]
  if (amount <= 100000) return CAREER_SALARY_OPTIONS[1]
  if (amount <= 200000) return CAREER_SALARY_OPTIONS[2]
  if (amount <= 300000) return CAREER_SALARY_OPTIONS[3]
  return CAREER_SALARY_OPTIONS[4]
}

function previousApplicationDate(daysAgo) {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return applicationDateValue(date)
}

const defaultApplications = [
  ['Яндекс', 'ML Engineer Intern', CAREER_SALARY_OPTIONS[1], 'Новый', 1],
  ['Т-Банк', 'Data Analyst', CAREER_SALARY_OPTIONS[2], 'Оффер', 3],
  ['Ozon Tech', 'Backend Developer', '—', 'Интервью', 6],
  ['Яндекс', 'Research ML', CAREER_SALARY_OPTIONS[1], 'Оффер', 9],
  ['Т-Банк', 'Product Analyst', CAREER_SALARY_OPTIONS[2], 'Отказ', 13],
  ['Ozon Tech', 'UX Researcher', CAREER_SALARY_OPTIONS[1], 'На рассмотрении', 16],
  ['Яндекс', 'Frontend Developer', '—', 'Отказ', 20],
  ['Т-Банк', 'QA Engineer', CAREER_SALARY_OPTIONS[1], 'Тестовое', 24],
  ['Ozon Tech', 'Product Manager', CAREER_SALARY_OPTIONS[2], 'Тех. собес', 29],
  ['Яндекс', 'Data Engineer', '—', 'Новый', 33],
  ['Lamoda Tech', 'Продуктовый аналитик', CAREER_SALARY_OPTIONS[1], 'На рассмотрении', 38],
  ['Сбер', 'Frontend-разработчик', CAREER_SALARY_OPTIONS[2], 'Интервью', 42],
  ['Альфа-Банк', 'Java-разработчик', CAREER_SALARY_OPTIONS[2], 'Тестовое', 47],
  ['МТС', 'Data Engineer', CAREER_SALARY_OPTIONS[1], 'Тех. собес', 53],
  ['Циан', 'UX/UI-дизайнер', CAREER_SALARY_OPTIONS[1], 'Новый', 58],
  ['VK Tech', 'Python-разработчик', CAREER_SALARY_OPTIONS[2], 'Оффер', 64],
  ['Райффайзен Банк', 'Бизнес-аналитик', CAREER_SALARY_OPTIONS[1], 'В архиве', 69],
  ['Туту', 'Маркетинговый аналитик', CAREER_SALARY_OPTIONS[1], 'На рассмотрении', 75],
  ['СДЭК', 'QA-инженер', CAREER_SALARY_OPTIONS[1], 'Отказ', 82],
  ['Лемана ПРО', 'BI-аналитик', CAREER_SALARY_OPTIONS[2], 'Интервью', 88],
  ['Билайн', 'Инженер по тестированию', CAREER_SALARY_OPTIONS[1], 'Тестовое', 95],
  ['Яндекс Пэй', 'Системный аналитик', CAREER_SALARY_OPTIONS[2], 'Новый', 103],
].map(([company, position, salary, status, daysAgo], index) => ({
  id: `demo-${index + 1}`, internal: index < 3, vacancyId: null, company, date: previousApplicationDate(daysAgo), status, position, salary,
  source: index < 3 ? 'ЦУ' : 'Внешний источник', link: '', contact: '', notes: '',
}))

function getApplications() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(APPLICATIONS_STORAGE_KEY) || 'null')
    const source = Array.isArray(saved)
      ? [...saved, ...defaultApplications.filter((item) => !saved.some((savedItem) => savedItem.id === item.id))]
      : defaultApplications
    const result = source
      .map((item) => {
        const demoIndex = defaultApplications.findIndex((demo) => demo.id === item.id)
        const legacyDate = applicationDateValue(new Date(2026, 5, 11 - Math.max(0, demoIndex - 9)))
        return {
          ...item,
          date: demoIndex >= 0 && item.date === legacyDate ? defaultApplications[demoIndex].date : item.date,
          salary: normalizeApplicationSalary(item.salary),
        }
      })
    try { window.localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(result)) } catch { /* Keep the session interactive. */ }
    return result
  } catch {
    return defaultApplications
  }
}

function saveApplications() {
  try { window.localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(applications)) } catch { /* Keep the session interactive. */ }
}

function getPortfolioProfiles() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(PORTFOLIO_PROFILES_STORAGE_KEY) || '[]')
    if (!Array.isArray(saved)) return []
    let primaryFound = false
    const profiles = saved
      .filter((profile) => profile?.id && typeof profile.name === 'string')
      .map((profile, index) => {
        const primary = Boolean(profile.primary) && !primaryFound
        if (primary) primaryFound = true
        return {
          id: String(profile.id),
          name: profile.name,
          description: typeof profile.description === 'string' ? profile.description : '',
          resumeLink: typeof profile.resumeLink === 'string' ? profile.resumeLink : '',
          resumeFile: profile.resumeFile?.name ? profile.resumeFile : null,
          portfolioLink: typeof profile.portfolioLink === 'string' ? profile.portfolioLink : '',
          portfolioFile: profile.portfolioFile?.name ? profile.portfolioFile : null,
          tone: PORTFOLIO_PROFILE_TONES.includes(profile.tone) ? profile.tone : PORTFOLIO_PROFILE_TONES[index % PORTFOLIO_PROFILE_TONES.length],
          primary,
          createdAt: Number(profile.createdAt) || Date.now(),
        }
      })
    if (profiles.length === 1) profiles[0].primary = true
    return profiles
  } catch {
    return []
  }
}

function savePortfolioProfiles() {
  try { window.localStorage.setItem(PORTFOLIO_PROFILES_STORAGE_KEY, JSON.stringify(portfolioProfiles)) } catch { /* Keep the session interactive. */ }
}

function getOnboarding() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(ONBOARDING_KEY) || 'null')
    if (saved && typeof saved === 'object') return saved
    // Existing students keep their previously entered career information.
    const goalId = getSavedGoalIds()[0]
    if (goalId) {
      const legacy = JSON.parse(window.localStorage.getItem(GOAL_FORM_VALUES_KEY) || '{}')
      return { values: legacy?.[goalId] || {}, completed: true, ready: true, workReady: true, goalsChosen: true }
    }
  } catch { /* Use an empty onboarding when stored data is unavailable. */ }
  return { values: {}, completed: false, ready: false }
}

function getGoalFormValues() {
  return getOnboarding().values || {}
}

function isEditingOnboarding() {
  return getOnboarding().completed && new URLSearchParams(window.location.search).get('edit') === 'onboarding'
}

function saveOnboarding(data) {
  window.localStorage.setItem(ONBOARDING_KEY, JSON.stringify(data))
}

function saveGoalFormValues(form) {
  try {
    const onboarding = getOnboarding()
    const previous = onboarding.values || {}
    const firstStep = form.querySelector('#company')
    const values = firstStep ? {
      ...previous,
      noWork: Boolean(form.querySelector('[data-no-work]')?.checked),
      company: form.querySelector('#company')?.value || '',
      specialty: form.querySelector('#specialty')?.value || '',
      grade: form.querySelector('#grade')?.value || '',
      salary: form.querySelector('#salary')?.value || '',
    } : {
      ...previous,
      noExpectations: Boolean(form.querySelector('[data-no-expectations]')?.checked),
      desiredCompany: form.querySelector('#desired-company')?.value || '',
      desiredSpecialty: [...(form.querySelector('#desired-specialty')?.selectedOptions || [])].map((option) => option.value),
      desiredGrade: form.querySelector('#desired-grade')?.value || '',
      desiredSalary: form.querySelector('#desired-salary')?.value || '',
    }
    saveOnboarding({ ...onboarding, values, ...(firstStep ? { workReady: true, ready: onboarding.completed } : {}) })
  } catch {
    // Form editing still works for the current visit when storage is unavailable.
  }
}

const normalizeCourseTitle = (value = '') => value
  .toLocaleLowerCase('ru')
  .replaceAll('ё', 'е')
  .replace(/[^a-zа-я0-9+]+/g, ' ')
  .trim()

const courseCategoryOrder = ['Fundamentals', 'Major', 'STEM', 'Soft', 'Minor', 'Network', 'Standard', 'Elective']
const plannerCourses = courseCatalog
  .filter((course) => course.id !== COURSE_CATALOG_SOURCE.id)
  .map((course) => ({ ...course, prerequisites: [], corequisites: [] }))
  .sort((first, second) => courseCategoryOrder.indexOf(first.category) - courseCategoryOrder.indexOf(second.category)
    || first.title.localeCompare(second.title, 'ru'))
const courseTitleIndex = plannerCourses.map((course) => ({ id: course.id, normalized: normalizeCourseTitle(course.title) }))

function resolveRelatedCourseIds(course, names) {
  return [...new Set(names.flatMap((name) => {
    const normalized = normalizeCourseTitle(name)
    return courseTitleIndex
      .filter((candidate) => candidate.id !== course.id
        && candidate.normalized.length > 6
        && (normalized === candidate.normalized || normalized.includes(candidate.normalized)))
      .map((candidate) => candidate.id)
  }))]
}

plannerCourses.forEach((course) => {
  course.prerequisites = resolveRelatedCourseIds(course, course.prerequisiteNames)
  course.corequisites = resolveRelatedCourseIds(course, course.corequisiteNames)
})

const courseCategories = courseCategoryOrder.filter((category) => plannerCourses.some((course) => course.category === category))
const courseWorkloads = [...new Set(plannerCourses.map((course) => course.workload))].sort((a, b) => a - b)
const availableCatalogSemesters = [...new Set(plannerCourses.flatMap((course) => course.available))].sort((a, b) => a - b)

const glossaryTerms = [
  { id: 'fundamentals', term: 'Fundamentals', description: 'Обязательные для всех студентов базовые дисциплины. Основную часть блока проходят в первые четыре семестра.' },
  { id: 'major', term: 'Major', description: 'Основное направление обучения: например, искусственный интеллект, бизнес или разработка. Major определяет набор обязательных Core-курсов.' },
  { id: 'core', term: 'Core', description: 'Обязательные дисциплины выбранного направления. Для студентов других направлений эти курсы могут быть необязательными.' },
  { id: 'specialization', term: 'Специализация', description: 'Профессиональный профиль внутри направления. Специализация влияет на набор рекомендованных Choice-курсов.' },
  { id: 'choice', term: 'Choice', description: 'Курсы по выбору, рекомендованные для конкретной специализации. Часть из них может быть обязательной для её получения.' },
  { id: 'soft', term: 'Soft', description: 'Дисциплины для развития гибких навыков: коммуникации, командной работы, презентации и самоорганизации.' },
  { id: 'stem', term: 'STEM', description: 'Курсы в области естественных наук, технологий, инженерии и математики. Конкретную дисциплину студент выбирает самостоятельно.' },
  { id: 'minor', term: 'Minor', description: 'Дополнительный учебный профиль из другого направления. Обычно его выбирают к пятому семестру и проходят до окончания программы.' },
  { id: 'electives', term: 'Факультативы', description: 'Необязательные курсы вне Core, Choice, STEM, Soft и Minor. Их можно добавлять для расширения траектории или подготовки к другим дисциплинам.' },
  { id: 'prerequisites', term: 'Пререквизиты', description: 'Курсы, которые необходимо завершить до начала выбранной дисциплины.' },
  { id: 'corequisites', term: 'Кореквизиты', description: 'Курсы, которые нужно проходить одновременно с выбранной дисциплиной или добавить в тот же период обучения.' },
  { id: 'postrequisites', term: 'Постреквизиты', description: 'Следующие курсы траектории, для которых текущая дисциплина является пререквизитом.' },
  { id: 'fast-track', term: 'Фаст-трек', description: 'Возможность пройти отдельные дисциплины раньше стандартного семестра по согласованию с академической командой.' },
]

const trajectoryPresets = Object.fromEntries([
  ['Искусственный интеллект', 'ИИ'],
  ['Бизнес и аналитика', 'Бизнес и аналитика'],
  ['Разработка', 'Разработка'],
].map(([label, specialization]) => [label, plannerCourses
  .filter((course) => course.category === 'Major' && course.specializations.includes(specialization))
  .map((course) => course.id)]))

function createDefaultPlannerState() {
  return {
    hideCompletedSemesters: false,
    hideProgress: false,
    statisticsCollapsed: false,
    collapsedSemesters: [1, 2, 4, 5, 6, 7, 8],
    collapsedCourseGroups: [],
    collapsedAvailableGroups: [],
    semesters: {
      1: [
        { id: '3b76f260-d6eb-425f-9fd0-c0a20001e68d', completed: true, fixed: true },
        { id: '79637cb7-566c-4c3f-9ae0-ec8f71dc3425', completed: true, fixed: true },
        { id: '8cef3870-88b1-48ff-9158-78df7615fcd1', completed: true, fixed: false },
        { id: 'c2de5c23-0a1c-4f82-9db2-664b1ceb2899', completed: true, fixed: false },
      ],
      2: [
        { id: '6de6247d-d369-4e82-9ec2-1aa683903b53', completed: true, fixed: true },
        { id: '2c591cab-1da2-4e9a-bbb4-af7ffc848732', completed: true, fixed: true },
        { id: '1ae0ede3-5156-4453-8400-c0e5a7b37bb6', completed: true, fixed: true },
        { id: 'b4bfeaf1-e139-461d-bcbf-e4172be754a6', completed: true, fixed: false },
      ],
      3: [], 4: [], 5: [], 6: [], 7: [], 8: [],
    },
  }
}

function getPlannerState() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(PLANNER_STORAGE_KEY) || 'null')
    if (!saved?.semesters) return createDefaultPlannerState()
    return {
      hideCompletedSemesters: Boolean(saved.hideCompletedSemesters),
      hideProgress: Boolean(saved.hideProgress),
      statisticsCollapsed: Boolean(saved.statisticsCollapsed),
      collapsedSemesters: Array.isArray(saved.collapsedSemesters)
        ? saved.collapsedSemesters.filter((semester) => Number.isInteger(semester) && semester >= 1 && semester <= 8)
        : [],
      collapsedCourseGroups: Array.isArray(saved.collapsedCourseGroups)
        ? saved.collapsedCourseGroups.filter((semester) => Number.isInteger(semester) && semester >= 1 && semester <= 8)
        : [],
      collapsedAvailableGroups: Array.isArray(saved.collapsedAvailableGroups)
        ? saved.collapsedAvailableGroups.filter((semester) => Number.isInteger(semester) && semester >= 1 && semester <= 8)
        : [],
      semesters: Object.fromEntries(Array.from({ length: 8 }, (_, index) => {
        const semester = index + 1
        const courses = Array.isArray(saved.semesters[semester]) ? saved.semesters[semester] : []
        const resolvedCourses = semester === 2 && courses.length === 0
          ? createDefaultPlannerState().semesters[2]
          : courses
        return [semester, resolvedCourses
          .filter((item) => plannerCourses.some((course) => course.id === item.id))
          .map((item) => ({ ...item, completed: semester < CURRENT_SEMESTER || Boolean(item.completed) }))]
      })),
    }
  } catch {
    return createDefaultPlannerState()
  }
}

let plannerState = getPlannerState()
let pointerPlannerDrag = null
let suppressPlannerCourseClickUntil = 0
let catalogSearch = ''
let catalogDirections = new Set()
let catalogSemesters = new Set()
let catalogCategories = new Set()
let catalogWorkloads = new Set()
let catalogRequisites = new Set()
let catalogStatuses = new Set()
let catalogFilterOpen = null
let plannerAvailableFilters = new Map()
let plannerAvailableLimits = new Map()
let plannerAvailableFilterOpen = null
let plannerCourseMenu = null
let collapsedCatalogGroups = new Set()
let openGlossaryTerms = new Set()
let vacancySearch = ''
let vacancySalaryFrom = '0'
let vacancyFavoritesOnly = false
let vacancyFilters = new Set()
let vacancyInternships = true
let vacancyPage = 1
const VACANCIES_PER_PAGE = 10
let vacancyDirectionOpen = false
let vacancySelectedDirections = new Set()
let selectedVacancyId = new URLSearchParams(window.location.search).get('id')
let applications = getApplications()
let applicationFilters = { company: new Set(), status: new Set(), position: new Set(), salary: new Set() }
let applicationFilterOpen = null
let applicationPage = 1
let editingApplicationId = null
let portfolioProfiles = getPortfolioProfiles()
let editingPortfolioProfileId = new URLSearchParams(window.location.search).get('id')
let portfolioDraftFiles = { resume: undefined, portfolio: undefined }
let portfolioDraftFileObjects = { resume: null, portfolio: null }
const portfolioFileObjects = new Map()

function getVacancyState() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(VACANCY_STATE_KEY) || '{}')
    return {
      favorites: new Set(Array.isArray(saved.favorites) ? saved.favorites : []),
      applied: new Set(Array.isArray(saved.applied) ? saved.applied : []),
    }
  } catch {
    return { favorites: new Set(), applied: new Set() }
  }
}

let vacancyState = getVacancyState()

function saveVacancyState() {
  try {
    window.localStorage.setItem(VACANCY_STATE_KEY, JSON.stringify({ favorites: [...vacancyState.favorites], applied: [...vacancyState.applied] }))
  } catch {
    // The current session remains interactive when storage is unavailable.
  }
}

function savePlannerState() {
  try {
    window.localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(plannerState))
  } catch {
    // The demo remains interactive when browser storage is unavailable.
  }
}

function findPlannerCourse(courseId) {
  return plannerCourses.find((course) => course.id === courseId)
}

function getPlannedCourseIds() {
  return new Set(Object.values(plannerState.semesters).flat().map((item) => item.id))
}

function getSemesterLoad(semester) {
  return plannerState.semesters[semester].reduce((sum, item) => sum + (findPlannerCourse(item.id)?.workload || 0), 0)
}

function plannerSummary() {
  const planned = Object.values(plannerState.semesters).flat()
  const completed = planned.filter((item) => item.completed).length
  const percent = planned.length ? Math.round((completed / planned.length) * 100) : 0
  return { planned: planned.length, completed, percent }
}

function getStudySemesterProgress() {
  const totalSemesters = 8
  const completedSemesters = Array.from({ length: totalSemesters }, (_, index) => index + 1)
    .filter((semester) => isPlannerSemesterCompleted(semester)).length
  return { totalSemesters, completedSemesters, percent: Math.round(completedSemesters / totalSemesters * 100) }
}

function courseHasConflict(courseId, semester) {
  const course = findPlannerCourse(courseId)
  if (!course) return false
  if (semester < CURRENT_SEMESTER) return false
  const unavailable = !course.available.includes(semester)
  const completedBefore = new Set(
    Object.entries(plannerState.semesters)
      .filter(([semesterNumber]) => Number(semesterNumber) < semester)
      .flatMap(([, items]) => items.filter((item) => item.completed).map((item) => item.id)),
  )
  const plannedTogether = new Set(plannerState.semesters[semester].map((item) => item.id))
  const missingPrerequisite = course.prerequisites.some((id) => !completedBefore.has(id))
  const missingCorequisite = course.corequisites.some((id) => !completedBefore.has(id) && !plannedTogether.has(id))
  return unavailable || missingPrerequisite || missingCorequisite
}

function getPlannerConflicts() {
  return Object.entries(plannerState.semesters).flatMap(([semester, items]) =>
    items.filter((item) => courseHasConflict(item.id, Number(semester))).map((item) => ({
      course: findPlannerCourse(item.id),
      semester: Number(semester),
    })),
  )
}

function getStudyProgress() {
  try {
    const taskIds = JSON.parse(window.localStorage.getItem(STUDY_PROGRESS_KEY) || '[]')
    return new Set(Array.isArray(taskIds) ? taskIds : [])
  } catch {
    return new Set()
  }
}

function saveStudyProgress(taskIds) {
  try {
    window.localStorage.setItem(STUDY_PROGRESS_KEY, JSON.stringify([...taskIds]))
  } catch {
    // The interaction still works for the current view when storage is unavailable.
  }
}

function getStudyProgressSummary(progress = getStudyProgress()) {
  const totalTasks = studyStages.reduce((sum, stage) => sum + stage.tasks.length, 0)
  const completedTasks = studyStages.reduce((sum, stage) => sum + stage.tasks.filter((_, index) => progress.has(`${stage.id}-${index}`)).length, 0)
  const completedStages = studyStages.filter((stage) => stage.tasks.every((_, index) => progress.has(`${stage.id}-${index}`))).length
  return { totalTasks, completedTasks, completedStages, percent: Math.round((completedTasks / totalTasks) * 100) }
}

function getIndustryProgress() {
  try {
    const taskIds = JSON.parse(window.localStorage.getItem(INDUSTRY_PROGRESS_KEY) || '[]')
    return new Set(Array.isArray(taskIds) ? taskIds : [])
  } catch {
    return new Set()
  }
}

function saveIndustryProgress(taskIds) {
  try {
    window.localStorage.setItem(INDUSTRY_PROGRESS_KEY, JSON.stringify([...taskIds]))
  } catch {
    // The interaction still works for the current view when storage is unavailable.
  }
}

function getIndustryProgressSummary(progress = getIndustryProgress()) {
  const totalTasks = industryStages.reduce((sum, stage) => sum + stage.tasks.length, 0)
  const completedTasks = industryStages.reduce((sum, stage) => sum + stage.tasks.filter((_, index) => progress.has(`${stage.id}-${index}`)).length, 0)
  const completedStages = industryStages.filter((stage) => stage.tasks.every((_, index) => progress.has(`${stage.id}-${index}`))).length
  return { totalTasks, completedTasks, completedStages, percent: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0 }
}

function getSavedGoalIds() {
  try {
    const ids = JSON.parse(window.localStorage.getItem(SAVED_GOALS_KEY) || '[]')
    const tracks = new Set()
    return Array.isArray(ids) ? ids.filter((id) => {
      const goal = goals.find((item) => item.id === id && !item.comingSoon)
      if (!goal || tracks.has(goal.kind)) return false
      tracks.add(goal.kind)
      return true
    }).slice(0, MAX_GOALS) : []
  } catch {
    return []
  }
}

function getSavedGoals() {
  const ids = getSavedGoalIds()
  return ids.map((id) => goals.find((goal) => goal.id === id)).filter(Boolean)
}

function setPendingGoal(goal) {
  if (goal) window.localStorage.setItem(PENDING_GOAL_KEY, goal.id)
}

function getPendingGoal() {
  try {
    const pendingId = window.localStorage.getItem(PENDING_GOAL_KEY)
    return goals.find((goal) => goal.id === pendingId) || null
  } catch {
    return null
  }
}

function getGoalSelection() {
  try {
    const ids = JSON.parse(window.localStorage.getItem(GOAL_SELECTION_KEY) || '[]')
    const saved = getSavedGoals()
    const tracks = new Set(saved.map((goal) => goal.kind))
    return Array.isArray(ids) ? ids.filter((id) => {
      const goal = goals.find((item) => item.id === id && !item.comingSoon)
      if (!goal || tracks.has(goal.kind)) return false
      tracks.add(goal.kind)
      return true
    }).slice(0, MAX_GOALS - saved.length) : []
  } catch { return [] }
}

function commitGoalSelection() {
  if (!getOnboarding().ready) return false
  const selected = getGoalSelection()
  if (!selected.length) return false
  const saved = getSavedGoalIds()
  selected.forEach((id) => {
    const goal = goals.find((item) => item.id === id)
    window.localStorage.removeItem(goal.kind === 'study' ? STUDY_PROGRESS_KEY : INDUSTRY_PROGRESS_KEY)
    if (goal.kind === 'study') {
      window.localStorage.removeItem(PLANNER_STORAGE_KEY)
      plannerState = createDefaultPlannerState()
    }
  })
  window.localStorage.setItem(SAVED_GOALS_KEY, JSON.stringify([...saved, ...selected]))
  saveOnboarding({ ...getOnboarding(), completed: true, ready: true, goalsChosen: true })
  window.localStorage.removeItem(GOAL_SELECTION_KEY)
  window.localStorage.removeItem(PENDING_GOAL_KEY)
  return true
}

function resetGoalJourney() {
  ;[GOAL_SELECTION_KEY, PENDING_GOAL_KEY, STUDY_PROGRESS_KEY, INDUSTRY_PROGRESS_KEY, PLANNER_STORAGE_KEY]
    .forEach((key) => window.localStorage.removeItem(key))
  plannerState = createDefaultPlannerState()
}

const iconByKind = {
  industry: 'building.svg',
  study: 'graduation.svg',
  business: 'luggage.svg',
  science: 'microscope.svg',
}

const opportunities = [
  ['Стажировки', 'Со 2-го курса бакалавриата', 'opportunity-code.svg'],
  ['Мастерская Test&Learn', 'Для всех', 'opportunity-book.svg'],
  ['Передача резюме через рукопожатие', 'С 3-го курса бакалавриата', 'opportunity-message.svg'],
  ['Совместные программы с партнерами', 'Со 2-го курса бакалавриата', 'opportunity-book.svg'],
  ['Джобборд с вакансиями от партнеров', 'Со 2-го курса бакалавриата', 'opportunity-building.svg'],
  ['One day offer и спиддейтинг', 'Со 2-го курса бакалавриата', 'opportunity-award.svg'],
  ['Буткемпы от партнеров', 'Для всех', 'opportunity-file-search.svg'],
  ['Реферальная программа', 'Со 2-го курса бакалавриата', 'opportunity-user-plus.svg'],
]

const icon = (name, size = 18, className = 'icon') =>
  `<img aria-hidden="true" draggable="false" class="${className}" src="${ASSET}${name}" width="${size}" height="${size}" alt="">`

const escapeHTML = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;')

const externalUrl = (value = '') => {
  const normalized = value.trim()
  if (!normalized) return ''
  return /^(https?:\/\/)/i.test(normalized) ? normalized : `https://${normalized}`
}

function highlightSearchText(value, query = '') {
  const text = String(value)
  const term = query.trim()
  if (!term) return escapeHTML(text)
  const pattern = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'giu')
  let result = ''
  let offset = 0
  for (const match of text.matchAll(pattern)) {
    result += escapeHTML(text.slice(offset, match.index))
      + `<mark class="search-highlight">${escapeHTML(match[0])}</mark>`
    offset = match.index + match[0].length
  }
  return result + escapeHTML(text.slice(offset))
}

function badge(content) {
  return `<span class="badge badge--outline">${content}</span>`
}

function pluralizePairs(value) {
  const absolute = Math.abs(value)
  const remainder100 = absolute % 100
  const remainder10 = absolute % 10
  if (remainder100 >= 11 && remainder100 <= 14) return 'пар'
  if (remainder10 === 1) return 'пара'
  if (remainder10 >= 2 && remainder10 <= 4) return 'пары'
  return 'пар'
}

function pluralizeCourses(value) {
  const remainder100 = Math.abs(value) % 100
  const remainder10 = Math.abs(value) % 10
  if (remainder100 >= 11 && remainder100 <= 14) return 'курсов'
  if (remainder10 === 1) return 'курс'
  if (remainder10 >= 2 && remainder10 <= 4) return 'курса'
  return 'курсов'
}

function iconButton({ iconName, label, counter = false }) {
  return controlButton({
    className: 'icon-button',
    content: `${icon(iconName)}${counter ? '<span class="notification-dot" aria-label="Есть новые уведомления"></span>' : ''}`,
    attributes: `aria-label="${label}"`,
  })
}

function globalNav() {
  const items = [
    ['Навигатор', true, 'compass.svg'],
    ['Учеба', false, 'book.svg'],
    ['События', false, 'announcement.svg'],
    ['Сервисы', false, 'package.svg'],
  ]

  return `
    <header class="global-nav">
      ${controlButton({
        className: 'global-nav__logo',
        content: `<img src="${ASSET}logo.svg" alt="">`,
        attributes: 'aria-label="Перезапустить сценарий" data-restart-scenario',
      })}
      <nav class="global-nav__menu" aria-label="Основная навигация">
        <div class="global-nav__menu-group">
          ${items.map(([label, active, iconName]) => controlButton({
            className: `menu-button ${active ? 'menu-button--active' : ''}`.trim(),
            content: `${icon(iconName)}<span>${label}</span>`,
            attributes: active ? 'aria-current="page"' : '',
          })).join('')}
        </div>
        ${iconButton({ iconName: 'bookmark.svg', label: 'Сохраненное' })}
      </nav>
      <div class="global-nav__account">
        ${controlButton({ className: 'search-button', content: `${icon('search.svg', 20)}<span>Поиск</span>${badge('⌘+K')}`, attributes: 'aria-label="Открыть поиск"' })}
        ${controlButton({ className: 'calendar-button', content: `${icon('calendar-plus.svg')}<span>32</span>`, attributes: 'aria-label="События в календаре"' })}
        ${iconButton({ iconName: 'bell.svg', label: 'Уведомления', counter: true })}
        ${controlButton({ className: 'avatar-button', content: `<img src="${ASSET}avatar.png" alt="">`, attributes: 'aria-label="Профиль пользователя"' })}
      </div>
    </header>`
}

function mobileNav({ backButton = false, backTarget = 'goals', anchorNavigation = false, state = 'normal' } = {}) {
  return `
    <nav class="mobile-nav" data-state="${state}" aria-label="Мобильная навигация">
      <span class="mobile-nav__gradient" aria-hidden="true"></span>
      <div class="mobile-nav__cluster">
        <div class="mobile-nav__menu-shell">
          ${controlButton({ className: 'mobile-nav__menu-toggle', content: '<span class="mobile-nav__menu-icon" aria-hidden="true"></span><span>Меню</span>', attributes: `aria-expanded="${state === 'active'}"` })}
        </div>
        ${controlButton({ className: 'mobile-nav__avatar', content: `<img src="${ASSET}mobile-avatar.png" alt="">`, attributes: 'aria-label="Профиль пользователя"' })}
      </div>
      ${backButton ? controlButton({ className: 'mobile-nav__utility mobile-nav__utility--back', content: icon('arrow-left.svg'), attributes: `aria-label="Назад" data-back-to-${backTarget}` }) : ''}
      ${anchorNavigation ? controlButton({ className: 'mobile-nav__utility mobile-nav__utility--anchor', content: icon('list.svg'), attributes: 'aria-label="Навигация по странице"' }) : ''}
    </nav>`
}

function informerFooter() {
  return controlButton({ className: 'informer-footer', content: `<img src="${ASSET}informer-footer.svg" alt="">`, attributes: 'aria-label="Открыть чат-помощник"' })
}

function headerIsland() {
  return `
    <section class="header-island header-island--desktop" aria-labelledby="page-title">
      <div class="header-island__copy">
        <h1 id="page-title">Навигатор</h1>
        <div class="header-island__support">
          <p>Личная карьерная цель помогает выбрать курсы, активности, проекты и вакансии.</p>
          <p>Если сложно сформулировать ее самостоятельно — начни с консультации.</p>
        </div>
        <div class="header-island__actions">
          ${controlButton({ className: 'flat-button flat-button--outline header-island__consultation-action', content: `${icon('message-chat-square.svg', 20)}<span>Хочу консультацию</span>` })}
          ${getOnboarding().completed ? controlButton({ variant: 'flat', content: 'Редактировать данные', attributes: 'data-edit-onboarding' }) : ''}
        </div>
      </div>
      <div class="header-island__art header-island__art--goals" aria-hidden="true">${icon('goals-header-illustration.svg', 389, 'header-island__art-image')}</div>
    </section>`
}

function navigatorGoalsHeader() {
  return `
    <section class="header-island header-island--desktop header-island--goals-home" aria-labelledby="page-title">
      <div class="header-island__copy">
        <h1 id="page-title">Навигатор</h1>
        <div class="header-island__support">
          <p>Личная карьерная цель помогает выбрать курсы, активности, проекты и вакансии.</p>
          <p>Если сложно сформулировать ее самостоятельно — начни с консультации.</p>
        </div>
        <div class="header-island__actions">
          ${controlButton({ className: 'flat-button flat-button--primary header-island__goal-action', content: `${icon('plus.svg', 20)}<span>Добавить цель</span>`, attributes: 'data-add-goal' })}
          ${controlButton({ className: 'flat-button flat-button--outline header-island__consultation-action', content: `${icon('message-chat-square.svg', 20)}<span>Хочу консультацию</span>` })}
          ${controlButton({ className: 'flat-button flat-button--neutral', content: 'Редактировать данные', attributes: 'data-edit-onboarding' })}
        </div>
      </div>
      <div class="header-island__art header-island__art--goals" aria-hidden="true">${icon('goals-header-illustration.svg', 389, 'header-island__art-image')}</div>
    </section>`
}

function goalCardState(goal) {
  const savedGoals = getSavedGoals()
  const draft = getGoalSelection()
  const selected = savedGoals.some((item) => item.id === goal.id) || draft.includes(goal.id)
  const trackAlreadyUsed = savedGoals.some((item) => item.kind === goal.kind) || draft.some((id) => id !== goal.id && goals.find((item) => item.id === id)?.kind === goal.kind)
  const unavailable = goal.comingSoon || trackAlreadyUsed || (!selected && savedGoals.length + draft.length >= MAX_GOALS) || savedGoals.some((item) => item.id === goal.id)
  return { selected, unavailable: Boolean(unavailable) }
}

function goalCard(goal) {
  const { selected, unavailable } = goalCardState(goal)
  return controlButton({
    className: `goal-card ${selected ? 'goal-card--selected' : ''}`,
    attributes: `aria-pressed="${selected}" data-goal-id="${goal.id}" ${unavailable ? `disabled ${goal.comingSoon ? `aria-describedby="${goal.id}-state"` : ''}` : ''}`,
    content: `<span class="goal-card__heading">
        <span class="goal-card__icon goal-card__icon--${goal.kind}">${icon(iconByKind[goal.kind], 18, 'icon goal-card__icon-default')}${icon('check-verified.svg', 18, 'icon goal-card__icon-selected')}</span>
        <span class="goal-card__category">${goal.category}</span>
        ${goal.comingSoon ? badge(`<span id="${goal.id}-state">Готовим</span>`) : ''}
      </span>
      <span class="goal-card__title">${goal.title}</span>`,
  })
}

function infoPanel() {
  return `
    <aside class="sidebar" aria-label="Дополнительная информация">
      <section class="how-it-works">
        <h2>Как работают цели</h2>
        <p>У тебя может быть до 2 целей:<br>по одной в каждом треке, но одна всегда основная</p>
        <ul>
          <li>${icon('progress.svg', 20)}Отдельный прогресс</li>
          <li>${icon('activity.svg', 20)}Отдельные активности</li>
          <li>${icon('edit.svg', 20)}<span>Ты можешь поменять цель<br>в любой момент</span></li>
        </ul>
      </section>
      <section class="help-card">
        <div class="help-card__body">
          <h2>${icon('help.svg', 20)}Помощь ЦПК в Маяке</h2>
          <p>Введи /mayak, выбери: Учеба и карьера →<br>Центр партнерств и карьеры →<br>Навигация по карьерным возможностям в ЦУ</p>
        </div>
        ${controlButton({ className: 'flat-button flat-button--neutral help-card__action', content: 'Получить помощь' })}
      </section>
    </aside>`
}

function invitationTemplate() {
  return `
    <div class="app-shell">
      ${globalNav()}${mobileNav()}${informerFooter()}
      <main class="page-content">
        ${headerIsland()}
        <div class="workspace">
          <section class="portfolio-empty goal-invitation" aria-labelledby="invitation-title">
            <div class="portfolio-empty__copy">
              <h2 id="invitation-title" tabindex="-1">Выбери, к чему хочешь прийти</h2>
              <p>${getOnboarding().completed ? 'Выбери до двух целей, чтобы спланировать учебу и карьерные шаги. Данные о работе и ожиданиях сохранены — их можно изменить позже.' : 'Расскажи о своей работе и ожиданиях, а затем выбери до двух целей. Они помогут спланировать учебу и карьерные шаги. Данные и цели можно изменить позже.'}</p>
            </div>
            ${controlButton({ className: 'flat-button flat-button--primary', content: 'Выбрать цель', attributes: 'data-start-onboarding' })}
          </section>
          ${infoPanel()}
        </div>
      </main>
      <div id="modal-root"></div>
    </div>`
}

function appTemplate() {
  return `
    <div class="app-shell">
      ${globalNav()}
      ${mobileNav({ backButton: true, backTarget: 'selection' })}
      ${informerFooter()}
      <main class="page-content work-step">
        ${journeyHeader({ backAttributes: 'data-selection-back' })}
        <div class="work-step__layout">
          <section class="work-form work-form--goals" aria-labelledby="goals-heading">
            <div class="work-form__heading">
              ${getOnboarding().goalsChosen ? '' : '<span>Шаг 3 из 3</span>'}
              <h2 id="goals-heading" tabindex="-1">${getSavedGoals().length ? 'Добавь вторую цель' : 'Выбери цели'}</h2>
              <p class="work-form__description">Выбери до двух целей: одну в Индустрии и одну в Учебе.</p>
            </div>
            <div class="goal-grid">${goals.map(goalCard).join('')}</div>
            <div class="work-form__actions">
              ${controlButton({ className: 'flat-button flat-button--outline', content: 'Назад', attributes: 'data-selection-back' })}
              ${controlButton({ className: 'flat-button flat-button--primary', content: getSavedGoals().length ? 'Добавить цель' : 'Продолжить', attributes: `data-confirm-goal-selection ${getGoalSelection().length ? '' : 'disabled'}` })}
            </div>
          </section>
        </div>
      </main>
      <div id="modal-root"></div>
    </div>`
}

function workExperienceTemplate() {
  const editing = isEditingOnboarding()
  const values = getGoalFormValues()
  const fieldsDisabled = values.noWork ? 'disabled' : ''
  return `
    <div class="app-shell">
      ${globalNav()}
      ${mobileNav({ backButton: true })}
      ${informerFooter()}
      <main class="page-content work-step">
        <div class="work-step__header">
          ${controlButton({ className: 'work-step__back', content: `${icon('arrow-left.svg')}<span>${isEditingOnboarding() ? 'К целям' : 'Назад'}</span>`, attributes: 'data-back-to-goals' })}
          <section class="header-island header-island--work" aria-labelledby="work-step-title">
            <div class="header-island__copy">
              <h1 id="work-step-title" tabindex="-1">Определим точку старта</h1>
              <div class="header-island__support">
                <p>Так мы сможем подобрать подходящие вакансии и карьерные возможности.</p>
              </div>
            </div>
          </section>
        </div>

        ${privacyNote()}

        <div class="work-step__layout">
          <form class="work-form" data-onboarding-step="work" novalidate>
            <div class="work-form__heading">
              <span>Шаг 1 из ${editing ? '2' : '3'}</span>
              <h2>Расскажи о своей работе</h2>
            </div>
            <div class="work-form__fields">
              ${checkboxControl({ className: 'work-checkbox', inputAttributes: `data-no-work ${values.noWork ? 'checked' : ''}`, boxContent: icon('check-small.svg', 20), content: '<span>Сейчас не работаю</span>' })}
              ${fieldControl({ id: 'company', label: 'Компания*', placeholder: 'Название компании', value: values.company || '', inputAttributes: fieldsDisabled, errorMessage: 'Укажи название компании' })}
              ${fieldControl({ id: 'specialty', label: 'Специальность*', placeholder: 'Выбери наиболее подходящую специальность', value: normalizeOnboardingSpecialty(values.specialty), inputAttributes: fieldsDisabled, options: ONBOARDING_SPECIALTY_OPTIONS, errorMessage: 'Выбери специальность' })}
              ${fieldControl({ id: 'grade', label: 'Грейд*', placeholder: 'Выбери наиболее подходящий грейд', value: values.grade || '', inputAttributes: fieldsDisabled, options: ['Стажер', 'Джуниор', 'Мидл', 'Сеньор'], errorMessage: 'Выбери грейд' })}
              ${fieldControl({ id: 'salary', label: 'Зарплата (₽)', placeholder: 'Выбери диапазон', value: values.salary || '', inputAttributes: fieldsDisabled, options: CAREER_SALARY_OPTIONS, required: false })}
            </div>
            ${controlButton({ className: 'work-form__submit flat-button flat-button--primary', content: 'Продолжить', type: 'submit' })}
          </form>

        </div>
      </main>
      <div id="modal-root"></div>
    </div>`
}

function journeyHeader({ backAttributes = 'data-back-to-goals' } = {}) {
  return `
    <div class="work-step__header">
      ${controlButton({ className: 'work-step__back', content: `${icon('arrow-left.svg')}<span>${isEditingOnboarding() ? 'К целям' : 'Назад'}</span>`, attributes: backAttributes })}
      <section class="header-island header-island--work" aria-labelledby="work-step-title">
        <div class="header-island__copy">
          <h1 id="work-step-title" tabindex="-1">Определим точку старта</h1>
          <div class="header-island__support">
            <p>Так мы сможем подобрать подходящие вакансии и карьерные возможности.</p>
          </div>
        </div>
      </section>
    </div>`
}

function privacyNote() {
  return `
    <aside class="privacy-note work-step__privacy" aria-labelledby="privacy-title">
      ${icon('info.svg', 20, 'privacy-note__icon')}
      <div>
        <h2 id="privacy-title">Конфиденциальность</h2>
        <p>Сотрудники ЦУ используют данные только в обобщенном виде — для аналитики и улучшения карьерных инструментов. Индивидуально данные доступны только карьерному консультанту.</p>
      </div>
    </aside>`
}

function jobExpectationsTemplate() {
  const values = getGoalFormValues()
  const fieldsDisabled = values.noExpectations ? 'disabled' : ''
  return `
    <div class="app-shell">
      ${globalNav()}
      ${mobileNav({ backButton: true, backTarget: 'work' })}
      ${informerFooter()}
      <main class="page-content work-step">
        ${journeyHeader()}

        <div class="work-step__layout">
          <form class="work-form work-form--expectations" data-onboarding-step="expectations" novalidate>
            <div class="work-form__heading">
              <span>Шаг 2 из ${isEditingOnboarding() ? '2' : '3'}</span>
              <h2>Расскажи об ожиданиях от работы</h2>
            </div>
            <div class="work-form__fields">
              ${checkboxControl({ className: 'work-checkbox', inputAttributes: `data-no-expectations ${values.noExpectations ? 'checked' : ''}`, boxContent: icon('check-small.svg', 20), content: '<span>Сейчас не знаю</span>' })}
              ${fieldControl({ id: 'desired-company', label: 'В каких компаниях хочешь работать*', placeholder: 'Названия компаний', value: values.desiredCompany || '', inputAttributes: fieldsDisabled, errorMessage: 'Укажи хотя бы одну компанию' })}
              ${fieldControl({ id: 'desired-specialty', label: 'Специальность*', placeholder: 'Выбери одну или несколько специальностей', value: (values.desiredSpecialty || []).map(normalizeOnboardingSpecialty), multiple: true, checkContent: icon('check-small.svg', 16), inputAttributes: fieldsDisabled, options: ONBOARDING_SPECIALTY_OPTIONS, errorMessage: 'Выбери хотя бы одну специальность' })}
              ${fieldControl({ id: 'desired-grade', label: 'Грейд*', placeholder: 'Выбери наиболее подходящий грейд', value: values.desiredGrade || '', inputAttributes: fieldsDisabled, options: ['Стажер', 'Джуниор', 'Мидл', 'Сеньор'], errorMessage: 'Выбери грейд' })}
              ${fieldControl({ id: 'desired-salary', label: 'Зарплата (₽)', placeholder: 'Выбери диапазон', value: values.desiredSalary || '', inputAttributes: fieldsDisabled, options: CAREER_SALARY_OPTIONS, required: false })}
            </div>
            <div class="work-form__actions">
              ${controlButton({ className: 'flat-button flat-button--outline', content: 'Назад', attributes: 'data-back-to-work' })}
              ${controlButton({ className: 'flat-button flat-button--primary', content: isEditingOnboarding() ? 'Сохранить' : 'Продолжить', type: 'submit' })}
            </div>
          </form>

        </div>
      </main>
      <div id="modal-root"></div>
    </div>`
}

function surveyCompleteTemplate() {
  return `
    <div class="app-shell">
      ${globalNav()}
      ${mobileNav()}
      ${informerFooter()}
      <main class="page-content success-page">
        <section class="survey-complete survey-complete--full" aria-labelledby="survey-complete-title">
          <img class="survey-complete__image" src="${ASSET}survey-complete.svg" width="220" height="220" alt="">
          <div class="survey-complete__content">
            <h2 id="survey-complete-title" tabindex="-1">Спасибо за ответы</h2>
            ${controlButton({ className: 'flat-button flat-button--primary', content: 'Перейти к цели', attributes: 'data-go-to-my-goals' })}
          </div>
        </section>
      </main>
      <div id="modal-root"></div>
    </div>`
}

function studyStageTemplate(stage, stageIndex, progress) {
  const completed = stage.tasks.filter((_, taskIndex) => progress.has(`${stage.id}-${taskIndex}`)).length
  const expanded = stageIndex === 0

  return `
    <article class="study-stage ${expanded ? 'study-stage--expanded' : ''}" data-study-stage="${stage.id}">
      ${controlButton({
        className: 'study-stage__toggle',
        attributes: `aria-expanded="${expanded}" aria-controls="study-stage-panel-${stage.id}" data-study-stage-toggle`,
        content: `
        <span class="study-stage__copy">
          <span class="study-stage__title-line">
            <strong>${stage.title}</strong>
            ${icon('dot-single.svg', 16)}
            <span data-study-stage-count>${completed} из ${stage.tasks.length}</span>
          </span>
          <span class="study-stage__description">${stage.description}</span>
        </span>
        <span class="study-stage__chevron" aria-hidden="true">
          <img class="study-stage__chevron-up" src="${ASSET}chevron-up.svg" width="18" height="18" alt="">
          <img class="study-stage__chevron-down" src="${ASSET}chevron-down.svg" width="18" height="18" alt="">
        </span>`,
      })}
      <div class="study-stage__panel" id="study-stage-panel-${stage.id}" aria-hidden="${!expanded}" ${expanded ? '' : 'inert'}>
        <div class="study-stage__panel-inner">
          <div class="study-stage__tasks">
            ${stage.tasks.map(([title, description], taskIndex) => {
              const taskId = `${stage.id}-${taskIndex}`
              return `
                ${checkboxControl({
                  className: 'study-task',
                  inputAttributes: `data-study-task data-stage-id="${stage.id}" value="${taskId}" ${progress.has(taskId) ? 'checked' : ''}`,
                  boxContent: icon('check-small.svg', 20),
                  content: `<span class="study-task__copy">
                    <strong>${title}</strong>
                    <span>${description}</span>
                  </span>`,
                })}`
            }).join('')}
          </div>
        </div>
      </div>
    </article>`
}

function industryTaskUrl(action) {
  if (action.href) return action.href
  if (!action.tab) return ''
  const url = new URL('study-goal/', APP_ROOT_URL)
  url.searchParams.set('view', 'industry')
  url.searchParams.set('tab', action.tab)
  if (action.openApplication) url.searchParams.set('action', 'add-application')
  return url.href
}

function industryStageTemplate(stage, stageIndex, progress) {
  const completed = stage.tasks.filter((_, taskIndex) => progress.has(`${stage.id}-${taskIndex}`)).length
  const expanded = stageIndex === 0

  return `
    <article class="study-stage ${expanded ? 'study-stage--expanded' : ''}" data-industry-stage="${stage.id}">
      ${controlButton({
        className: 'study-stage__toggle',
        attributes: `aria-expanded="${expanded}" aria-controls="industry-stage-panel-${stage.id}" data-industry-stage-toggle`,
        content: `
        <span class="study-stage__copy">
          <span class="study-stage__title-line">
            <strong>${stage.title}</strong>
            ${icon('dot-single.svg', 16)}
            <span data-industry-stage-count>${completed} из ${stage.tasks.length}</span>
          </span>
          <span class="study-stage__description">${stage.description}</span>
        </span>
        <span class="study-stage__chevron" aria-hidden="true">
          <img class="study-stage__chevron-up" src="${ASSET}chevron-up.svg" width="18" height="18" alt="">
          <img class="study-stage__chevron-down" src="${ASSET}chevron-down.svg" width="18" height="18" alt="">
        </span>`,
      })}
      <div class="study-stage__panel" id="industry-stage-panel-${stage.id}" aria-hidden="${!expanded}" ${expanded ? '' : 'inert'}>
        <div class="study-stage__panel-inner">
          <div class="study-stage__tasks">
            ${stage.tasks.map(([title, description, action], taskIndex) => {
              const taskId = `${stage.id}-${taskIndex}`
              const actionUrl = action ? industryTaskUrl(action) : ''
              return `<div class="study-task industry-task">
                ${checkboxControl({
                  className: 'industry-task__check',
                  inputAttributes: `data-industry-task value="${taskId}" ${progress.has(taskId) ? 'checked' : ''}`,
                  boxContent: icon('check-small.svg', 20),
                  content: `<span class="study-task__copy"><strong>${title}</strong><span>${description}</span></span>`,
                })}
                ${action ? `<span class="industry-task__action-wrap">${controlButton({
                  variant: 'flat-outline',
                  className: 'industry-task__action',
                  content: escapeHTML(action.label),
                  href: actionUrl,
                  target: '_blank',
                  attributes: actionUrl
                    ? `aria-label="${escapeHTML(`${action.label}: ${title}. Откроется в новой вкладке`)}"`
                    : `data-industry-task-pending aria-controls="industry-task-tooltip-${taskId}" aria-label="${escapeHTML(`${action.label}: ${title}`)}"`,
                })}${actionUrl ? '' : `<span class="industry-task__tooltip" id="industry-task-tooltip-${taskId}" role="tooltip" aria-live="polite" hidden>Готовим</span>`}</span>` : ''}
              </div>`
            }).join('')}
          </div>
        </div>
      </div>
    </article>`
}

function studyTabPlaceholder(id, title, description) {
  return `
    <section class="study-content-panel study-placeholder" aria-labelledby="study-placeholder-${id}">
      <h2 id="study-placeholder-${id}">${title}</h2>
      <p>${description}</p>
    </section>`
}

function createCourseFilters() {
  return Object.fromEntries(['direction', 'category', 'semester', 'workload', 'requisites', 'status'].map((id) => [id, new Set()]))
}

function catalogFilterSets() {
  return { direction: catalogDirections, category: catalogCategories, semester: catalogSemesters, workload: catalogWorkloads, requisites: catalogRequisites, status: catalogStatuses }
}

function getAvailableCourseFilters(semester) {
  if (!plannerAvailableFilters.has(semester)) plannerAvailableFilters.set(semester, createCourseFilters())
  return plannerAvailableFilters.get(semester)
}

function courseMatchesFilters(course, filters) {
  const placement = findPlannerItem(course.id)
  const status = placement?.item.completed ? 'completed' : placement ? 'planned' : 'available'
  return (!filters.direction.size || course.specializations.some((value) => filters.direction.has(value)))
    && (!filters.category.size || filters.category.has(course.category))
    && (!filters.semester.size || course.available.some((value) => filters.semester.has(value)))
    && (!filters.workload.size || filters.workload.has(course.workload))
    && (!filters.requisites.size || filters.requisites.has(course.prerequisiteNames.length + course.corequisiteNames.length ? 'with' : 'without'))
    && (!filters.status.size || filters.status.has(status))
}

function courseFilterDefinitions() {
  return [
    ['direction', 'Направление', [...new Set(plannerCourses.flatMap((course) => course.specializations))].sort((a, b) => a.localeCompare(b, 'ru')).map((value) => ({ value, label: value }))],
    ['category', 'Тип курса', courseCategories.map((value) => ({ value, label: value }))],
    ['semester', 'Семестр', availableCatalogSemesters.map((value) => ({ value: String(value), label: String(value) }))],
    ['workload', 'Нагрузка', courseWorkloads.map((value) => ({ value: String(value), label: `${value} ${pluralizePairs(value)}` }))],
    ['requisites', 'Реквизиты', [{ value: 'with', label: 'Есть реквизиты' }, { value: 'without', label: 'Без реквизитов' }]],
    ['status', 'Статус', [{ value: 'planned', label: 'В плане' }, { value: 'available', label: 'Не в плане' }, { value: 'completed', label: 'Пройдено' }]],
  ]
}

function courseFilterControls({ prefix, filters, openFilter, semester = null }) {
  return courseFilterDefinitions().map(([id, label, options]) => multiSelectControl({
    id: `${prefix}-${id}`,
    label: semester !== null && id === 'semester' ? 'Доступные семестры' : label,
    placeholder: semester !== null && id === 'semester' ? 'Доступные семестры' : label,
    options,
    selected: new Set([...filters[id]].map(String)),
    open: openFilter === id,
    checkContent: icon('check-small.svg', 20),
    attributes: semester === null ? `data-catalog-filter-toggle="${id}"` : `data-planner-filter-toggle="${semester}" data-filter-name="${id}"`,
  })).join('')
}

function completedCourseBadge() {
  return '<span class="badge badge--positive planner-course__completed-badge">Пройдено</span>'
}

function courseCardToolbar(course, semester) {
  return controlButton({
      variant: 'context-trigger',
      className: 'planner-course__menu-toggle',
      content: icon('planner-menu-dots.svg', 18),
      attributes: `data-planner-menu-toggle="${course.id}" data-semester="${semester}" aria-label="Действия с курсом «${escapeHTML(course.title)}»" aria-haspopup="menu" aria-expanded="false" aria-controls="planner-course-context-menu"`,
    })
}

function courseCardContent(course, { completed = false, conflict = false, searchQuery = '' } = {}) {
  const postrequisiteCount = plannerCourses.filter((candidate) => candidate.prerequisites.includes(course.id)).length
  const requisiteCount = course.prerequisiteNames.length + course.corequisiteNames.length + postrequisiteCount

  return `<span class="planner-course__content">
    <span class="planner-course__heading-line">
      <span class="planner-course__title">${highlightSearchText(course.title, searchQuery)}</span>
    </span>
    <span class="planner-course__tags">
      ${completed ? completedCourseBadge() : ''}
      <span class="planner-course__tag">${course.workload} ${pluralizePairs(course.workload)} в неделю</span>
      <span class="planner-course__tag">Семестры: ${course.available.join(', ')}</span>
      ${requisiteCount ? `<span class="planner-course__tag">Реквизиты: ${requisiteCount}</span>` : ''}
    </span>
    ${searchQuery.trim() && course.description.toLowerCase().includes(searchQuery.trim().toLowerCase()) ? `<span class="planner-course__search-description">${highlightSearchText(course.description, searchQuery)}</span>` : ''}
    ${conflict ? '<span class="planner-course__conflict-note" role="status">Проверь пререквизиты и доступность курса</span>' : ''}
  </span>`
}

function catalogCourseCard(course) {
  const placement = findPlannerItem(course.id)
  const completed = Boolean(placement?.item.completed)

  return `
    <article class="education-card planner-course course-card--detailed catalog-course-card ${completed ? 'planner-course--completed' : ''}">
      ${controlButton({
        className: 'planner-course__open catalog-course-card__open',
        attributes: `aria-label="Подробнее о курсе «${course.title}»" data-catalog-course-open="${course.id}"`,
        content: courseCardContent(course, { completed, searchQuery: catalogSearch }),
      })}
    </article>`
}

function catalogTemplate() {
  const query = catalogSearch.trim().toLowerCase()
  const filters = catalogFilterSets()
  const filtered = plannerCourses.filter((course) =>
    (!query || course.title.toLowerCase().includes(query) || course.description.toLowerCase().includes(query))
    && courseMatchesFilters(course, filters),
  )
  const groups = [...new Set(filtered.map((course) => course.category))]

  return `
    <section class="catalog" aria-labelledby="catalog-title">
      <h2 class="visually-hidden" id="catalog-title">Каталог курсов</h2>
      <div class="catalog-filters">
        ${fieldControl({ id: 'catalog-search', label: 'Поиск по курсам', hideLabel: true, placeholder: 'Поиск', required: false, value: catalogSearch, className: 'input-search', leadingContent: icon('search.svg', 20), inputAttributes: 'data-catalog-search autocomplete="off"' })}
        <div class="catalog-filter-bar">
          ${courseFilterControls({ prefix: 'catalog', filters, openFilter: catalogFilterOpen })}
          ${catalogSearch || catalogDirections.size || catalogSemesters.size || catalogCategories.size || catalogWorkloads.size || catalogRequisites.size || catalogStatuses.size
            ? controlButton({ variant: 'flat', size: 'compact', className: 'catalog__reset', content: 'Сбросить', attributes: 'data-catalog-reset' })
            : ''}
        </div>
      </div>
      <div class="catalog-results" aria-live="polite">
        ${filtered.length ? groups.map((category, groupIndex) => {
          const expanded = !collapsedCatalogGroups.has(category)
          const groupId = `catalog-course-list-${groupIndex}`
          return `
            <section class="catalog-group" aria-labelledby="catalog-group-${groupIndex}">
              <h3 id="catalog-group-${groupIndex}">${category}</h3>
              <div class="catalog-course-list ${expanded ? 'catalog-course-list--expanded' : ''}" data-catalog-course-group="${encodeURIComponent(category)}">
                ${controlButton({
                  className: 'catalog-course-list__header',
                  content: `<strong>Список курсов</strong>${icon('chevron-down.svg', 18)}`,
                  attributes: `aria-expanded="${expanded}" aria-controls="${groupId}" data-catalog-group-toggle="${encodeURIComponent(category)}"`,
                })}
                <div class="catalog-course-list__panel" id="${groupId}" aria-hidden="${!expanded}" ${expanded ? '' : 'inert'}>
                  <div class="catalog-course-list__panel-inner">
                    <div class="catalog-grid">${filtered.filter((course) => course.category === category).map(catalogCourseCard).join('')}</div>
                  </div>
                </div>
              </div>
            </section>`
        }).join('') : `
          <div class="catalog-empty">
            <strong>Подходящих курсов нет</strong>
            <span>Измени запрос или сбрось часть фильтров</span>
          </div>`}
      </div>
    </section>`
}

function glossaryTermTemplate(item) {
  const expanded = openGlossaryTerms.has(item.id)
  return `
    <article class="glossary-term ${expanded ? 'glossary-term--expanded' : ''}" data-glossary-term="${item.id}">
      ${controlButton({
        className: 'glossary-term__toggle',
        attributes: `aria-expanded="${expanded}" aria-controls="glossary-panel-${item.id}" data-glossary-toggle="${item.id}"`,
        content: `<strong>${item.term}</strong><span class="glossary-term__chevron" aria-hidden="true">${icon('chevron-down.svg', 18)}</span>`,
      })}
      <div class="glossary-term__panel" id="glossary-panel-${item.id}" aria-hidden="${!expanded}" ${expanded ? '' : 'inert'}>
        <div><p>${item.description}</p></div>
      </div>
    </article>`
}

function glossaryTemplate() {
  return `
    <section class="study-content-panel glossary" aria-labelledby="glossary-title">
      <div class="glossary__intro">
        <h2 id="glossary-title">Глоссарий</h2>
        <p>Основные термины учебной программы, которые встречаются в каталоге и планировщике.</p>
      </div>
      <div class="glossary-list">${glossaryTerms.map(glossaryTermTemplate).join('')}</div>
    </section>`
}

function plannerCourseTemplate(item, semester, index) {
  const course = findPlannerCourse(item.id)
  const conflict = courseHasConflict(item.id, semester)
  const semesterCompleted = isPlannerSemesterCompleted(semester)

  return `
    <article class="education-card planner-course course-card--detailed ${item.completed ? 'planner-course--completed' : ''} ${conflict ? 'planner-course--conflict' : ''}" ${semesterCompleted ? '' : 'data-planner-drag-handle'} data-planner-course="${course.id}" data-planner-semester="${semester}" data-planner-index="${index}">
      ${courseCardToolbar(course, semester)}
      ${controlButton({
        className: 'planner-course__open',
        attributes: `aria-label="Подробнее о курсе «${course.title}»" aria-describedby="planner-drag-instructions" aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown Alt+ArrowLeft Alt+ArrowRight" data-planner-course-open="${course.id}"`,
        content: courseCardContent(course, { completed: item.completed, conflict }),
      })}
      ${item.fixed ? '<div class="planner-course__footer planner-course__footer--meta"><span class="planner-course__fixed">Обязательный курс</span></div>' : ''}
    </article>`
}

function plannerAvailableCoursesTemplate(semester) {
  const plannedIds = getPlannedCourseIds()
  const filters = getAvailableCourseFilters(semester)
  const matching = plannerCourses.filter((course) => course.available.includes(semester) && !plannedIds.has(course.id) && courseMatchesFilters(course, filters))
  const limit = plannerAvailableLimits.get(semester) || 8
  const available = matching.slice(0, limit)
  const hasFilters = Object.values(filters).some((set) => set.size)
  const openFilter = plannerAvailableFilterOpen?.semester === semester ? plannerAvailableFilterOpen.filter : null

  return `<div class="planner-available-courses">
    <div class="catalog-filter-bar planner-available-filters" aria-label="Фильтры доступных курсов ${semester}-го семестра">
      ${courseFilterControls({ prefix: `planner-available-${semester}`, filters, openFilter, semester })}
      ${hasFilters ? controlButton({ variant: 'flat', size: 'compact', className: 'catalog__reset', content: 'Сбросить', attributes: `data-planner-filter-reset="${semester}"` }) : ''}
    </div>
    <div class="planner-course-grid planner-available-grid" aria-live="polite">
      ${available.length ? available.map((course) => `
        <article class="education-card planner-course course-card--detailed planner-picker-course" data-planner-drag-handle data-planner-picker-course="${course.id}" data-planner-semester="${semester}">
          ${courseCardToolbar(course, semester)}
          ${controlButton({
            className: 'planner-course__open planner-picker-course__content',
            attributes: `aria-label="Подробнее о курсе «${course.title}»" aria-describedby="planner-drag-instructions" aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown Alt+ArrowLeft Alt+ArrowRight" data-planner-course-open="${course.id}"`,
            content: courseCardContent(course),
          })}
          <div class="planner-course__footer planner-picker-course__footer">
            ${controlButton({ variant: 'flat', className: 'planner-course__add', content: 'Добавить', attributes: `data-planner-course-action="add" data-course-id="${course.id}" data-target-semester="${semester}" aria-label="Добавить курс «${escapeHTML(course.title)}» в ${semester}-й семестр"` })}
          </div>
        </article>`).join('') : `<div class="planner-picker__empty">
        <strong>${hasFilters ? 'Подходящих курсов нет' : 'Все доступные курсы уже добавлены'}</strong>
        <span>${hasFilters ? 'Измени фильтры или сбрось их' : 'Перетащи сюда курс из другого семестра или открой каталог'}</span>
      </div>`}
    </div>
    ${matching.length > limit ? controlButton({ variant: 'flat', content: `Показать еще ${Math.min(8, matching.length - limit)}`, attributes: `data-planner-available-more="${semester}"` }) : ''}
  </div>`
}

function plannerCourseGroupTemplate({ semester, type, title, items = [], completed = false }) {
  const stateKey = type === 'available' ? 'collapsedAvailableGroups' : 'collapsedCourseGroups'
  const collapsed = plannerState[stateKey].includes(semester)
  const expanded = !collapsed
  const groupId = `planner-${type}-${semester}`
  const reset = type === 'current' && !completed && items.some((item) => !item.fixed)

  return `
    <section class="planner-course-group ${expanded ? 'planner-course-group--expanded' : ''}" data-planner-course-group="${type}-${semester}">
      <header class="planner-course-group__header">
        <strong id="${groupId}-title">${title}</strong>
        <div class="planner-course-group__actions">
          ${reset ? controlButton({ variant: 'flat-destructive', className: 'planner-reset-button', content: 'Сбросить курсы', attributes: `data-planner-reset-semester="${semester}"` }) : ''}
          ${controlButton({ className: 'planner-course-group__toggle', content: icon('chevron-down.svg', 18), attributes: `aria-label="${expanded ? 'Свернуть' : 'Развернуть'} ${title.toLowerCase()}" aria-expanded="${expanded}" aria-controls="${groupId}-panel" data-planner-group-toggle="${type}" data-semester="${semester}"` })}
        </div>
      </header>
      <div class="planner-course-group__panel" id="${groupId}-panel" aria-labelledby="${groupId}-title" aria-hidden="${!expanded}" ${expanded ? '' : 'inert'}>
        <div class="planner-course-group__panel-inner">
          ${type === 'available'
            ? plannerAvailableCoursesTemplate(semester)
            : items.length
              ? `<div class="planner-course-grid">${items.map((item, index) => plannerCourseTemplate(item, semester, index)).join('')}</div>`
              : '<div class="planner-course-group__empty">В семестре пока нет курсов</div>'}
        </div>
      </div>
    </section>`
}

function plannerSemesterTemplate(semester) {
  const items = plannerState.semesters[semester]
  const passed = semester < CURRENT_SEMESTER
  const completed = isPlannerSemesterCompleted(semester)
  if (passed && completed && plannerState.hideCompletedSemesters) return ''
  const load = getSemesterLoad(semester)
  const expanded = !plannerState.collapsedSemesters.includes(semester)
  const conflicts = items.filter((item) => courseHasConflict(item.id, semester))
  const completedCourses = items.filter((item) => item.completed).length
  const canReset = !completed && items.some((item) => !item.fixed)

  return `
    <section class="planner-semester ${expanded ? 'planner-semester--expanded' : ''} ${semester === CURRENT_SEMESTER ? 'planner-semester--current' : ''} ${completed ? 'planner-semester--completed' : ''}" aria-labelledby="planner-semester-${semester}" data-planner-semester-section="${semester}" ${completed ? '' : `data-planner-dropzone="${semester}"`}>
      <div class="planner-semester__surface">
        <header class="planner-semester__header">
          ${controlButton({
            className: 'planner-semester__toggle',
            attributes: `aria-expanded="${expanded}" aria-controls="planner-semester-panel-${semester}" data-planner-semester-toggle="${semester}"`,
            content: `<span class="planner-semester__title">
              <span class="planner-semester__heading" id="planner-semester-${semester}">${semester} семестр</span>
              ${load ? `<span class="badge badge--outline">${load} ${pluralizePairs(load)} в неделю</span>` : ''}
              ${completedCourses ? `<span class="badge badge--positive">${icon('check-verified.svg', 16)}${completedCourses} из ${items.length} курсов завершено</span>` : ''}
              ${semester === CURRENT_SEMESTER ? '<span class="badge badge--current">Текущий</span>' : ''}
            </span>`,
          })}
          <div class="planner-semester__actions">
            ${canReset ? controlButton({ variant: 'flat-destructive', className: 'planner-reset-button planner-semester__reset', content: 'Сбросить курсы', attributes: `data-planner-reset-semester="${semester}"` }) : ''}
            ${controlButton({ className: 'planner-semester__chevron-button', attributes: `aria-label="${expanded ? 'Свернуть' : 'Развернуть'} ${semester} семестр" aria-expanded="${expanded}" aria-controls="planner-semester-panel-${semester}" data-planner-semester-toggle="${semester}"`, content: icon('chevron-down.svg', 18) })}
          </div>
        </header>
        ${conflicts.length ? `<div class="planner-semester__conflicts-panel" aria-hidden="${!expanded}" ${expanded ? '' : 'inert'}>
          <div class="planner-semester__conflicts-panel-inner">
            <div class="planner-conflicts" role="status">
              ${icon('planner-conflict.svg', 20)}
              <div><strong>Есть конфликты</strong><ul>${conflicts.map((item) => `<li>Проверь доступность и пререквизиты курса «${findPlannerCourse(item.id)?.title}»</li>`).join('')}</ul></div>
            </div>
          </div>
        </div>` : ''}
        <div class="planner-semester__panel" id="planner-semester-panel-${semester}" aria-hidden="${!expanded}" ${expanded ? '' : 'inert'}>
          <div class="planner-semester__panel-inner">
            ${plannerCourseGroupTemplate({ semester, type: 'current', title: 'Курсы семестра', items, completed })}
            ${completed ? '' : plannerCourseGroupTemplate({ semester, type: 'available', title: 'Доступные курсы' })}
          </div>
        </div>
      </div>
    </section>`
}

function plannerTemplate() {
  const statisticsExpanded = !plannerState.statisticsCollapsed
  const semesterProgress = getStudySemesterProgress()
  return `
    <section class="planner" aria-labelledby="planner-title">
      <h2 class="visually-hidden" id="planner-title">Планировщик</h2>
      <p class="visually-hidden" id="planner-drag-instructions">Перетащи курс за основную область карточки в другой семестр. Для доступного курса перетаскивание добавит его в семестр. С клавиатуры используй Alt и клавиши со стрелками.</p>
      <section class="planner-statistics ${statisticsExpanded ? 'planner-statistics--expanded' : ''}" aria-labelledby="planner-statistics-title">
        <header class="planner-statistics__header"><h3 id="planner-statistics-title">${controlButton({ className: 'planner-statistics__toggle', content: `<span>Статистика</span>${icon('chevron-down.svg', 18)}`, attributes: `data-planner-statistics-toggle aria-expanded="${statisticsExpanded}" aria-controls="planner-statistics-panel"` })}</h3></header>
        <div class="planner-statistics__panel" id="planner-statistics-panel" aria-hidden="${!statisticsExpanded}" ${statisticsExpanded ? '' : 'inert'}>
          <div class="planner-statistics__panel-inner">
            <div class="planner-overview" aria-label="Сводка учебного плана">
          ${[
            ['Business', 25, 16], ['Software Engineering', 16, 32], ['AI', 52, 18],
          ].map(([label, earned, available]) => `<div class="planner-track"><strong>${label}</strong><div class="planner-track__bar"><span style="width:${earned}%"></span><i style="width:${available}%"></i></div><dl><div><dt>Набрано</dt><dd>${earned}%</dd></div><div><dt>Можно набрать</dt><dd>${available}%</dd></div></dl></div>`).join('')}
            </div>
          </div>
        </div>
      </section>
      <div class="planner-semesters-group">
        <div class="planner-semesters-heading">
          <div class="planner-semesters-heading__title">
            <h3>Семестры</h3>
            <span class="badge badge--positive">${icon('check-verified.svg', 16)}${semesterProgress.completedSemesters} из ${semesterProgress.totalSemesters} семестров завершено</span>
          </div>
          <div class="planner__primary-actions">
            ${controlButton({ className: 'flat-button flat-button--outline planner-trajectory-button', content: `${icon('stars.svg', 20)}<span>Подобрать траекторию</span>`, attributes: 'data-planner-trajectory' })}
            ${controlButton({ variant: 'flat-destructive', className: 'planner-reset-all', content: 'Сбросить курсы', attributes: 'data-planner-reset-all' })}
          </div>
        </div>
        <div class="planner-semesters">
          ${Array.from({ length: 8 }, (_, index) => plannerSemesterTemplate(index + 1)).join('')}
        </div>
      </div>
    </section>`
}

function studyGoalTemplate() {
  const progress = getStudyProgress()
  const summary = getStudyProgressSummary(progress)

  return `
    <div class="app-shell">
      ${globalNav()}
      ${mobileNav({ backButton: true, backTarget: 'my-goals' })}
      ${informerFooter()}
      <main class="page-content study-detail-page study-detail-page--study">
        ${controlButton({ className: 'work-step__back study-detail__back', content: `${icon('arrow-left.svg', 18)}<span>К целям</span>`, attributes: 'data-back-to-my-goals' })}
        <section class="study-header" aria-labelledby="study-detail-title">
          <div class="study-header__copy">
            <h1 id="study-detail-title" tabindex="-1">Учеба</h1>
            <p>Личная карьерная цель помогает выбрать курсы, активности, проекты и вакансии.<br>Если сложно сформулировать ее самостоятельно — начни с консультации.</p>
          </div>
          <div class="study-header__illustration" aria-hidden="true">${icon('study-header-illustration.svg', 322)}</div>
          <div class="study-tabs" role="tablist" aria-label="Разделы учебной цели" data-study-tabs>
            <span class="study-tabs__indicator" aria-hidden="true"></span>
            ${[
              ['planner', 'Планировщик'],
              ['catalog', 'Каталог курсов'],
              ['glossary', 'Глоссарий'],
            ].map(([id, label]) => tabControl({ id, label, active: id === 'planner' })).join('')}
          </div>
        </section>

        <div id="study-panel-goal" role="tabpanel" aria-label="Моя цель" data-study-panel="goal" hidden>
          <section class="study-content-panel study-goal-panel" aria-labelledby="study-goal-heading">
            <h2 class="visually-hidden" id="study-goal-heading">Моя цель</h2>
            <div class="study-goal-shell">
              <div class="study-goal-summary-island">
                <div class="study-goal-shell__meta">
                  <strong>Учеба</strong>
                  <span class="badge badge--positive">${icon('check-verified.svg', 16)}<span data-study-stage-summary>${summary.completedStages} из ${studyStages.length} завершено</span></span>
                  ${goalDetailActions('study')}
                </div>
                <div class="study-goal-summary">
                  <h3>Хочу учиться</h3>
                  <strong data-study-percent>${summary.percent}%</strong>
                  <div class="study-goal-progress" role="progressbar" aria-label="Прогресс цели «Хочу учиться»" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${summary.percent}" data-study-progress>
                    <span style="width: ${summary.percent}%"></span>
                  </div>
                </div>
              </div>
              <section class="study-journey" aria-labelledby="study-journey-title">
                <div class="study-journey__heading">
                  <h3 id="study-journey-title">Этапы пути</h3>
                </div>
                <p>Этапы без строгого пути: действия идут параллельно, а не строго друг за другом.</p>
                <div class="study-stage-list">
                  ${studyStages.map((stage, index) => studyStageTemplate(stage, index, progress)).join('')}
                </div>
              </section>
            </div>
          </section>
        </div>
        <div id="study-panel-planner" role="tabpanel" aria-labelledby="study-tab-planner" data-study-panel="planner">
          ${plannerTemplate()}
        </div>
        <div id="study-panel-catalog" role="tabpanel" aria-labelledby="study-tab-catalog" data-study-panel="catalog" hidden>
          ${catalogTemplate()}
        </div>
        <div id="study-panel-glossary" role="tabpanel" aria-labelledby="study-tab-glossary" data-study-panel="glossary" hidden>
          ${glossaryTemplate()}
        </div>
      </main>
      <div id="modal-root"></div>
    </div>`
}

function favoriteIcon() {
  return `<span class="favorite-icon">${icon('heart.svg', 20, 'icon favorite-icon__outline')}${icon('heart-filled.svg', 20, 'icon favorite-icon__filled')}</span>`
}

function vacancyCardTemplate(vacancy, { openable = true, searchQuery = '' } = {}) {
  const favorite = vacancyState.favorites.has(vacancy.id)
  const applied = vacancyState.applied.has(vacancy.id)

  return `
    <article class="vacancy-card ${openable ? 'vacancy-card--openable' : ''}">
      ${openable ? controlButton({ className: 'vacancy-card__open', content: '', attributes: `aria-label="Открыть вакансию «${vacancy.title}»" data-vacancy-open="${vacancy.id}"` }) : ''}
      <header class="vacancy-card__company">
        <span class="vacancy-logo"><img src="${ASSET}${vacancy.logo}" alt=""></span>
        <span>${highlightSearchText(vacancy.company, searchQuery)}</span>
        ${vacancy.level ? `<span class="vacancy-card__level vacancy-card__level--${vacancy.levelTone}">${vacancy.level}</span>` : ''}
      </header>
      <div class="vacancy-card__copy">
        <h3>${highlightSearchText(vacancy.title, searchQuery)}</h3>
        <strong>${vacancy.salary}</strong>
        <p>${highlightSearchText(vacancy.description, searchQuery)}</p>
      </div>
      <div class="vacancy-card__tags">${vacancy.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
      <footer class="vacancy-card__footer">
        <div class="vacancy-card__actions">
          ${controlButton({
            className: `vacancy-card__apply ${applied ? 'vacancy-card__apply--done' : ''}`,
            content: `${applied ? icon('check-green.svg', 20) : ''}<span>${applied ? 'Откликнулся' : 'Откликнуться'}</span>`,
            attributes: `aria-pressed="${applied}" data-vacancy-apply="${vacancy.id}"${applied ? ' disabled' : ''}`,
          })}
          ${controlButton({
            className: `vacancy-card__favorite ${favorite ? 'is-active' : ''}`,
            content: favoriteIcon(),
            attributes: `aria-pressed="${favorite}" aria-label="${favorite ? 'Удалить из избранного' : 'Добавить в избранное'}" data-vacancy-favorite="${vacancy.id}"`,
          })}
        </div>
        <span>${vacancy.fresh}</span>
      </footer>
    </article>`
}

function vacancyApplicationToolbar() {
  const tool = (asset, label, disabled = false) => `<span class="vacancy-apply-toolbar__tool ${disabled ? 'is-disabled' : ''}" aria-label="${label}" role="img">${icon(asset, 18)}</span>`
  const divider = '<span class="vacancy-apply-toolbar__divider" aria-hidden="true"></span>'
  return `${tool('vacancy-apply-undo.svg', 'Отменить действие', true)}${tool('vacancy-apply-redo.svg', 'Повторить действие', true)}${divider}${tool('vacancy-apply-text.svg', 'Формат текста')}${tool('vacancy-apply-list.svg', 'Маркированный список')}${tool('vacancy-apply-link.svg', 'Добавить ссылку')}${divider}${tool('vacancy-apply-underline.svg', 'Подчеркнуть')}${tool('vacancy-apply-highlight.svg', 'Выделить текст')}${divider}${tool('vacancy-apply-clear-format.svg', 'Очистить форматирование')}${divider}`
}

function openVacancyApplicationDialog(vacancy) {
  if (!vacancy) return
  previouslyFocused = document.activeElement
  const modalRoot = document.querySelector('#modal-root')

  if (!portfolioProfiles.length) {
    modalRoot.innerHTML = `<div class="modal-backdrop" role="presentation">
      <div class="goal-dialog goal-dialog--sm vacancy-no-profile-dialog" role="dialog" aria-modal="true" aria-labelledby="vacancy-no-profile-title" aria-describedby="vacancy-no-profile-description" tabindex="-1">
        ${controlButton({ className: 'goal-dialog__close', content: icon('close.svg', 20), attributes: 'aria-label="Закрыть" data-close-dialog' })}
        <img class="vacancy-no-profile-dialog__illustration" src="${ASSET}vacancy-no-profile.svg" width="200" height="200" alt="">
        <div class="vacancy-no-profile-dialog__content">
          <div class="vacancy-no-profile-dialog__copy">
            <h2 id="vacancy-no-profile-title">Сперва заполни профиль</h2>
            <p id="vacancy-no-profile-description">Чтобы откликнуться на вакансию, нужно завести хотя бы один профиль с резюме и портфолио</p>
          </div>
          <div class="vacancy-no-profile-dialog__actions">
            ${controlButton({ className: 'flat-button flat-button--primary', content: 'Добавить профиль', attributes: 'data-vacancy-add-profile' })}
            ${controlButton({ className: 'flat-button flat-button--neutral', content: 'Отмена', attributes: 'data-close-dialog' })}
          </div>
        </div>
      </div>
    </div>`
    setModalState(true)
    modalRoot.querySelector('.vacancy-no-profile-dialog')?.focus()
    return
  }

  const primaryProfile = portfolioProfiles.find((profile) => profile.primary)
  const profileOptions = portfolioProfiles.map((profile) => ({ value: profile.id, label: profile.name }))
  modalRoot.innerHTML = `<div class="modal-backdrop" role="presentation">
    <div class="goal-dialog vacancy-apply-dialog" role="dialog" aria-modal="true" aria-labelledby="vacancy-apply-title" aria-describedby="vacancy-apply-description" tabindex="-1">
      ${controlButton({ className: 'goal-dialog__close', content: icon('close.svg', 20), attributes: 'aria-label="Закрыть" data-close-dialog' })}
      <div class="goal-dialog__header">
        <h2 id="vacancy-apply-title">Откликнуться на вакансию</h2>
        <p class="goal-dialog__lead" id="vacancy-apply-description">Рекрутер увидит твой отклик в ближайшее время</p>
      </div>
      <form class="vacancy-apply-form" data-vacancy-application-form="${escapeHTML(vacancy.id)}" novalidate>
        <div class="vacancy-apply-form__fields">
          ${fieldControl({
            id: 'vacancy-application-profile',
            label: 'Выбери профиль',
            placeholder: '',
            options: profileOptions,
            value: primaryProfile?.id || '',
            required: false,
          })}
          <div class="vacancy-apply-letter">
            ${fieldControl({
              id: 'vacancy-cover-letter',
              label: 'Сопроводительное письмо',
              placeholder: '',
              required: false,
              multiline: true,
              toolbarContent: vacancyApplicationToolbar(),
              inputAttributes: 'maxlength="2500" data-vacancy-cover-letter aria-describedby="vacancy-cover-letter-helper"',
            })}
            <span class="vacancy-apply-letter__helper" id="vacancy-cover-letter-helper">До 2500 символов</span>
          </div>
          <div class="vacancy-apply-consent">
            ${checkboxControl({
              className: 'vacancy-apply-consent__control',
              inputAttributes: 'required data-vacancy-application-consent aria-describedby="vacancy-application-consent-error"',
              boxContent: icon('check-small.svg', 16),
              content: `<span class="vacancy-apply-offer">Ознакомлен с ${linkControl({ href: 'https://cu.ru/oferta', label: 'офертой', attributes: 'target="_blank" rel="noopener noreferrer"' })}</span>`,
            })}
            <span class="vacancy-apply-consent__error" id="vacancy-application-consent-error" aria-live="polite">Подтверди ознакомление с офертой</span>
          </div>
        </div>
        <div class="goal-dialog__actions">
          ${controlButton({ className: 'flat-button flat-button--neutral', content: 'Отмена', attributes: 'data-close-dialog' })}
          ${controlButton({ className: 'flat-button flat-button--primary', content: 'Откликнуться', type: 'submit' })}
        </div>
      </form>
    </div>
  </div>`
  setModalState(true)
  modalRoot.querySelector('.vacancy-apply-dialog')?.focus()
}

function renderVacancyAfterApplication(vacancyId) {
  if (getScreenFromLocation() === 'vacancy') {
    renderScreen('vacancy', { animate: false, historyMode: 'none' })
    return
  }
  renderVacanciesPanel({ focusSelector: `[data-vacancy-open="${vacancyId}"]` })
}

function vacancyInfoBlock(title, content, className = '') {
  return `<section class="vacancy-detail__block ${className}" aria-labelledby="vacancy-${className || 'info'}-title">
    <h2 id="vacancy-${className || 'info'}-title">${title}</h2>
    ${content}
  </section>`
}

function vacancyDetailTemplate() {
  const vacancy = vacancies.find((item) => item.id === selectedVacancyId) || vacancies[2] || vacancies[0]
  selectedVacancyId = vacancy.id
  const city = vacancy.tags.find((tag) => ['Москва', 'Санкт-Петербург', 'Казань', 'Новосибирск'].includes(tag)) || 'Москва'
  const format = vacancy.tags.find((tag) => ['Гибрид', 'Офис', 'Удалённо'].includes(tag)) || 'Гибрид'
  const employment = vacancy.tags.find((tag) => tag.includes('занятость')) || 'Полная занятость'
  const address = format === 'Удалённо' ? 'Можно работать удалённо' : `${city}, офис компании`
  const roleSkills = {
    development: ['JavaScript', 'Git', 'REST API', 'Алгоритмы'],
    analytics: ['Python', 'SQL', 'Pandas', 'Статистика', 'BI'],
    machine: ['Python', 'SQL', 'Машинное обучение', 'Статистика'],
    design: ['Figma', 'Прототипирование', 'UX-исследования'],
    product: ['Аналитика', 'Исследования', 'Управление продуктом'],
    quality: ['Тестирование', 'API', 'SQL'],
    security: ['Linux', 'Сети', 'Информационная безопасность'],
  }
  const skills = roleSkills[vacancy.direction] || roleSkills.development

  return `
    <div class="app-shell">
      ${globalNav()}
      ${mobileNav({ backButton: true, backTarget: 'vacancies' })}
      ${informerFooter()}
      <main class="page-content vacancy-detail-page">
        ${controlButton({ className: 'work-step__back vacancy-detail__back', content: `${icon('arrow-left.svg', 18)}<span>К целям</span>`, attributes: 'data-back-to-vacancies' })}
        <div class="vacancy-detail__layout">
          <div class="vacancy-detail__content">
            ${vacancyInfoBlock('Основная информация', `<dl class="vacancy-detail__facts">
              <div><dt>Компания</dt><dd>${vacancy.company}</dd></div>
              <div><dt>Должность</dt><dd>${vacancy.title}</dd></div>
              <div><dt>Доход</dt><dd>${vacancy.salary}</dd></div>
              <div><dt>Занятость</dt><dd>${employment.replace(' занятость', '')}</dd></div>
              <div><dt>Формат</dt><dd>${format === 'Гибрид' ? 'Гибридный' : format}</dd></div>
              <div><dt>Адрес</dt><dd>${address}</dd></div>
            </dl>`, 'main-info')}
            ${vacancyInfoBlock('О компании', `<p>${vacancy.company} развивает цифровые продукты и сервисы для миллионов пользователей. Команда объединяет разработчиков, аналитиков, дизайнеров и продуктовых специалистов.</p><p>В этой роли ты будешь работать над реальными задачами вместе с опытной командой и получать регулярную обратную связь.</p>`, 'company')}
            ${vacancyInfoBlock('Условия для кандидатов', `<ul class="vacancy-detail__benefits">
              <li>${icon('check-green.svg', 18)}ДМС</li><li>${icon('check-green.svg', 18)}Компенсация спорта</li>
              <li>${icon('check-green.svg', 18)}Гибкое начало рабочего дня</li><li>${icon('check-green.svg', 18)}Выдача оборудования</li>
              <li>${icon('check-green.svg', 18)}Бюджет на внешнее обучение</li>
            </ul>`, 'benefits')}
            ${vacancyInfoBlock('Чем предстоит заниматься', `<ul><li>Работать над задачами продуктовой команды</li><li>Анализировать требования и предлагать решения</li><li>Участвовать в планировании и обсуждении результатов</li><li>Документировать решения и делиться знаниями с командой</li></ul>`, 'tasks')}
            ${vacancyInfoBlock('Что мы ждём', `<ul><li>Базовые знания и интерес к направлению</li><li>Готовность разбираться в новых инструментах</li><li>Умение задавать вопросы и работать в команде</li><li>Возможность уделять работе от 30 часов в неделю</li></ul>`, 'requirements')}
            ${vacancyInfoBlock('Ключевые навыки', `<p class="vacancy-detail__hint">Навыки, которые понадобятся для выполнения задач</p><div class="vacancy-detail__skills">${skills.map((skill) => `<span>${skill}</span>`).join('')}</div>`, 'skills')}
            ${vacancyInfoBlock('Будет плюсом', `<ul><li>Учебные или пет-проекты по направлению</li><li>Опыт работы с инструментами из описания вакансии</li><li>Знакомство с продуктовой разработкой</li></ul>`, 'plus')}
          </div>
          <aside class="vacancy-detail__sidebar" aria-label="Карточка вакансии">${vacancyCardTemplate(vacancy, { openable: false })}</aside>
        </div>
      </main>
      <div id="modal-root"></div>
    </div>`
}

function vacanciesTemplate() {
  const query = vacancySearch.trim().toLocaleLowerCase('ru')
  const filterGroups = [
    ['Вакансии', ['Свежие', 'Партнёры ЦУ']],
    ['Уровень', ['Бакалавриат', 'Магистратура']],
    ['Опыт', ['Без опыта', 'До 1 года', 'Более 1 года', 'Более 3 лет']],
    ['Формат', ['Удалённо', 'Гибрид', 'Офис']],
    ['Тип занятости', [['Полная', 'Полная занятость'], ['Частичная', 'Частичная занятость']]],
  ]
  const selectedByGroup = filterGroups.map(([, items]) => items
    .map((item) => Array.isArray(item) ? item[1] : item)
    .filter((value) => vacancyFilters.has(value)))
  const filtered = vacancies.filter((vacancy) => {
    const searchable = `${vacancy.title} ${vacancy.company} ${vacancy.description}`.toLocaleLowerCase('ru')
    const facets = new Set([...vacancy.tags, vacancy.level, vacancy.isFresh ? 'Свежие' : '', vacancy.partner ? 'Партнёры ЦУ' : ''])
    return (!query || searchable.includes(query))
      && (!vacancySelectedDirections.size || vacancySelectedDirections.has(vacancy.direction))
      && (!vacancyFavoritesOnly || vacancyState.favorites.has(vacancy.id))
      && (!Number(vacancySalaryFrom) || vacancy.salaryMax >= Number(vacancySalaryFrom))
      && selectedByGroup.every((selected) => !selected.length || selected.some((filter) => facets.has(filter)))
      && (vacancyInternships || !vacancy.tags.includes('Стажировка'))
  })
  const pageCount = Math.max(1, Math.ceil(filtered.length / VACANCIES_PER_PAGE))
  vacancyPage = Math.min(vacancyPage, pageCount)
  const pageItems = filtered.slice((vacancyPage - 1) * VACANCIES_PER_PAGE, vacancyPage * VACANCIES_PER_PAGE)

  return `
    <div class="vacancies-layout">
      <div class="vacancies-main">
        <div class="vacancy-search">
          ${fieldControl({ id: 'vacancy-search', label: 'Поиск вакансий', hideLabel: true, placeholder: 'Поиск', required: false, value: vacancySearch, className: 'input-search', leadingContent: icon('search.svg', 20), inputAttributes: 'data-vacancy-search autocomplete="off"' })}
          ${controlButton({ className: `vacancy-search__favorite ${vacancyFavoritesOnly ? 'is-active' : ''}`, content: favoriteIcon(), attributes: `aria-pressed="${vacancyFavoritesOnly}" aria-label="${vacancyFavoritesOnly ? 'Показать все вакансии' : 'Показать только избранное'}" data-vacancy-favorites-only` })}
        </div>
        ${filtered.length ? `<div class="vacancy-grid">${pageItems.map((vacancy) => vacancyCardTemplate(vacancy, { searchQuery: vacancySearch })).join('')}</div>
          <nav class="vacancy-pagination" aria-label="Страницы вакансий">
            ${controlButton({ className: 'vacancy-pagination__arrow', content: icon('chevron-up.svg', 18), attributes: `aria-label="Предыдущая страница" data-vacancy-page="${vacancyPage - 1}" ${vacancyPage === 1 ? 'disabled' : ''}` })}
            ${Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => controlButton({ className: `vacancy-pagination__page ${page === vacancyPage ? 'is-current' : ''}`, content: String(page), attributes: `aria-label="Страница ${page}" ${page === vacancyPage ? 'aria-current="page"' : ''} data-vacancy-page="${page}"` })).join('')}
            ${controlButton({ className: 'vacancy-pagination__arrow vacancy-pagination__arrow--next', content: icon('chevron-up.svg', 18), attributes: `aria-label="Следующая страница" data-vacancy-page="${vacancyPage + 1}" ${vacancyPage === pageCount ? 'disabled' : ''}` })}
            <span>По ${VACANCIES_PER_PAGE} вакансий · ${filtered.length} всего</span>
          </nav>` : `<div class="vacancies-empty"><strong>Ничего не найдено</strong><span>Измени запрос или сбрось фильтры</span></div>`}
      </div>
      <aside class="vacancy-filters" aria-labelledby="vacancy-filters-title">
        <h2 id="vacancy-filters-title">Фильтры</h2>
        ${multiSelectControl({ id: 'vacancy-role', label: 'Направление или роль', placeholder: 'Выбери направления', options: vacancyDirections, selected: vacancySelectedDirections, open: vacancyDirectionOpen, checkContent: icon('check-small.svg', 20), attributes: 'data-vacancy-direction-toggle' })}
        ${filterGroups.map(([title, items]) => `<div class="vacancy-filter-group"><strong>${title}</strong><div>${items.map((item) => {
          const [label, value] = Array.isArray(item) ? item : [item, item]
          return chipControl({ label, selected: vacancyFilters.has(value), attributes: `data-vacancy-filter="${value}"` })
        }).join('')}</div></div>`).join('')}
        ${fieldControl({ id: 'vacancy-salary', label: 'Зарплата от', placeholder: 'Не важна', options: VACANCY_SALARY_OPTIONS, value: vacancySalaryFrom, inputAttributes: 'data-vacancy-salary', required: false })}
        ${checkboxControl({ className: 'vacancy-internships', inputAttributes: `data-vacancy-internships ${vacancyInternships ? 'checked' : ''}`, boxContent: icon('check-small.svg', 20), content: '<span><strong>Рассматриваю стажировки</strong><small>Интересные проекты с возможностью остаться в штате компании</small></span>' })}
        ${controlButton({ className: 'vacancy-filters__reset', content: 'Сбросить', attributes: 'data-vacancy-reset' })}
      </aside>
    </div>`
}

function applicationFilterControl(id, label, values) {
  return multiSelectControl({
    id: `application-${id}`,
    label,
    placeholder: label,
    options: values.map((value) => ({ label: value, value })),
    selected: applicationFilters[id],
    open: applicationFilterOpen === id,
    checkContent: icon('check-small.svg', 20),
    attributes: `data-application-filter-toggle="${id}"`,
  })
}

function formatApplicationDate(value) {
  if (!value) return '—'
  const [year, month, day] = value.split('-')
  return `${day}.${month}.${year.slice(-2)}`
}

function applicationsTemplate() {
  const filterValues = {
    company: [...new Set(applications.map((item) => item.company))],
    status: APPLICATION_STATUSES,
    position: [...new Set(applications.map((item) => item.position))],
    salary: CAREER_SALARY_OPTIONS,
  }
  const filtered = applications.filter((item) => Object.entries(applicationFilters)
    .every(([key, selected]) => !selected.size || selected.has(item[key])))
  const pageCount = Math.max(1, Math.ceil(filtered.length / 10))
  applicationPage = Math.min(applicationPage, pageCount)
  const rows = filtered.slice((applicationPage - 1) * 10, applicationPage * 10)
  const statusClass = (status) => `application-status--${APPLICATION_STATUSES.indexOf(status)}`
  const hasFilters = Object.values(applicationFilters).some((selected) => selected.size)

  return `<section class="applications-panel" aria-labelledby="applications-title">
    <h2 class="visually-hidden" id="applications-title">Отклики</h2>
    <div class="applications-toolbar">
      <div class="applications-filter-bar">
        <div class="applications-filters">
          ${applicationFilterControl('company', 'Компания', filterValues.company)}
          ${applicationFilterControl('status', 'Статус', filterValues.status)}
          ${applicationFilterControl('position', 'Должность', filterValues.position)}
          ${applicationFilterControl('salary', 'Зарплата', filterValues.salary)}
        </div>
        ${hasFilters ? controlButton({ variant: 'flat', size: 'compact', className: 'applications-filter-reset', content: `${icon('application-filter-reset.svg', 18)}<span>Сбросить</span>`, attributes: 'data-application-filter-reset' }) : ''}
      </div>
      ${controlButton({ className: 'applications-add', content: `${icon('planner-plus.svg', 20)}<span>Внешний отклик</span>`, attributes: 'data-application-add' })}
    </div>
    <div class="applications-table-wrap">
      <div class="applications-table-stage">
        <table class="applications-table">
          <thead><tr><th>Компания</th><th>Дата отклика</th><th>Статус</th><th>Должность</th><th>Зарплата</th><th>Заметки</th></tr></thead>
          <tbody>${rows.map((item) => `<tr>
            <td>${item.company}</td><td><span class="application-date">${icon('application-calendar.svg', 18)}${formatApplicationDate(item.date)}</span></td><td><span class="application-status ${statusClass(item.status)}">${item.status}</span></td>
            <td>${item.position}</td><td>${normalizeApplicationSalary(item.salary) || '—'}</td><td>${item.notes || '—'}</td>
          </tr>`).join('')}</tbody>
        </table>
        ${rows.length ? `<div class="applications-edit-rail" aria-label="Действия с откликами">${rows.map((item) => controlButton({ className: 'application-edit', content: icon('edit.svg', 20), attributes: `aria-label="Редактировать отклик ${item.company}" data-application-edit="${item.id}"` })).join('')}</div>` : ''}
      </div>
      ${rows.length ? '' : '<div class="applications-empty">По выбранным фильтрам откликов нет</div>'}
      <div class="applications-pager">
        <div>${Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => controlButton({ className: `applications-page ${page === applicationPage ? 'is-current' : ''}`, content: String(page), attributes: `data-application-page="${page}" ${page === applicationPage ? 'aria-current="page"' : ''}` })).join('')}</div>
        <span>${filtered.length ? `${(applicationPage - 1) * 10 + 1}–${Math.min(applicationPage * 10, filtered.length)}` : '0'} из ${filtered.length}</span>
      </div>
    </div>
  </section>`
}

function renderApplicationsPanel({ focusSelector } = {}) {
  const panel = root.querySelector('[data-study-panel="applications"]')
  if (!panel) return
  panel.innerHTML = applicationsTemplate()
  if (focusSelector) panel.querySelector(focusSelector)?.focus({ preventScroll: true })
}

function openApplicationDrawer(application = null) {
  const item = application || {
    id: `external-${Date.now()}`, internal: false, company: '', date: applicationDateValue(new Date()), status: 'Новый',
    position: '', salary: '', source: 'Внешний источник', link: '', contact: '', notes: '',
  }
  editingApplicationId = application?.id || null
  previouslyFocused = document.activeElement
  const locked = item.internal ? 'disabled' : ''
  document.querySelector('#modal-root').innerHTML = `<div class="modal-backdrop modal-backdrop--sheet" role="presentation">
    <aside class="application-drawer application-drawer--${item.internal ? 'internal' : 'external'}" role="dialog" aria-modal="true" aria-labelledby="application-drawer-title" tabindex="-1">
      ${controlButton({ className: 'goal-dialog__close application-drawer__close', content: icon('close.svg', 24), attributes: 'aria-label="Закрыть" data-close-dialog' })}
      <img class="application-drawer__character" src="${ASSET}application-drawer-character.png" width="198" height="208" alt="">
      <header class="application-drawer__header"><h2 id="application-drawer-title">${item.internal ? item.company : 'Внешняя вакансия'}</h2>${item.internal ? `<p>${item.position}</p>` : ''}</header>
      <form class="application-form" data-application-form novalidate>
        <div class="application-form__fields">
          ${fieldControl({ id: 'application-company', label: 'Компания', placeholder: 'Название компании', value: item.company, inputAttributes: locked })}
          ${fieldControl({ id: 'application-date', label: 'Дата отклика', placeholder: 'Выбери дату', value: item.date, type: 'date', inputAttributes: item.internal ? 'disabled' : '', dateIconContent: icon('application-calendar-picker.svg', 24), clearIconContent: icon('application-date-clear.svg', 24) })}
          ${fieldControl({ id: 'application-status', label: 'Статус', placeholder: 'Выбери статус', options: APPLICATION_STATUSES, value: item.status })}
          ${fieldControl({ id: 'application-position', label: 'Должность', placeholder: 'Название должности', value: item.position, inputAttributes: locked })}
          ${item.internal
            ? fieldControl({ id: 'application-salary', label: 'Зарплата', placeholder: 'Не указана', options: CAREER_SALARY_OPTIONS, value: normalizeApplicationSalary(item.salary), required: false, inputAttributes: locked })
            : fieldControl({ id: 'application-salary', label: 'Зарплата', placeholder: 'Выбери зарплату', options: CAREER_SALARY_OPTIONS, value: normalizeApplicationSalary(item.salary), required: false })}
          ${item.internal
            ? fieldControl({ id: 'application-source', label: 'Источник вакансии', placeholder: '', options: ['ЦУ'], value: item.source, inputAttributes: 'disabled', required: false })
            : fieldControl({ id: 'application-link', label: 'Ссылка на вакансию', placeholder: 'https://', value: item.link, required: false })}
          ${fieldControl({ id: 'application-contact', label: 'Контакт нанимающего', placeholder: '@username или ссылка', value: item.contact, required: false })}
          ${fieldControl({ id: 'application-notes', label: 'Комментарий', placeholder: 'Оставь свой комментарий', value: item.notes, required: false, multiline: true })}
        </div>
        <div class="application-form__footer">${controlButton({ className: 'flat-button flat-button--primary', content: 'Сохранить', type: 'submit' })}</div>
      </form>
    </aside>
  </div>`
  setModalState(true)
  document.querySelector('.application-drawer').focus()
}

function formatPortfolioFileSize(size = 0) {
  if (!Number.isFinite(size) || size <= 0) return ''
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} КБ`
  return `${(size / (1024 * 1024)).toFixed(2).replace('.', ',')} МБ`
}

function portfolioMaterialTemplate(label, linkLabel, link, file, kind, profileId) {
  const safeLabel = escapeHTML(label)
  const safeLinkLabel = escapeHTML(linkLabel)
  const href = externalUrl(link)

  return `
    <section class="portfolio-material" aria-label="${safeLabel}">
      <span class="portfolio-material__label">${safeLabel}</span>
      ${file ? `<div class="portfolio-file">
        ${icon('portfolio-file.svg', 24)}
        <span class="portfolio-file__name">${escapeHTML(file.name)}</span>
        ${file.size ? `<span class="portfolio-file__size">${formatPortfolioFileSize(Number(file.size))}</span>` : ''}
        ${controlButton({ className: 'portfolio-file__download', content: icon('portfolio-download.svg', 24), attributes: `aria-label="Скачать ${safeLabel.toLowerCase()}" data-portfolio-download="${profileId}" data-portfolio-file-kind="${kind}"` })}
      </div>` : '<span class="portfolio-material__empty">Файл не добавлен</span>'}
      ${href ? `<a class="portfolio-material__link" href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer"><span>${safeLinkLabel}</span>${icon('portfolio-external.svg', 18)}</a>` : '<span class="portfolio-material__empty-link">Ссылка не добавлена</span>'}
    </section>`
}

function portfolioProfileCard(profile, index, profiles) {
  const tone = profile.tone || PORTFOLIO_PROFILE_TONES[index % PORTFOLIO_PROFILE_TONES.length]
  return `
    <article class="portfolio-profile-card portfolio-profile-card--tone-${tone}">
      <div class="portfolio-profile-card__surface">
        <header class="portfolio-profile-card__header">
          <h3>${escapeHTML(profile.name)}</h3>
          ${profile.description ? `<p>${escapeHTML(profile.description)}</p>` : ''}
        </header>
        <div class="portfolio-profile-card__materials">
          ${portfolioMaterialTemplate('Резюме', 'Ссылка на резюме', profile.resumeLink, profile.resumeFile, 'resume', profile.id)}
          ${portfolioMaterialTemplate('Портфолио', 'Ссылка на портфолио', profile.portfolioLink, profile.portfolioFile, 'portfolio', profile.id)}
        </div>
      </div>
      <footer class="portfolio-profile-card__footer">
        ${profiles.length > 1 ? toggleControl({ className: 'portfolio-profile-card__primary', inputAttributes: `data-portfolio-primary="${profile.id}" ${profile.primary ? 'checked' : ''}`, label: 'Основной профиль' }) : ''}
        <div class="portfolio-profile-card__actions">
          ${controlButton({ variant: 'flat-destructive', className: 'portfolio-profile-card__delete', content: 'Удалить', attributes: `data-portfolio-delete="${profile.id}"` })}
          ${controlButton({ className: 'flat-button flat-button--neutral', content: 'Редактировать', attributes: `data-portfolio-edit="${profile.id}"` })}
        </div>
      </footer>
    </article>`
}

function portfolioPreparationPanel() {
  return `
    <aside class="portfolio-preparation" aria-labelledby="portfolio-preparation-title">
      <div class="portfolio-preparation__body">
        <h2 id="portfolio-preparation-title">Подготовка</h2>
        <p>Обратись к консультанту — он поможет составить резюме и портфолио под твою специальность с учётом твоего опыта и навыков.</p>
        <img src="${ASSET}portfolio-preparation.png" width="275" height="146" alt="">
      </div>
      ${controlButton({ variant: 'flat', className: 'help-card__action portfolio-preparation__action', content: 'Получить консультацию' })}
    </aside>`
}

function portfolioTemplate() {
  const sortedProfiles = [...portfolioProfiles].sort((first, second) => Number(second.primary) - Number(first.primary) || first.createdAt - second.createdAt)

  return `
    <div class="portfolio-layout">
      <section class="portfolio-content" aria-labelledby="portfolio-title">
        <h2 class="visually-hidden" id="portfolio-title">Резюме и портфолио</h2>
        ${sortedProfiles.length ? `
          <div class="portfolio-profile-list">${sortedProfiles.map(portfolioProfileCard).join('')}</div>
          <div class="portfolio-content__add">${controlButton({ className: 'flat-button flat-button--primary', content: `${icon('plus.svg', 20)}<span>Профиль</span>`, attributes: 'data-portfolio-add' })}</div>` : `
          <div class="portfolio-empty">
            <div class="portfolio-empty__copy">
              <h2>Подготовь материалы для отклика</h2>
              <p>Заполни несколько профилей, добавь в них резюме и портфолио по своей профессии и сопроводительное письмо. Ты сможешь использовать профили при отклике на вакансии.</p>
            </div>
            ${controlButton({ className: 'flat-button flat-button--primary', content: `${icon('plus.svg', 20)}<span>Профиль</span>`, attributes: 'data-portfolio-add' })}
          </div>`}
      </section>
      ${portfolioPreparationPanel()}
    </div>`
}

function profileEditorTemplate() {
  const profile = portfolioProfiles.find((item) => item.id === editingPortfolioProfileId)
  const resumeFile = portfolioDraftFiles.resume || profile?.resumeFile || null
  const portfolioFile = portfolioDraftFiles.portfolio || profile?.portfolioFile || null

  return `
    <div class="app-shell">
      ${globalNav()}
      ${mobileNav({ backButton: true, backTarget: 'portfolio' })}
      ${informerFooter()}
      <main class="page-content work-step profile-page">
        <div class="work-step__header">
          ${controlButton({ className: 'work-step__back', content: `${icon('arrow-left.svg')}<span>К резюме и портфолио</span>`, attributes: 'data-back-to-portfolio' })}
          <section class="header-island header-island--work" aria-labelledby="profile-page-title">
            <div class="header-island__copy">
              <h1 id="profile-page-title" tabindex="-1">Профиль</h1>
              <div class="header-island__support"><p>Добавь резюме и портфолио по своей профессии</p></div>
            </div>
          </section>
        </div>
        <form class="profile-form" data-portfolio-form novalidate>
          <div class="profile-form__sections">
            <section class="profile-form__section" aria-labelledby="profile-private-title">
              <h2 id="profile-private-title">Не публичная информация</h2>
              ${fieldControl({ id: 'profile-name', label: 'Название профиля', placeholder: '', value: profile?.name || '', errorMessage: 'Укажи название профиля' })}
              ${fieldControl({ id: 'profile-description', label: 'Описание профиля', placeholder: '', value: profile?.description || '', required: false, multiline: true, className: 'profile-description-field' })}
            </section>
            <section class="profile-form__section" aria-labelledby="profile-public-title">
              <h2 id="profile-public-title">Эту информацию увидит рекрутер</h2>
              ${fieldControl({ id: 'profile-resume-link', label: 'Ссылка на резюме', placeholder: '', value: profile?.resumeLink || '', required: false })}
              ${fileControl({ id: 'profile-resume-file', label: 'Файл с резюме', file: resumeFile, inputAttributes: 'data-profile-file-kind="resume"', checkContent: icon('check-green.svg', 20), clearContent: icon('application-date-clear.svg', 24) })}
              ${fieldControl({ id: 'profile-portfolio-link', label: 'Ссылка на портфолио', placeholder: '', value: profile?.portfolioLink || '', required: false })}
              ${fileControl({ id: 'profile-portfolio-file', label: 'Файл с портфолио', file: portfolioFile, inputAttributes: 'data-profile-file-kind="portfolio"', checkContent: icon('check-green.svg', 20), clearContent: icon('application-date-clear.svg', 24) })}
            </section>
          </div>
          ${controlButton({ className: 'flat-button flat-button--primary profile-form__submit', content: 'Сохранить', type: 'submit' })}
        </form>
      </main>
      <div id="modal-root"></div>
    </div>`
}

function renderPortfolioPanel({ focusSelector } = {}) {
  const panel = root.querySelector('[data-study-panel="portfolio"]')
  if (!panel) return
  panel.innerHTML = portfolioTemplate()
  if (focusSelector) panel.querySelector(focusSelector)?.focus({ preventScroll: true })
}

function openPortfolioProfileEditor(profile = null) {
  editingPortfolioProfileId = profile?.id || null
  portfolioDraftFiles = {
    resume: profile?.resumeFile || null,
    portfolio: profile?.portfolioFile || null,
  }
  portfolioDraftFileObjects = {
    resume: profile ? portfolioFileObjects.get(`${profile.id}:resume`) || null : null,
    portfolio: profile ? portfolioFileObjects.get(`${profile.id}:portfolio`) || null : null,
  }
  renderScreen('profile')
}

function returnToPortfolio() {
  editingPortfolioProfileId = null
  portfolioDraftFiles = { resume: undefined, portfolio: undefined }
  portfolioDraftFileObjects = { resume: null, portfolio: null }
  requestedStudyTab = 'portfolio'
  renderScreen('industry-goal')
}

function setPortfolioFileError(field, message = '') {
  const error = field.querySelector('.ui-field__error')
  field.classList.toggle('ui-file-field--error', Boolean(message))
  if (error) {
    error.textContent = message
    error.style.display = message ? 'block' : ''
  }
}

function updatePortfolioFileControl(field, file) {
  const kind = field.querySelector('[data-profile-file-kind]')?.dataset.profileFileKind
  if (!kind || !file) return false
  const extension = file.name.split('.').pop()?.toLocaleLowerCase('ru')
  if (!['jpg', 'jpeg', 'png', 'pdf'].includes(extension)) {
    setPortfolioFileError(field, 'Выбери файл формата jpg, png или pdf')
    return false
  }
  if (file.size > 5 * 1024 * 1024) {
    setPortfolioFileError(field, 'Размер файла не должен превышать 5 МБ')
    return false
  }

  portfolioDraftFiles[kind] = { name: file.name, size: file.size, type: file.type }
  portfolioDraftFileObjects[kind] = file
  field.querySelector('[data-file-name]').textContent = file.name
  field.querySelector('[data-file-selected]').hidden = false
  setPortfolioFileError(field)
  return true
}

function clearPortfolioFile(field) {
  const input = field.querySelector('[data-profile-file-kind]')
  const kind = input?.dataset.profileFileKind
  if (!kind) return
  input.value = ''
  portfolioDraftFiles[kind] = null
  portfolioDraftFileObjects[kind] = null
  field.querySelector('[data-file-name]').textContent = ''
  field.querySelector('[data-file-selected]').hidden = true
  setPortfolioFileError(field)
}

function openPortfolioDeleteDialog(profile) {
  previouslyFocused = document.activeElement
  document.querySelector('#modal-root').innerHTML = `
    <div class="modal-backdrop" role="presentation">
      <div class="goal-dialog goal-dialog--sm portfolio-delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby="portfolio-delete-title" aria-describedby="portfolio-delete-description" tabindex="-1">
        ${controlButton({ className: 'goal-dialog__close', content: icon('close.svg', 20), attributes: 'aria-label="Закрыть" data-close-dialog' })}
        <div class="goal-dialog__header">
          <h2 id="portfolio-delete-title">Удалить профиль?</h2>
          <p class="goal-dialog__lead" id="portfolio-delete-description">Профиль «${escapeHTML(profile.name)}» и добавленные в него материалы будут удалены.</p>
        </div>
        <div class="goal-dialog__actions">
          ${controlButton({ className: 'flat-button flat-button--neutral', content: 'Отмена', attributes: 'data-close-dialog' })}
          ${controlButton({ className: 'flat-button flat-button--danger', content: 'Удалить', attributes: `data-portfolio-delete-confirm="${profile.id}"` })}
        </div>
      </div>
    </div>`
  setModalState(true)
  document.querySelector('.portfolio-delete-dialog').focus()
}

function goalDetailActions(kind) {
  const goal = getSavedGoals().find((item) => item.kind === kind)
  if (!goal) return ''

  return `<div class="study-goal-shell__actions">
    ${controlButton({ variant: 'flat-destructive', className: 'study-goal-shell__delete', content: 'Удалить', attributes: `data-delete-current-goal="${goal.id}"` })}
    ${kind === 'industry' ? '' : controlButton({ className: 'flat-button flat-button--neutral', content: 'Редактировать данные', attributes: `data-edit-current-goal="${goal.id}"` })}
  </div>`
}

function openGoalDeleteDialog(goal) {
  previouslyFocused = document.activeElement
  const title = goal.kind === 'study'
    ? 'Хочу учиться'
    : goal.id === 'first-job' ? 'Выйти на первую работу или стажировку' : goal.title
  document.querySelector('#modal-root').innerHTML = `
    <div class="modal-backdrop" role="presentation">
      <div class="goal-dialog goal-dialog--sm goal-delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby="goal-delete-title" aria-describedby="goal-delete-description" tabindex="-1">
        ${controlButton({ className: 'goal-dialog__close', content: icon('close.svg', 20), attributes: 'aria-label="Закрыть" data-close-dialog' })}
        <div class="goal-dialog__header">
          <h2 id="goal-delete-title">Удалить цель?</h2>
          <p class="goal-dialog__lead" id="goal-delete-description">Цель «${escapeHTML(title)}» и прогресс по ее этапам будут удалены.</p>
        </div>
        <div class="goal-dialog__actions">
          ${controlButton({ className: 'flat-button flat-button--neutral', content: 'Отмена', attributes: 'data-close-dialog' })}
          ${controlButton({ className: 'flat-button flat-button--danger', content: 'Удалить', attributes: `data-delete-current-goal-confirm="${goal.id}"` })}
        </div>
      </div>
    </div>`
  setModalState(true)
  document.querySelector('.goal-delete-dialog').focus()
}

function industryGoalTemplate() {
  const progress = getIndustryProgress()
  const summary = getIndustryProgressSummary(progress)
  const selectedGoal = getSavedGoals().find((goal) => goal.kind === 'industry')
  const goalTitle = selectedGoal?.id === 'first-job'
    ? 'Выйти на первую работу или стажировку'
    : selectedGoal?.title || 'Выйти на первую работу или стажировку'

  return `
    <div class="app-shell">
      ${globalNav()}
      ${mobileNav({ backButton: true, backTarget: 'my-goals' })}
      ${informerFooter()}
      <main class="page-content study-detail-page">
        ${controlButton({ className: 'work-step__back study-detail__back', content: `${icon('arrow-left.svg', 18)}<span>К целям</span>`, attributes: 'data-back-to-my-goals' })}
        <section class="study-header" aria-labelledby="industry-detail-title">
          <div class="study-header__copy">
            <h1 id="industry-detail-title" tabindex="-1">Индустрия</h1>
            <p>Личная карьерная цель помогает выбрать курсы, активности, проекты и вакансии.<br>Если сложно сформулировать её самостоятельно — начни с консультации.</p>
          </div>
          <div class="study-header__illustration" aria-hidden="true">${icon('study-header-illustration.svg', 322)}</div>
          <div class="study-tabs" role="tablist" aria-label="Разделы индустриальной цели" data-study-tabs>
            <span class="study-tabs__indicator" aria-hidden="true"></span>
            ${[
              ['goal', 'Моя цель'],
              ['vacancies', 'Вакансии'],
              ['applications', 'Отклики'],
              ['portfolio', 'Резюме и портфолио'],
            ].map(([id, label]) => tabControl({ id, label, active: id === 'goal' })).join('')}
          </div>
        </section>

        <div id="study-panel-goal" role="tabpanel" aria-labelledby="study-tab-goal" data-study-panel="goal">
          <section class="study-content-panel study-goal-panel industry-goal-panel" aria-labelledby="industry-goal-heading">
            <h2 class="visually-hidden" id="industry-goal-heading">Моя цель</h2>
            <div class="study-goal-shell">
              <div class="study-goal-summary-island">
                <div class="study-goal-shell__meta">
                  <strong>Индустрия</strong>
                  <span class="badge badge--positive">${icon('check-verified.svg', 16)}<span data-industry-stage-summary>${summary.completedStages} из ${industryStages.length} завершено</span></span>
                  ${goalDetailActions('industry')}
                </div>
                <div class="study-goal-summary">
                  <h3>${goalTitle}</h3>
                  <strong data-industry-percent>${summary.percent}%</strong>
                  <div class="study-goal-progress" role="progressbar" aria-label="Прогресс цели «${goalTitle}»" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${summary.percent}" data-industry-progress>
                    <span style="width: ${summary.percent}%"></span>
                  </div>
                </div>
              </div>
              <section class="study-journey" aria-labelledby="industry-journey-title">
                <div class="study-journey__heading">
                  <h3 id="industry-journey-title">Этапы пути</h3>
                </div>
                <p>Этапы без строгого пути: действия идут параллельно, а не строго друг за другом.</p>
                <div class="study-stage-list">
                  ${industryStages.map((stage, index) => industryStageTemplate(stage, index, progress)).join('')}
                </div>
              </section>
            </div>
          </section>
        </div>
        <div id="study-panel-vacancies" role="tabpanel" aria-labelledby="study-tab-vacancies" data-study-panel="vacancies" hidden>
          ${vacanciesTemplate()}
        </div>
        <div id="study-panel-applications" role="tabpanel" aria-labelledby="study-tab-applications" data-study-panel="applications" hidden>
          ${applicationsTemplate()}
        </div>
        <div id="study-panel-portfolio" role="tabpanel" aria-labelledby="study-tab-portfolio" data-study-panel="portfolio" hidden>
          ${portfolioTemplate()}
        </div>
      </main>
      <div id="modal-root"></div>
    </div>`
}

function savedGoalCard(goal) {
  const track = goal.kind === 'study' ? 'Учеба' : 'Индустрия'
  const title = goal.kind === 'study' ? 'Хочу учиться' : goal.title
  const summary = goal.kind === 'study' ? getStudySemesterProgress() : getIndustryProgressSummary()
  const stageCount = goal.kind === 'study' ? summary.totalSemesters : industryStages.length
  const completedCount = goal.kind === 'study' ? summary.completedSemesters : summary.completedStages

  return `
    <article class="saved-goal">
      <header class="saved-goal__header">
        <div class="saved-goal__meta">
          <h3>${track}</h3>
          <span class="badge badge--positive">${icon('check-verified.svg', 16)}${completedCount} из ${stageCount} ${goal.kind === 'study' ? 'семестров ' : ''}завершено</span>
        </div>
        <div class="saved-goal__actions">
          ${controlButton({ variant: 'flat-destructive', className: 'saved-goal__delete', content: 'Удалить', attributes: `data-delete-current-goal="${goal.id}"` })}
          ${controlButton({ className: 'flat-button flat-button--neutral saved-goal__open', content: 'Открыть', attributes: `data-open-saved-goal="${goal.kind}"` })}
        </div>
      </header>
      <div class="saved-goal__body">
        <h4>${title}</h4>
        <strong>${summary.percent}%</strong>
        <div class="saved-goal__progress" role="progressbar" aria-label="Прогресс цели «${title}»" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${summary.percent}">
          <span style="width: ${summary.percent}%"></span>
        </div>
      </div>
    </article>`
}

function myGoalsTemplate() {
  if (!getSavedGoals().length) return invitationTemplate()
  const savedGoals = getSavedGoals()

  return `
    <div class="app-shell">
      ${globalNav()}
      ${mobileNav()}
      ${informerFooter()}
      <main class="page-content">
        ${navigatorGoalsHeader()}
        <div class="workspace goals-workspace">
          <section class="my-goals-panel my-goals-panel--overview" aria-labelledby="my-goals-title">
            <h2 class="visually-hidden" id="my-goals-title" tabindex="-1">Мои цели</h2>
            <div class="saved-goals-list">
              ${savedGoals.length ? savedGoals.map(savedGoalCard).join('') : `
                <div class="my-goals-empty">
                  <p>Здесь появятся твои цели</p>
                  ${controlButton({ className: 'flat-button flat-button--primary', content: `${icon('plus.svg', 20)}<span>Добавить цель</span>`, attributes: 'data-add-goal' })}
                </div>`}
            </div>
          </section>
          ${infoPanel()}
        </div>
      </main>
      <div id="modal-root"></div>
    </div>`
}

const root = document.querySelector('#root')
let previouslyFocused = null
let activeGoal = null
let pageTransitioning = false
let requestedStudyTab = new URLSearchParams(window.location.search).get('tab')
let requestedIndustryAction = new URLSearchParams(window.location.search).get('action')

const screenRoutes = {
  goals: { template: invitationTemplate, focus: '#invitation-title' },
  'goal-selection': { template: appTemplate, focus: '#goals-heading' },
  'work-experience': { template: workExperienceTemplate, focus: '#work-step-title' },
  'job-expectations': { template: jobExpectationsTemplate, focus: '#work-step-title' },
  success: { template: surveyCompleteTemplate, focus: '#survey-complete-title' },
  'my-goals': { template: myGoalsTemplate, focus: '#my-goals-title' },
  'study-goal': { template: studyGoalTemplate, focus: '#study-detail-title' },
  'industry-goal': { template: industryGoalTemplate, focus: '#industry-detail-title' },
  profile: { template: profileEditorTemplate, focus: '#profile-page-title' },
  vacancy: { template: vacancyDetailTemplate, focus: '.vacancy-detail__block h2' },
}

function getScreenFromLocation() {
  const segments = window.location.pathname.split('/').filter(Boolean)
  const screen = segments.at(-1)?.replace(/\.html$/, '') || 'goals'
  const view = new URLSearchParams(window.location.search).get('view')
  if (screen === 'study-goal' && view === 'industry') return 'industry-goal'
  if (screen === 'study-goal' && view === 'vacancy') return 'vacancy'
  return screenRoutes[screen] ? screen : 'goals'
}

const appRootPath = APP_ROOT_URL.pathname

function getScreenUrl(screen) {
  if (screen === 'industry-goal') {
    const url = new URL('study-goal/', APP_ROOT_URL)
    url.searchParams.set('view', 'industry')
    if (requestedStudyTab) url.searchParams.set('tab', requestedStudyTab)
    if (requestedIndustryAction === 'add-application') url.searchParams.set('action', requestedIndustryAction)
    return `${url.pathname}${url.search}`
  }
  if (screen === 'vacancy' && selectedVacancyId) return `${appRootPath}study-goal/?view=vacancy&id=${encodeURIComponent(selectedVacancyId)}`
  if (screen === 'profile' && editingPortfolioProfileId) return `${appRootPath}profile/?id=${encodeURIComponent(editingPortfolioProfileId)}`
  if (['work-experience', 'job-expectations'].includes(screen) && isEditingOnboarding()) return `${appRootPath}${screen}/?edit=onboarding`
  return `${appRootPath}${screen}/`
}

function syncStudyTabIndicator(tablist, { animate = true } = {}) {
  if (!tablist) return
  const activeTab = tablist.querySelector('[data-study-tab].is-active')
  const indicator = tablist.querySelector('.study-tabs__indicator')
  if (!activeTab || !indicator) return

  indicator.classList.toggle('is-static', !animate)
  indicator.style.width = `${activeTab.offsetWidth}px`
  indicator.style.transform = `translateX(${activeTab.offsetLeft}px)`
  if (!animate) window.requestAnimationFrame(() => indicator.classList.remove('is-static'))
}

function initializeCurrentScreen() {
  const tablist = root.querySelector('[data-study-tabs]')
  if (tablist && requestedStudyTab) {
    const requestedTab = tablist.querySelector(`[data-study-tab="${requestedStudyTab}"]`)
    if (requestedTab) activateStudyTab(requestedTab)
    requestedStudyTab = null
  }
  if (tablist) syncStudyTabIndicator(tablist, { animate: false })
  if (requestedIndustryAction === 'add-application'
    && getScreenFromLocation() === 'industry-goal'
    && root.querySelector('[data-study-tab="applications"].is-active')) {
    openApplicationDrawer()
  }
  requestedIndustryAction = null
}

function resolveJourneyScreen(screen) {
  const onboarding = getOnboarding()
  const hasGoals = getSavedGoals().length > 0
  if (screen === 'goals' && hasGoals) return 'my-goals'
  if (screen === 'my-goals' && !hasGoals) return 'goals'
  if (['work-experience', 'job-expectations'].includes(screen) && onboarding.completed && !isEditingOnboarding()) return hasGoals ? 'my-goals' : 'goal-selection'
  if (screen === 'job-expectations' && !onboarding.workReady) return 'work-experience'
  if (screen === 'goal-selection' && !onboarding.ready) return onboarding.workReady ? 'job-expectations' : 'work-experience'
  if (screen === 'goal-selection' && getSavedGoals().length >= MAX_GOALS) return 'my-goals'
  if (screen === 'study-goal' && !getSavedGoals().some((goal) => goal.kind === 'study')) return hasGoals ? 'my-goals' : 'goals'
  if (screen === 'industry-goal' && !getSavedGoals().some((goal) => goal.kind === 'industry')) return hasGoals ? 'my-goals' : 'goals'
  return screenRoutes[screen] ? screen : 'goals'
}

function renderScreen(screen, { animate = true, historyMode = 'push' } = {}) {
  if (animate && pageTransitioning) return

  closePlannerCourseMenu()
  closePlannerAvailableFilters()
  const resolvedScreen = resolveJourneyScreen(screen)
  const route = screenRoutes[resolvedScreen]
  if (historyMode === 'none' && resolvedScreen !== screen) historyMode = 'replace'

  if (historyMode === 'push') window.history.pushState({ screen: resolvedScreen }, '', getScreenUrl(resolvedScreen))
  if (historyMode === 'replace') window.history.replaceState({ screen: resolvedScreen }, '', getScreenUrl(resolvedScreen))

  if (animate) {
    transitionView(route.template(), route.focus)
    return
  }

  root.innerHTML = route.template()
  window.scrollTo({ top: 0, behavior: 'auto' })
  initializeCurrentScreen()
}

const initialScreen = getScreenFromLocation()
renderScreen(initialScreen, { animate: false, historyMode: 'replace' })

function transitionView(template, focusSelector) {
  if (pageTransitioning) return

  const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300
  if (duration === 0) {
    root.innerHTML = template
    window.scrollTo({ top: 0, behavior: 'auto' })
    initializeCurrentScreen()
    root.querySelector(focusSelector)?.focus({ preventScroll: true })
    return
  }

  pageTransitioning = true
  document.body.classList.add('has-page-transition')
  const overlay = document.createElement('div')
  overlay.className = 'page-transition'
  overlay.setAttribute('aria-hidden', 'true')
  document.body.append(overlay)
  overlay.getBoundingClientRect()
  overlay.classList.add('page-transition--visible')

  window.setTimeout(() => {
    root.innerHTML = template
    window.scrollTo({ top: 0, behavior: 'auto' })
    initializeCurrentScreen()
    root.querySelector(focusSelector)?.focus({ preventScroll: true })

    window.requestAnimationFrame(() => {
      overlay.classList.remove('page-transition--visible')
    })

    window.setTimeout(() => {
      overlay.remove()
      document.body.classList.remove('has-page-transition')
      pageTransitioning = false
    }, duration)
  }, duration)
}

function closeDialog(onClosed) {
  const modalRoot = document.querySelector('#modal-root')
  const backdrop = modalRoot.querySelector('.modal-backdrop')
  if (!backdrop || backdrop.classList.contains('is-closing')) return

  backdrop.classList.add('is-closing')
  const animationDuration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300

  window.setTimeout(() => {
    modalRoot.innerHTML = ''
    setModalState(false)
    if (onClosed) onClosed()
    else previouslyFocused?.focus()
  }, animationDuration)
}

function setModalState(open) {
  const modalRoot = document.querySelector('#modal-root')
  if (!modalRoot?.parentElement) return
  ;[...modalRoot.parentElement.children].forEach((element) => {
    if (element !== modalRoot) element.inert = open
  })
  document.body.classList.toggle('has-dialog', open)
}

function openDialog(goal) {
  previouslyFocused = document.activeElement
  activeGoal = goal
  document.querySelector('#modal-root').innerHTML = `
    <div class="modal-backdrop" role="presentation">
      <div class="goal-dialog" role="dialog" aria-modal="true" aria-labelledby="goal-dialog-title" tabindex="-1">
        ${controlButton({ className: 'goal-dialog__close', content: icon('close.svg', 20), attributes: 'aria-label="Закрыть"' })}
        <div class="goal-dialog__header">
          <h2 id="goal-dialog-title">${goal.title}</h2>
          <p class="goal-dialog__lead">С этой целью тебе станут доступны:</p>
        </div>
        <div class="goal-dialog__grid">
          ${[opportunities.slice(0, 4), opportunities.slice(4)].map((column) => `
            <div class="goal-dialog__column">
              ${column.map(([title, meta, iconName]) => `
                <div class="opportunity">
                  <span class="opportunity__icon" aria-hidden="true">${icon(iconName, 20)}</span>
                  <span><strong>${title}</strong><small>${meta}</small></span>
                </div>`).join('')}
            </div>`).join('')}
        </div>
        <div class="goal-dialog__actions">
          ${controlButton({ className: 'flat-button flat-button--neutral', content: 'Назад к списку', attributes: 'data-close-dialog' })}
          ${controlButton({ className: 'flat-button flat-button--primary', content: 'Выбрать', attributes: 'data-select-goal' })}
        </div>
      </div>
    </div>`
  setModalState(true)
  document.querySelector('.goal-dialog').focus()
}

function openGoalLimitDialog() {
  previouslyFocused = document.activeElement
  document.querySelector('#modal-root').innerHTML = `
    <div class="modal-backdrop" role="presentation">
      <div class="goal-dialog goal-dialog--sm goal-limit-dialog" role="alertdialog" aria-modal="true" aria-labelledby="goal-limit-title" aria-describedby="goal-limit-description" tabindex="-1">
        ${controlButton({ className: 'goal-dialog__close', content: icon('goal-limit-close.svg', 20), attributes: 'aria-label="Закрыть"' })}
        <img class="goal-limit-dialog__image" src="${ASSET}goal-limit-illustration.svg" width="200" height="200" alt="">
        <div class="goal-limit-dialog__bottom">
          <div class="goal-dialog__header">
            <h2 id="goal-limit-title">Цели уже выбраны</h2>
            <p class="goal-dialog__lead" id="goal-limit-description">Чтобы добавить новую цель, удали одну из текущих.</p>
          </div>
          <div class="goal-dialog__actions">
            ${controlButton({ className: 'flat-button flat-button--primary', content: 'Понятно', attributes: 'data-close-dialog' })}
          </div>
        </div>
      </div>
    </div>`
  setModalState(true)
  document.querySelector('.goal-limit-dialog').focus()
}

function renderPlannerPanel({ focusSelector } = {}) {
  closePlannerCourseMenu()
  const panel = root.querySelector('[data-study-panel="planner"]')
  if (!panel) return
  panel.innerHTML = plannerTemplate()
  if (focusSelector) panel.querySelector(focusSelector)?.focus({ preventScroll: true })
}

function renderPlannerDropResult(courseId, semester) {
  renderPlannerPanel({ focusSelector: `[data-planner-course="${courseId}"] [data-planner-course-open]` })
  const targetSemester = root.querySelector(`[data-planner-semester-section="${semester}"]`)
  if (!targetSemester) return
  requestAnimationFrame(() => {
    targetSemester.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    })
  })
}

function renderCatalogPanel({ focusSelector } = {}) {
  const panel = root.querySelector('[data-study-panel="catalog"]')
  if (!panel) return
  panel.innerHTML = catalogTemplate()
  if (focusSelector) panel.querySelector(focusSelector)?.focus({ preventScroll: true })
}

function renderVacanciesPanel({ focusSelector, preserveSearch = false } = {}) {
  const panel = root.querySelector('[data-study-panel="vacancies"]')
  if (!panel) return
  const search = preserveSearch ? panel.querySelector('.vacancy-search') : null
  if (search) {
    const nextPanel = document.createElement('div')
    nextPanel.innerHTML = vacanciesTemplate()
    const main = panel.querySelector('.vacancies-main')
    ;[...main.children].filter((child) => child !== search).forEach((child) => child.remove())
    ;[...nextPanel.querySelector('.vacancies-main').children]
      .filter((child) => !child.matches('.vacancy-search'))
      .forEach((child) => main.append(child))
    panel.querySelector('.vacancy-filters').replaceWith(nextPanel.querySelector('.vacancy-filters'))
    const favoriteButton = search.querySelector('[data-vacancy-favorites-only]')
    favoriteButton.classList.toggle('is-active', vacancyFavoritesOnly)
    favoriteButton.setAttribute('aria-pressed', String(vacancyFavoritesOnly))
    favoriteButton.setAttribute('aria-label', vacancyFavoritesOnly ? 'Показать все вакансии' : 'Показать только избранное')
  } else panel.innerHTML = vacanciesTemplate()
  if (focusSelector) panel.querySelector(focusSelector)?.focus({ preventScroll: true })
}

function canPlacePlannerCourse(courseId, semester) {
  const course = findPlannerCourse(courseId)
  const source = findPlannerItem(courseId)
  return Boolean(course && course.available.includes(semester) && canMoveToPlannerSemester(semester)
    && (!source || (source.semester !== semester && !isPlannerSemesterCompleted(source.semester))))
}

function getRecommendedCourseSemester(courseId) {
  const course = findPlannerCourse(courseId)
  if (!course || findPlannerItem(courseId)) return null
  const available = course.available.filter((semester) => canPlacePlannerCourse(courseId, semester)).sort((a, b) => a - b)
  const withoutConflicts = available.filter((semester) => !courseHasConflict(courseId, semester))
  const preferred = withoutConflicts.length ? withoutConflicts : available
  return preferred.find((semester) => getSemesterLoad(semester) + course.workload <= 16)
    ?? preferred.reduce((best, semester) => best === null || getSemesterLoad(semester) < getSemesterLoad(best) ? semester : best, null)
}

function applyPlannerCourseAction(courseId, action, targetSemester) {
  const course = findPlannerCourse(courseId)
  const placement = findPlannerItem(courseId)
  if (!course) return false
  if (action === 'recommended') {
    const recommended = getRecommendedCourseSemester(courseId)
    return recommended !== null && applyPlannerCourseAction(courseId, 'add', recommended)
  }
  if (action === 'place' || action === 'add') {
    if (!canPlacePlannerCourse(courseId, targetSemester) || (action === 'add' && placement)) return false
    if (placement) return movePlannerCourse(courseId, targetSemester)
    plannerState.semesters[targetSemester].push({ id: courseId, completed: false, fixed: false })
    plannerState.collapsedSemesters = plannerState.collapsedSemesters.filter((value) => value !== targetSemester)
    plannerState.collapsedCourseGroups = plannerState.collapsedCourseGroups.filter((value) => value !== targetSemester)
  } else if (action === 'completed') {
    if (!placement || placement.semester < CURRENT_SEMESTER) return false
    placement.item.completed = !placement.item.completed
  } else if (action === 'remove') {
    if (!placement || placement.item.fixed || isPlannerSemesterCompleted(placement.semester)) return false
    plannerState.semesters[placement.semester].splice(placement.index, 1)
  } else return false
  savePlannerState()
  return true
}

function plannerCourseActionDefinitions(courseId, semester) {
  const placement = findPlannerItem(courseId)
  const recommended = getRecommendedCourseSemester(courseId)
  const current = placement?.semester || semester
  const movable = Array.from({ length: 8 }, (_, index) => index + 1).some((target) => canPlacePlannerCourse(courseId, target))
  return [
    ...(!placement ? [{ action: 'recommended', label: 'Добавить в рекомендованный', asset: 'planner-plus.svg', iconSize: 18, disabled: recommended === null, title: recommended === null ? 'Сейчас нет доступного семестра' : `Рекомендуемый: ${recommended} семестр` }] : []),
    { action: 'place', target: current - 1, label: 'В предыдущий семестр', asset: 'planner-menu-up.svg', disabled: !canPlacePlannerCourse(courseId, current - 1) },
    { action: 'place', target: current + 1, label: 'В следующий семестр', asset: 'planner-menu-down.svg', disabled: !canPlacePlannerCourse(courseId, current + 1) },
    { action: 'semesters', label: placement ? 'Перенести в семестр' : 'Добавить в семестр', asset: 'planner-menu-move.svg', disabled: !movable },
    { action: 'completed', label: placement?.item.completed ? 'Отметить непройденным' : 'Отметить пройденным', asset: 'planner-menu-check.svg', disabled: !placement || placement.semester < CURRENT_SEMESTER },
    { action: 'about', label: 'О курсе', asset: 'planner-menu-info.svg' },
    { separator: true },
    { action: 'remove', label: 'Удалить', asset: 'planner-menu-trash.svg', destructive: true, disabled: !placement || placement.item.fixed || isPlannerSemesterCompleted(placement.semester) },
  ]
}

function plannerCourseActionAttributes(courseId, item, { semester, fromDrawer = false } = {}) {
  return `data-planner-course-action="${item.action}" data-course-id="${courseId}" data-semester="${semester}"${item.target !== undefined ? ` data-target-semester="${item.target}"` : ''}${fromDrawer ? ' data-course-action-drawer' : ''}${item.title ? ` title="${escapeHTML(item.title)}"` : ''}`
}

function courseDrawerActionsTemplate(courseId, semester, { source = 'planner' } = {}) {
  const placement = findPlannerItem(courseId)
  const definitions = plannerCourseActionDefinitions(courseId, semester)
  const semesterAction = definitions.find((item) => item.action === 'semesters')
  const recommended = getRecommendedCourseSemester(courseId)
  const actions = source === 'catalog' ? [
    { action: 'recommended', label: 'В рекомендованный', asset: 'planner-plus.svg', iconSize: 18, disabled: recommended === null, title: recommended === null ? 'Курс уже в плане или нет доступного семестра' : `В рекомендованный ${recommended} семестр` },
    { ...semesterAction, label: 'Добавить в семестр', disabled: Boolean(placement) || semesterAction.disabled },
  ] : definitions.filter((item) => !item.separator && item.action !== 'about')
  return `<div class="course-drawer__actions">
    ${actions.map((item) => controlButton({
      variant: item.destructive ? 'flat-icon-destructive' : 'flat-icon',
      className: 'course-drawer__action',
      content: icon(item.asset, item.iconSize || 20),
      attributes: `${plannerCourseActionAttributes(courseId, { ...item, title: item.title || item.label }, { semester, fromDrawer: true })} aria-label="${escapeHTML(item.label)}"${item.disabled ? ' disabled' : ''}${item.action === 'semesters' ? ' aria-haspopup="menu" aria-expanded="false" aria-controls="planner-course-semester-menu"' : ''}${item.action === 'completed' ? ` aria-pressed="${Boolean(placement?.item.completed)}"` : ''}`,
    })).join('')}
  </div>`
}

function closePlannerCourseMenu({ restoreFocus = false } = {}) {
  const anchor = plannerCourseMenu?.anchor
  anchor?.setAttribute('aria-expanded', 'false')
  root.querySelector('#planner-course-menu')?.remove()
  plannerCourseMenu = null
  if (restoreFocus && anchor?.isConnected) anchor.focus({ preventScroll: true })
}

function focusPlannerMenuItem(menu, last = false) {
  if (!menu) return
  const items = [...menu.querySelectorAll('[role="menuitem"]:not(:disabled)')]
  ;(last ? items.at(-1) : items[0])?.focus({ preventScroll: true })
}

function renderPlannerCourseMenu({ focus = false } = {}) {
  if (!plannerCourseMenu?.anchor.isConnected) return closePlannerCourseMenu()
  const { courseId, semester, anchor, fromDrawer, submenu, onlySemesters } = plannerCourseMenu
  const planned = Boolean(findPlannerItem(courseId))
  const items = plannerCourseActionDefinitions(courseId, semester).filter((item) => planned || item.action === 'semesters').map((item) => item.separator ? item : ({
    ...item,
    label: planned ? item.label : 'Добавить в семестр',
    iconContent: icon(item.asset, item.iconSize || 20),
    trailingContent: item.action === 'semesters' ? icon('planner-menu-chevron.svg', 24) : '',
    attributes: `${plannerCourseActionAttributes(courseId, item, { semester, fromDrawer })}${item.action === 'semesters' ? ` aria-haspopup="menu" aria-expanded="${submenu}" aria-controls="planner-course-semester-menu"` : ''}`,
  }))
  const compact = window.innerWidth < 640
  const semesterItems = Array.from({ length: 8 }, (_, index) => index + 1).map((target) => ({
    label: `${target} семестр`,
    disabled: !canPlacePlannerCourse(courseId, target),
    attributes: plannerCourseActionAttributes(courseId, { action: 'place', target }, { semester, fromDrawer }),
  }))
  if (compact && !onlySemesters) semesterItems.unshift({ label: 'Назад', attributes: 'data-planner-menu-back' })
  let portal = root.querySelector('#planner-course-menu')
  if (!portal) {
    portal = document.createElement('div')
    portal.id = 'planner-course-menu'
    root.append(portal)
  }
  portal.innerHTML = `${!onlySemesters ? contextMenuControl({ id: 'planner-course-context-menu', label: 'Действия с курсом', items }) : ''}
    ${submenu || onlySemesters ? contextMenuControl({ id: 'planner-course-semester-menu', label: 'Выбери семестр', items: semesterItems }) : ''}`
  const main = portal.querySelector('#planner-course-context-menu')
  const sub = portal.querySelector('#planner-course-semester-menu')
  const rect = anchor.getBoundingClientRect()
  const menu = main || sub
  menu.style.width = `${Math.min(onlySemesters ? 200 : 300, window.innerWidth - 24)}px`
  const width = menu.getBoundingClientRect().width
  const height = menu.getBoundingClientRect().height
  const fitsBeside = rect.right + width + 16 <= window.innerWidth && !fromDrawer
  const left = Math.max(12, Math.min(fitsBeside ? rect.right + 4 : rect.left, window.innerWidth - width - 12))
  const desiredTop = fitsBeside ? rect.top : rect.bottom + 4
  const top = Math.max(12, Math.min(desiredTop, window.innerHeight - height - 12))
  menu.style.left = `${left}px`
  menu.style.top = `${top}px`
  if (sub && main) {
    sub.style.width = `${Math.min(compact ? 300 : 200, window.innerWidth - 24)}px`
    const submenuWidth = sub.getBoundingClientRect().width
    const submenuHeight = sub.getBoundingClientRect().height
    const parentItem = main.querySelector('[data-planner-course-action="semesters"]')
    let mainRect = main.getBoundingClientRect()
    if (!compact && mainRect.right + submenuWidth + 14 > window.innerWidth && mainRect.left - submenuWidth - 2 < 12) {
      main.style.left = `${Math.max(12, window.innerWidth - mainRect.width - submenuWidth - 14)}px`
      mainRect = main.getBoundingClientRect()
    }
    const itemRect = parentItem.getBoundingClientRect()
    const submenuLeft = mainRect.right + submenuWidth + 14 <= window.innerWidth
      ? mainRect.right + 2 : Math.max(12, mainRect.left - submenuWidth - 2)
    sub.style.left = `${compact ? left : submenuLeft}px`
    sub.style.top = `${Math.max(12, Math.min(compact ? top : itemRect.top, window.innerHeight - submenuHeight - 12))}px`
    if (compact) main.hidden = true
  }
  anchor.setAttribute('aria-expanded', 'true')
  if (focus) focusPlannerMenuItem(sub || main)
}

function openPlannerCourseMenu(anchor, { onlySemesters = false, focus = true } = {}) {
  closePlannerCourseMenu()
  closePlannerAvailableFilters()
  const courseId = anchor.dataset.plannerMenuToggle || anchor.dataset.courseId
  const placement = findPlannerItem(courseId)
  const course = findPlannerCourse(courseId)
  if (!course) return
  plannerCourseMenu = {
    courseId,
    anchor,
    semester: placement?.semester || Number(anchor.dataset.semester) || course.available[0] || CURRENT_SEMESTER,
    fromDrawer: anchor.hasAttribute('data-course-action-drawer'),
    submenu: onlySemesters,
    onlySemesters,
  }
  renderPlannerCourseMenu({ focus })
}

function handlePlannerCourseAction(button) {
  const action = button.dataset.plannerCourseAction
  const courseId = button.dataset.courseId
  if (button.disabled) return
  if (action === 'semesters') {
    if (plannerCourseMenu && !button.hasAttribute('data-course-action-drawer')) {
      plannerCourseMenu.submenu = true
      renderPlannerCourseMenu({ focus: true })
    } else openPlannerCourseMenu(button, { onlySemesters: true })
    return
  }
  const fromDrawer = button.hasAttribute('data-course-action-drawer')
  const drawerSource = fromDrawer ? root.querySelector('.course-drawer')?.dataset.courseSource : undefined
  const semester = Number(button.dataset.semester)
  closePlannerCourseMenu({ restoreFocus: action === 'about' })
  if (action === 'about') return openPlannerCourseDrawer(courseId, { semester })
  if (!applyPlannerCourseAction(courseId, action, Number(button.dataset.targetSemester))) return
  const placement = findPlannerItem(courseId)
  const focusSelector = placement ? `[data-planner-course="${courseId}"] [data-planner-menu-toggle]` : `[data-planner-group-toggle="current"][data-semester="${semester}"]`
  const refresh = () => {
    renderPlannerPanel({ focusSelector: fromDrawer ? undefined : focusSelector })
    renderCatalogPanel()
    if (fromDrawer) previouslyFocused = root.querySelector(focusSelector) || root.querySelector('[data-study-tab="planner"]')
  }
  if (fromDrawer && action === 'remove') closeDialog(refresh)
  else {
    refresh()
    if (fromDrawer) openPlannerCourseDrawer(courseId, { refresh: true, focusSelector: `[data-planner-course-action="${action === 'completed' ? 'completed' : 'semesters'}"]`, semester, source: drawerSource })
  }
}

function renderPlannerAvailableGroup(semester, { focusSelector } = {}) {
  const group = root.querySelector(`[data-planner-course-group="available-${semester}"]`)
  const content = group?.querySelector('.planner-course-group__panel-inner')
  if (!content) return
  content.innerHTML = plannerAvailableCoursesTemplate(semester)
  const openField = content.querySelector('.ui-multiselect.is-open')
  if (openField) positionPlannerFilterOptions(openField)
  if (focusSelector) content.querySelector(focusSelector)?.focus({ preventScroll: true })
}

function positionPlannerFilterOptions(field) {
  const options = field.querySelector('.ui-multiselect__options')
  if (!options || options.hidden) return
  const rect = options.getBoundingClientRect()
  if (rect.right > window.innerWidth - 12) options.style.left = `${window.innerWidth - 12 - rect.right}px`
  if (rect.bottom > window.innerHeight - 12) {
    const anchor = field.getBoundingClientRect()
    const below = window.innerHeight - anchor.bottom - 16
    const above = anchor.top - 16
    if (above > below) {
      options.style.top = 'auto'
      options.style.bottom = 'calc(100% + 4px)'
      options.style.maxHeight = `${Math.min(280, Math.max(32, above))}px`
    } else options.style.maxHeight = `${Math.min(280, Math.max(32, below))}px`
  }
}

function closePlannerAvailableFilters() {
  plannerAvailableFilterOpen = null
  root.querySelectorAll('[data-ui-multiselect^="planner-available-"]').forEach((field) => {
    field.classList.remove('is-open')
    field.querySelector('.ui-multiselect__trigger')?.setAttribute('aria-expanded', 'false')
    const options = field.querySelector('.ui-multiselect__options')
    if (options) options.hidden = true
  })
}

function findPlannerItem(courseId) {
  for (const [semester, items] of Object.entries(plannerState.semesters)) {
    const index = items.findIndex((item) => item.id === courseId)
    if (index >= 0) return { semester: Number(semester), index, item: items[index] }
  }
  return null
}

function isPlannerSemesterCompleted(semester) {
  if (semester < CURRENT_SEMESTER) return true
  const items = plannerState.semesters[semester] || []
  return items.length > 0 && items.every((item) => item.completed)
}

function canMoveToPlannerSemester(semester) {
  return Number.isInteger(semester)
    && semester >= CURRENT_SEMESTER
    && semester <= 8
    && !isPlannerSemesterCompleted(semester)
}

function movePlannerCourse(courseId, targetSemester, targetIndex) {
  const source = findPlannerItem(courseId)
  const course = findPlannerCourse(courseId)
  if (!source || !course || !course.available.includes(targetSemester) || !canMoveToPlannerSemester(targetSemester)) return false
  if (isPlannerSemesterCompleted(source.semester)) return false

  plannerState.semesters[source.semester].splice(source.index, 1)
  const destination = plannerState.semesters[targetSemester]
  const insertionIndex = Number.isInteger(targetIndex) ? Math.min(Math.max(targetIndex, 0), destination.length) : destination.length
  destination.splice(insertionIndex, 0, source.item)
  plannerState.collapsedSemesters = plannerState.collapsedSemesters.filter((semester) => semester !== targetSemester)
  plannerState.collapsedCourseGroups = plannerState.collapsedCourseGroups.filter((semester) => semester !== targetSemester)
  savePlannerState()
  return true
}

function openPlannerResetDialog(semester = null) {
  previouslyFocused = document.activeElement
  const resetDescription = semester
    ? 'Все необязательные курсы будут удалены из семестра. Сброс нельзя будет отменить.'
    : 'Все необязательные курсы будут удалены из плана. Сброс нельзя будет отменить.'

  document.querySelector('#modal-root').innerHTML = `
    <div class="modal-backdrop" role="presentation">
      <div class="goal-dialog goal-dialog--sm planner-dialog planner-reset-dialog" role="alertdialog" aria-modal="true" aria-labelledby="planner-reset-title" aria-describedby="planner-reset-description" tabindex="-1">
        ${controlButton({ className: 'goal-dialog__close', content: icon('close.svg', 20), attributes: 'aria-label="Закрыть"' })}
        <div class="goal-dialog__header">
          <h2 id="planner-reset-title">Сбросить курсы?</h2>
          <p class="goal-dialog__lead" id="planner-reset-description">${resetDescription}</p>
        </div>
        <div class="goal-dialog__actions">
          ${controlButton({ className: 'flat-button flat-button--neutral flat-button--text', content: 'Отмена', attributes: 'data-close-dialog' })}
          ${controlButton({ className: 'flat-button flat-button--danger', content: 'Сбросить', attributes: `data-planner-reset-confirm ${semester ? `data-semester="${semester}"` : ''}` })}
        </div>
      </div>
    </div>`
  setModalState(true)
  document.querySelector('.planner-dialog').focus()
}

function openPlannerCourseDrawer(courseId, { refresh = false, focusSelector, semester = null, source = null } = {}) {
  const course = findPlannerCourse(courseId)
  const placement = findPlannerItem(courseId)
  if (!course) return

  const prerequisiteTitles = course.prerequisiteNames
  const corequisiteTitles = course.corequisiteNames
  const postrequisiteTitles = plannerCourses
    .filter((item) => item.prerequisites.includes(courseId))
    .map((item) => item.title)
  const hasConflict = placement ? courseHasConflict(courseId, placement.semester) : false
  const unavailable = placement ? !course.available.includes(placement.semester) : false
  const conditionTitles = [...prerequisiteTitles, ...corequisiteTitles]
  const relationRows = (names) => names.map((title) => {
    const relatedId = resolveRelatedCourseIds(course, [title])[0]
    const prerequisitePlacement = relatedId ? findPlannerItem(relatedId) : null
    const completed = Boolean(prerequisitePlacement?.item.completed)
    return `<li class="course-drawer__relation ${completed ? 'is-complete' : 'is-missing'}"><img src="${ASSET}${completed ? 'course-drawer-prerequisite-complete.svg' : 'course-drawer-warning.svg'}" width="20" height="20" alt="">${title}</li>`
  }).join('')
  const prerequisiteRows = relationRows(prerequisiteTitles)
  const corequisiteRows = relationRows(corequisiteTitles)
  const postrequisiteRows = postrequisiteTitles.map((title) => `<li class="course-drawer__relation"><img src="${ASSET}course-drawer-postrequisite.svg" width="20" height="20" alt="">${title}</li>`).join('')
  const drawerSource = source || (refresh ? document.querySelector('.course-drawer')?.dataset.courseSource : null) || (placement ? 'planner' : 'catalog')
  const contextSemester = placement?.semester || semester || course.available.find((value) => canMoveToPlannerSemester(value)) || course.available[0] || CURRENT_SEMESTER
  const previousScroll = refresh ? document.querySelector('.course-drawer__scroll')?.scrollTop || 0 : 0
  if (!refresh) previouslyFocused = document.activeElement
  document.querySelector('#modal-root').innerHTML = `
    <div class="modal-backdrop modal-backdrop--sheet${refresh ? ' is-refresh' : ''}" role="presentation">
      <aside class="course-drawer${refresh ? ' is-refresh' : ''}" data-course-id="${courseId}" data-course-source="${drawerSource}" role="dialog" aria-modal="true" aria-label="О курсе: ${course.title}" aria-describedby="course-drawer-description" tabindex="-1">
        ${controlButton({ className: 'goal-dialog__close course-drawer__close', content: icon('course-drawer-close.svg', 24), attributes: 'aria-label="Закрыть" data-close-dialog' })}
        <header class="course-drawer__header">
          <h2 id="course-drawer-title">О курсе</h2>
          <p id="course-drawer-description">${course.title}</p>
          ${placement?.item.completed ? completedCourseBadge() : ''}
          <img class="course-drawer__character" src="${ASSET}course-drawer-character.png" width="198" height="208" alt="">
        </header>
        <div class="course-drawer__content">
          <div class="course-drawer__scroll">
            ${hasConflict ? `<div class="course-drawer__warning" role="status">
              ${icon('course-drawer-warning.svg', 20)}
              <div><strong>${unavailable ? `Курс недоступен в ${placement.semester}-м семестре` : 'Не все условия выполнены'}</strong><p>${conditionTitles.length ? `Проверь: ${conditionTitles.join(', ')}` : `Доступные семестры: ${course.available.join(', ')}`}</p></div>
            </div>` : ''}
            <a class="course-drawer__syllabus" href="${course.handbookUrl}" target="_blank" rel="noreferrer">
              <div><span>Актуальный силлабус</span><strong>Открыть в хэндбуке</strong></div>
              <img src="${ASSET}course-drawer-cap.png" width="124" height="76" alt="">
            </a>
            <section class="course-drawer__section">
              <h3>Описание</h3>
              <p>${course.description}</p>
            </section>
            <dl class="course-drawer__facts">
              <div><dt>Поток</dt><dd>${course.cohort}</dd></div>
              <div><dt>Тип курса</dt><dd><span class="course-drawer__badge course-drawer__badge--type">${course.category}</span></dd></div>
              <div><dt>Школа</dt><dd>${course.school}</dd></div>
              <div><dt>Специализация</dt><dd><ul class="course-drawer__specializations">${course.specializations.map((item) => `<li><img src="${ASSET}course-drawer-list.svg" width="20" height="20" alt="">${item}</li>`).join('')}</ul></dd></div>
              ${course.level ? `<div><dt>Уровень</dt><dd>${course.level}</dd></div>` : ''}
              <div><dt>Сезон</dt><dd><span class="course-drawer__badge course-drawer__badge--season">${course.season}</span></dd></div>
              <div><dt>Доступные семестры</dt><dd>${course.available.map((semester) => `<span class="course-drawer__badge course-drawer__badge--semester">${semester} семестр</span>`).join(' ')}</dd></div>
              <div><dt>Академическая нагрузка</dt><dd>${course.workloadText}</dd></div>
            </dl>
            <section class="course-drawer__section">
              <h3>Пререквизиты</h3>
              ${prerequisiteRows ? `<ul class="course-drawer__relations">${prerequisiteRows}</ul>` : '<p>Нет</p>'}
            </section>
            <section class="course-drawer__section">
              <h3>Кореквизиты</h3>
              ${corequisiteRows ? `<ul class="course-drawer__relations">${corequisiteRows}</ul>` : '<p>Нет</p>'}
            </section>
            <section class="course-drawer__section">
              <h3>Постреквизиты</h3>
              ${postrequisiteRows ? `<ul class="course-drawer__relations">${postrequisiteRows}</ul>` : '<p>Нет</p>'}
            </section>
          </div>
          <footer class="course-drawer__footer">
            ${courseDrawerActionsTemplate(courseId, contextSemester, { source: drawerSource })}
          </footer>
        </div>
      </aside>
    </div>`
  setModalState(true)
  const drawer = document.querySelector('.course-drawer')
  drawer.querySelector('.course-drawer__scroll').scrollTop = previousScroll
  const focusTarget = focusSelector ? drawer.querySelector(focusSelector) : drawer
  ;(focusTarget && !focusTarget.disabled ? focusTarget : drawer).focus({ preventScroll: true })
}

function openPlannerTrajectoryDialog() {
  previouslyFocused = document.activeElement
  document.querySelector('#modal-root').innerHTML = `
    <div class="modal-backdrop" role="presentation">
      <div class="goal-dialog planner-dialog planner-trajectory-dialog" role="dialog" aria-modal="true" aria-labelledby="planner-trajectory-title" tabindex="-1">
        ${controlButton({ className: 'goal-dialog__close', content: icon('close.svg', 20), attributes: 'aria-label="Закрыть"' })}
        <div class="goal-dialog__header">
          <h2 id="planner-trajectory-title">Подбор траектории</h2>
          <p class="goal-dialog__lead">Распределим рекомендованные курсы по семестрам с учетом нагрузки и пререквизитов.</p>
        </div>
        <form class="planner-trajectory-form" data-planner-trajectory-form novalidate>
          ${fieldControl({ id: 'trajectory-specialization', label: 'Специализация*', placeholder: 'Выбери специализацию', options: Object.keys(trajectoryPresets), errorMessage: 'Выбери специализацию' })}
          ${fieldControl({ id: 'trajectory-load', label: 'Максимальная нагрузка*', placeholder: 'Выбери нагрузку', options: ['12 пар в неделю', '16 пар в неделю', '20 пар в неделю'], value: '16 пар в неделю', errorMessage: 'Выбери нагрузку' })}
          ${toggleControl({ inputAttributes: 'data-planner-keep-selection checked', label: 'Сохранить уже добавленные курсы' })}
          <div class="goal-dialog__actions">
            ${controlButton({ className: 'flat-button flat-button--neutral', content: 'Отмена', attributes: 'data-close-dialog' })}
            ${controlButton({ className: 'flat-button flat-button--primary', content: 'Собрать план', type: 'submit' })}
          </div>
        </form>
      </div>
    </div>`
  setModalState(true)
  document.querySelector('.planner-trajectory-dialog').focus()
}

function applyPlannerTrajectory(specialization, maxLoad, keepSelection) {
  if (!keepSelection) {
    for (let semester = CURRENT_SEMESTER; semester <= 8; semester += 1) {
      if (isPlannerSemesterCompleted(semester)) continue
      plannerState.semesters[semester] = plannerState.semesters[semester].filter((item) => item.fixed)
    }
  }

  const plannedIds = getPlannedCourseIds()
  for (const courseId of trajectoryPresets[specialization] || []) {
    if (plannedIds.has(courseId)) continue
    const course = findPlannerCourse(courseId)
    const target = course.available
      .filter((semester) => semester >= CURRENT_SEMESTER)
      .filter((semester) => !isPlannerSemesterCompleted(semester))
      .find((semester) => getSemesterLoad(semester) + course.workload <= maxLoad)
    if (!target) continue
    plannerState.semesters[target].push({ id: courseId, completed: false, fixed: false, generated: true })
    plannedIds.add(courseId)
  }

  savePlannerState()
}

function resetPlanner({ semester = null, keepCompleted = true } = {}) {
  if (semester) {
    if (isPlannerSemesterCompleted(semester)) return
    plannerState.semesters[semester] = plannerState.semesters[semester].filter((item) => item.fixed)
  } else if (keepCompleted) {
    for (let index = 1; index <= 8; index += 1) {
      plannerState.semesters[index] = plannerState.semesters[index].filter((item) => item.fixed || item.completed)
    }
  } else {
    const completedSemesters = new Map(
      Array.from({ length: 8 }, (_, index) => index + 1)
        .filter((index) => isPlannerSemesterCompleted(index))
        .map((index) => [index, plannerState.semesters[index]]),
    )
    plannerState = createDefaultPlannerState()
    for (let index = 1; index <= 8; index += 1) {
      plannerState.semesters[index] = completedSemesters.get(index)
        || plannerState.semesters[index].filter((item) => item.fixed)
    }
  }
  savePlannerState()
}

function activateStudyTab(tab, { focus = false } = {}) {
  const tablist = tab.closest('[data-study-tabs]')
  closePlannerCourseMenu()
  closePlannerAvailableFilters()
  const target = tab.dataset.studyTab

  tablist.querySelectorAll('[data-study-tab]').forEach((item) => {
    const active = item === tab
    item.classList.toggle('is-active', active)
    item.setAttribute('aria-selected', String(active))
    item.tabIndex = active ? 0 : -1
  })
  root.querySelectorAll('[data-study-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.studyPanel !== target
  })
  syncStudyTabIndicator(tablist)
  if (focus) tab.focus()
}

function updateStudyProgress() {
  const checkboxes = [...root.querySelectorAll('[data-study-task]')]
  if (!checkboxes.length) return

  const progress = new Set(checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value))
  const summary = getStudyProgressSummary(progress)
  saveStudyProgress(progress)

  root.querySelector('[data-study-percent]').textContent = `${summary.percent}%`
  root.querySelector('[data-study-stage-summary]').textContent = `${summary.completedStages} из ${studyStages.length} завершено`
  const completedBadge = root.querySelector('[data-study-completed-badge]')
  if (completedBadge) completedBadge.textContent = `${summary.completedStages}/${studyStages.length} завершено`

  const progressbar = root.querySelector('[data-study-progress]')
  progressbar.setAttribute('aria-valuenow', String(summary.percent))
  progressbar.querySelector('span').style.width = `${summary.percent}%`

  studyStages.forEach((stage) => {
    const completed = stage.tasks.filter((_, index) => progress.has(`${stage.id}-${index}`)).length
    root.querySelector(`[data-study-stage="${stage.id}"] [data-study-stage-count]`).textContent = `${completed} из ${stage.tasks.length}`
  })
}

function updateIndustryProgress() {
  const checkboxes = [...root.querySelectorAll('[data-industry-task]')]
  if (!checkboxes.length) return

  const progress = new Set(checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value))
  const summary = getIndustryProgressSummary(progress)
  saveIndustryProgress(progress)

  root.querySelector('[data-industry-percent]').textContent = `${summary.percent}%`
  root.querySelector('[data-industry-stage-summary]').textContent = `${summary.completedStages} из ${industryStages.length} завершено`

  const progressbar = root.querySelector('[data-industry-progress]')
  progressbar.setAttribute('aria-valuenow', String(summary.percent))
  progressbar.querySelector('span').style.width = `${summary.percent}%`

  industryStages.forEach((stage) => {
    const completed = stage.tasks.filter((_, index) => progress.has(`${stage.id}-${index}`)).length
    root.querySelector(`[data-industry-stage="${stage.id}"] [data-industry-stage-count]`).textContent = `${completed} из ${stage.tasks.length}`
  })
}

function restartScenario() {
  try {
    ;[ONBOARDING_KEY, GOAL_SELECTION_KEY, SAVED_GOALS_KEY, PENDING_GOAL_KEY, STUDY_PROGRESS_KEY, INDUSTRY_PROGRESS_KEY, VACANCY_STATE_KEY, APPLICATIONS_STORAGE_KEY, PORTFOLIO_PROFILES_STORAGE_KEY, GOAL_FORM_VALUES_KEY, PLANNER_STORAGE_KEY]
      .forEach((key) => window.localStorage.removeItem(key))
  } catch {
    // The scenario still restarts in memory when storage is unavailable.
  }

  plannerState = createDefaultPlannerState()
  vacancyState = { favorites: new Set(), applied: new Set() }
  applications = defaultApplications.map((item) => ({ ...item }))
  portfolioProfiles = []
  editingPortfolioProfileId = null
  portfolioDraftFiles = { resume: undefined, portfolio: undefined }
  portfolioDraftFileObjects = { resume: null, portfolio: null }
  portfolioFileObjects.clear()
  vacancySearch = ''
  vacancySalaryFrom = '0'
  vacancyFavoritesOnly = false
  vacancyFilters.clear()
  vacancyInternships = true
  vacancyPage = 1
  vacancyDirectionOpen = false
  vacancySelectedDirections.clear()
  catalogSearch = ''
  catalogDirections.clear()
  catalogSemesters.clear()
  catalogCategories.clear()
  catalogWorkloads.clear()
  catalogRequisites.clear()
  catalogStatuses.clear()
  catalogFilterOpen = null
  plannerAvailableFilters.clear()
  plannerAvailableLimits.clear()
  plannerAvailableFilterOpen = null
  closePlannerCourseMenu()
  collapsedCatalogGroups.clear()
  openGlossaryTerms.clear()
  requestedStudyTab = null
  requestedIndustryAction = null
  clearPlannerPointerDrag()
  setModalState(false)
  renderScreen('goals', { historyMode: 'replace' })
}

function closeSingleSelect(field) {
  field.classList.remove('is-open')
  field.querySelector('[data-ui-select-toggle]')?.setAttribute('aria-expanded', 'false')
  const menu = field.querySelector('.ui-select__options')
  if (menu) menu.hidden = true
}

function closeIndustryTaskTooltips(except = null) {
  root.querySelectorAll('[data-industry-task-pending]').forEach((button) => {
    if (button === except) return
    button.removeAttribute('aria-describedby')
    const tooltip = document.getElementById(button.getAttribute('aria-controls'))
    if (tooltip) tooltip.hidden = true
  })
}

function closeAllSingleSelects(except = null) {
  root.querySelectorAll('[data-ui-select].is-open').forEach((field) => {
    if (field !== except) closeSingleSelect(field)
  })
}

const APPLICATION_MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const APPLICATION_WEEKDAYS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']

function parseApplicationDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '')
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null
}

function applicationDateValue(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function renderApplicationDatePicker(field) {
  const input = field.querySelector('[data-ui-field]')
  const selected = parseApplicationDate(input.value)
  const initial = selected || new Date()
  const [cursorYear, cursorMonth] = (field.dataset.uiDateMonth || `${initial.getFullYear()}-${initial.getMonth()}`)
    .split('-').map(Number)
  const first = new Date(cursorYear, cursorMonth, 1)
  const offset = (first.getDay() + 6) % 7
  const start = new Date(cursorYear, cursorMonth, 1 - offset)
  const days = Array.from({ length: 42 }, (_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index))
  const picker = field.querySelector('.ui-date-picker')

  field.dataset.uiDateMonth = `${cursorYear}-${cursorMonth}`
  picker.innerHTML = `
    <span class="ui-date-picker__header">
      ${controlButton({ className: 'ui-date-picker__nav', content: icon('application-chevron-left.svg', 24), attributes: 'aria-label="Предыдущий месяц" data-ui-date-month="-1"' })}
      <span class="ui-date-picker__title">${APPLICATION_MONTHS[cursorMonth]} ${cursorYear}</span>
      ${controlButton({ className: 'ui-date-picker__nav', content: icon('application-chevron-right.svg', 24), attributes: 'aria-label="Следующий месяц" data-ui-date-month="1"' })}
    </span>
    <span class="ui-date-picker__weekdays" aria-hidden="true">${APPLICATION_WEEKDAYS.map((day) => `<span class="ui-date-picker__weekday">${day}</span>`).join('')}</span>
    <span class="ui-date-picker__days">${days.map((date) => {
      const value = applicationDateValue(date)
      const outside = date.getMonth() !== cursorMonth
      const weekend = date.getDay() === 0 || date.getDay() === 6
      const isSelected = value === input.value
      return controlButton({
        className: `ui-date-picker__day ${outside ? 'is-outside' : ''} ${weekend ? 'is-weekend' : ''} ${isSelected ? 'is-selected' : ''}`.replace(/\s+/g, ' ').trim(),
        content: String(date.getDate()),
        attributes: `data-ui-date-day="${value}" aria-label="${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}"${isSelected ? ' aria-current="date"' : ''}`,
      })
    }).join('')}</span>`
}

function closeApplicationDatePicker(field) {
  field.classList.remove('is-date-open')
  field.querySelectorAll('[data-ui-date-toggle]').forEach((button) => button.setAttribute('aria-expanded', 'false'))
  const picker = field.querySelector('.ui-date-picker')
  if (picker) picker.hidden = true
}

function closeAllApplicationDatePickers(except = null) {
  root.querySelectorAll('[data-ui-date].is-date-open').forEach((field) => {
    if (field !== except) closeApplicationDatePicker(field)
  })
}

function closeVacancyDirectionSelect() {
  if (!vacancyDirectionOpen) return
  vacancyDirectionOpen = false
  const multiselect = root.querySelector('[data-ui-multiselect="vacancy-role"]')
  multiselect?.classList.remove('is-open')
  multiselect?.querySelector('.ui-multiselect__trigger')?.setAttribute('aria-expanded', 'false')
  const options = multiselect?.querySelector('.ui-multiselect__options')
  if (options) options.hidden = true
}

function closeCatalogFilters() {
  if (!catalogFilterOpen) return
  catalogFilterOpen = null
  root.querySelectorAll('[data-ui-multiselect^="catalog-"]').forEach((field) => {
    field.classList.remove('is-open')
    field.querySelector('.ui-multiselect__trigger')?.setAttribute('aria-expanded', 'false')
    const options = field.querySelector('.ui-multiselect__options')
    if (options) options.hidden = true
  })
}

root.addEventListener('click', (event) => {
  const statisticsToggle = event.target.closest('[data-planner-statistics-toggle]')
  if (statisticsToggle) {
    const expanded = statisticsToggle.getAttribute('aria-expanded') !== 'true'
    plannerState.statisticsCollapsed = !expanded
    savePlannerState()
    statisticsToggle.setAttribute('aria-expanded', String(expanded))
    const island = statisticsToggle.closest('.planner-statistics')
    island.classList.toggle('planner-statistics--expanded', expanded)
    const panel = island.querySelector('.planner-statistics__panel')
    panel.setAttribute('aria-hidden', String(!expanded))
    panel.inert = !expanded
    return
  }
  const courseMenuToggle = event.target.closest('[data-planner-menu-toggle]')
  if (courseMenuToggle) {
    if (plannerCourseMenu?.anchor === courseMenuToggle) closePlannerCourseMenu({ restoreFocus: true })
    else openPlannerCourseMenu(courseMenuToggle)
    return
  }
  const courseAction = event.target.closest('[data-planner-course-action]')
  if (courseAction) {
    handlePlannerCourseAction(courseAction)
    return
  }
  if (event.target.closest('[data-planner-menu-back]')) {
    plannerCourseMenu.submenu = false
    renderPlannerCourseMenu({ focus: true })
    return
  }
  const plannerFilterToggle = event.target.closest('[data-planner-filter-toggle]')
  if (plannerFilterToggle) {
    const semester = Number(plannerFilterToggle.dataset.plannerFilterToggle)
    const filter = plannerFilterToggle.dataset.filterName
    const wasOpen = plannerAvailableFilterOpen?.semester === semester && plannerAvailableFilterOpen.filter === filter
    closePlannerCourseMenu()
    closeCatalogFilters()
    closePlannerAvailableFilters()
    plannerAvailableFilterOpen = wasOpen ? null : { semester, filter }
    renderPlannerAvailableGroup(semester, { focusSelector: `[data-planner-filter-toggle="${semester}"][data-filter-name="${filter}"]` })
    return
  }
  const plannerFilterReset = event.target.closest('[data-planner-filter-reset]')
  if (plannerFilterReset) {
    const semester = Number(plannerFilterReset.dataset.plannerFilterReset)
    plannerAvailableFilters.set(semester, createCourseFilters())
    plannerAvailableLimits.set(semester, 8)
    closePlannerAvailableFilters()
    renderPlannerAvailableGroup(semester, { focusSelector: `[data-planner-filter-toggle="${semester}"]` })
    return
  }
  const availableMore = event.target.closest('[data-planner-available-more]')
  if (availableMore) {
    const semester = Number(availableMore.dataset.plannerAvailableMore)
    plannerAvailableLimits.set(semester, (plannerAvailableLimits.get(semester) || 8) + 8)
    renderPlannerAvailableGroup(semester, { focusSelector: `[data-planner-available-more="${semester}"]` })
    return
  }
  if (event.target.closest('[data-restart-scenario]')) {
    restartScenario()
    return
  }

  if (vacancyDirectionOpen && !event.target.closest('[data-ui-multiselect="vacancy-role"]')) {
    closeVacancyDirectionSelect()
  }

  const clickedSelect = event.target.closest('[data-ui-select]')
  closeAllSingleSelects(clickedSelect)

  const clickedDate = event.target.closest('[data-ui-date]')
  closeAllApplicationDatePickers(clickedDate)

  const dateClear = event.target.closest('[data-ui-date-clear]')
  if (dateClear) {
    const field = dateClear.closest('[data-ui-date]')
    const input = field.querySelector('[data-ui-field]')
    input.value = ''
    field.querySelector('[data-ui-date-value]').textContent = 'Выбери дату'
    field.querySelector('[data-ui-date-value]').classList.add('is-placeholder')
    dateClear.hidden = true
    closeApplicationDatePicker(field)
    input.dispatchEvent(new Event('change', { bubbles: true }))
    field.querySelector('[data-ui-date-toggle]').focus()
    return
  }

  const dateMonth = event.target.closest('[data-ui-date-month]')
  if (dateMonth) {
    const field = dateMonth.closest('[data-ui-date]')
    const [year, month] = field.dataset.uiDateMonth.split('-').map(Number)
    const next = new Date(year, month + Number(dateMonth.dataset.uiDateMonth), 1)
    field.dataset.uiDateMonth = `${next.getFullYear()}-${next.getMonth()}`
    renderApplicationDatePicker(field)
    field.querySelector(`[data-ui-date-month="${dateMonth.dataset.uiDateMonth}"]`)?.focus()
    return
  }

  const dateDay = event.target.closest('[data-ui-date-day]')
  if (dateDay) {
    const field = dateDay.closest('[data-ui-date]')
    const input = field.querySelector('[data-ui-field]')
    input.value = dateDay.dataset.uiDateDay
    field.querySelector('[data-ui-date-value]').textContent = formatApplicationDate(input.value)
    field.querySelector('[data-ui-date-value]').classList.remove('is-placeholder')
    field.querySelector('[data-ui-date-clear]').hidden = false
    closeApplicationDatePicker(field)
    input.dispatchEvent(new Event('change', { bubbles: true }))
    field.querySelector('[data-ui-date-toggle]').focus()
    return
  }

  const dateToggle = event.target.closest('[data-ui-date-toggle]')
  if (dateToggle) {
    const field = dateToggle.closest('[data-ui-date]')
    const open = !field.classList.contains('is-date-open')
    field.classList.toggle('is-date-open', open)
    field.querySelectorAll('[data-ui-date-toggle]').forEach((button) => button.setAttribute('aria-expanded', String(open)))
    const picker = field.querySelector('.ui-date-picker')
    picker.hidden = !open
    if (open) renderApplicationDatePicker(field)
    return
  }

  const selectToggle = event.target.closest('[data-ui-select-toggle]')
  if (selectToggle) {
    const field = selectToggle.closest('[data-ui-select]')
    const open = !field.classList.contains('is-open')
    field.classList.toggle('is-open', open)
    selectToggle.setAttribute('aria-expanded', String(open))
    field.querySelector('.ui-select__options').hidden = !open
    return
  }

  const selectOption = event.target.closest('[data-ui-select-option]')
  if (selectOption) {
    const field = selectOption.closest('[data-ui-select]')
    const select = field.querySelector('select')
    const trigger = field.querySelector('[data-ui-select-toggle]')
    if (select.disabled) return
    if (select.multiple) {
      const option = [...select.options].find((item) => item.value === selectOption.dataset.value)
      option.selected = !option.selected
    } else select.value = selectOption.dataset.value
    const selectedValues = new Set([...select.selectedOptions].map((option) => option.value))
    const displayValue = [...select.selectedOptions].map((option) => option.textContent).join(', ')
    trigger.querySelector('span:first-child').textContent = displayValue || trigger.dataset.placeholder
    trigger.querySelector('span:first-child').classList.toggle('is-placeholder', !displayValue)
    field.querySelectorAll('[data-ui-select-option]').forEach((option) => {
      const selected = selectedValues.has(option.dataset.value)
      option.classList.toggle('is-selected', selected)
      option.setAttribute('aria-selected', String(selected))
    })
    if (!select.multiple) closeSingleSelect(field)
    select.dispatchEvent(new Event('change', { bubbles: true }))
    if (!select.multiple) trigger.focus()
    return
  }

  const mobileMenuToggle = event.target.closest('.mobile-nav__menu-toggle')
  if (mobileMenuToggle) {
    const nav = mobileMenuToggle.closest('.mobile-nav')
    const active = nav.dataset.state !== 'active'
    nav.dataset.state = active ? 'active' : 'normal'
    mobileMenuToggle.setAttribute('aria-expanded', String(active))
  }

  if (event.target.closest('[data-start-onboarding]')) {
    renderScreen(getOnboarding().completed ? 'goal-selection' : 'work-experience')
    return
  }

  if (event.target.closest('[data-edit-onboarding], [data-edit-current-goal]')) {
    window.history.pushState({}, '', `${appRootPath}work-experience/?edit=onboarding`)
    renderScreen('work-experience', { historyMode: 'none' })
    return
  }

  const card = event.target.closest('.goal-card:not(:disabled)')
  if (card) {
    const selected = getGoalSelection()
    const id = card.dataset.goalId
    window.localStorage.setItem(GOAL_SELECTION_KEY, JSON.stringify(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]))
    root.querySelectorAll('.goal-card').forEach((item) => {
      const goal = goals.find((entry) => entry.id === item.dataset.goalId)
      const state = goalCardState(goal)
      item.classList.toggle('goal-card--selected', state.selected)
      item.setAttribute('aria-pressed', String(state.selected))
      item.disabled = state.unavailable
    })
    root.querySelector('[data-confirm-goal-selection]').disabled = !getGoalSelection().length
    root.querySelector(`[data-goal-id="${id}"]`)?.focus({ preventScroll: true })
    return
  }

  if (event.target.closest('[data-confirm-goal-selection]')) {
    if (commitGoalSelection()) renderScreen('my-goals')
    return
  }

  if (event.target.closest('[data-selection-back], [data-back-to-selection]')) {
    if (!getOnboarding().goalsChosen) {
      window.history.pushState({}, '', `${appRootPath}job-expectations/?edit=onboarding`)
      renderScreen('job-expectations', { historyMode: 'none' })
    } else renderScreen(getSavedGoals().length ? 'my-goals' : 'goals')
    return
  }

  const savedGoalButton = event.target.closest('[data-open-saved-goal]')
  if (savedGoalButton?.dataset.openSavedGoal === 'study') renderScreen('study-goal')
  if (savedGoalButton?.dataset.openSavedGoal === 'industry') renderScreen('industry-goal')

  const deleteCurrentGoal = event.target.closest('[data-delete-current-goal]')
  if (deleteCurrentGoal) {
    const goal = goals.find((item) => item.id === deleteCurrentGoal.dataset.deleteCurrentGoal)
    if (goal) openGoalDeleteDialog(goal)
    return
  }

  const confirmGoalDelete = event.target.closest('[data-delete-current-goal-confirm]')
  if (confirmGoalDelete) {
    const goal = goals.find((item) => item.id === confirmGoalDelete.dataset.deleteCurrentGoalConfirm)
    if (!goal) return
    try {
      saveOnboarding(getOnboarding())
      const remaining = getSavedGoalIds().filter((id) => id !== goal.id)
      window.localStorage.setItem(SAVED_GOALS_KEY, JSON.stringify(remaining))
      if (window.localStorage.getItem(PENDING_GOAL_KEY) === goal.id) window.localStorage.removeItem(PENDING_GOAL_KEY)
      window.localStorage.removeItem(goal.kind === 'study' ? STUDY_PROGRESS_KEY : INDUSTRY_PROGRESS_KEY)
      window.localStorage.removeItem(GOAL_SELECTION_KEY)
      if (goal.kind === 'study') {
        window.localStorage.removeItem(PLANNER_STORAGE_KEY)
        plannerState = createDefaultPlannerState()
      }
      if (!remaining.length) resetGoalJourney()
    } catch {
      // Keep navigation available even when storage is unavailable.
    }
    closeDialog(() => renderScreen(getSavedGoals().length ? 'my-goals' : 'goals'))
    return
  }

  const studyTab = event.target.closest('[data-study-tab]')
  if (studyTab) {
    vacancyDirectionOpen = false
    applicationFilterOpen = null
    activateStudyTab(studyTab)
  }

  const pendingIndustryTask = event.target.closest('[data-industry-task-pending]')
  if (pendingIndustryTask) {
    const tooltipId = pendingIndustryTask.getAttribute('aria-controls')
    const tooltip = document.getElementById(tooltipId)
    closeIndustryTaskTooltips(pendingIndustryTask)
    if (tooltip) {
      tooltip.hidden = !tooltip.hidden
      if (tooltip.hidden) pendingIndustryTask.removeAttribute('aria-describedby')
      else pendingIndustryTask.setAttribute('aria-describedby', tooltipId)
    }
    return
  }

  if (event.target.closest('[data-portfolio-add]')) {
    openPortfolioProfileEditor()
    return
  }

  const portfolioEdit = event.target.closest('[data-portfolio-edit]')
  if (portfolioEdit) {
    openPortfolioProfileEditor(portfolioProfiles.find((profile) => profile.id === portfolioEdit.dataset.portfolioEdit))
    return
  }

  const portfolioDelete = event.target.closest('[data-portfolio-delete]')
  if (portfolioDelete) {
    const profile = portfolioProfiles.find((item) => item.id === portfolioDelete.dataset.portfolioDelete)
    if (profile) openPortfolioDeleteDialog(profile)
    return
  }

  const portfolioDeleteConfirm = event.target.closest('[data-portfolio-delete-confirm]')
  if (portfolioDeleteConfirm) {
    const deletedId = portfolioDeleteConfirm.dataset.portfolioDeleteConfirm
    const wasPrimary = portfolioProfiles.find((profile) => profile.id === deletedId)?.primary
    portfolioProfiles = portfolioProfiles.filter((profile) => profile.id !== deletedId)
    portfolioFileObjects.delete(`${deletedId}:resume`)
    portfolioFileObjects.delete(`${deletedId}:portfolio`)
    if (wasPrimary && portfolioProfiles.length === 1) portfolioProfiles[0].primary = true
    savePortfolioProfiles()
    closeDialog(() => renderPortfolioPanel({ focusSelector: '[data-portfolio-add]' }))
    return
  }

  const portfolioDownload = event.target.closest('[data-portfolio-download]')
  if (portfolioDownload) {
    const key = `${portfolioDownload.dataset.portfolioDownload}:${portfolioDownload.dataset.portfolioFileKind}`
    const file = portfolioFileObjects.get(key)
    if (file) {
      const href = URL.createObjectURL(file)
      const link = document.createElement('a')
      link.href = href
      link.download = file.name
      link.click()
      URL.revokeObjectURL(href)
    }
    return
  }

  const portfolioFileClear = event.target.closest('[data-file-clear]')
  if (portfolioFileClear) {
    clearPortfolioFile(portfolioFileClear.closest('[data-file-control]'))
    return
  }

  const applicationFilterToggle = event.target.closest('[data-application-filter-toggle]')
  if (applicationFilterToggle) {
    const filter = applicationFilterToggle.dataset.applicationFilterToggle
    applicationFilterOpen = applicationFilterOpen === filter ? null : filter
    renderApplicationsPanel({ focusSelector: `[data-application-filter-toggle="${filter}"]` })
    return
  }

  if (event.target.closest('[data-application-filter-reset]')) {
    Object.values(applicationFilters).forEach((selected) => selected.clear())
    applicationFilterOpen = null
    applicationPage = 1
    renderApplicationsPanel({ focusSelector: '[data-application-filter-toggle="company"]' })
    return
  }

  if (event.target.closest('[data-application-add]')) {
    openApplicationDrawer()
    return
  }

  const applicationEdit = event.target.closest('[data-application-edit]')
  if (applicationEdit) {
    openApplicationDrawer(applications.find((item) => item.id === applicationEdit.dataset.applicationEdit))
    return
  }

  const applicationPageButton = event.target.closest('[data-application-page]')
  if (applicationPageButton) {
    applicationPage = Number(applicationPageButton.dataset.applicationPage)
    renderApplicationsPanel({ focusSelector: `[data-application-page="${applicationPage}"]` })
    return
  }

  if (event.target.closest('[data-vacancy-direction-toggle]')) {
    vacancyDirectionOpen = !vacancyDirectionOpen
    renderVacanciesPanel({ focusSelector: '[data-vacancy-direction-toggle]' })
  }

  const vacancyOpen = event.target.closest('[data-vacancy-open]')
  if (vacancyOpen) {
    selectedVacancyId = vacancyOpen.dataset.vacancyOpen
    renderScreen('vacancy')
    return
  }

  if (event.target.closest('[data-vacancy-add-profile]')) {
    closeDialog(() => {
      requestedStudyTab = 'portfolio'
      renderScreen('industry-goal')
    })
    return
  }

  const vacancyFavorite = event.target.closest('[data-vacancy-favorite]')
  if (vacancyFavorite) {
    const id = vacancyFavorite.dataset.vacancyFavorite
    if (vacancyState.favorites.has(id)) vacancyState.favorites.delete(id)
    else vacancyState.favorites.add(id)
    saveVacancyState()
    const favorite = vacancyState.favorites.has(id)
    vacancyFavorite.classList.toggle('is-active', favorite)
    vacancyFavorite.setAttribute('aria-pressed', String(favorite))
    vacancyFavorite.setAttribute('aria-label', favorite ? 'Удалить из избранного' : 'Добавить в избранное')
    if (vacancyFavoritesOnly && getScreenFromLocation() !== 'vacancy') {
      renderVacanciesPanel({ focusSelector: '[data-vacancy-favorites-only]', preserveSearch: true })
    }
  }

  const vacancyApply = event.target.closest('[data-vacancy-apply]')
  if (vacancyApply) {
    const id = vacancyApply.dataset.vacancyApply
    if (!vacancyState.applied.has(id)) openVacancyApplicationDialog(vacancies.find((item) => item.id === id))
    return
  }

  if (event.target.closest('[data-vacancy-favorites-only]')) {
    vacancyFavoritesOnly = !vacancyFavoritesOnly
    vacancyPage = 1
    renderVacanciesPanel({ focusSelector: '[data-vacancy-favorites-only]', preserveSearch: true })
  }

  const vacancyFilter = event.target.closest('[data-vacancy-filter]')
  if (vacancyFilter) {
    const value = vacancyFilter.dataset.vacancyFilter
    if (vacancyFilters.has(value)) vacancyFilters.delete(value)
    else vacancyFilters.add(value)
    vacancyPage = 1
    renderVacanciesPanel({ focusSelector: `[data-vacancy-filter="${value}"]` })
  }

  if (event.target.closest('[data-vacancy-reset]')) {
    vacancySearch = ''
    vacancySalaryFrom = '0'
    vacancyFavoritesOnly = false
    vacancyFilters.clear()
    vacancyInternships = true
    vacancySelectedDirections.clear()
    vacancyDirectionOpen = false
    vacancyPage = 1
    renderVacanciesPanel({ focusSelector: '[data-vacancy-search]' })
  }

  const vacancyPageButton = event.target.closest('[data-vacancy-page]:not(:disabled)')
  if (vacancyPageButton) {
    vacancyPage = Number(vacancyPageButton.dataset.vacancyPage)
    renderVacanciesPanel({ focusSelector: `[data-vacancy-page="${vacancyPage}"]` })
    root.querySelector('[data-study-panel="vacancies"]')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const plannerCourseOpen = event.target.closest('[data-planner-course-open]')
  if (plannerCourseOpen && performance.now() < suppressPlannerCourseClickUntil) {
    event.preventDefault()
    return
  }
  if (plannerCourseOpen) openPlannerCourseDrawer(plannerCourseOpen.dataset.plannerCourseOpen, { source: plannerCourseOpen.closest('[data-planner-picker-course]') ? 'catalog' : 'planner', semester: Number(plannerCourseOpen.closest('[data-planner-semester]')?.dataset.plannerSemester) || null })

  const catalogCourseOpen = event.target.closest('[data-catalog-course-open]')
  if (catalogCourseOpen) openPlannerCourseDrawer(catalogCourseOpen.dataset.catalogCourseOpen, { source: 'catalog' })

  const catalogGroupToggle = event.target.closest('[data-catalog-group-toggle]')
  if (catalogGroupToggle) {
    const category = decodeURIComponent(catalogGroupToggle.dataset.catalogGroupToggle)
    const group = catalogGroupToggle.closest('[data-catalog-course-group]')
    const expanded = collapsedCatalogGroups.has(category)
    if (expanded) collapsedCatalogGroups.delete(category)
    else collapsedCatalogGroups.add(category)
    group?.classList.toggle('catalog-course-list--expanded', expanded)
    catalogGroupToggle.setAttribute('aria-expanded', String(expanded))
    const panel = group?.querySelector('.catalog-course-list__panel')
    if (panel) {
      panel.setAttribute('aria-hidden', String(!expanded))
      panel.inert = !expanded
    }
  }

  const catalogFilterToggle = event.target.closest('[data-catalog-filter-toggle]')
  if (catalogFilterToggle) {
    const filter = catalogFilterToggle.dataset.catalogFilterToggle
    catalogFilterOpen = catalogFilterOpen === filter ? null : filter
    renderCatalogPanel({ focusSelector: `[data-catalog-filter-toggle="${filter}"]` })
  }

  const catalogSemester = event.target.closest('[data-catalog-semester]')
  if (catalogSemester) {
    const semester = Number(catalogSemester.dataset.catalogSemester)
    if (catalogSemesters.has(semester)) catalogSemesters.delete(semester)
    else catalogSemesters.add(semester)
    renderCatalogPanel({ focusSelector: `[data-catalog-semester="${semester}"]` })
  }

  const catalogCategory = event.target.closest('[data-catalog-category]')
  if (catalogCategory) {
    const category = catalogCategory.dataset.catalogCategory
    if (catalogCategories.has(category)) catalogCategories.delete(category)
    else catalogCategories.add(category)
    renderCatalogPanel({ focusSelector: `[data-catalog-category="${category}"]` })
  }

  const catalogWorkload = event.target.closest('[data-catalog-workload]')
  if (catalogWorkload) {
    const workload = Number(catalogWorkload.dataset.catalogWorkload)
    if (catalogWorkloads.has(workload)) catalogWorkloads.delete(workload)
    else catalogWorkloads.add(workload)
    renderCatalogPanel({ focusSelector: `[data-catalog-workload="${workload}"]` })
  }

  if (event.target.closest('[data-catalog-reset]')) {
    catalogSearch = ''
    catalogDirections.clear()
    catalogSemesters.clear()
    catalogCategories.clear()
    catalogWorkloads.clear()
    catalogRequisites.clear()
    catalogStatuses.clear()
    catalogFilterOpen = null
    renderCatalogPanel({ focusSelector: '[data-catalog-search]' })
  }

  const glossaryToggle = event.target.closest('[data-glossary-toggle]')
  if (glossaryToggle) {
    const termId = glossaryToggle.dataset.glossaryToggle
    if (openGlossaryTerms.has(termId)) openGlossaryTerms.delete(termId)
    else openGlossaryTerms.add(termId)
    root.querySelectorAll('[data-glossary-term]').forEach((term) => {
      const expanded = openGlossaryTerms.has(term.dataset.glossaryTerm)
      const toggle = term.querySelector('[data-glossary-toggle]')
      const panel = term.querySelector('.glossary-term__panel')
      term.classList.toggle('glossary-term--expanded', expanded)
      toggle.setAttribute('aria-expanded', String(expanded))
      panel.setAttribute('aria-hidden', String(!expanded))
      panel.inert = !expanded
    })
  }

  const stageToggle = event.target.closest('[data-study-stage-toggle]')
  if (stageToggle) {
    const stage = stageToggle.closest('[data-study-stage]')
    const panel = stage.querySelector('.study-stage__panel')
    const expanded = stageToggle.getAttribute('aria-expanded') !== 'true'
    stageToggle.setAttribute('aria-expanded', String(expanded))
    stage.classList.toggle('study-stage--expanded', expanded)
    panel.setAttribute('aria-hidden', String(!expanded))
    panel.inert = !expanded
  }

  const industryStageToggle = event.target.closest('[data-industry-stage-toggle]')
  if (industryStageToggle) {
    const stage = industryStageToggle.closest('[data-industry-stage]')
    const panel = stage.querySelector('.study-stage__panel')
    const expanded = industryStageToggle.getAttribute('aria-expanded') !== 'true'
    industryStageToggle.setAttribute('aria-expanded', String(expanded))
    stage.classList.toggle('study-stage--expanded', expanded)
    panel.setAttribute('aria-hidden', String(!expanded))
    panel.inert = !expanded
  }

  const plannerSemesterToggle = event.target.closest('[data-planner-semester-toggle]')
  if (plannerSemesterToggle) {
    const semester = Number(plannerSemesterToggle.dataset.plannerSemesterToggle)
    const section = plannerSemesterToggle.closest('[data-planner-semester-section]')
    const wasCollapsed = plannerState.collapsedSemesters.includes(semester)
    const expanded = wasCollapsed
    plannerState.collapsedSemesters = wasCollapsed
      ? plannerState.collapsedSemesters.filter((value) => value !== semester)
      : [...plannerState.collapsedSemesters, semester]
    savePlannerState()
    if (section) {
      section.classList.toggle('planner-semester--expanded', expanded)
      section.querySelectorAll('[data-planner-semester-toggle]').forEach((toggle) => {
        toggle.setAttribute('aria-expanded', String(expanded))
        if (toggle.classList.contains('planner-semester__chevron-button')) {
          toggle.setAttribute('aria-label', `${expanded ? 'Свернуть' : 'Развернуть'} ${semester} семестр`)
        }
      })
      const panel = section.querySelector('.planner-semester__panel')
      if (panel) {
        panel.setAttribute('aria-hidden', String(!expanded))
        panel.inert = !expanded
      }
      const conflictsPanel = section.querySelector('.planner-semester__conflicts-panel')
      if (conflictsPanel) {
        conflictsPanel.setAttribute('aria-hidden', String(!expanded))
        conflictsPanel.inert = !expanded
      }
    }
  }

  const plannerGroupToggle = event.target.closest('[data-planner-group-toggle]')
  if (plannerGroupToggle) {
    const semester = Number(plannerGroupToggle.dataset.semester)
    const type = plannerGroupToggle.dataset.plannerGroupToggle
    const stateKey = type === 'available' ? 'collapsedAvailableGroups' : 'collapsedCourseGroups'
    const group = plannerGroupToggle.closest('[data-planner-course-group]')
    const wasCollapsed = plannerState[stateKey].includes(semester)
    const expanded = wasCollapsed
    plannerState[stateKey] = wasCollapsed
      ? plannerState[stateKey].filter((value) => value !== semester)
      : [...plannerState[stateKey], semester]
    savePlannerState()
    group?.classList.toggle('planner-course-group--expanded', expanded)
    plannerGroupToggle.setAttribute('aria-expanded', String(expanded))
    plannerGroupToggle.setAttribute('aria-label', `${expanded ? 'Свернуть' : 'Развернуть'} ${type === 'available' ? 'доступные курсы' : 'курсы семестра'}`)
    const panel = group?.querySelector('.planner-course-group__panel')
    if (panel) {
      panel.setAttribute('aria-hidden', String(!expanded))
      panel.inert = !expanded
    }
  }

  const plannerResetSemester = event.target.closest('[data-planner-reset-semester]')
  if (plannerResetSemester) {
    const semester = Number(plannerResetSemester.dataset.plannerResetSemester)
    if (!isPlannerSemesterCompleted(semester)) openPlannerResetDialog(semester)
  }

  if (event.target.closest('[data-planner-reset-all]')) openPlannerResetDialog()
  if (event.target.closest('[data-planner-trajectory]')) openPlannerTrajectoryDialog()

  const plannerResetConfirm = event.target.closest('[data-planner-reset-confirm]')
  if (plannerResetConfirm) {
    const semester = plannerResetConfirm.dataset.semester ? Number(plannerResetConfirm.dataset.semester) : null
    const keepCompleted = Boolean(semester)
    resetPlanner({ semester, keepCompleted })
    closeDialog(() => renderPlannerPanel({ focusSelector: semester ? `[data-planner-group-toggle="current"][data-semester="${semester}"]` : '[data-planner-reset-all]' }))
  }

  if (event.target.closest('[data-select-goal]')) {
    setPendingGoal(activeGoal)
    closeDialog(() => {
      renderScreen('work-experience')
    })
  }

  if (event.target.closest('[data-back-to-goals]')) {
    renderScreen(getOnboarding().completed ? 'my-goals' : 'goals')
  }

  if (event.target.closest('[data-back-to-work]')) {
    renderScreen('work-experience')
  }

  if (event.target.closest('[data-go-to-my-goals]')) {
    renderScreen('my-goals')
  }

  if (event.target.closest('[data-back-to-my-goals]')) {
    renderScreen('my-goals')
  }

  if (event.target.closest('[data-back-to-vacancies]')) {
    requestedStudyTab = 'vacancies'
    renderScreen('industry-goal')
  }

  if (event.target.closest('[data-back-to-portfolio]')) {
    returnToPortfolio()
    return
  }

  if (event.target.closest('[data-add-goal]')) {
    if (getSavedGoals().length >= MAX_GOALS) openGoalLimitDialog()
    else {
      window.localStorage.removeItem(GOAL_SELECTION_KEY)
      renderScreen(getOnboarding().completed ? 'goal-selection' : 'work-experience')
    }
  }

  if (event.target.closest('[data-close-dialog], .goal-dialog__close')) closeDialog()
  if (event.target.classList.contains('modal-backdrop')) closeDialog()
})

document.addEventListener('click', (event) => {
  if (!event.target.closest('[data-industry-task-pending]')) closeIndustryTaskTooltips()
  if (!event.target.closest('#planner-course-menu, [data-planner-menu-toggle], [data-planner-course-action="semesters"], [data-planner-menu-back]')) closePlannerCourseMenu()
  if (!event.target.closest('[data-ui-multiselect^="planner-available-"], [data-planner-filter-toggle]')) closePlannerAvailableFilters()
  if (!event.target.closest('[data-ui-select]')) closeAllSingleSelects()
  if (!event.target.closest('[data-ui-date]')) closeAllApplicationDatePickers()
  if (!event.target.closest('[data-ui-multiselect]')) closeVacancyDirectionSelect()
  if (!event.target.closest('[data-ui-multiselect^="catalog-"]')) closeCatalogFilters()
  if (!event.target.closest('[data-application-filter-toggle], [data-ui-multiselect^="application-"]') && applicationFilterOpen) {
    applicationFilterOpen = null
    root.querySelectorAll('[data-ui-multiselect^="application-"]').forEach((field) => {
      field.classList.remove('is-open')
      field.querySelector('.ui-multiselect__trigger')?.setAttribute('aria-expanded', 'false')
      const options = field.querySelector('.ui-multiselect__options')
      if (options) options.hidden = true
    })
  }
})

root.addEventListener('change', (event) => {
  if (event.target.matches('[data-vacancy-application-consent]')) {
    event.target.closest('.vacancy-apply-consent')?.classList.remove('is-error')
    event.target.setAttribute('aria-invalid', 'false')
  }
  if (event.target.matches('[data-ui-select-checkbox]')) {
    const field = event.target.closest('[data-ui-select]')
    const select = field.querySelector('select')
    const option = [...select.options].find((item) => item.value === event.target.value)
    if (select.disabled || !option) return
    option.selected = event.target.checked
    event.target.closest('.ui-select__option').classList.toggle('is-selected', event.target.checked)
    const trigger = field.querySelector('[data-ui-select-toggle]')
    const displayValue = [...select.selectedOptions].map((item) => item.textContent).join(', ')
    trigger.querySelector('span:first-child').textContent = displayValue || trigger.dataset.placeholder
    trigger.querySelector('span:first-child').classList.toggle('is-placeholder', !displayValue)
    select.dispatchEvent(new Event('change', { bubbles: true }))
    return
  }
  const plannerFilter = event.target.dataset.uiMultiselectOption?.match(/^planner-available-(\d+)-(.+)$/)
  if (plannerFilter) {
    const semester = Number(plannerFilter[1])
    const filter = plannerFilter[2]
    const target = getAvailableCourseFilters(semester)[filter]
    const value = ['semester', 'workload'].includes(filter) ? Number(event.target.value) : event.target.value
    if (event.target.checked) target.add(value)
    else target.delete(value)
    plannerAvailableLimits.set(semester, 8)
    plannerAvailableFilterOpen = { semester, filter }
    renderPlannerAvailableGroup(semester, { focusSelector: `[data-ui-multiselect-option="planner-available-${semester}-${filter}"][value="${CSS.escape(event.target.value)}"]` })
    return
  }
  if (event.target.matches('[data-study-task]')) updateStudyProgress()
  if (event.target.matches('[data-industry-task]')) updateIndustryProgress()

  if (event.target.matches('[data-profile-file-kind]')) {
    const field = event.target.closest('[data-file-control]')
    const file = event.target.files?.[0]
    if (file && !updatePortfolioFileControl(field, file)) event.target.value = ''
  }

  if (event.target.matches('[data-portfolio-primary]')) {
    const profileId = event.target.dataset.portfolioPrimary
    portfolioProfiles = portfolioProfiles.map((profile) => ({
      ...profile,
      primary: event.target.checked && profile.id === profileId,
    }))
    savePortfolioProfiles()
    renderPortfolioPanel({ focusSelector: `[data-portfolio-primary="${profileId}"]` })
    return
  }

  if (event.target.matches('[data-vacancy-internships]')) {
    vacancyInternships = event.target.checked
    vacancyPage = 1
    renderVacanciesPanel({ focusSelector: '[data-vacancy-internships]' })
  }
  if (event.target.matches('[data-vacancy-salary]')) {
    vacancySalaryFrom = event.target.value
    vacancyPage = 1
    renderVacanciesPanel({ focusSelector: '[data-ui-select-toggle="vacancy-salary"]' })
  }
  if (event.target.matches('[data-ui-multiselect-option="vacancy-role"]')) {
    if (event.target.checked) vacancySelectedDirections.add(event.target.value)
    else vacancySelectedDirections.delete(event.target.value)
    vacancyPage = 1
    vacancyDirectionOpen = true
    renderVacanciesPanel({ focusSelector: `[data-ui-multiselect-option="vacancy-role"][value="${event.target.value}"]` })
  }

  if (event.target.matches('[data-ui-multiselect-option^="catalog-"]')) {
    const filter = event.target.dataset.uiMultiselectOption.replace('catalog-', '')
    const target = {
      direction: catalogDirections,
      category: catalogCategories,
      semester: catalogSemesters,
      workload: catalogWorkloads,
      requisites: catalogRequisites,
      status: catalogStatuses,
    }[filter]
    const value = ['semester', 'workload'].includes(filter) ? Number(event.target.value) : event.target.value
    if (event.target.checked) target?.add(value)
    else target?.delete(value)
    catalogFilterOpen = filter
    renderCatalogPanel({ focusSelector: `[data-ui-multiselect-option="catalog-${filter}"][value="${event.target.value}"]` })
  }

  if (event.target.matches('[data-ui-multiselect-option^="application-"]')) {
    const filter = event.target.dataset.uiMultiselectOption.replace('application-', '')
    if (event.target.checked) applicationFilters[filter].add(event.target.value)
    else applicationFilters[filter].delete(event.target.value)
    applicationFilterOpen = filter
    applicationPage = 1
    renderApplicationsPanel({ focusSelector: `[data-ui-multiselect-option="application-${filter}"][value="${event.target.value}"]` })
  }

  if (event.target.matches('[data-planner-hide-completed]')) {
    plannerState.hideCompletedSemesters = event.target.checked
    savePlannerState()
    renderPlannerPanel({ focusSelector: '[data-planner-hide-completed]' })
  }

  if (event.target.matches('[data-planner-hide-progress]')) {
    plannerState.hideProgress = event.target.checked
    savePlannerState()
    renderPlannerPanel({ focusSelector: '[data-planner-hide-progress]' })
  }

  if (event.target.matches('[data-no-work]')) {
    root.querySelectorAll('[data-ui-field]').forEach((field) => {
      field.disabled = event.target.checked
      field.closest('[data-ui-select]')?.querySelector('[data-ui-select-toggle]')?.toggleAttribute('disabled', event.target.checked)
      field.closest('[data-ui-select]')?.querySelectorAll('[data-ui-select-checkbox]').forEach((checkbox) => { checkbox.disabled = event.target.checked })
      field.closest('.ui-field').classList.toggle('ui-field--disabled', event.target.checked)
      clearWorkFieldValidation(field)
    })
  }

  if (event.target.matches('[data-no-expectations]')) {
    closeAllSingleSelects()
    root.querySelectorAll('[data-ui-field]').forEach((field) => {
      field.disabled = event.target.checked
      field.closest('[data-ui-select]')?.querySelector('[data-ui-select-toggle]')?.toggleAttribute('disabled', event.target.checked)
      field.closest('[data-ui-select]')?.querySelectorAll('[data-ui-select-checkbox]').forEach((checkbox) => { checkbox.disabled = event.target.checked })
      field.closest('.ui-field').classList.toggle('ui-field--disabled', event.target.checked)
      clearWorkFieldValidation(field)
    })
  }

  if (event.target.matches('[data-ui-field]')) validateWorkField(event.target)
})

root.addEventListener('dragover', (event) => {
  const drop = event.target.closest('[data-file-drop]')
  if (!drop) return
  event.preventDefault()
  drop.classList.add('is-drag-over')
})

root.addEventListener('dragleave', (event) => {
  const drop = event.target.closest('[data-file-drop]')
  if (drop && !drop.contains(event.relatedTarget)) drop.classList.remove('is-drag-over')
})

root.addEventListener('drop', (event) => {
  const drop = event.target.closest('[data-file-drop]')
  if (!drop) return
  event.preventDefault()
  drop.classList.remove('is-drag-over')
  const file = event.dataTransfer?.files?.[0]
  if (file) updatePortfolioFileControl(drop.closest('[data-file-control]'), file)
})

root.addEventListener('input', (event) => {
  if (event.target.matches('[data-ui-field]')) validateWorkField(event.target)
  if (event.target.matches('[data-catalog-search]')) {
    catalogSearch = event.target.value
    const selectionStart = event.target.selectionStart
    renderCatalogPanel({ focusSelector: '[data-catalog-search]' })
    const search = root.querySelector('[data-catalog-search]')
    search?.setSelectionRange(selectionStart, selectionStart)
  }
  if (event.target.matches('[data-vacancy-search]')) {
    vacancySearch = event.target.value
    vacancyPage = 1
    const selectionStart = event.target.selectionStart
    renderVacanciesPanel({ focusSelector: '[data-vacancy-search]' })
    const search = root.querySelector('[data-vacancy-search]')
    search?.setSelectionRange(selectionStart, selectionStart)
  }
})

function validateWorkField(field) {
  const container = field.closest('.ui-field')
  const valid = field.disabled || !field.required || field.value.trim() !== ''
  field.classList.toggle('has-value', field.value.trim() !== '')
  container.classList.toggle('ui-field--error', !valid)
  field.setAttribute('aria-invalid', String(!valid))

  if (valid) field.removeAttribute('aria-describedby')
  else field.setAttribute('aria-describedby', `${field.id}-error`)

  const trigger = container.querySelector('[data-ui-select-toggle]')
  if (trigger) {
    trigger.setAttribute('aria-invalid', String(!valid))
    if (valid) trigger.removeAttribute('aria-describedby')
    else trigger.setAttribute('aria-describedby', `${field.id}-error`)
  }

  return valid
}

function clearWorkFieldValidation(field) {
  field.closest('.ui-field').classList.remove('ui-field--error')
  field.setAttribute('aria-invalid', 'false')
  field.removeAttribute('aria-describedby')
  const trigger = field.closest('.ui-field').querySelector('[data-ui-select-toggle]')
  trigger?.setAttribute('aria-invalid', 'false')
  trigger?.removeAttribute('aria-describedby')
}

function focusWorkField(field) {
  const selectTrigger = field.closest('[data-ui-select]')?.querySelector('[data-ui-select-toggle]')
  const dateTrigger = field.closest('[data-ui-date]')?.querySelector('[data-ui-date-toggle]')
  ;(selectTrigger || dateTrigger || field).focus()
}

root.addEventListener('submit', (event) => {
  if (event.target.matches('[data-vacancy-application-form]')) {
    event.preventDefault()
    const consent = event.target.querySelector('[data-vacancy-application-consent]')
    if (!consent?.checked) {
      consent?.closest('.vacancy-apply-consent')?.classList.add('is-error')
      consent?.setAttribute('aria-invalid', 'true')
      consent?.focus()
      return
    }
    const vacancyId = event.target.dataset.vacancyApplicationForm
    const vacancy = vacancies.find((item) => item.id === vacancyId)
    if (!vacancy) return
    const data = new FormData(event.target)
    const profileId = String(data.get('vacancy-application-profile') || '')
    const profile = portfolioProfiles.find((item) => item.id === profileId)
    const application = {
      id: `internal-${vacancyId}`,
      internal: true,
      vacancyId,
      company: vacancy.company,
      date: applicationDateValue(new Date()),
      status: 'Новый',
      position: vacancy.title,
      salary: normalizeApplicationSalary(vacancy.salary),
      source: 'ЦУ',
      link: '',
      contact: '',
      notes: '',
      profileId: profile?.id || null,
      profileName: profile?.name || '',
      coverLetter: String(data.get('vacancy-cover-letter') || '').trim(),
    }
    applications = [application, ...applications.filter((item) => item.vacancyId !== vacancyId)]
    vacancyState.applied.add(vacancyId)
    saveApplications()
    saveVacancyState()
    closeDialog(() => renderVacancyAfterApplication(vacancyId))
    return
  }

  if (event.target.matches('[data-portfolio-form]')) {
    event.preventDefault()
    const fields = [...event.target.querySelectorAll('[data-ui-field]')]
    const firstInvalid = fields.find((field) => !validateWorkField(field))
    const invalidFile = event.target.querySelector('.ui-file-field--error')
    if (firstInvalid) {
      focusWorkField(firstInvalid)
      return
    }
    if (invalidFile) {
      invalidFile.querySelector('input[type="file"]')?.focus()
      return
    }

    const data = new FormData(event.target)
    const existing = portfolioProfiles.find((profile) => profile.id === editingPortfolioProfileId)
    const id = existing?.id || `profile-${Date.now()}`
    const profile = {
      ...(existing || {}),
      id,
      name: String(data.get('profile-name') || '').trim(),
      description: String(data.get('profile-description') || '').trim(),
      resumeLink: String(data.get('profile-resume-link') || '').trim(),
      resumeFile: portfolioDraftFiles.resume === undefined ? existing?.resumeFile || null : portfolioDraftFiles.resume,
      portfolioLink: String(data.get('profile-portfolio-link') || '').trim(),
      portfolioFile: portfolioDraftFiles.portfolio === undefined ? existing?.portfolioFile || null : portfolioDraftFiles.portfolio,
      tone: existing?.tone || PORTFOLIO_PROFILE_TONES[portfolioProfiles.length % PORTFOLIO_PROFILE_TONES.length],
      primary: existing?.primary || portfolioProfiles.length === 0,
      createdAt: existing?.createdAt || Date.now(),
    }

    if (existing) portfolioProfiles = portfolioProfiles.map((item) => item.id === existing.id ? profile : item)
    else portfolioProfiles.push(profile)
    if (portfolioDraftFileObjects.resume) portfolioFileObjects.set(`${id}:resume`, portfolioDraftFileObjects.resume)
    if (portfolioDraftFileObjects.portfolio) portfolioFileObjects.set(`${id}:portfolio`, portfolioDraftFileObjects.portfolio)
    if (portfolioDraftFiles.resume === null) portfolioFileObjects.delete(`${id}:resume`)
    if (portfolioDraftFiles.portfolio === null) portfolioFileObjects.delete(`${id}:portfolio`)
    savePortfolioProfiles()
    returnToPortfolio()
    return
  }

  if (event.target.matches('[data-application-form]')) {
    event.preventDefault()
    const fields = [...event.target.querySelectorAll('[data-ui-field]')]
    const firstInvalid = fields.find((field) => !validateWorkField(field))
    if (firstInvalid) {
      focusWorkField(firstInvalid)
      return
    }
    const data = new FormData(event.target)
    const existing = applications.find((item) => item.id === editingApplicationId)
    const application = {
      ...(existing || {}),
      id: existing?.id || `external-${Date.now()}`,
      internal: Boolean(existing?.internal),
      vacancyId: existing?.vacancyId || null,
      company: existing?.internal ? existing.company : data.get('application-company'),
      date: existing?.internal ? existing.date : data.get('application-date'),
      status: data.get('application-status'),
      position: existing?.internal ? existing.position : data.get('application-position'),
      salary: existing?.internal ? normalizeApplicationSalary(existing.salary) : normalizeApplicationSalary(data.get('application-salary')),
      source: existing?.internal ? existing.source : 'Внешний источник',
      link: existing?.internal ? existing.link : data.get('application-link'),
      contact: data.get('application-contact'),
      notes: data.get('application-notes'),
    }
    if (existing) applications = applications.map((item) => item.id === existing.id ? application : item)
    else applications.unshift(application)
    saveApplications()
    closeDialog(() => renderApplicationsPanel({ focusSelector: `[data-application-edit="${application.id}"]` }))
    return
  }

  if (event.target.matches('[data-planner-trajectory-form]')) {
    event.preventDefault()
    const fields = [...event.target.querySelectorAll('[data-ui-field]')]
    const firstInvalid = fields.find((field) => !validateWorkField(field))
    if (firstInvalid) {
      focusWorkField(firstInvalid)
      return
    }

    const specialization = event.target.querySelector('#trajectory-specialization').value
    const maxLoad = Number.parseInt(event.target.querySelector('#trajectory-load').value, 10)
    const keepSelection = event.target.querySelector('[data-planner-keep-selection]').checked
    applyPlannerTrajectory(specialization, maxLoad, keepSelection)
    closeDialog(() => renderPlannerPanel({ focusSelector: '[data-planner-trajectory]' }))
    return
  }

  if (!event.target.matches('.work-form')) return
  event.preventDefault()

  const fields = [...event.target.querySelectorAll('[data-ui-field]')]
  let firstInvalid = null
  fields.forEach((field) => {
    if (!validateWorkField(field) && !firstInvalid) firstInvalid = field
  })
  if (firstInvalid) {
    focusWorkField(firstInvalid)
    return
  }

  saveGoalFormValues(event.target)

  if (event.target.dataset.onboardingStep === 'expectations') {
    const editing = isEditingOnboarding()
    saveOnboarding({ ...getOnboarding(), completed: true, ready: true })
    renderScreen(editing && getSavedGoals().length ? 'my-goals' : 'goal-selection')
    return
  }

  renderScreen('job-expectations')
})

window.addEventListener('popstate', () => {
  selectedVacancyId = new URLSearchParams(window.location.search).get('id')
  editingPortfolioProfileId = new URLSearchParams(window.location.search).get('id')
  if (getScreenFromLocation() === 'industry-goal') requestedStudyTab = new URLSearchParams(window.location.search).get('tab')
  requestedIndustryAction = new URLSearchParams(window.location.search).get('action')
  renderScreen(getScreenFromLocation(), { historyMode: 'none' })
})

document.addEventListener('focusin', (event) => {
  closeIndustryTaskTooltips(event.target.closest('[data-industry-task-pending]'))
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeIndustryTaskTooltips()
})

document.addEventListener('keydown', (event) => {
  const dialog = document.querySelector('[aria-modal="true"]')
  if (!dialog) return
  if (event.key === 'Escape') {
    const openDatePicker = dialog.querySelector('[data-ui-date].is-date-open')
    if (openDatePicker) {
      closeApplicationDatePicker(openDatePicker)
      openDatePicker.querySelector('[data-ui-date-toggle]')?.focus()
      return
    }
    const openSelect = dialog.querySelector('[data-ui-select].is-open')
    if (openSelect) {
      closeSingleSelect(openSelect)
      openSelect.querySelector('[data-ui-select-toggle]')?.focus()
      return
    }
    closeDialog()
    return
  }
  if (event.key !== 'Tab') return

  const focusable = [...dialog.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])')]
  if (!focusable.length) {
    event.preventDefault()
    dialog.focus()
    return
  }

  const first = focusable[0]
  const last = focusable.at(-1)
  if (!dialog.contains(document.activeElement)) {
    event.preventDefault()
    first.focus()
  } else if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
})

root.addEventListener('pointerdown', (event) => {
  if (event.button !== 0 || event.target.closest('.planner-course__footer, [data-planner-menu-toggle], #planner-course-menu')) return
  const card = event.target.closest('[data-planner-drag-handle]')
  if (!card) return
  closePlannerCourseMenu()
  const sourceSemester = Number(card.dataset.plannerSemester)
  if (sourceSemester && isPlannerSemesterCompleted(sourceSemester)) return

  const pickerCourseId = card.dataset.plannerPickerCourse
  pointerPlannerDrag = {
    id: pickerCourseId || card.dataset.plannerCourse,
    semester: pickerCourseId ? null : Number(card.dataset.plannerSemester),
    source: pickerCourseId ? 'picker' : 'semester',
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    offsetX: event.clientX - card.getBoundingClientRect().left,
    offsetY: event.clientY - card.getBoundingClientRect().top,
    active: false,
    card,
    preview: null,
  }
})

function clearPlannerPointerDrag() {
  pointerPlannerDrag?.card.classList.remove('is-dragging')
  pointerPlannerDrag?.preview?.remove()
  root.querySelectorAll('.is-drag-over').forEach((item) => item.classList.remove('is-drag-over'))
  document.body.classList.remove('is-planner-dragging')
  pointerPlannerDrag = null
}

function cancelPlannerPointerDrag() {
  const wasActive = Boolean(pointerPlannerDrag?.active)
  clearPlannerPointerDrag()
  if (wasActive) renderPlannerPanel()
}

root.addEventListener('pointermove', (event) => {
  if (!pointerPlannerDrag || event.pointerId !== pointerPlannerDrag.pointerId) return
  const distance = Math.hypot(event.clientX - pointerPlannerDrag.startX, event.clientY - pointerPlannerDrag.startY)
  if (!pointerPlannerDrag.active && distance < 6) return

  if (!pointerPlannerDrag.active) {
    pointerPlannerDrag.active = true
    document.body.classList.add('is-planner-dragging')
    pointerPlannerDrag.card.setPointerCapture?.(event.pointerId)
    pointerPlannerDrag.card.classList.add('is-dragging')
    const rect = pointerPlannerDrag.card.getBoundingClientRect()
    const preview = pointerPlannerDrag.card.cloneNode(true)
    preview.classList.remove('is-dragging')
    preview.classList.add('planner-course-drag-preview')
    preview.setAttribute('aria-hidden', 'true')
    preview.style.width = `${rect.width}px`
    preview.style.height = `${rect.height}px`
    document.body.append(preview)
    pointerPlannerDrag.preview = preview
  }
  event.preventDefault()

  pointerPlannerDrag.preview.style.transform = `translate3d(${event.clientX - pointerPlannerDrag.offsetX}px, ${event.clientY - pointerPlannerDrag.offsetY}px, 0) rotate(.4deg) scale(1.015)`

  const pointerTarget = document.elementFromPoint(event.clientX, event.clientY)
  const dropzone = pointerTarget?.closest('[data-planner-dropzone]')
  root.querySelectorAll('.is-drag-over').forEach((item) => item.classList.remove('is-drag-over'))
  if (!dropzone) return
  const course = findPlannerCourse(pointerPlannerDrag.id)
  const semester = Number(dropzone.dataset.plannerDropzone)
  if (!course || !course.available.includes(semester) || !canMoveToPlannerSemester(semester)) return
  dropzone.classList.add('is-drag-over')
})

root.addEventListener('pointerup', (event) => {
  if (!pointerPlannerDrag || event.pointerId !== pointerPlannerDrag.pointerId) return
  const drag = pointerPlannerDrag
  if (!drag.active) {
    clearPlannerPointerDrag()
    return
  }

  suppressPlannerCourseClickUntil = performance.now() + 500
  const pointerTarget = document.elementFromPoint(event.clientX, event.clientY)
  const dropzone = pointerTarget?.closest('[data-planner-dropzone]')
  if (!dropzone) {
    clearPlannerPointerDrag()
    renderPlannerPanel()
    return
  }
  const semester = Number(dropzone.dataset.plannerDropzone)
  const course = findPlannerCourse(drag.id)
  if (!course || !course.available.includes(semester) || !canMoveToPlannerSemester(semester)) {
    clearPlannerPointerDrag()
    renderPlannerPanel()
    return
  }

  const targetCard = pointerTarget.closest('[data-planner-course]')
  const targetIndex = targetCard ? Number(targetCard.dataset.plannerIndex) : undefined
  const courseId = drag.id
  let changed = false
  if (drag.source === 'picker') {
    if (canMoveToPlannerSemester(semester) && !getPlannedCourseIds().has(courseId)) {
      const destination = plannerState.semesters[semester]
      const insertionIndex = Number.isInteger(targetIndex) ? Math.min(Math.max(targetIndex, 0), destination.length) : destination.length
      destination.splice(insertionIndex, 0, { id: courseId, completed: false, fixed: false })
      plannerState.collapsedSemesters = plannerState.collapsedSemesters.filter((value) => value !== semester)
      plannerState.collapsedCourseGroups = plannerState.collapsedCourseGroups.filter((value) => value !== semester)
      savePlannerState()
      changed = true
    }
  } else {
    changed = movePlannerCourse(courseId, semester, targetIndex)
  }
  clearPlannerPointerDrag()
  if (changed) renderPlannerDropResult(courseId, semester)
  else renderPlannerPanel()
})

root.addEventListener('pointercancel', cancelPlannerPointerDrag)
window.addEventListener('blur', cancelPlannerPointerDrag)

root.addEventListener('keydown', (event) => {
  const menu = event.target.closest('#planner-course-menu [role="menu"]')
  if (menu && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Escape', 'Tab'].includes(event.key)) {
    event.preventDefault()
    event.stopPropagation()
    if (event.key === 'Escape' || event.key === 'Tab') return closePlannerCourseMenu({ restoreFocus: true })
    if (event.key === 'ArrowLeft') {
      if (plannerCourseMenu.submenu && !plannerCourseMenu.onlySemesters) {
        plannerCourseMenu.submenu = false
        renderPlannerCourseMenu()
        root.querySelector('#planner-course-context-menu [data-planner-course-action="semesters"]')?.focus()
      } else closePlannerCourseMenu({ restoreFocus: true })
      return
    }
    if (event.key === 'ArrowRight') {
      if (event.target.dataset.plannerCourseAction === 'semesters') handlePlannerCourseAction(event.target)
      return
    }
    const items = [...menu.querySelectorAll('[role="menuitem"]:not(:disabled)')]
    const current = items.indexOf(event.target)
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1
      : event.key === 'ArrowDown' ? (current + 1) % items.length : (current - 1 + items.length) % items.length
    items[index]?.focus({ preventScroll: true })
    return
  }
  const courseMenuToggle = event.target.closest('[data-planner-menu-toggle]')
  if (courseMenuToggle && !event.altKey && !event.ctrlKey && !event.metaKey && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
    event.preventDefault()
    openPlannerCourseMenu(courseMenuToggle)
    if (event.key === 'ArrowUp') focusPlannerMenuItem(root.querySelector('#planner-course-context-menu'), true)
    return
  }
  const availableFilter = event.target.closest('[data-ui-multiselect^="planner-available-"]')
  if (availableFilter && event.key === 'Escape') {
    event.preventDefault()
    closePlannerAvailableFilters()
    availableFilter.querySelector('.ui-multiselect__trigger').focus()
    return
  }
  const selectField = event.target.closest('[data-ui-select]')
  if (selectField?.querySelector('select')?.multiple) {
    const trigger = selectField.querySelector('[data-ui-select-toggle]')
    const options = [...selectField.querySelectorAll('[data-ui-select-option], [data-ui-select-checkbox]')]
    if (event.key === 'Escape') {
      event.preventDefault()
      closeSingleSelect(selectField)
      trigger.focus()
      return
    }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) && !trigger.disabled) {
      event.preventDefault()
      selectField.classList.add('is-open')
      trigger.setAttribute('aria-expanded', 'true')
      selectField.querySelector('.ui-select__options').hidden = false
      const current = options.indexOf(event.target)
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1
        : event.key === 'ArrowDown' ? (current + 1) % options.length
          : (current - 1 + options.length) % options.length
      options[index]?.focus()
      return
    }
  }

  const availableCourseHandle = event.target.closest('[data-planner-picker-course][data-planner-drag-handle]')
  if (availableCourseHandle && event.altKey && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    const courseId = availableCourseHandle.dataset.plannerPickerCourse
    const semester = Number(availableCourseHandle.dataset.plannerSemester)
    const course = findPlannerCourse(courseId)
    if (!course || !canMoveToPlannerSemester(semester) || getPlannedCourseIds().has(courseId)) return
    event.preventDefault()
    plannerState.semesters[semester].push({ id: courseId, completed: false, fixed: false })
    plannerState.collapsedSemesters = plannerState.collapsedSemesters.filter((value) => value !== semester)
    plannerState.collapsedCourseGroups = plannerState.collapsedCourseGroups.filter((value) => value !== semester)
    savePlannerState()
    renderPlannerDropResult(courseId, semester)
    return
  }

  const courseHandle = event.target.closest('[data-planner-course][data-planner-drag-handle]')
  if (courseHandle && event.altKey && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    const card = courseHandle.closest('[data-planner-course]')
    const source = findPlannerItem(card.dataset.plannerCourse)
    const course = findPlannerCourse(card.dataset.plannerCourse)
    if (!source || !course) return

    event.preventDefault()
    let targetSemester = source.semester
    let targetIndex
    if (event.key === 'ArrowLeft') targetIndex = Math.max(0, source.index - 1)
    if (event.key === 'ArrowRight') targetIndex = Math.min(plannerState.semesters[source.semester].length - 1, source.index + 1)
    const eligible = (semester) => course.available.includes(semester) && canMoveToPlannerSemester(semester)
    if (event.key === 'ArrowUp') targetSemester = Array.from({ length: source.semester - CURRENT_SEMESTER }, (_, index) => source.semester - index - 1).find(eligible) ?? source.semester
    if (event.key === 'ArrowDown') targetSemester = Array.from({ length: 8 - source.semester }, (_, index) => source.semester + index + 1).find(eligible) ?? source.semester

    if (targetSemester !== source.semester || (Number.isInteger(targetIndex) && targetIndex !== source.index)) {
      movePlannerCourse(course.id, targetSemester, targetIndex)
      renderPlannerDropResult(course.id, targetSemester)
    }
    return
  }

  const tab = event.target.closest('[data-study-tab]')
  if (!tab || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return

  event.preventDefault()
  const tabs = [...tab.closest('[data-study-tabs]').querySelectorAll('[data-study-tab]')]
  const currentIndex = tabs.indexOf(tab)
  let nextIndex = currentIndex
  if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
  if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length
  if (event.key === 'Home') nextIndex = 0
  if (event.key === 'End') nextIndex = tabs.length - 1
  activateStudyTab(tabs[nextIndex], { focus: true })
})

window.addEventListener('resize', () => syncStudyTabIndicator(root.querySelector('[data-study-tabs]'), { animate: false }))
window.addEventListener('resize', () => closePlannerCourseMenu())
document.addEventListener('scroll', (event) => {
  if (plannerCourseMenu && !event.target.closest?.('#planner-course-menu')) closePlannerCourseMenu()
}, true)
