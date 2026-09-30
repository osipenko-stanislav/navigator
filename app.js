import { checkboxControl, chipControl, controlButton, fieldControl, tabControl, toggleControl } from './components/controls.js?v=6'

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
const PLANNER_STORAGE_KEY = 'cpk:study-planner'
const CURRENT_SEMESTER = 2
const PLANNER_COURSE_TARGET = 24
const PLANNER_CREDIT_TARGET = 60

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

const plannerCourses = [
  { id: 'math-1', title: 'Математический анализ', category: 'Core', workload: 4, available: [1], prerequisites: [] },
  { id: 'programming-1', title: 'Основы программирования', category: 'Core', workload: 4, available: [1], prerequisites: [] },
  { id: 'academic-writing', title: 'Академическое письмо', category: 'Soft', workload: 2, available: [1, 2], prerequisites: [] },
  { id: 'algorithms', title: 'Алгоритмы и структуры данных', category: 'Core', workload: 4, available: [2, 3], prerequisites: ['programming-1'] },
  { id: 'linear-algebra', title: 'Линейная алгебра', category: 'Core', workload: 4, available: [2, 3], prerequisites: ['math-1'] },
  { id: 'databases', title: 'Базы данных', category: 'Core', workload: 3, available: [3, 4], prerequisites: ['programming-1'] },
  { id: 'product-design', title: 'Проектирование цифровых продуктов', category: 'Choice', workload: 3, available: [3, 4, 5], prerequisites: [] },
  { id: 'probability', title: 'Теория вероятностей', category: 'Core', workload: 4, available: [3, 4], prerequisites: ['math-1'] },
  { id: 'machine-learning', title: 'Введение в машинное обучение', category: 'Choice', workload: 4, available: [4, 5], prerequisites: ['algorithms', 'linear-algebra', 'probability'] },
  { id: 'product-analytics', title: 'Продуктовая аналитика', category: 'Choice', workload: 3, available: [4, 5, 6], prerequisites: ['databases', 'probability'] },
  { id: 'computer-networks', title: 'Компьютерные сети', category: 'Core', workload: 3, available: [4, 5], prerequisites: ['programming-1'] },
  { id: 'research-practice', title: 'Исследовательская практика', category: 'Elective', workload: 2, available: [5, 6, 7], prerequisites: ['academic-writing'] },
  { id: 'team-project', title: 'Командный проект', category: 'Project', workload: 4, available: [5, 6], prerequisites: ['product-design'] },
  { id: 'internship', title: 'Индустриальная практика', category: 'Project', workload: 4, available: [6, 7, 8], prerequisites: ['team-project'] },
]

const plannerCourseDescriptions = {
  'math-1': 'Базовые методы математического анализа для решения прикладных задач и изучения следующих количественных дисциплин.',
  'programming-1': 'Введение в алгоритмическое мышление, основные конструкции языка и практику разработки небольших программ.',
  algorithms: 'Структуры данных, оценка сложности и алгоритмические подходы, которые используются в промышленной разработке.',
  databases: 'Проектирование реляционных моделей, SQL и практические основы надёжной работы с данными.',
  'product-design': 'Исследование пользовательских задач, проектирование сценариев и проверка решений через прототипы.',
  'machine-learning': 'Основные модели машинного обучения, подготовка данных и оценка качества решений.',
  'product-analytics': 'Метрики продукта, постановка экспериментов и принятие решений на основе данных.',
  'team-project': 'Командная работа над продуктом: от постановки задачи и распределения ролей до презентации результата.',
  internship: 'Практический опыт работы над задачами индустриального партнёра в условиях реального проекта.',
}

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

const trajectoryPresets = {
  'Искусственный интеллект': ['probability', 'machine-learning', 'computer-networks', 'research-practice', 'team-project', 'internship'],
  'Продуктовая аналитика': ['probability', 'databases', 'product-analytics', 'research-practice', 'team-project', 'internship'],
  'Цифровые продукты': ['product-design', 'product-analytics', 'team-project', 'research-practice', 'internship'],
}

