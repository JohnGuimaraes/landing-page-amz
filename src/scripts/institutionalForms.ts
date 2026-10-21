/** No personal data is logged or persisted. The adapter stays inactive until configured. */
export function initInstitutionalForms(): void {
  document.querySelectorAll<HTMLFormElement>('[data-institutional-form]').forEach(form => {
    if (form.dataset.bound) return;
    form.dataset.bound = 'true';
    const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
    const status = form.querySelector<HTMLElement>('.form-status')!;
    const fields = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]')];
    const validate = (field: typeof fields[number]) => {
      let message = '';
      if (!field.value.trim()) message = 'Preencha este campo.';
      else if (field instanceof HTMLInputElement && field.type === 'email' && field.validity.typeMismatch) message = 'Informe um e-mail válido.';
      else if (field.value.trim().length < field.minLength) message = `Use pelo menos ${field.minLength} caracteres.`;
      field.setAttribute('aria-invalid', String(Boolean(message)));
      form.querySelector<HTMLElement>(`#${field.id}-error`)!.textContent = message;
      return !message;
    };
    fields.forEach(field => {
      field.addEventListener('blur', () => validate(field));
      field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') validate(field); });
    });
    button.disabled = false;
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (button.disabled) return;
      const invalid = fields.filter(field => !validate(field));
      if (invalid.length) {
        status.textContent = 'Revise os campos indicados antes de continuar.';
        invalid[0].focus();
        return;
      }
      const endpoint = form.dataset.endpoint;
      if (!endpoint) {
        status.textContent = 'Envio indisponível. Nenhum dado foi enviado. Utilize o WhatsApp da AMZ para iniciar a conversa.';
        return;
      }
      // Only an approved HTTPS endpoint may be activated. Server validation/rate limits
      // and recipient/privacy approval are mandatory; the honeypot alone is insufficient.
      const url = new URL(endpoint, location.origin);
      if (url.protocol !== 'https:') {
        status.textContent = 'Envio indisponível. Utilize o WhatsApp da AMZ.';
        return;
      }
      if ((form.elements.namedItem('website') as HTMLInputElement).value) {
        status.textContent = 'Não foi possível enviar. Utilize o WhatsApp da AMZ.';
        return;
      }
      button.disabled = true;
      form.setAttribute('aria-busy', 'true');
      button.querySelector('span')!.textContent = 'Enviando…';
      status.textContent = 'Enviando sua solicitação…';
      try {
        const response = await fetch(url, {
          method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ kind: form.dataset.kind, ...Object.fromEntries(new FormData(form)) }),
          signal: AbortSignal.timeout(15000),
        });
        const result = await response.json();
        if (!response.ok || result.accepted !== true || typeof result.receipt !== 'string' || !result.receipt.trim()) throw new Error('Not acknowledged');
        status.textContent = 'Solicitação recebida pelo serviço de atendimento.';
        form.reset();
      } catch {
        status.textContent = 'Não foi possível confirmar o recebimento. Seus campos foram preservados. Você pode conversar pelo WhatsApp.';
      } finally {
        form.removeAttribute('aria-busy');
        button.disabled = false;
        button.querySelector('span')!.textContent = 'Enviar solicitação';
      }
    });
  });
}
