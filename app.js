import { checkboxControl, chipControl, controlButton, fieldControl, multiSelectControl, tabControl, toggleControl } from './components/controls.js?v=10'
import { COURSE_CATALOG_SOURCE, courseCatalog } from './courses.js?v=2'

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
const PLANNER_STORAGE_KEY = 'cpk:study-planner-autumn-2026'
const CURRENT_SEMESTER = 3
const PLANNER_COURSE_TARGET = 24
const PLANNER_CREDIT_TARGET = 60
const CAREER_SALARY_OPTIONS = ['До 50 000', '50 000–100 000', '100 000–200 000', 'Более 200 000']

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
      ['Узнать, какие возможности у меня есть', 'Изучи материалы карьерного трека в хэндбуке'],
      ['Подписаться на карьерный канал', 'Следи за мероприятиями и вакансиями компаний-партнёров'],
      ['Узнать, какие шаги делать дальше', 'Запишись на консультацию и обсуди свою карьерную ситуацию'],
    ],
  },
  {
    id: 'job-preparation',
    title: 'Подготовка к трудоустройству',
    description: 'Навыки, резюме, интервью и обратная связь от индустрии',
    tasks: [
      ['Изучить материалы в «Карьерной аптечке»', 'Подготовься к выходу на рынок с помощью материалов ЦУ'],
      ['Узнать, какие навыки требуются для моей профессии', 'Сверь свои навыки с профилем специалиста'],
      ['Посетить мероприятие компании-партнёра', 'Выбери подходящее мероприятие в карьерном канале'],
      ['Записаться на курс «Mock-интервью»', 'Курс поможет системно подготовиться к выходу на рынок труда'],
      ['Составить резюме с учётом рекомендаций', 'Проверь структуру, содержание и формулировки в резюме'],
      ['Пройти тренировочное техническое собеседование', 'Сначала составь и провалидируй резюме; повторить собеседование можно через два месяца'],
      ['Встретиться с экспертом из индустрии', 'Обсуди свою карьерную ситуацию на разовой встрече или серии встреч'],
    ],
  },
  {
    id: 'practice',
    title: 'Практический опыт',
    description: 'Задачи от партнёров и проекты для портфолио',
    tasks: [
      ['Решить задачу партнёра в рамках буткемпа', 'Буткемп длится одну-две недели и предполагает самостоятельную работу'],
      ['Пополнить портфолио проектом в Мастерской Test&Learn', 'Мастерская длится четыре месяца: проект выполняет команда студентов'],
    ],
  },
  {
    id: 'employment',
    title: 'Трудоустройство',
    description: 'Вакансии партнёров, самостоятельный поиск и персональное сопровождение',
    tasks: [
      ['Откликнуться на вакансию компании-партнёра', 'Выбери подходящую вакансию на странице карьерных возможностей'],
      ['Откликнуться на вакансию, найденную самостоятельно', 'Добавь внешний отклик, чтобы отслеживать его вместе с остальными'],
      ['Передать резюме через «рукопожатие»', 'Доступно после тренировочного технического собеседования'],
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
    collapsedSemesters: [2, 3, 4, 5, 6, 7, 8],
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
      collapsedSemesters: Array.isArray(saved.collapsedSemesters)
        ? saved.collapsedSemesters.filter((semester) => Number.isInteger(semester) && semester >= 1 && semester <= 8)
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
let plannerPickerSemester = null
let plannerSearch = ''
let plannerCategories = new Set()
let pointerPlannerDrag = null
let suppressPlannerCourseClickUntil = 0
let catalogSearch = ''
let catalogSemesters = new Set()
let catalogCategories = new Set()
let catalogWorkloads = new Set()
let openGlossaryTerms = new Set()
let vacancySearch = ''
let vacancyFavoritesOnly = false
let vacancyFilters = new Set()
let vacancyInternships = true
let vacancyPage = 1
const VACANCIES_PER_PAGE = 10
let vacancyDirectionOpen = false
let vacancySelectedDirections = new Set()
let selectedVacancyId = new URLSearchParams(window.location.search).get('id')

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
    return Array.isArray(ids) ? ids.filter((id) => goals.some((goal) => goal.id === id)).slice(0, MAX_GOALS) : []
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

function commitPendingGoal() {
  const pendingId = window.localStorage.getItem(PENDING_GOAL_KEY)
  const goal = goals.find((item) => item.id === pendingId && !item.comingSoon)
  const savedGoals = getSavedGoals()
  const savedIds = savedGoals.map((item) => item.id)
  const trackAlreadyUsed = savedGoals.some((item) => item.kind === goal?.kind)

  if (goal && !trackAlreadyUsed && !savedIds.includes(goal.id) && savedIds.length < MAX_GOALS) {
    savedIds.push(goal.id)
    window.localStorage.setItem(SAVED_GOALS_KEY, JSON.stringify(savedIds))
  }

  window.localStorage.removeItem(PENDING_GOAL_KEY)
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
  `<img aria-hidden="true" class="${className}" src="${ASSET}${name}" width="${size}" height="${size}" alt="">`

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
        ${controlButton({ className: 'flat-button flat-button--primary header-island__action', content: `${icon('message-chat-square.svg', 20)}<span>Хочу консультацию</span>` })}
      </div>
      <div class="header-island__art header-island__art--goals" aria-hidden="true">${icon('goals-header-illustration.svg', 389, 'header-island__art-image')}</div>
    </section>`
}

function goalCard(goal) {
  const savedGoals = getSavedGoals()
  const trackAlreadyUsed = savedGoals.some((item) => item.kind === goal.kind)
  const unavailable = goal.comingSoon || trackAlreadyUsed || savedGoals.length >= MAX_GOALS
  return controlButton({
    className: 'goal-card',
    attributes: `data-goal-id="${goal.id}" ${unavailable ? `disabled ${goal.comingSoon ? `aria-describedby="${goal.id}-state"` : ''}` : ''}`,
    content: `<span class="goal-card__heading">
        <span class="goal-card__icon goal-card__icon--${goal.kind}">${icon(iconByKind[goal.kind])}</span>
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

function appTemplate() {
  return `
    <div class="app-shell">
      ${globalNav()}
      ${mobileNav()}
      ${informerFooter()}
      <main class="page-content">
        ${headerIsland()}
        <div class="workspace">
          <section class="goal-panel" aria-labelledby="goals-heading">
            <div class="section-heading">
              <h2 id="goals-heading" tabindex="-1">Выбери цель</h2>
              <p>Определи, что для тебя сейчас в приоритете: индустрия,<br class="desktop-break"> предпринимательство, наука или только обучение.</p>
            </div>
            <div class="goal-grid">${goals.map(goalCard).join('')}</div>
          </section>
          ${infoPanel()}
        </div>
      </main>
      <div id="modal-root"></div>
    </div>`
}

function workExperienceTemplate() {
  return `
    <div class="app-shell">
      ${globalNav()}
      ${mobileNav({ backButton: true })}
      ${informerFooter()}
      <main class="page-content work-step">
        <div class="work-step__header">
          ${controlButton({ className: 'work-step__back', content: `${icon('arrow-left.svg')}<span>К выбору цели</span>`, attributes: 'data-back-to-goals' })}
          <section class="header-island header-island--work" aria-labelledby="work-step-title">
            <div class="header-island__copy">
              <h1 id="work-step-title" tabindex="-1">Определим точку старта</h1>
              <div class="header-island__support">
                <p>Так мы сможем подобрать подходящие вакансии и карьерные возможности.</p>
              </div>
            </div>
            <div class="header-island__art" aria-hidden="true">${icon('decorative.svg', 335, 'header-island__art-image')}</div>
          </section>
        </div>

        <div class="work-step__layout">
          <form class="work-form" data-goal-form novalidate>
            <div class="work-form__heading">
              <span>Шаг 1 из 2</span>
              <h2>Расскажи о своей работе</h2>
            </div>
            <div class="work-form__fields">
              ${checkboxControl({ className: 'work-checkbox', inputAttributes: 'data-no-work', boxContent: icon('check-small.svg', 20), content: '<span>Сейчас не работаю</span>' })}
              ${fieldControl({ id: 'company', label: 'Компания*', placeholder: 'Название компании', errorMessage: 'Укажи название компании' })}
              ${fieldControl({ id: 'specialty', label: 'Специальность*', placeholder: 'Выбери наиболее подходящую специальность', options: ['Разработка', 'Аналитика', 'Дизайн', 'Управление продуктом'], errorMessage: 'Выбери специальность' })}
              ${fieldControl({ id: 'grade', label: 'Грейд*', placeholder: 'Выбери наиболее подходящий грейд', options: ['Стажер', 'Джуниор', 'Мидл', 'Сеньор'], errorMessage: 'Выбери грейд' })}
              ${fieldControl({ id: 'salary', label: 'Зарплата (₽)', placeholder: 'Выбери диапазон', options: CAREER_SALARY_OPTIONS, required: false })}
            </div>
            ${controlButton({ className: 'work-form__submit flat-button flat-button--primary', content: 'Продолжить', type: 'submit' })}
          </form>

          <aside class="privacy-note" aria-labelledby="privacy-title">
            ${icon('info.svg', 20, 'privacy-note__icon')}
            <div>
              <h2 id="privacy-title">Конфиденциальность</h2>
              <p>Сотрудники ЦУ используют данные только в обобщенном виде — для аналитики и улучшения карьерных инструментов. Индивидуально данные доступны только карьерному консультанту.</p>
            </div>
          </aside>
        </div>
      </main>
      <div id="modal-root"></div>
    </div>`
}

function journeyHeader() {
  return `
    <div class="work-step__header">
      ${controlButton({ className: 'work-step__back', content: `${icon('arrow-left.svg')}<span>К выбору цели</span>`, attributes: 'data-back-to-goals' })}
      <section class="header-island header-island--work" aria-labelledby="work-step-title">
        <div class="header-island__copy">
          <h1 id="work-step-title" tabindex="-1">Определим точку старта</h1>
          <div class="header-island__support">
            <p>Так мы сможем подобрать подходящие вакансии и карьерные возможности.</p>
          </div>
        </div>
        <div class="header-island__art" aria-hidden="true">${icon('decorative.svg', 335, 'header-island__art-image')}</div>
      </section>
    </div>`
}

function privacyNote() {
  return `
    <aside class="privacy-note" aria-labelledby="privacy-title">
      ${icon('info.svg', 20, 'privacy-note__icon')}
      <div>
        <h2 id="privacy-title">Конфиденциальность</h2>
        <p>Сотрудники ЦУ используют данные только в обобщенном виде — для аналитики и улучшения карьерных инструментов. Индивидуально данные доступны только карьерному консультанту.</p>
      </div>
    </aside>`
}

function jobExpectationsTemplate() {
  return `
    <div class="app-shell">
      ${globalNav()}
      ${mobileNav({ backButton: true, backTarget: 'work' })}
      ${informerFooter()}
      <main class="page-content work-step">
        ${journeyHeader()}

        <div class="work-step__layout">
          <form class="work-form work-form--expectations" data-goal-form data-goal-form-final novalidate>
            <div class="work-form__heading">
              <span>Шаг 2 из 2</span>
              <h2>Расскажи об ожиданиях от работы</h2>
            </div>
            <div class="work-form__fields">
              ${checkboxControl({ className: 'work-checkbox', inputAttributes: 'data-no-expectations', boxContent: icon('check-small.svg', 20), content: '<span>Пока не знаю</span>' })}
              ${fieldControl({ id: 'desired-specialty', label: 'Специальность', placeholder: 'Выбери наиболее подходящую специальность', options: ['Разработка', 'Аналитика', 'Дизайн', 'Управление продуктом'], errorMessage: 'Выбери специальность' })}
              ${fieldControl({ id: 'desired-grade', label: 'Грейд', placeholder: 'Выбери наиболее подходящий грейд', options: ['Стажер', 'Джуниор', 'Мидл', 'Сеньор'], errorMessage: 'Выбери грейд' })}
              ${fieldControl({ id: 'desired-salary', label: 'Зарплата (₽)', placeholder: 'Выбери диапазон', options: CAREER_SALARY_OPTIONS, errorMessage: 'Выбери диапазон' })}
            </div>
            <div class="work-form__actions">
              ${controlButton({ className: 'flat-button flat-button--outline', content: 'Назад', attributes: 'data-back-to-work' })}
              ${controlButton({ className: 'flat-button flat-button--primary', content: 'Отправить', type: 'submit' })}
            </div>
          </form>

          ${privacyNote()}
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
            ${stage.tasks.map(([title, description], taskIndex) => {
              const taskId = `${stage.id}-${taskIndex}`
              return checkboxControl({
                className: 'study-task',
                inputAttributes: `data-industry-task value="${taskId}" ${progress.has(taskId) ? 'checked' : ''}`,
                boxContent: icon('check-small.svg', 20),
                content: `<span class="study-task__copy"><strong>${title}</strong><span>${description}</span></span>`,
              })
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

function courseCardContent(course, { completed = false, conflict = false } = {}) {
  const postrequisiteCount = plannerCourses.filter((candidate) => candidate.prerequisites.includes(course.id)).length
  const requisiteCount = course.prerequisiteNames.length + course.corequisiteNames.length + postrequisiteCount

  return `<span class="planner-course__content">
    <span class="planner-course__heading-line">
      <span class="planner-course__title">${course.title}</span>
      ${completed ? `<img class="planner-course__completed-icon" src="${ASSET}check-verified.svg" width="16" height="16" alt="Пройден">` : ''}
    </span>
    <span class="planner-course__tags">
      <span class="planner-course__tag">${course.workload} ${pluralizePairs(course.workload)} в неделю</span>
      <span class="planner-course__tag">Семестры: ${course.available.join(', ')}</span>
      ${requisiteCount ? `<span class="planner-course__tag">Реквизиты: ${requisiteCount}</span>` : ''}
    </span>
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
        content: courseCardContent(course, { completed }),
      })}
    </article>`
}

function catalogTemplate() {
  const query = catalogSearch.trim().toLowerCase()
  const filtered = plannerCourses.filter((course) =>
    (!query || course.title.toLowerCase().includes(query) || course.description.toLowerCase().includes(query))
    && (!catalogSemesters.size || course.available.some((semester) => catalogSemesters.has(semester)))
    && (!catalogCategories.size || catalogCategories.has(course.category))
    && (!catalogWorkloads.size || catalogWorkloads.has(course.workload)),
  )
  const groups = [...new Set(filtered.map((course) => course.category))]

  return `
    <section class="study-content-panel catalog" aria-labelledby="catalog-title">
      <div class="catalog__intro">
        <div>
          <h2 id="catalog-title">Каталог</h2>
          <p>${plannerCourses.length} ${pluralizeCourses(plannerCourses.length)} осеннего семестра 2026 года <a href="${COURSE_CATALOG_SOURCE.url}" target="_blank" rel="noreferrer">из хэндбука ЦУ</a>.</p>
        </div>
        ${catalogSearch || catalogSemesters.size || catalogCategories.size || catalogWorkloads.size
          ? controlButton({ className: 'flat-button flat-button--neutral flat-button--text catalog__reset', content: 'Сбросить фильтры', attributes: 'data-catalog-reset' })
          : ''}
      </div>
      <div class="catalog-filters">
        ${fieldControl({ id: 'catalog-search', label: 'Поиск по курсам', hideLabel: true, placeholder: 'Название или описание курса', required: false, value: catalogSearch, className: 'input-search', leadingContent: icon('search.svg', 20), inputAttributes: 'data-catalog-search autocomplete="off"' })}
        <div class="catalog-filter-group catalog-filter-group--types">
          <strong>Тип курса</strong>
          <div class="catalog-filter-group__chips" role="group" aria-label="Тип курса">
            ${courseCategories.map((category) => chipControl({ label: category, selected: catalogCategories.has(category), attributes: `data-catalog-category="${category}"` })).join('')}
          </div>
        </div>
        <div class="catalog-filter-group catalog-filter-group--semesters">
          <strong>Семестры</strong>
          <div class="catalog-filter-group__chips" role="group" aria-label="Доступные семестры">
            ${availableCatalogSemesters.map((semester) => chipControl({ label: String(semester), selected: catalogSemesters.has(semester), attributes: `data-catalog-semester="${semester}"` })).join('')}
          </div>
        </div>
        <div class="catalog-filter-group catalog-filter-group--workload">
          <strong>Нагрузка в неделю</strong>
          <div class="catalog-filter-group__chips" role="group" aria-label="Нагрузка в неделю">
            ${courseWorkloads.map((workload) => chipControl({ label: `${workload} ${pluralizePairs(workload)}`, selected: catalogWorkloads.has(workload), attributes: `data-catalog-workload="${workload}"` })).join('')}
          </div>
        </div>
      </div>
      <div class="catalog-results" aria-live="polite">
        <p class="catalog-results__summary">Найдено: ${filtered.length}</p>
        ${filtered.length ? groups.map((category) => `
          <section class="catalog-group" aria-labelledby="catalog-group-${category.toLowerCase()}">
            <h3 id="catalog-group-${category.toLowerCase()}">${category}</h3>
            <div class="catalog-grid">${filtered.filter((course) => course.category === category).map(catalogCourseCard).join('')}</div>
          </section>`).join('') : `
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
      ${controlButton({
        className: 'planner-course__open',
        attributes: `aria-label="Подробнее о курсе «${course.title}»" aria-describedby="planner-drag-instructions" aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown Alt+ArrowLeft Alt+ArrowRight" data-planner-course-open="${course.id}"`,
        content: courseCardContent(course, { completed: item.completed, conflict }),
      })}
      <div class="planner-course__footer">
        ${controlButton({ className: 'flat-button flat-button--neutral flat-button--text planner-course__about', content: 'О курсе', attributes: `data-planner-course-open="${course.id}" aria-label="Подробнее о курсе «${course.title}»"` })}
        <div class="planner-course__actions">
          ${semesterCompleted
            ? '<span class="planner-course__fixed">Завершен</span>'
            : !item.fixed
              ? controlButton({ className: 'flat-button planner-course__remove', content: `${icon('trash.svg', 18)}<span>Удалить</span>`, attributes: `data-planner-remove data-course-id="${course.id}" data-semester="${semester}"` })
              : '<span class="planner-course__fixed">Обязательный</span>'}
        </div>
      </div>
    </article>`
}

function plannerPickerTemplate(semester) {
  const plannedIds = getPlannedCourseIds()
  const query = plannerSearch.trim().toLowerCase()
  const available = plannerCourses.filter((course) =>
    course.available.includes(semester)
    && !plannedIds.has(course.id)
    && (!plannerCategories.size || plannerCategories.has(course.category))
    && (!query || course.title.toLowerCase().includes(query)),
  )
  const categories = ['Все', ...courseCategories]

  return `
    <div class="planner-picker" data-planner-picker>
      <div class="planner-picker__header">
        <div>
          <h4>Доступные курсы</h4>
          <p>${semester} семестр</p>
        </div>
        ${controlButton({ className: 'goal-dialog__close planner-picker__close', content: icon('close.svg', 20), attributes: `aria-label="Закрыть выбор курсов" data-planner-picker-toggle="${semester}"` })}
      </div>
      ${fieldControl({ id: 'planner-course-search', label: 'Поиск', placeholder: 'Название курса', required: false, value: plannerSearch, className: 'input-search', leadingContent: icon('search.svg', 20), inputAttributes: 'data-planner-search autocomplete="off"' })}
      <div class="planner-filter" role="group" aria-label="Тип курса">
        ${categories.map((category) => chipControl({
          label: category,
          selected: category === 'Все' ? plannerCategories.size === 0 : plannerCategories.has(category),
          attributes: `data-planner-category="${category}"`,
        })).join('')}
      </div>
      <div class="planner-picker__list">
        ${available.length ? available.map((course) => `
          <article class="education-card planner-course course-card--detailed planner-picker-course" data-planner-drag-handle data-planner-picker-course="${course.id}">
            ${controlButton({
              className: 'planner-course__open planner-picker-course__content',
              attributes: `aria-label="Подробнее о курсе «${course.title}»" data-planner-course-open="${course.id}"`,
              content: courseCardContent(course),
            })}
            <div class="planner-course__footer planner-picker-course__footer">
              ${controlButton({ className: 'flat-button flat-button--neutral flat-button--text planner-course__add', content: 'Добавить', attributes: `data-planner-add data-course-id="${course.id}" data-semester="${semester}"` })}
            </div>
          </article>`).join('') : `
          <div class="planner-picker__empty">
            <strong>Подходящих курсов нет</strong>
            <span>Измени фильтр или выбери другой семестр</span>
          </div>`}
      </div>
    </div>`
}

function plannerSemesterTemplate(semester) {
  const items = plannerState.semesters[semester]
  const passed = semester < CURRENT_SEMESTER
  const completed = isPlannerSemesterCompleted(semester)
  if (passed && completed && plannerState.hideCompletedSemesters) return ''
  const load = getSemesterLoad(semester)
  const credits = items.reduce((sum, item) => sum + Math.max(2, Math.round((findPlannerCourse(item.id)?.workload || 0) * 1.5)), 0)
  const expanded = !plannerState.collapsedSemesters.includes(semester)
  const conflicts = items.filter((item) => courseHasConflict(item.id, semester))

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
              ${credits ? `<span class="badge badge--outline">${credits} кредитов</span>` : ''}
              ${semester === CURRENT_SEMESTER ? '<span class="badge badge--current">Текущий</span>' : ''}
              ${completed ? `<span class="badge badge--positive">${icon('check-verified.svg', 16)}Завершен</span>` : ''}
            </span>`,
          })}
        </header>
        ${conflicts.length ? `<div class="planner-semester__conflicts-panel" aria-hidden="${!expanded}" ${expanded ? '' : 'inert'}>
          <div class="planner-semester__conflicts-panel-inner">
            <div class="planner-conflicts" role="status">
              ${icon('planner-conflict.svg', 20)}
              <div><strong>Есть конфликты</strong><ul>${conflicts.map((item) => `<li>Проверь доступность и пререквизиты курса «${findPlannerCourse(item.id)?.title}»</li>`).join('')}</ul></div>
            </div>
          </div>
        </div>` : ''}
        <div class="planner-semester__body">
          <div class="planner-semester__toolbar">
            <strong>Курсы семестра</strong>
            <div>
              ${completed ? '' : controlButton({ className: 'flat-button flat-button--neutral flat-button--text planner-add-button', content: `${icon('planner-plus.svg', 18)}<span>Курс</span>`, attributes: `data-planner-picker-toggle="${semester}" aria-expanded="${plannerPickerSemester === semester}"` })}
              ${!completed && items.some((item) => !item.fixed) ? controlButton({ className: 'flat-button flat-button--neutral flat-button--text planner-reset-button', content: 'Сбросить курсы', attributes: `data-planner-reset-semester="${semester}"` }) : ''}
              ${controlButton({ className: 'planner-semester__chevron-button', attributes: `aria-label="${expanded ? 'Свернуть' : 'Развернуть'} ${semester} семестр" aria-expanded="${expanded}" aria-controls="planner-semester-panel-${semester}" data-planner-semester-toggle="${semester}"`, content: icon('chevron-down.svg', 18) })}
            </div>
          </div>
          <div class="planner-semester__panel" id="planner-semester-panel-${semester}" aria-hidden="${!expanded}" ${expanded ? '' : 'inert'}>
            <div class="planner-semester__panel-inner">
              <div class="planner-course-grid">
                ${items.map((item, index) => plannerCourseTemplate(item, semester, index)).join('')}
                ${completed ? '' : controlButton({ className: 'planner-semester__empty', content: `${icon('planner-plus.svg', 18)}<span>Курс</span>`, attributes: `data-planner-picker-toggle="${semester}"` })}
              </div>
              ${!completed && plannerPickerSemester === semester ? plannerPickerTemplate(semester) : ''}
            </div>
          </div>
        </div>
      </div>
    </section>`
}

function plannerTemplate() {
  const summary = plannerSummary()
  const conflicts = getPlannerConflicts().length
  const usedCredits = Object.values(plannerState.semesters).flat().reduce((sum, item) => sum + Math.max(2, Math.round((findPlannerCourse(item.id)?.workload || 0) * 1.5)), 0)

  return `
    <section class="planner" aria-labelledby="planner-title">
      <p class="visually-hidden" id="planner-drag-instructions">Перетащи курс за основную область карточки в другой семестр. С клавиатуры используй Alt и клавиши со стрелками.</p>
      <div class="planner__intro">
        <div class="planner__copy">
          <h2 id="planner-title">Планировщик</h2>
        </div>
        <div class="planner__primary-actions">
          ${controlButton({ className: 'flat-button flat-button--neutral flat-button--text', content: 'Сбросить курсы', attributes: 'data-planner-reset-all' })}
          ${controlButton({ className: 'flat-button flat-button--primary planner-trajectory-button', content: `${icon('stars.svg', 20)}<span>Подобрать траекторию</span>`, attributes: 'data-planner-trajectory' })}
        </div>
      </div>
      <div class="planner-overview" aria-label="Сводка учебного плана">
        <div class="planner-metric"><span>Курсов выбрано</span><strong>${summary.planned}<small> / ${PLANNER_COURSE_TARGET}</small></strong></div>
        <div class="planner-metric"><span>Конфликты</span><strong>${conflicts}</strong></div>
        <div class="planner-metric"><span>Свободные кредиты</span><strong>${Math.max(0, PLANNER_CREDIT_TARGET - usedCredits)}</strong></div>
        ${[
          ['Business', 25, 16], ['Software Engineering', 16, 32], ['AI', 52, 18],
        ].map(([label, earned, available]) => `<div class="planner-track"><strong>${label}</strong><div class="planner-track__bar"><span style="width:${earned}%"></span><i style="width:${available}%"></i></div><dl><div><dt>Набрано</dt><dd>${earned}%</dd></div><div><dt>Можно набрать</dt><dd>${available}%</dd></div></dl></div>`).join('')}
      </div>
      <div class="planner-semesters-heading">
        <h3>Семестры</h3>
        <span class="badge badge--positive">${icon('check-verified.svg', 16)}Пройдено курсов: ${summary.completed} из ${summary.planned}</span>
        <div class="planner__settings">
          ${toggleControl({ inputAttributes: `data-planner-hide-completed ${plannerState.hideCompletedSemesters ? 'checked' : ''}`, label: 'Скрыть пройденные семестры' })}
        </div>
      </div>
      <div class="planner-semesters">
        ${Array.from({ length: 8 }, (_, index) => plannerSemesterTemplate(index + 1)).join('')}
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
      <main class="page-content study-detail-page">
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
              ['goal', 'Моя цель'],
              ['planner', 'Планировщик'],
              ['catalog', 'Каталог'],
              ['glossary', 'Глоссарий'],
            ].map(([id, label]) => tabControl({ id, label, active: id === 'planner' })).join('')}
          </div>
        </section>

        <div id="study-panel-goal" role="tabpanel" aria-labelledby="study-tab-goal" data-study-panel="goal" hidden>
          <section class="study-content-panel" aria-labelledby="study-goal-heading">
            <h2 id="study-goal-heading">Моя цель</h2>
            <div class="study-goal-shell">
              <div class="study-goal-shell__meta">
                <strong>Учеба</strong>
                ${icon('dot-single.svg', 16)}
                <span data-study-stage-summary>${summary.completedStages} из ${studyStages.length} этапов завершено</span>
              </div>
              <div class="study-goal-summary">
                <h3>Хочу учиться</h3>
                <strong data-study-percent>${summary.percent}%</strong>
                <div class="study-goal-progress" role="progressbar" aria-label="Прогресс цели «Хочу учиться»" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${summary.percent}" data-study-progress>
                  <span style="width: ${summary.percent}%"></span>
                </div>
              </div>
              <section class="study-journey" aria-labelledby="study-journey-title">
                <div class="study-journey__heading">
                  <h3 id="study-journey-title">Этапы пути</h3>
                  <span class="study-journey__badge">${icon('check-verified.svg', 16)}<span data-study-completed-badge>${summary.completedStages}/${studyStages.length} завершено</span></span>
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