function createDefaultPlannerState() {
  return {
    hideCompletedSemesters: false,
    hideProgress: false,
    collapsedSemesters: [3, 4, 5, 6, 7, 8],
    semesters: {
      1: [
        { id: 'math-1', completed: true, fixed: true },
        { id: 'programming-1', completed: true, fixed: true },
      ],
      2: [
        { id: 'academic-writing', completed: true, fixed: false },
        { id: 'algorithms', completed: true, fixed: true },
        { id: 'linear-algebra', completed: false, fixed: true },
      ],
      3: [
        { id: 'databases', completed: false, fixed: false },
        { id: 'product-design', completed: false, fixed: false },
      ],
      4: [], 5: [], 6: [], 7: [], 8: [],
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
        return [semester, courses.filter((item) => plannerCourses.some((course) => course.id === item.id))]
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
  const unavailable = !course.available.includes(semester)
  if (!course.prerequisites.length) return unavailable
  const completedBefore = new Set(
    Object.entries(plannerState.semesters)
      .filter(([semesterNumber]) => Number(semesterNumber) < semester)
      .flatMap(([, items]) => items.map((item) => item.id)),
  )
  return unavailable || course.prerequisites.some((id) => !completedBefore.has(id))
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
        ${controlButton({ className: 'calendar-button', content: `${icon('calendar-plus.svg')}<span>32</span>`, attributes: 'aria-label="События в календаре"' })}
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
      ${anchorNavigation ? controlButton({ className: 'mobile-nav__utility mobile-nav__utility--anchor', content: icon('list.svg'), attributes: 'aria-label="Навигация по странице"' }) : ''}
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
          ${controlButton({ className: 'work-step__back', content: `${icon('arrow-left.svg')}<span>К выбору цели</span>`, attributes: 'data-back-to-goals' })}
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
              <span>Шаг 1 из 2</span>
              <h2>Расскажи о своей работе</h2>
            </div>
            <div class="work-form__fields">
              ${checkboxControl({ className: 'work-checkbox', inputAttributes: 'data-no-work', boxContent: icon('check-small.svg', 20), content: '<span>Сейчас не работаю</span>' })}
              ${fieldControl({ id: 'company', label: 'Компания*', placeholder: 'Название компании', errorMessage: 'Укажи название компании' })}
              ${fieldControl({ id: 'specialty', label: 'Специальность*', placeholder: 'Выбери наиболее подходящую специальность', options: ['Разработка', 'Аналитика', 'Дизайн', 'Управление продуктом'], errorMessage: 'Выбери специальность' })}
              ${fieldControl({ id: 'grade', label: 'Грейд*', placeholder: 'Выбери наиболее подходящий грейд', options: ['Стажер', 'Джуниор', 'Мидл', 'Сеньор'], errorMessage: 'Выбери грейд' })}
              ${fieldControl({ id: 'salary', label: 'Зарплата (₽)', placeholder: 'Выбери диапазон', options: ['До 50 000', '50 000–100 000', '100 000–200 000', 'Более 200 000'], required: false })}
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
      ${controlButton({ className: 'work-step__back', content: `${icon('arrow-left.svg')}<span>К выбору цели</span>`, attributes: 'data-back-to-goals' })}
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
              <span>Шаг 2 из 2</span>
              <h2>Расскажи об ожиданиях от работы</h2>
            </div>
            <div class="work-form__fields">
              ${checkboxControl({ className: 'work-checkbox', inputAttributes: 'data-no-expectations', boxContent: icon('check-small.svg', 20), content: '<span>Пока не знаю</span>' })}
              ${fieldControl({ id: 'desired-specialty', label: 'Специальность', placeholder: 'Выбери наиболее подходящую специальность', options: ['Разработка', 'Аналитика', 'Дизайн', 'Управление продуктом'], errorMessage: 'Выбери специальность' })}
              ${fieldControl({ id: 'desired-grade', label: 'Грейд', placeholder: 'Выбери наиболее подходящий грейд', options: ['Стажер', 'Джуниор', 'Мидл', 'Сеньор'], errorMessage: 'Выбери грейд' })}
              ${fieldControl({ id: 'desired-salary', label: 'Зарплата (₽)', placeholder: 'Выбери диапазон', options: ['До 50 000', '50 000–100 000', '100 000–200 000', 'Более 200 000'], errorMessage: 'Выбери диапазон' })}
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

function studyTabPlaceholder(id, title, description) {
  return `
    <section class="study-content-panel study-placeholder" aria-labelledby="study-placeholder-${id}">
      <h2 id="study-placeholder-${id}">${title}</h2>
      <p>${description}</p>
    </section>`
}

function catalogCourseCard(course) {
  const placement = findPlannerItem(course.id)
  const description = plannerCourseDescriptions[course.id]
    || `Курс «${course.title}» помогает развивать профильные знания и дополняет учебную траекторию.`
  const prerequisiteTitles = course.prerequisites.map((id) => findPlannerCourse(id)?.title).filter(Boolean)
  const postrequisiteCount = plannerCourses.filter((candidate) => candidate.prerequisites.includes(course.id)).length

  return `
    <article class="education-card planner-course catalog-course-card ${placement ? 'catalog-course-card--planned' : ''}">
      ${controlButton({
        className: 'planner-course__open catalog-course-card__open',
        attributes: `aria-label="Подробнее о курсе «${course.title}»" data-catalog-course-open="${course.id}"`,
        content: `<span class="planner-course__content">
          <span class="planner-course__title">${course.title}</span>
          <span class="planner-course__tags">
            <span class="planner-course__tag">${course.category}</span>
            <span class="planner-course__tag">${course.workload} пары в неделю</span>
            <span class="planner-course__tag">${course.available.join(', ')} семестр</span>
            <span class="planner-course__tag">Пререквизиты: ${prerequisiteTitles.length}</span>
            ${postrequisiteCount ? `<span class="planner-course__tag">Постреквизиты: ${postrequisiteCount}</span>` : ''}
          </span>
          <span class="planner-course__note">${description}</span>
        </span>`,
      })}
      <div class="planner-course__footer catalog-course-card__footer">
        ${controlButton({ className: 'flat-button flat-button--neutral flat-button--text planner-course__about', content: 'О курсе', attributes: `data-catalog-course-open="${course.id}" aria-label="Подробнее о курсе «${course.title}»"` })}
        <span class="catalog-course-card__status">${placement ? `В плане · ${placement.semester} семестр` : `${course.available.join(', ')} семестр`}</span>
      </div>
    </article>`
}

function catalogTemplate() {
  const query = catalogSearch.trim().toLowerCase()
  const filtered = plannerCourses.filter((course) =>
    (!query || course.title.toLowerCase().includes(query) || (plannerCourseDescriptions[course.id] || '').toLowerCase().includes(query))
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
          <p>Исследуй доступные курсы и открывай карточки, чтобы посмотреть подробности.</p>
        </div>
        ${catalogSearch || catalogSemesters.size || catalogCategories.size || catalogWorkloads.size
          ? controlButton({ className: 'flat-button flat-button--neutral flat-button--text catalog__reset', content: 'Сбросить фильтры', attributes: 'data-catalog-reset' })
          : ''}
      </div>
      <div class="catalog-filters">
        ${fieldControl({ id: 'catalog-search', label: 'Поиск', placeholder: 'Название или описание курса', required: false, value: catalogSearch, className: 'input-search', leadingContent: icon('search.svg', 20), inputAttributes: 'data-catalog-search autocomplete="off"' })}
        <div class="catalog-filter-group">
          <strong>Доступные семестры</strong>
          <div class="catalog-filter-group__chips" role="group" aria-label="Доступные семестры">
            ${Array.from({ length: 8 }, (_, index) => chipControl({ label: String(index + 1), selected: catalogSemesters.has(index + 1), attributes: `data-catalog-semester="${index + 1}"` })).join('')}
          </div>
        </div>
        <div class="catalog-filter-group">
          <strong>Тип курса</strong>
          <div class="catalog-filter-group__chips" role="group" aria-label="Тип курса">
            ${['Core', 'Choice', 'Elective', 'Project', 'Soft'].map((category) => chipControl({ label: category, selected: catalogCategories.has(category), attributes: `data-catalog-category="${category}"` })).join('')}
          </div>
        </div>
        <div class="catalog-filter-group">
          <strong>Нагрузка в неделю</strong>
          <div class="catalog-filter-group__chips" role="group" aria-label="Нагрузка в неделю">
            ${[2, 3, 4].map((workload) => chipControl({ label: workload === 4 ? '4+ пары' : `${workload} пары`, selected: catalogWorkloads.has(workload), attributes: `data-catalog-workload="${workload}"` })).join('')}
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
            <span>Измени запрос или сбрось часть фильтров</span>
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
  const prerequisiteTitles = course.prerequisites.map((id) => findPlannerCourse(id)?.title).filter(Boolean)
  const postrequisiteCount = plannerCourses.filter((candidate) => candidate.prerequisites.includes(course.id)).length

  return `
    <article class="education-card planner-course ${item.completed ? 'planner-course--completed' : ''} ${conflict ? 'planner-course--conflict' : ''}" data-planner-drag-handle data-planner-course="${course.id}" data-planner-semester="${semester}" data-planner-index="${index}">
      ${controlButton({
        className: 'planner-course__open',
        attributes: `aria-label="Подробнее о курсе «${course.title}»" aria-describedby="planner-drag-instructions" aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown Alt+ArrowLeft Alt+ArrowRight" data-planner-course-open="${course.id}"`,
        content: `<span class="planner-course__content">
          <span class="planner-course__heading-line">
            <span class="planner-course__title">${course.title}</span>
            ${item.completed ? `<img class="planner-course__completed-icon" src="${ASSET}check-verified.svg" width="16" height="16" alt="Пройден">` : ''}
          </span>
          <span class="planner-course__tags">
            ${prerequisiteTitles.length ? '<span class="planner-course__tag">Пререквизит</span>' : ''}
            ${postrequisiteCount ? '<span class="planner-course__tag">Постреквизит</span>' : ''}
            ${course.category === 'Core' ? '<span class="planner-course__tag">Кореквизит</span>' : ''}
          </span>
          ${conflict ? '<span class="planner-course__note" role="status">Проверь пререквизиты и доступность курса</span>' : ''}
        </span>`,
      })}
      <div class="planner-course__footer">
        ${controlButton({ className: 'flat-button flat-button--neutral flat-button--text planner-course__about', content: 'О курсе', attributes: `data-planner-course-open="${course.id}" aria-label="Подробнее о курсе «${course.title}»"` })}
        <div class="planner-course__actions">
          ${!item.fixed ? controlButton({ className: 'flat-button planner-course__remove', content: `${icon('trash.svg', 18)}<span>Удалить</span>`, attributes: `data-planner-remove data-course-id="${course.id}" data-semester="${semester}"` }) : '<span class="planner-course__fixed">Обязательный</span>'}
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
  const categories = ['Все', 'Core', 'Choice', 'Elective', 'Project', 'Soft']

  return `
    <div class="planner-picker" data-planner-picker>
      <div class="planner-picker__header">
        <div>
          <h4>Доступные курсы</h4>
          <p>${semester} семестр</p>
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
          <article class="education-card planner-course planner-picker-course" data-planner-drag-handle data-planner-picker-course="${course.id}">
            <div class="planner-picker-course__content">
              <div class="planner-course__top">
              <span class="planner-course__category">${course.category}</span>
                <span class="planner-course__load">${course.workload} пары в неделю</span>
              </div>
              <h5 class="planner-course__title">${course.title}</h5>
            </div>
            <div class="planner-course__footer planner-picker-course__footer">
              ${controlButton({ className: 'flat-button flat-button--neutral flat-button--text planner-course__add', content: 'Добавить', attributes: `data-planner-add data-course-id="${course.id}" data-semester="${semester}"` })}
            </div>
          </article>`).join('') : `
          <div class="planner-picker__empty">
            <strong>Подходящих курсов нет</strong>
            <span>Измени фильтр или выбери другой семестр</span>
          </div>`}
      </div>
    </div>`
}

function plannerSemesterTemplate(semester) {
  const items = plannerState.semesters[semester]
  const passed = semester < CURRENT_SEMESTER
  const completed = items.length > 0 && items.every((item) => item.completed)
  if (passed && completed && plannerState.hideCompletedSemesters) return ''
  const load = getSemesterLoad(semester)
  const credits = items.reduce((sum, item) => sum + Math.max(2, Math.round((findPlannerCourse(item.id)?.workload || 0) * 1.5)), 0)
  const expanded = !plannerState.collapsedSemesters.includes(semester)
  const conflicts = items.filter((item) => courseHasConflict(item.id, semester))

  return `
    <section class="planner-semester ${expanded ? 'planner-semester--expanded' : ''} ${semester === CURRENT_SEMESTER ? 'planner-semester--current' : ''}" aria-labelledby="planner-semester-${semester}" data-planner-semester-section="${semester}" data-planner-dropzone="${semester}">
      <div class="planner-semester__surface">
        <header class="planner-semester__header">
          ${controlButton({
            className: 'planner-semester__toggle',
            attributes: `aria-expanded="${expanded}" aria-controls="planner-semester-panel-${semester}" data-planner-semester-toggle="${semester}"`,
            content: `<span class="planner-semester__title">
              <span class="planner-semester__heading" id="planner-semester-${semester}">${semester} семестр</span>
              ${load ? `<span class="badge badge--outline">${load} ${load === 1 ? 'пара' : load < 5 ? 'пары' : 'пар'} в неделю</span>` : ''}
              ${credits ? `<span class="badge badge--outline">${credits} кредитов</span>` : ''}
              ${semester === CURRENT_SEMESTER ? '<span class="badge badge--current">Текущий</span>' : ''}
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
              ${controlButton({ className: 'flat-button flat-button--neutral flat-button--text planner-add-button', content: `${icon('planner-plus.svg', 18)}<span>Курс</span>`, attributes: `data-planner-picker-toggle="${semester}" aria-expanded="${plannerPickerSemester === semester}"` })}
              ${items.some((item) => !item.fixed) ? controlButton({ className: 'flat-button flat-button--neutral flat-button--text planner-reset-button', content: 'Сбросить курсы', attributes: `data-planner-reset-semester="${semester}"` }) : ''}
              ${controlButton({ className: 'planner-semester__chevron-button', attributes: `aria-label="${expanded ? 'Свернуть' : 'Развернуть'} ${semester} семестр" aria-expanded="${expanded}" aria-controls="planner-semester-panel-${semester}" data-planner-semester-toggle="${semester}"`, content: icon('chevron-down.svg', 18) })}
            </div>
          </div>
          <div class="planner-semester__panel" id="planner-semester-panel-${semester}" aria-hidden="${!expanded}" ${expanded ? '' : 'inert'}>
            <div class="planner-semester__panel-inner">
              <div class="planner-course-grid">
                ${items.map((item, index) => plannerCourseTemplate(item, semester, index)).join('')}
                ${controlButton({ className: 'planner-semester__empty', content: `${icon('planner-plus.svg', 18)}<span>Курс</span>`, attributes: `data-planner-picker-toggle="${semester}"` })}
              </div>
              ${plannerPickerSemester === semester ? plannerPickerTemplate(semester) : ''}
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
      <p class="visually-hidden" id="planner-drag-instructions">Перетащи курс за основную область карточки в другой семестр. С клавиатуры используй Alt и клавиши со стрелками.</p>
      <div class="planner__intro">
        <div class="planner__copy">
          <h2 id="planner-title">Планировщик</h2>
          <p>Определи, что для тебя сейчас в приоритете: индустрия,<br>предпринимательство, наука или только обучение.</p>
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
        <span class="badge badge--positive">${icon('check-verified.svg', 16)}${summary.completed} из ${summary.planned} курсов завершено</span>
        <div class="planner__settings">
          ${toggleControl({ inputAttributes: `data-planner-hide-completed ${plannerState.hideCompletedSemesters ? 'checked' : ''}`, label: 'Скрыть пройденные' })}
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
                <span data-study-stage-summary>${summary.completedStages} из ${studyStages.length} этапов завершено</span>
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
                <p>Этапы без строгого пути: действия идут параллельно, а не строго друг за другом.</p>
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

function savedGoalCard(goal) {
  const track = goal.kind === 'study' ? 'Учеба' : 'Индустрия'
  const title = goal.kind === 'study' ? 'Хочу учиться' : goal.title
  const summary = goal.kind === 'study' ? getStudyProgressSummary() : { completedStages: 0, percent: 0 }

  return `
    <article class="saved-goal">
      <header class="saved-goal__header">
        <div class="saved-goal__meta">
          <h3>${track}</h3>
          ${icon('dot-single.svg', 16)}
          <span>${summary.completedStages} / 5 этапов завершено</span>
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
}

function getScreenFromLocation() {
  const segments = window.location.pathname.split('/').filter(Boolean)
  const screen = segments.at(-1)?.replace(/\.html$/, '') || 'goals'
  return screenRoutes[screen] ? screen : 'goals'
}

const appRootPath = APP_ROOT_URL.pathname

function getScreenUrl(screen) {
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
            <h2 id="goal-limit-title">Ой, цели уже выбраны</h2>
            <p class="goal-dialog__lead" id="goal-limit-description">Чтобы назначить новую цель, нужно удалить одну из текущих</p>
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

function findPlannerItem(courseId) {
  for (const [semester, items] of Object.entries(plannerState.semesters)) {
    const index = items.findIndex((item) => item.id === courseId)
    if (index >= 0) return { semester: Number(semester), index, item: items[index] }
  }
  return null
}

function movePlannerCourse(courseId, targetSemester, targetIndex) {
  const source = findPlannerItem(courseId)
  const course = findPlannerCourse(courseId)
  if (!source || !course || !course.available.includes(targetSemester)) return false

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

  document.querySelector('#modal-root').innerHTML = `
    <div class="modal-backdrop" role="presentation">
      <div class="goal-dialog planner-dialog planner-reset-dialog" role="alertdialog" aria-modal="true" aria-labelledby="planner-reset-title" aria-describedby="planner-reset-description" tabindex="-1">
        ${controlButton({ className: 'goal-dialog__close', content: icon('close.svg', 20), attributes: 'aria-label="Закрыть"' })}
        <div class="goal-dialog__header">
          <h2 id="planner-reset-title">Сброс курсов</h2>
          <p class="goal-dialog__lead" id="planner-reset-description">После сброса курсов вернуть их нельзя</p>
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

  const prerequisiteTitles = course.prerequisites.map((id) => findPlannerCourse(id)?.title).filter(Boolean)
  const postrequisiteTitles = plannerCourses
    .filter((item) => item.prerequisites.includes(courseId))
    .map((item) => item.title)
  const description = plannerCourseDescriptions[courseId]
    || `Курс «${course.title}» развивает профильные знания и помогает подготовиться к следующим этапам учебной траектории.`
  const hasConflict = placement ? courseHasConflict(courseId, placement.semester) : false
  const recommendedSemester = course.available[0]
  const season = recommendedSemester % 2 ? 'Осень' : 'Весна'
  const specializations = course.category === 'Soft'
    ? ['Для всех специализаций']
    : course.category === 'Project'
      ? ['Мобильная разработка', 'Веб-разработка']
      : ['Разработка программного обеспечения']
  const courseType = course.category === 'Core' ? 'Major core' : course.category
  const prerequisiteRows = course.prerequisites.map((id) => {
    const prerequisite = findPlannerCourse(id)
    const prerequisitePlacement = findPlannerItem(id)
    const completed = Boolean(prerequisitePlacement?.item.completed)
    return `<li class="course-drawer__relation ${completed ? 'is-complete' : 'is-missing'}"><img src="${ASSET}${completed ? 'course-drawer-prerequisite-complete.svg' : 'course-drawer-warning.svg'}" width="20" height="20" alt="">${prerequisite?.title || id}</li>`
  }).join('')
  const postrequisiteRows = postrequisiteTitles.map((title) => `<li class="course-drawer__relation"><img src="${ASSET}course-drawer-postrequisite.svg" width="20" height="20" alt="">${title}</li>`).join('')

  previouslyFocused = document.activeElement
  document.querySelector('#modal-root').innerHTML = `
    <div class="modal-backdrop modal-backdrop--sheet" role="presentation">
      <aside class="course-drawer" role="dialog" aria-modal="true" aria-label="О курсе: ${course.title}" aria-describedby="course-drawer-description" tabindex="-1">
        ${controlButton({ className: 'goal-dialog__close course-drawer__close', content: icon('course-drawer-close.svg', 24), attributes: 'aria-label="Закрыть" data-close-dialog' })}
        <header class="course-drawer__header">
          <h2 id="course-drawer-title">О курсе</h2>
          <p id="course-drawer-description">${course.title}</p>
          <img class="course-drawer__character" src="${ASSET}course-drawer-character.png" width="198" height="208" alt="">
        </header>
        <div class="course-drawer__content">
          <div class="course-drawer__scroll">
            ${hasConflict ? `<div class="course-drawer__warning" role="status">
              ${icon('course-drawer-warning.svg', 20)}
              <div><strong>Не все пререквизиты выполнены</strong><p>Нужно пройти: ${prerequisiteTitles.join(', ') || 'обязательные курсы программы'}</p></div>
            </div>` : ''}
            <div class="course-drawer__syllabus">
              <div><span>Учебный план курса</span><strong>Темплан</strong></div>
              <img src="${ASSET}course-drawer-cap.png" width="124" height="76" alt="">
            </div>
            <section class="course-drawer__section">
              <h3>Описание</h3>
              <p>${description}</p>
            </section>
            <dl class="course-drawer__facts">
              <div><dt>Год поступления</dt><dd>2026–2030</dd></div>
              <div><dt>Тип курса</dt><dd><span class="course-drawer__badge course-drawer__badge--type">${courseType}</span></dd></div>
              <div><dt>Специализация</dt><dd><ul class="course-drawer__specializations">${specializations.map((item) => `<li><img src="${ASSET}course-drawer-list.svg" width="20" height="20" alt="">${item}</li>`).join('')}</ul></dd></div>
              <div><dt>Осень / весна</dt><dd><span class="course-drawer__badge course-drawer__badge--season">${season}</span></dd></div>
              <div><dt>Рекомендованный к прохождению семестр</dt><dd><span class="course-drawer__badge course-drawer__badge--semester">${recommendedSemester} семестр</span></dd></div>
              <div><dt>Академическая нагрузка</dt><dd>${course.workload} пары в неделю</dd></div>
            </dl>
            <section class="course-drawer__section">
              <h3>Пререквизиты</h3>
              ${prerequisiteRows ? `<ul class="course-drawer__relations">${prerequisiteRows}</ul>` : '<p>Нет</p>'}
            </section>
            <section class="course-drawer__section">
              <h3>Постреквизиты</h3>
              ${postrequisiteRows ? `<ul class="course-drawer__relations">${postrequisiteRows}</ul>` : '<p>Нет</p>'}
            </section>
          </div>
          <footer class="course-drawer__footer">
            ${controlButton({ className: 'flat-button flat-button--outline', content: 'Закрыть', attributes: 'data-close-dialog' })}
            ${placement
              ? controlButton({ className: 'flat-button flat-button--primary', content: placement.item.completed ? 'Вернуть в план' : 'Отметить пройденным', attributes: `data-drawer-toggle-completed data-course-id="${course.id}" data-semester="${placement.semester}"` })
              : `<div class="course-drawer__add-actions" aria-label="Добавить курс в семестр">
                ${course.available.map((semester) => controlButton({ className: 'flat-button flat-button--primary', content: `${semester} семестр`, attributes: `data-drawer-add-course data-course-id="${course.id}" data-semester="${semester}"` })).join('')}
              </div>`}
          </footer>
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
          ${fieldControl({ id: 'trajectory-load', label: 'Максимальная нагрузка*', placeholder: 'Выбери нагрузку', options: ['12 пар в неделю', '16 пар в неделю', '20 пар в неделю'], value: '16 пар в неделю', errorMessage: 'Выбери нагрузку' })}
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
      plannerState.semesters[semester] = plannerState.semesters[semester].filter((item) => item.fixed)
    }
  }

  const plannedIds = getPlannedCourseIds()
  for (const courseId of trajectoryPresets[specialization] || []) {
    if (plannedIds.has(courseId)) continue
    const course = findPlannerCourse(courseId)
    const target = course.available
      .filter((semester) => semester >= CURRENT_SEMESTER)
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
    plannerState.semesters[semester] = plannerState.semesters[semester].filter((item) => item.fixed)
  } else if (keepCompleted) {
    for (let index = 1; index <= 8; index += 1) {
      plannerState.semesters[index] = plannerState.semesters[index].filter((item) => item.fixed || item.completed)
    }
  } else {
    plannerState = createDefaultPlannerState()
    for (let index = 1; index <= 8; index += 1) {
      plannerState.semesters[index] = plannerState.semesters[index].filter((item) => item.fixed)
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
  root.querySelector('[data-study-stage-summary]').textContent = `${summary.completedStages} из ${studyStages.length} этапов завершено`
  root.querySelector('[data-study-completed-badge]').textContent = `${summary.completedStages}/${studyStages.length} завершено`

  const progressbar = root.querySelector('[data-study-progress]')
  progressbar.setAttribute('aria-valuenow', String(summary.percent))
  progressbar.querySelector('span').style.width = `${summary.percent}%`

  studyStages.forEach((stage) => {
    const completed = stage.tasks.filter((_, index) => progress.has(`${stage.id}-${index}`)).length
    root.querySelector(`[data-study-stage="${stage.id}"] [data-study-stage-count]`).textContent = `${completed} из ${stage.tasks.length}`
  })
}

function restartScenario() {
  try {
    ;[SAVED_GOALS_KEY, PENDING_GOAL_KEY, STUDY_PROGRESS_KEY, PLANNER_STORAGE_KEY]
      .forEach((key) => window.localStorage.removeItem(key))
  } catch {
    // The scenario still restarts in memory when storage is unavailable.
  }

  plannerState = createDefaultPlannerState()
  plannerPickerSemester = null
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

root.addEventListener('click', (event) => {
  if (event.target.closest('[data-restart-scenario]')) {
    restartScenario()
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

  const studyTab = event.target.closest('[data-study-tab]')
  if (studyTab) activateStudyTab(studyTab)

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

  const pickerToggle = event.target.closest('[data-planner-picker-toggle]')
  if (pickerToggle) {
    const semester = Number(pickerToggle.dataset.plannerPickerToggle)
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
          toggle.setAttribute('aria-label', `${expanded ? 'Свернуть' : 'Развернуть'} ${semester} семестр`)
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
    if (!getPlannedCourseIds().has(courseId)) {
      plannerState.semesters[semester].push({ id: courseId, completed: false, fixed: false })
      savePlannerState()
      renderPlannerPanel({ focusSelector: `[data-planner-picker-toggle="${semester}"]` })
    }
  }

  const plannerRemove = event.target.closest('[data-planner-remove]')
  if (plannerRemove) {
    const semester = Number(plannerRemove.dataset.semester)
    plannerState.semesters[semester] = plannerState.semesters[semester].filter((item) => item.id !== plannerRemove.dataset.courseId || item.fixed)
    savePlannerState()
    renderPlannerPanel({ focusSelector: `[data-planner-picker-toggle="${semester}"]` })
  }

  const plannerResetSemester = event.target.closest('[data-planner-reset-semester]')
  if (plannerResetSemester) openPlannerResetDialog(Number(plannerResetSemester.dataset.plannerResetSemester))

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
    if (course?.available.includes(semester) && !getPlannedCourseIds().has(courseId)) {
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

  if (event.target.closest('[data-add-goal]')) {
    if (getSavedGoals().length >= MAX_GOALS) openGoalLimitDialog()
    else renderScreen('goals')
  }

  if (event.target.closest('[data-close-dialog], .goal-dialog__close')) closeDialog()
  if (event.target.classList.contains('modal-backdrop')) closeDialog()
})

root.addEventListener('change', (event) => {
  if (event.target.matches('[data-study-task]')) updateStudyProgress()

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
      field.closest('.ui-field').classList.toggle('ui-field--disabled', event.target.checked)
      clearWorkFieldValidation(field)
    })
  }

  if (event.target.matches('[data-no-expectations]')) {
    root.querySelectorAll('[data-ui-field]').forEach((field) => {
      field.disabled = event.target.checked
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

root.addEventListener('submit', (event) => {
  if (event.target.matches('[data-planner-trajectory-form]')) {
    event.preventDefault()
    const fields = [...event.target.querySelectorAll('[data-ui-field]')]
    const firstInvalid = fields.find((field) => !validateWorkField(field))
    if (firstInvalid) {
      firstInvalid.focus()
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
    firstInvalid.focus()
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
  if (!course.available.includes(semester)) return
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
  if (!course?.available.includes(semester)) {
    clearPlannerPointerDrag()
    return
  }

  const targetCard = pointerTarget.closest('[data-planner-course]')
  const targetIndex = targetCard ? Number(targetCard.dataset.plannerIndex) : undefined
  const courseId = drag.id
  let changed = false
  if (drag.source === 'picker') {
    if (!getPlannedCourseIds().has(courseId) && findPlannerCourse(courseId)?.available.includes(semester)) {
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
