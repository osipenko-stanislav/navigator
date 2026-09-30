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

export function fieldControl({ id, label, placeholder, options, required = true, errorMessage, inputAttributes = '', value = '', className = '', leadingContent = '' }) {
  const validation = required ? ' required' : ''
  const error = errorMessage || 'Заполни поле'
  const extraAttributes = attributes(inputAttributes)
  const classes = ['ui-field', className].filter(Boolean).join(' ')
  const safeValue = escapeAttribute(value)

  if (options) {
    return `
      <label class="${classes}" for="${id}">
        <span class="ui-field__label">${label}</span>
        <span class="ui-field__control ui-field__control--select">
          <select id="${id}" name="${id}" class="${value ? 'has-value' : ''}" data-ui-field${validation}${extraAttributes}>
            <option value="" ${value ? '' : 'selected'} disabled>${placeholder}</option>
            ${options.map((option) => `<option value="${option}" ${option === value ? 'selected' : ''}>${option}</option>`).join('')}
          </select>
        </span>
        <span class="ui-field__error" id="${id}-error" aria-live="polite">${error}</span>
      </label>`
  }

  return `
    <label class="${classes}" for="${id}">
      <span class="ui-field__label">${label}</span>
      <span class="ui-field__control">
        ${leadingContent}
        <input id="${id}" name="${id}" type="text" placeholder="${placeholder}" value="${safeValue}" data-ui-field${validation}${extraAttributes}>
      </span>
      <span class="ui-field__error" id="${id}-error" aria-live="polite">${error}</span>
    </label>`
}

export function tabControl({ id, label, active = false }) {
  return controlButton({
    className: `study-tabs__tab ${active ? 'is-active' : ''}`.trim(),
    content: `<span>${label}</span>`,
    attributes: `role="tab" id="study-tab-${id}" aria-controls="study-panel-${id}" aria-selected="${active}" tabindex="${active ? '0' : '-1'}" data-study-tab="${id}"`,
  })
}