function vacancyCardTemplate(vacancy, { openable = true } = {}) {
  const favorite = vacancyState.favorites.has(vacancy.id)
  const applied = vacancyState.applied.has(vacancy.id)

  return `
    <article class="vacancy-card ${openable ? 'vacancy-card--openable' : ''}">
      ${openable ? controlButton({ className: 'vacancy-card__open', content: '', attributes: `aria-label="Открыть вакансию «${vacancy.title}»" data-vacancy-open="${vacancy.id}"` }) : ''}
      <header class="vacancy-card__company">
        <span class="vacancy-logo"><img src="${ASSET}${vacancy.logo}" alt=""></span>
        <span>${vacancy.company}</span>
        ${vacancy.level ? `<span class="vacancy-card__level vacancy-card__level--${vacancy.levelTone}">${vacancy.level}</span>` : ''}
      </header>
      <div class="vacancy-card__copy">
        <h3>${vacancy.title}</h3>
        <strong>${vacancy.salary}</strong>
        <p>${vacancy.description}</p>
      </div>
      <div class="vacancy-card__tags">${vacancy.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
      <footer class="vacancy-card__footer">
        <div class="vacancy-card__actions">
          ${controlButton({
            className: `vacancy-card__apply ${applied ? 'vacancy-card__apply--done' : ''}`,
            content: `${applied ? icon('check-green.svg', 20) : ''}<span>${applied ? 'Откликнулся' : 'Откликнуться'}</span>`,
            attributes: `aria-pressed="${applied}" data-vacancy-apply="${vacancy.id}"`,
          })}
          ${controlButton({
            className: `vacancy-card__favorite ${favorite ? 'is-active' : ''}`,
            content: icon(favorite ? 'heart-filled.svg' : 'heart.svg', 20),
            attributes: `aria-pressed="${favorite}" aria-label="${favorite ? 'Удалить из избранного' : 'Добавить в избранное'}" data-vacancy-favorite="${vacancy.id}"`,
          })}
        </div>
        <span>${vacancy.fresh}</span>
      </footer>
    </article>`
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
  const filtered = vacancies.filter((vacancy) => {
    const searchable = `${vacancy.title} ${vacancy.company} ${vacancy.description}`.toLocaleLowerCase('ru')
    const facets = new Set([...vacancy.tags, vacancy.level, vacancy.isFresh ? 'Свежие' : '', vacancy.partner ? 'Партнёры ЦУ' : ''])
    return (!query || searchable.includes(query))
      && (!vacancySelectedDirections.size || vacancySelectedDirections.has(vacancy.direction))
      && (!vacancyFavoritesOnly || vacancyState.favorites.has(vacancy.id))
      && (!vacancyFilters.size || [...vacancyFilters].every((filter) => facets.has(filter)))
      && (vacancyInternships || !vacancy.tags.includes('Стажировка'))
  })
  const filterGroups = [
    ['Вакансии', ['Свежие', 'Партнёры ЦУ']],
    ['Уровень', ['Бакалавриат', 'Магистратура']],
    ['Опыт', ['Без опыта', 'До 1 года', 'Более 1 года', 'Более 3 лет']],
    ['Формат', ['Удалённо', 'Гибрид', 'Офис']],
    ['Тип занятости', [['Полная', 'Полная занятость'], ['Частичная', 'Частичная занятость']]],
  ]
  const pageCount = Math.max(1, Math.ceil(filtered.length / VACANCIES_PER_PAGE))
  vacancyPage = Math.min(vacancyPage, pageCount)
  const pageItems = filtered.slice((vacancyPage - 1) * VACANCIES_PER_PAGE, vacancyPage * VACANCIES_PER_PAGE)

  return `
    <div class="vacancies-layout">
      <div class="vacancies-main">
        <div class="vacancy-search">
          ${fieldControl({ id: 'vacancy-search', label: 'Поиск вакансий', hideLabel: true, placeholder: 'Поиск', required: false, value: vacancySearch, className: 'input-search', leadingContent: icon('search.svg', 20), inputAttributes: 'data-vacancy-search autocomplete="off"' })}
          ${controlButton({ className: `vacancy-search__favorite ${vacancyFavoritesOnly ? 'is-active' : ''}`, content: icon(vacancyFavoritesOnly ? 'heart-filled.svg' : 'heart.svg', 20), attributes: `aria-pressed="${vacancyFavoritesOnly}" aria-label="${vacancyFavoritesOnly ? 'Показать все вакансии' : 'Показать только избранное'}" data-vacancy-favorites-only` })}
        </div>
        ${filtered.length ? `<div class="vacancy-grid">${pageItems.map(vacancyCardTemplate).join('')}</div>
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
        ${fieldControl({ id: 'vacancy-salary', label: 'Зарплата от', placeholder: 'Не важна', options: CAREER_SALARY_OPTIONS, required: false })}
        ${checkboxControl({ className: 'vacancy-internships', inputAttributes: `data-vacancy-internships ${vacancyInternships ? 'checked' : ''}`, boxContent: icon('check-small.svg', 20), content: '<span><strong>Рассматриваю стажировки</strong><small>Интересные проекты с возможностью остаться в штате компании</small></span>' })}
        ${controlButton({ className: 'flat-button flat-button--primary vacancy-filters__show', content: `Показать ${filtered.length} ${filtered.length === 1 ? 'предложение' : 'предложений'}`, attributes: 'data-vacancy-show' })}
        ${controlButton({ className: 'vacancy-filters__reset', content: 'Сбросить', attributes: 'data-vacancy-reset' })}
      </aside>
    </div>`
}

function industryGoalTemplate() {
  const progress = getIndustryProgress()
  const summary = getIndustryProgressSummary(progress)
  const selectedGoal = getSavedGoals().find((goal) => goal.kind === 'industry')
  const goalTitle = selectedGoal?.title || 'Найти первую работу или стажировку'

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
          <section class="study-content-panel" aria-labelledby="industry-goal-heading">
            <h2 id="industry-goal-heading">Моя цель</h2>
            <div class="study-goal-shell">
              <div class="study-goal-shell__meta">
                <strong>Индустрия</strong>
                ${icon('dot-single.svg', 16)}
                <span data-industry-stage-summary>${summary.completedStages} из ${industryStages.length} этапов завершено</span>
              </div>
              <div class="study-goal-summary">
                <h3>${goalTitle}</h3>
                <strong data-industry-percent>${summary.percent}%</strong>
                <div class="study-goal-progress" role="progressbar" aria-label="Прогресс цели «${goalTitle}»" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${summary.percent}" data-industry-progress>
                  <span style="width: ${summary.percent}%"></span>
                </div>
              </div>
              <section class="study-journey" aria-labelledby="industry-journey-title">
                <div class="study-journey__heading">
                  <h3 id="industry-journey-title">Этапы пути</h3>
                  <span class="study-journey__badge">${icon('check-verified.svg', 16)}<span data-industry-completed-badge>${summary.completedStages}/${industryStages.length} завершено</span></span>
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
          ${studyTabPlaceholder('applications', 'Отклики', 'Здесь можно будет отслеживать отклики и этапы отбора.')}
        </div>
        <div id="study-panel-portfolio" role="tabpanel" aria-labelledby="study-tab-portfolio" data-study-panel="portfolio" hidden>
          ${studyTabPlaceholder('portfolio', 'Резюме и портфолио', 'Здесь появятся материалы для подготовки резюме и портфолио.')}
        </div>
      </main>
      <div id="modal-root"></div>
    </div>`
}

