function attributes(value = '') {
  const normalized = value.trim()
  return normalized ? ` ${normalized}` : ''
}

function escapeAttribute(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function formatDateValue(value = '') {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const [year, month, day] = value.split('-')
  return `${day}.${month}.${year.slice(-2)}`
}

export function controlButton({ content, className = '', type = 'button', attributes: extraAttributes = '' }) {
  const classAttribute = className ? ` class="${className}"` : ''
  return `<button${classAttribute} type="${type}"${attributes(extraAttributes)}>${content}</button>`
}

export function checkboxControl({
  className = '',
  inputAttributes = '',
  boxContent = '',
  content = '',
}) {
  const classes = ['ui-checkbox', className].filter(Boolean).join(' ')

  return `
    <label class="${classes}">
      <span class="ui-checkbox__control">
        <input class="ui-checkbox__input" type="checkbox"${attributes(inputAttributes)}>
        <span class="ui-checkbox__box" aria-hidden="true">${boxContent}</span>
      </span>
      ${content}
    </label>`
}

export function toggleControl({ className = '', inputAttributes = '', label }) {
  const classes = ['ui-toggle', className].filter(Boolean).join(' ')

  return `
    <label class="${classes}">
      <input class="ui-toggle__input" type="checkbox"${attributes(inputAttributes)}>
      <span class="ui-toggle__track" aria-hidden="true"><span></span></span>
      <span class="ui-toggle__label">${label}</span>
    </label>`
}

export function chipControl({ label, selected = false, attributes: extraAttributes = '' }) {
  return controlButton({
    className: `ui-chip-filled ${selected ? 'is-selected' : ''}`.trim(),
    content: `<span>${label}</span>`,
    attributes: `aria-pressed="${selected}"${attributes(extraAttributes)}`,
  })
}

export function fieldControl({ id, label, placeholder, options, required = true, errorMessage, inputAttributes = '', value = '', className = '', leadingContent = '', hideLabel = false, type = 'text', multiline = false, toolbarContent = '', dateIconContent = '', clearIconContent = '' }) {
  const validation = required ? ' required' : ''
  const error = errorMessage || 'Заполни поле'
  const extraAttributes = attributes(inputAttributes)
  const disabled = /(^|\s)disabled(\s|$)/.test(inputAttributes)
  const classes = ['ui-field', className].filter(Boolean).join(' ')
  const safeValue = escapeAttribute(value)
  const normalizedOptions = options?.map((option) => typeof option === 'object'
    ? { value: String(option.value), label: String(option.label) }
    : { value: String(option), label: String(option) })

  if (type === 'date') {
    const displayValue = formatDateValue(value)
    return `
      <div class="${classes}" data-ui-date="${id}">
        <span class="ui-field__label ${hideLabel ? 'ui-field__label--visually-hidden' : ''}" id="${id}-label">${label}</span>
        <span class="ui-field__control ui-field__control--date">
          <input id="${id}" name="${id}" type="hidden" value="${safeValue}" data-ui-field${validation}${extraAttributes}>
          ${controlButton({
            className: 'ui-date__value',
            content: `<span class="${displayValue ? '' : 'is-placeholder'}" data-ui-date-value>${displayValue || placeholder}</span>`,
            attributes: `aria-labelledby="${id}-label" aria-expanded="false" aria-controls="${id}-picker" data-ui-date-toggle="${id}"${disabled ? ' disabled' : ''}`,
          })}
          ${controlButton({
            className: 'ui-date__clear',
            content: clearIconContent,
            attributes: `aria-label="Очистить дату" data-ui-date-clear="${id}"${displayValue && !disabled ? '' : ' hidden'}${disabled ? ' disabled' : ''}`,
          })}
          ${controlButton({
            className: 'ui-date__calendar',
            content: dateIconContent,
            attributes: `aria-label="Открыть календарь" aria-expanded="false" aria-controls="${id}-picker" data-ui-date-toggle="${id}"${disabled ? ' disabled' : ''}`,
          })}
          <span class="ui-date-picker" id="${id}-picker" role="dialog" aria-label="Выбор даты" hidden></span>
        </span>
        <span class="ui-field__error" id="${id}-error" aria-live="polite">${error}</span>
      </div>`
  }

  if (options) {
    const selectedOption = normalizedOptions.find((option) => option.value === String(value))
    const displayValue = selectedOption?.label || ''
    return `
      <div class="${classes}" data-ui-select="${id}">
        <span class="ui-field__label ${hideLabel ? 'ui-field__label--visually-hidden' : ''}" id="${id}-label">${label}</span>
        <span class="ui-field__control ui-field__control--select">
          <select class="visually-hidden" id="${id}" name="${id}" data-ui-field${validation}${extraAttributes} tabindex="-1" aria-hidden="true">
            <option value="" ${value ? '' : 'selected'} disabled>${placeholder}</option>
            ${normalizedOptions.map((option) => `<option value="${escapeAttribute(option.value)}" ${option.value === String(value) ? 'selected' : ''}>${escapeAttribute(option.label)}</option>`).join('')}
          </select>
          ${controlButton({
            className: 'ui-select__trigger',
            content: `<span class="${displayValue ? '' : 'is-placeholder'}">${escapeAttribute(displayValue || placeholder)}</span><span class="ui-select__chevron" aria-hidden="true"></span>`,
            attributes: `id="${id}-trigger" aria-labelledby="${id}-label ${id}-trigger" aria-expanded="false" aria-controls="${id}-options" data-ui-select-toggle="${id}"${disabled ? ' disabled' : ''}`,
          })}
          <span class="ui-select__options" id="${id}-options" role="listbox" aria-labelledby="${id}-label" hidden>
            ${normalizedOptions.map((option) => controlButton({ className: `ui-select__option ${option.value === String(value) ? 'is-selected' : ''}`, content: escapeAttribute(option.label), attributes: `role="option" aria-selected="${option.value === String(value)}" data-ui-select-option="${id}" data-value="${escapeAttribute(option.value)}"` })).join('')}
          </span>
        </span>
        <span class="ui-field__error" id="${id}-error" aria-live="polite">${error}</span>
      </div>`
  }

  if (multiline) {
    return `
      <label class="${classes}" for="${id}">
        <span class="ui-field__label ${hideLabel ? 'ui-field__label--visually-hidden' : ''}">${label}</span>
        <span class="ui-field__control ui-field__control--textarea ${toolbarContent ? 'ui-field__control--with-toolbar' : ''}">
          ${toolbarContent ? `<span class="ui-field__toolbar">${toolbarContent}</span>` : ''}
          <textarea id="${id}" name="${id}" placeholder="${placeholder}" data-ui-field${validation}${extraAttributes}>${safeValue}</textarea>
        </span>
        <span class="ui-field__error" id="${id}-error" aria-live="polite">${error}</span>
      </label>`
  }

  return `
    <label class="${classes}" for="${id}">
      <span class="ui-field__label ${hideLabel ? 'ui-field__label--visually-hidden' : ''}">${label}</span>
      <span class="ui-field__control">
        ${leadingContent}
        <input id="${id}" name="${id}" type="${type}" placeholder="${placeholder}" value="${safeValue}" data-ui-field${validation}${extraAttributes}>
      </span>
      <span class="ui-field__error" id="${id}-error" aria-live="polite">${error}</span>
    </label>`
}

export function fileControl({ id, label, file = null, inputAttributes = '', checkContent = '', clearContent = '' }) {
  const fileName = file?.name ? escapeAttribute(file.name) : ''

  return `
    <div class="ui-file-field" data-file-control="${id}">
      <span class="ui-field__label" id="${id}-label">${label}</span>
      <label class="ui-file-field__drop" for="${id}" data-file-drop="${id}">
        <input class="visually-hidden" id="${id}" name="${id}" type="file" accept=".jpg,.jpeg,.png,.pdf" aria-labelledby="${id}-label ${id}-prompt" data-profile-file="${id}"${attributes(inputAttributes)}>
        <span id="${id}-prompt">Выбери файл или перетяни их сюда</span>
      </label>
      <div class="ui-file-field__selected" data-file-selected="${id}" ${fileName ? '' : 'hidden'}>
        <span class="ui-file-field__status" aria-hidden="true">${checkContent}</span>
        <span class="ui-file-field__name" data-file-name>${fileName}</span>
        ${controlButton({ className: 'ui-file-field__clear', content: clearContent, attributes: `aria-label="Удалить файл" data-file-clear="${id}"` })}
      </div>
      <span class="ui-file-field__helper">Файлы форматов jpg, png и pdf, не более 5 МБ</span>
      <span class="ui-field__error" id="${id}-error" aria-live="polite"></span>
    </div>`
}

export function tabControl({ id, label, active = false }) {
  return controlButton({
    className: `study-tabs__tab ${active ? 'is-active' : ''}`.trim(),
    content: `<span>${label}</span>`,
    attributes: `role="tab" id="study-tab-${id}" aria-controls="study-panel-${id}" aria-selected="${active}" tabindex="${active ? '0' : '-1'}" data-study-tab="${id}"`,
  })
}

export function multiSelectControl({ id, label, placeholder, options, selected = new Set(), open = false, checkContent = '', attributes: extraAttributes = '' }) {
  const selectedLabels = options.filter((option) => selected.has(option.value)).map((option) => option.label)
  const value = selectedLabels.length ? `${label}: ${selectedLabels.join(', ')}` : placeholder

  return `
    <div class="ui-multiselect ${open ? 'is-open' : ''}" data-ui-multiselect="${id}">
      <span class="ui-field__label">${label}</span>
      ${controlButton({
        className: 'ui-multiselect__trigger',
        content: `<span class="${selectedLabels.length ? '' : 'is-placeholder'}">${value}</span><span class="ui-multiselect__chevron" aria-hidden="true"></span>`,
        attributes: `aria-expanded="${open}" aria-controls="${id}-options"${attributes(extraAttributes)}`,
      })}
      <div class="ui-multiselect__options" id="${id}-options" ${open ? '' : 'hidden'}>
        ${options.map((option) => checkboxControl({
          className: 'ui-multiselect__option',
          inputAttributes: `value="${escapeAttribute(option.value)}" ${selected.has(option.value) ? 'checked' : ''} data-ui-multiselect-option="${id}"`,
          boxContent: checkContent,
          content: `<span>${option.label}</span>`,
        })).join('')}
      </div>
    </div>`
}