function savedGoalCard(goal) {
  const track = goal.kind === 'study' ? 'Учеба' : 'Индустрия'
  const title = goal.kind === 'study' ? 'Хочу учиться' : goal.title
  const summary = goal.kind === 'study' ? getStudyProgressSummary() : getIndustryProgressSummary()
  const stageCount = goal.kind === 'study' ? studyStages.length : industryStages.length

  return `
    <article class="saved-goal">
      <header class="saved-goal__header">
        <div class="saved-goal__meta">
          <h3>${track}</h3>
          ${icon('dot-single.svg', 16)}
          <span>${summary.completedStages} из ${stageCount} этапов завершено</span>
        </div>
        ${controlButton({ className: 'flat-button flat-button--neutral saved-goal__open', content: 'Открыть', attributes: `data-open-saved-goal="${goal.kind}"` })}
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
  const savedGoals = getSavedGoals()

  return `
    <div class="app-shell">
      ${globalNav()}
      ${mobileNav()}
      ${informerFooter()}
      <main class="page-content">
        ${headerIsland()}
        <div class="workspace goals-workspace">
          <section class="my-goals-panel" aria-labelledby="my-goals-title">
            <div class="my-goals-panel__top">
              <h2 id="my-goals-title" tabindex="-1">Мои цели</h2>
              ${controlButton({ className: 'flat-button flat-button--primary add-goal-button', content: `${icon('plus.svg', 20)}<span>Цель</span>`, attributes: 'data-add-goal' })}
            </div>
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

const screenRoutes = {
  goals: { template: appTemplate, focus: '#goals-heading' },
  'work-experience': { template: workExperienceTemplate, focus: '#work-step-title' },
  'job-expectations': { template: jobExpectationsTemplate, focus: '#work-step-title' },
  success: { template: surveyCompleteTemplate, focus: '#survey-complete-title' },
  'my-goals': { template: myGoalsTemplate, focus: '#my-goals-title' },
  'study-goal': { template: studyGoalTemplate, focus: '#study-detail-title' },
  'industry-goal': { template: industryGoalTemplate, focus: '#industry-detail-title' },
  vacancy: { template: vacancyDetailTemplate, focus: '.vacancy-detail__block h2' },
}

function getScreenFromLocation() {
  const segments = window.location.pathname.split('/').filter(Boolean)
  const screen = segments.at(-1)?.replace(/\.html$/, '') || 'goals'
  return screenRoutes[screen] ? screen : 'goals'
}

const appRootPath = APP_ROOT_URL.pathname

function getScreenUrl(screen) {
  if (screen === 'vacancy' && selectedVacancyId) return `${appRootPath}vacancy/?id=${encodeURIComponent(selectedVacancyId)}`
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
}

function renderScreen(screen, { animate = true, historyMode = 'push' } = {}) {
  if (animate && pageTransitioning) return

  const route = screenRoutes[screen] || screenRoutes.goals
  const resolvedScreen = screenRoutes[screen] ? screen : 'goals'

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
      <div class="goal-dialog goal-limit-dialog" role="alertdialog" aria-modal="true" aria-labelledby="goal-limit-title" aria-describedby="goal-limit-description" tabindex="-1">
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
  const panel = root.querySelector('[data-study-panel="planner"]')
  if (!panel) return
  panel.innerHTML = plannerTemplate()
  if (focusSelector) panel.querySelector(focusSelector)?.focus({ preventScroll: true })
}

function renderCatalogPanel({ focusSelector } = {}) {
  const panel = root.querySelector('[data-study-panel="catalog"]')
  if (!panel) return
  panel.innerHTML = catalogTemplate()
  if (focusSelector) panel.querySelector(focusSelector)?.focus({ preventScroll: true })
}

function renderVacanciesPanel({ focusSelector } = {}) {
  const panel = root.querySelector('[data-study-panel="vacancies"]')
  if (!panel) return
  panel.innerHTML = vacanciesTemplate()
  if (focusSelector) panel.querySelector(focusSelector)?.focus({ preventScroll: true })
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

function movePlannerCourse(courseId, targetSemester, targetIndex) {
  const source = findPlannerItem(courseId)
  const course = findPlannerCourse(courseId)
  if (!source || !course || !course.available.includes(targetSemester)) return false
  if (isPlannerSemesterCompleted(source.semester) || isPlannerSemesterCompleted(targetSemester)) return false

  plannerState.semesters[source.semester].splice(source.index, 1)
  const destination = plannerState.semesters[targetSemester]
  const insertionIndex = Number.isInteger(targetIndex) ? Math.min(Math.max(targetIndex, 0), destination.length) : destination.length
  destination.splice(insertionIndex, 0, source.item)
  plannerState.collapsedSemesters = plannerState.collapsedSemesters.filter((semester) => semester !== targetSemester)
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
      <div class="goal-dialog planner-dialog planner-reset-dialog" role="alertdialog" aria-modal="true" aria-labelledby="planner-reset-title" aria-describedby="planner-reset-description" tabindex="-1">
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

function openPlannerCourseDrawer(courseId) {
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
  const addableSemesters = course.available.filter((semester) => !isPlannerSemesterCompleted(semester))
  const canToggleCompletion = placement && placement.semester >= CURRENT_SEMESTER
  const showDrawerFooter = canToggleCompletion || (!placement && addableSemesters.length > 0)

  previouslyFocused = document.activeElement
  document.querySelector('#modal-root').innerHTML = `
    <div class="modal-backdrop modal-backdrop--sheet" role="presentation">
      <aside class="course-drawer" role="dialog" aria-modal="true" aria-label="О курсе: ${course.title}" aria-describedby="course-drawer-description" tabindex="-1">
        ${controlButton({ className: 'goal-dialog__close course-drawer__close', content: icon('course-drawer-close.svg', 24), attributes: 'aria-label="Закрыть" data-close-dialog' })}
        <header class="course-drawer__header">
          <h2 id="course-drawer-title">О курсе</h2>
          <p id="course-drawer-description">${course.title}</p>
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
          ${showDrawerFooter ? '<footer class="course-drawer__footer">' : ''}
            ${canToggleCompletion
              ? controlButton({ className: 'flat-button flat-button--primary', content: placement.item.completed ? 'Отметить непройденным' : 'Отметить пройденным', attributes: `data-drawer-toggle-completed data-course-id="${course.id}" data-semester="${placement.semester}"` })
              : !placement ? `<div class="course-drawer__add-actions" aria-label="Добавить курс в семестр">
                ${addableSemesters.map((semester) => controlButton({ className: 'flat-button flat-button--primary', content: `${semester} семестр`, attributes: `data-drawer-add-course data-course-id="${course.id}" data-semester="${semester}"` })).join('')}
              </div>` : ''}
          ${showDrawerFooter ? '</footer>' : ''}
        </div>
      </aside>
    </div>`
  setModalState(true)
  document.querySelector('.course-drawer').focus()
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

  plannerPickerSemester = null
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
  plannerPickerSemester = null
  savePlannerState()
}

function activateStudyTab(tab, { focus = false } = {}) {
  const tablist = tab.closest('[data-study-tabs]')
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
  root.querySelector('[data-study-stage-summary]').textContent = `${summary.completedStages} из ${studyStages.length} этапов завершено`
  root.querySelector('[data-study-completed-badge]').textContent = `${summary.completedStages}/${studyStages.length} завершено`

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
  root.querySelector('[data-industry-stage-summary]').textContent = `${summary.completedStages} из ${industryStages.length} этапов завершено`
  root.querySelector('[data-industry-completed-badge]').textContent = `${summary.completedStages}/${industryStages.length} завершено`

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
    ;[SAVED_GOALS_KEY, PENDING_GOAL_KEY, STUDY_PROGRESS_KEY, INDUSTRY_PROGRESS_KEY, VACANCY_STATE_KEY, PLANNER_STORAGE_KEY]
      .forEach((key) => window.localStorage.removeItem(key))
  } catch {
    // The scenario still restarts in memory when storage is unavailable.
  }

  plannerState = createDefaultPlannerState()
  plannerPickerSemester = null
  vacancyState = { favorites: new Set(), applied: new Set() }
  vacancySearch = ''
  vacancyFavoritesOnly = false
  vacancyFilters.clear()
  vacancyInternships = true
  vacancyPage = 1
  vacancyDirectionOpen = false
  vacancySelectedDirections.clear()
  plannerSearch = ''
  plannerCategories.clear()
  catalogSearch = ''
  catalogSemesters.clear()
  catalogCategories.clear()
  catalogWorkloads.clear()
  openGlossaryTerms.clear()
  requestedStudyTab = null
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

function closeAllSingleSelects(except = null) {
  root.querySelectorAll('[data-ui-select].is-open').forEach((field) => {
    if (field !== except) closeSingleSelect(field)
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

root.addEventListener('click', (event) => {
  if (event.target.closest('[data-restart-scenario]')) {
    restartScenario()
    return
  }

  if (vacancyDirectionOpen && !event.target.closest('[data-ui-multiselect="vacancy-role"]')) {
    closeVacancyDirectionSelect()
  }

  const clickedSelect = event.target.closest('[data-ui-select]')
  closeAllSingleSelects(clickedSelect)

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
    select.value = selectOption.dataset.value
    trigger.querySelector('span:first-child').textContent = selectOption.textContent
    trigger.querySelector('span:first-child').classList.remove('is-placeholder')
    field.querySelectorAll('[data-ui-select-option]').forEach((option) => {
      const selected = option === selectOption
      option.classList.toggle('is-selected', selected)
      option.setAttribute('aria-selected', String(selected))
    })
    closeSingleSelect(field)
    select.dispatchEvent(new Event('change', { bubbles: true }))
    trigger.focus()
    return
  }

  const mobileMenuToggle = event.target.closest('.mobile-nav__menu-toggle')
  if (mobileMenuToggle) {
    const nav = mobileMenuToggle.closest('.mobile-nav')
    const active = nav.dataset.state !== 'active'
    nav.dataset.state = active ? 'active' : 'normal'
    mobileMenuToggle.setAttribute('aria-expanded', String(active))
  }

  const card = event.target.closest('.goal-card:not(:disabled)')
  if (card) openDialog(goals.find((goal) => goal.id === card.dataset.goalId))

  const savedGoalButton = event.target.closest('[data-open-saved-goal]')
  if (savedGoalButton?.dataset.openSavedGoal === 'study') renderScreen('study-goal')
  if (savedGoalButton?.dataset.openSavedGoal === 'industry') renderScreen('industry-goal')

  const studyTab = event.target.closest('[data-study-tab]')
  if (studyTab) {
    vacancyDirectionOpen = false
    activateStudyTab(studyTab)
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

  const vacancyFavorite = event.target.closest('[data-vacancy-favorite]')
  if (vacancyFavorite) {
    const id = vacancyFavorite.dataset.vacancyFavorite
    if (vacancyState.favorites.has(id)) vacancyState.favorites.delete(id)
    else vacancyState.favorites.add(id)
    saveVacancyState()
    if (getScreenFromLocation() === 'vacancy') renderScreen('vacancy', { animate: false, historyMode: 'none' })
    else renderVacanciesPanel({ focusSelector: `[data-vacancy-favorite="${id}"]` })
  }

  const vacancyApply = event.target.closest('[data-vacancy-apply]')
  if (vacancyApply) {
    const id = vacancyApply.dataset.vacancyApply
    if (vacancyState.applied.has(id)) vacancyState.applied.delete(id)
    else vacancyState.applied.add(id)
    saveVacancyState()
    if (getScreenFromLocation() === 'vacancy') renderScreen('vacancy', { animate: false, historyMode: 'none' })
    else renderVacanciesPanel({ focusSelector: `[data-vacancy-apply="${id}"]` })
  }

  if (event.target.closest('[data-vacancy-favorites-only]')) {
    vacancyFavoritesOnly = !vacancyFavoritesOnly
    vacancyPage = 1
    renderVacanciesPanel({ focusSelector: '[data-vacancy-favorites-only]' })
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
  if (plannerCourseOpen) openPlannerCourseDrawer(plannerCourseOpen.dataset.plannerCourseOpen)

  const catalogCourseOpen = event.target.closest('[data-catalog-course-open]')
  if (catalogCourseOpen) openPlannerCourseDrawer(catalogCourseOpen.dataset.catalogCourseOpen)

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
    catalogSemesters.clear()
    catalogCategories.clear()
    catalogWorkloads.clear()
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

  const pickerToggle = event.target.closest('[data-planner-picker-toggle]')
  if (pickerToggle) {
    const semester = Number(pickerToggle.dataset.plannerPickerToggle)
    if (isPlannerSemesterCompleted(semester)) return
    plannerPickerSemester = plannerPickerSemester === semester ? null : semester
    plannerSearch = ''
    plannerCategories = new Set()
    if (plannerPickerSemester) {
      plannerState.collapsedSemesters = plannerState.collapsedSemesters.filter((value) => value !== semester)
      savePlannerState()
    }
    renderPlannerPanel({ focusSelector: plannerPickerSemester ? '[data-planner-search]' : `[data-planner-picker-toggle="${semester}"]` })
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
    if (!wasCollapsed && plannerPickerSemester === semester) {
      plannerPickerSemester = null
      section?.querySelector('.planner-picker')?.remove()
    }
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
      if (!expanded) {
        section.querySelectorAll('[data-planner-picker-toggle]').forEach((toggle) => toggle.setAttribute('aria-expanded', 'false'))
      }
    }
  }

  const plannerCategoryChip = event.target.closest('[data-planner-category]')
  if (plannerCategoryChip) {
    const category = plannerCategoryChip.dataset.plannerCategory
    if (category === 'Все') plannerCategories.clear()
    else if (plannerCategories.has(category)) plannerCategories.delete(category)
    else plannerCategories.add(category)
    renderPlannerPanel({ focusSelector: `[data-planner-category="${category}"]` })
  }

  const plannerAdd = event.target.closest('[data-planner-add]')
  if (plannerAdd) {
    const semester = Number(plannerAdd.dataset.semester)
    const courseId = plannerAdd.dataset.courseId
    if (!isPlannerSemesterCompleted(semester) && !getPlannedCourseIds().has(courseId)) {
      plannerState.semesters[semester].push({ id: courseId, completed: false, fixed: false })
      savePlannerState()
      renderPlannerPanel({ focusSelector: `[data-planner-picker-toggle="${semester}"]` })
    }
  }

  const plannerRemove = event.target.closest('[data-planner-remove]')
  if (plannerRemove) {
    const semester = Number(plannerRemove.dataset.semester)
    if (isPlannerSemesterCompleted(semester)) return
    plannerState.semesters[semester] = plannerState.semesters[semester].filter((item) => item.id !== plannerRemove.dataset.courseId || item.fixed)
    savePlannerState()
    renderPlannerPanel({ focusSelector: `[data-planner-picker-toggle="${semester}"]` })
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
    closeDialog(() => renderPlannerPanel({ focusSelector: semester ? `[data-planner-picker-toggle="${semester}"]` : '[data-planner-reset-all]' }))
  }

  const drawerToggleCompleted = event.target.closest('[data-drawer-toggle-completed]')
  if (drawerToggleCompleted) {
    const semester = Number(drawerToggleCompleted.dataset.semester)
    if (semester < CURRENT_SEMESTER) return
    const item = plannerState.semesters[semester].find((course) => course.id === drawerToggleCompleted.dataset.courseId)
    if (item) {
      item.completed = !item.completed
      savePlannerState()
      closeDialog(() => renderPlannerPanel({ focusSelector: `[data-planner-course="${item.id}"]` }))
    }
  }

  const drawerAddCourse = event.target.closest('[data-drawer-add-course]')
  if (drawerAddCourse) {
    const courseId = drawerAddCourse.dataset.courseId
    const semester = Number(drawerAddCourse.dataset.semester)
    const course = findPlannerCourse(courseId)
    if (course?.available.includes(semester) && !isPlannerSemesterCompleted(semester) && !getPlannedCourseIds().has(courseId)) {
      plannerState.semesters[semester].push({ id: courseId, completed: false, fixed: false })
      plannerState.collapsedSemesters = plannerState.collapsedSemesters.filter((value) => value !== semester)
      savePlannerState()
      closeDialog(() => renderCatalogPanel({ focusSelector: `[data-catalog-course-open="${courseId}"]` }))
    }
  }

  if (event.target.closest('[data-select-goal]')) {
    setPendingGoal(activeGoal)
    closeDialog(() => {
      renderScreen('work-experience')
    })
  }

  if (event.target.closest('[data-back-to-goals]')) {
    renderScreen('goals')
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

  if (event.target.closest('[data-add-goal]')) {
    if (getSavedGoals().length >= MAX_GOALS) openGoalLimitDialog()
    else renderScreen('goals')
  }

  if (event.target.closest('[data-close-dialog], .goal-dialog__close')) closeDialog()
  if (event.target.classList.contains('modal-backdrop')) closeDialog()
})

document.addEventListener('click', (event) => {
  if (!event.target.closest('[data-ui-select]')) closeAllSingleSelects()
  if (!event.target.closest('[data-ui-multiselect]')) closeVacancyDirectionSelect()
})

root.addEventListener('change', (event) => {
  if (event.target.matches('[data-study-task]')) updateStudyProgress()
  if (event.target.matches('[data-industry-task]')) updateIndustryProgress()
  if (event.target.matches('[data-vacancy-internships]')) {
    vacancyInternships = event.target.checked
    vacancyPage = 1
    renderVacanciesPanel({ focusSelector: '[data-vacancy-internships]' })
  }
  if (event.target.matches('[data-ui-multiselect-option="vacancy-role"]')) {
    if (event.target.checked) vacancySelectedDirections.add(event.target.value)
    else vacancySelectedDirections.delete(event.target.value)
    vacancyPage = 1
    vacancyDirectionOpen = true
    renderVacanciesPanel({ focusSelector: `[data-ui-multiselect-option="vacancy-role"][value="${event.target.value}"]` })
  }

  if (event.target.matches('[data-planner-completed]')) {
    const semester = Number(event.target.dataset.semester)
    const item = plannerState.semesters[semester].find((course) => course.id === event.target.dataset.courseId)
    if (item) item.completed = event.target.checked
    savePlannerState()
    renderPlannerPanel({ focusSelector: `[data-planner-completed][data-course-id="${event.target.dataset.courseId}"]` })
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
      field.closest('.ui-field').classList.toggle('ui-field--disabled', event.target.checked)
      clearWorkFieldValidation(field)
    })
  }

  if (event.target.matches('[data-no-expectations]')) {
    root.querySelectorAll('[data-ui-field]').forEach((field) => {
      field.disabled = event.target.checked
      field.closest('[data-ui-select]')?.querySelector('[data-ui-select-toggle]')?.toggleAttribute('disabled', event.target.checked)
      field.closest('.ui-field').classList.toggle('ui-field--disabled', event.target.checked)
      clearWorkFieldValidation(field)
    })
  }

  if (event.target.matches('[data-ui-field]')) validateWorkField(event.target)
})

root.addEventListener('input', (event) => {
  if (event.target.matches('[data-ui-field]')) validateWorkField(event.target)
  if (event.target.matches('[data-planner-search]')) {
    plannerSearch = event.target.value
    const selectionStart = event.target.selectionStart
    renderPlannerPanel({ focusSelector: '[data-planner-search]' })
    const search = root.querySelector('[data-planner-search]')
    search?.setSelectionRange(selectionStart, selectionStart)
  }
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

  return valid
}

function clearWorkFieldValidation(field) {
  field.closest('.ui-field').classList.remove('ui-field--error')
  field.setAttribute('aria-invalid', 'false')
  field.removeAttribute('aria-describedby')
}

function focusWorkField(field) {
  const selectTrigger = field.closest('[data-ui-select]')?.querySelector('[data-ui-select-toggle]')
  ;(selectTrigger || field).focus()
}

root.addEventListener('submit', (event) => {
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

  if (event.target.matches('[data-goal-form-final]')) {
    commitPendingGoal()
    renderScreen('success')
    return
  }

  renderScreen('job-expectations')
})

window.addEventListener('popstate', () => {
  selectedVacancyId = new URLSearchParams(window.location.search).get('id')
  if (getScreenFromLocation() === 'industry-goal') requestedStudyTab = new URLSearchParams(window.location.search).get('tab')
  renderScreen(getScreenFromLocation(), { historyMode: 'none' })
})

document.addEventListener('keydown', (event) => {
  const dialog = document.querySelector('[aria-modal="true"]')
  if (!dialog) return
  if (event.key === 'Escape') {
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
  if (event.button !== 0 || event.target.closest('.planner-course__footer')) return
  const card = event.target.closest('[data-planner-drag-handle]')
  if (!card) return
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

root.addEventListener('pointermove', (event) => {
  if (!pointerPlannerDrag || event.pointerId !== pointerPlannerDrag.pointerId) return
  const distance = Math.hypot(event.clientX - pointerPlannerDrag.startX, event.clientY - pointerPlannerDrag.startY)
  if (!pointerPlannerDrag.active && distance < 6) return

  if (!pointerPlannerDrag.active) {
    pointerPlannerDrag.active = true
    pointerPlannerDrag.card.setPointerCapture?.(event.pointerId)
    pointerPlannerDrag.card.classList.add('is-dragging')
    document.body.classList.add('is-planner-dragging')
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
  if (!course.available.includes(semester) || isPlannerSemesterCompleted(semester)) return
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
    return
  }
  const semester = Number(dropzone.dataset.plannerDropzone)
  const course = findPlannerCourse(drag.id)
  if (!course?.available.includes(semester) || isPlannerSemesterCompleted(semester)) {
    clearPlannerPointerDrag()
    return
  }

  const targetCard = pointerTarget.closest('[data-planner-course]')
  const targetIndex = targetCard ? Number(targetCard.dataset.plannerIndex) : undefined
  const courseId = drag.id
  let changed = false
  if (drag.source === 'picker') {
    if (!isPlannerSemesterCompleted(semester) && !getPlannedCourseIds().has(courseId) && findPlannerCourse(courseId)?.available.includes(semester)) {
      const destination = plannerState.semesters[semester]
      const insertionIndex = Number.isInteger(targetIndex) ? Math.min(Math.max(targetIndex, 0), destination.length) : destination.length
      destination.splice(insertionIndex, 0, { id: courseId, completed: false, fixed: false })
      plannerState.collapsedSemesters = plannerState.collapsedSemesters.filter((value) => value !== semester)
      savePlannerState()
      changed = true
    }
  } else {
    changed = movePlannerCourse(courseId, semester, targetIndex)
  }
  clearPlannerPointerDrag()
  if (changed) renderPlannerPanel({ focusSelector: `[data-planner-course="${courseId}"] [data-planner-course-open]` })
})

root.addEventListener('pointercancel', clearPlannerPointerDrag)
window.addEventListener('blur', clearPlannerPointerDrag)

root.addEventListener('keydown', (event) => {
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
    if (event.key === 'ArrowUp') targetSemester = [...course.available].reverse().find((semester) => semester < source.semester) ?? source.semester
    if (event.key === 'ArrowDown') targetSemester = course.available.find((semester) => semester > source.semester) ?? source.semester

    if (targetSemester !== source.semester || targetIndex !== source.index) {
      movePlannerCourse(course.id, targetSemester, targetIndex)
      renderPlannerPanel({ focusSelector: `[data-planner-course="${course.id}"] [data-planner-course-open]` })
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
