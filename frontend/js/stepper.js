/* =========================================================
   YatraSaathi — Stepper.js  (Vanilla JS port of React Bits)
   ========================================================= */

class Stepper {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.steps = options.steps || [];
    this.totalSteps = this.steps.length;
    this.currentStep = options.initialStep || 1;
    this.backButtonText = options.backButtonText || 'Back';
    this.nextButtonText = options.nextButtonText || 'Continue';
    this.onComplete = options.onComplete || (() => {});
    this.onStepChange = options.onStepChange || (() => {});
    this._animating = false;
    this.formData = {};

    this._build();
    this._renderStep(null, false);
    this._updateFooter();
  }

  /* ── DOM Build ─────────────────────────────────────────── */
  _build() {
    this.container.innerHTML = '';
    this.container.className = 'stp-outer';

    const card = document.createElement('div');
    card.className = 'stp-card';

    // indicator row
    const indRow = document.createElement('div');
    indRow.className = 'stp-indicator-row';
    indRow.id = this.container.id + '-indicators';
    card.appendChild(indRow);

    // content area (clips slides)
    const content = document.createElement('div');
    content.className = 'stp-content';
    content.id = this.container.id + '-content';
    card.appendChild(content);

    // footer
    const footer = document.createElement('div');
    footer.className = 'stp-footer';
    footer.id = this.container.id + '-footer';
    card.appendChild(footer);

    this.container.appendChild(card);
  }

  /* ── Indicators ────────────────────────────────────────── */
  _updateIndicators() {
    const row = document.getElementById(this.container.id + '-indicators');
    row.innerHTML = '';

    this.steps.forEach((_, i) => {
      const n = i + 1;
      const status = n < this.currentStep ? 'complete' : n === this.currentStep ? 'active' : 'inactive';

      const ind = document.createElement('div');
      ind.className = 'stp-indicator';

      const inner = document.createElement('div');
      inner.className = `stp-indicator-inner stp-${status}`;

      if (status === 'complete') {
        inner.innerHTML = `<svg class="stp-check" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`;
      } else if (status === 'active') {
        inner.innerHTML = `<div class="stp-dot"></div>`;
      } else {
        inner.innerHTML = `<span class="stp-num">${n}</span>`;
      }

      ind.appendChild(inner);
      row.appendChild(ind);

      if (i < this.totalSteps - 1) {
        const conn = document.createElement('div');
        conn.className = 'stp-connector';
        const fill = document.createElement('div');
        fill.className = `stp-connector-fill${status === 'complete' ? ' done' : ''}`;
        conn.appendChild(fill);
        row.appendChild(conn);
      }
    });
  }

  /* ── Step Content ──────────────────────────────────────── */
  _buildStepEl(stepData) {
    const el = document.createElement('div');
    el.className = 'stp-step';

    // header
    const hdr = document.createElement('div');
    hdr.className = 'stp-step-header';
    hdr.innerHTML = `<h3>${stepData.title}</h3><p>${stepData.subtitle}</p>`;
    el.appendChild(hdr);

    // fields
    (stepData.fields || []).forEach(f => {
      const grp = document.createElement('div');
      grp.className = 'form-group';

      const lbl = document.createElement('label');
      lbl.className = 'form-label';
      lbl.setAttribute('for', f.id);
      lbl.textContent = f.label;
      grp.appendChild(lbl);

      const wrap = document.createElement('div');
      wrap.className = 'input-with-icon';

      const ic = document.createElement('i');
      ic.className = f.icon;
      wrap.appendChild(ic);

      const inp = document.createElement('input');
      inp.type = f.type;
      inp.id = f.id;
      inp.className = 'form-control';
      inp.placeholder = f.placeholder || '';
      if (f.required) inp.required = true;
      if (f.minlength) inp.minLength = f.minlength;

      // Enter key advances stepper
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); this.next(); }
      });
      wrap.appendChild(inp);
      grp.appendChild(wrap);
      el.appendChild(grp);
    });

    if (stepData.footerLink) {
      const fl = document.createElement('div');
      fl.className = 'stp-step-link';
      fl.innerHTML = `<a href="${stepData.footerLink.href}" class="forgot-link">${stepData.footerLink.text}</a>`;
      el.appendChild(fl);
    }

    return el;
  }

  /* ── Render / Animate ──────────────────────────────────── */
  _renderStep(direction, animate = true) {
    const area = document.getElementById(this.container.id + '-content');
    const incoming = this._buildStepEl(this.steps[this.currentStep - 1]);

    this._updateIndicators();

    if (!animate || !area.children.length) {
      area.innerHTML = '';
      incoming.classList.add('stp-center');
      area.appendChild(incoming);
      setTimeout(() => { const inp = incoming.querySelector('input'); if (inp) inp.focus(); }, 100);
      return;
    }

    // direction: 1 = forward, -1 = backward
    const outClass  = direction > 0 ? 'stp-out-left'  : 'stp-out-right';
    const inClass   = direction > 0 ? 'stp-in-right'  : 'stp-in-left';
    const old = area.querySelector('.stp-step');

    if (old) {
      old.classList.add(outClass);
      setTimeout(() => old.remove(), 350);
    }

    incoming.classList.add(inClass);
    area.appendChild(incoming);

    // force reflow then transition to center
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        incoming.classList.remove(inClass);
        incoming.classList.add('stp-center');
      });
    });

    setTimeout(() => { const inp = incoming.querySelector('input'); if (inp) inp.focus(); }, 420);
  }

  /* ── Footer ────────────────────────────────────────────── */
  _updateFooter() {
    const footer = document.getElementById(this.container.id + '-footer');
    const isLast = this.currentStep === this.totalSteps;
    const id = this.container.id;

    footer.innerHTML = `
      <div class="stp-nav ${this.currentStep > 1 ? 'spread' : 'end'}">
        ${this.currentStep > 1
          ? `<button class="stp-back" data-stepper="${id}">${this.backButtonText}</button>`
          : ''}
        <button class="stp-next" id="${id}-next-btn" data-stepper="${id}">
          ${isLast
            ? `<i class="fa-solid fa-paper-plane"></i> Complete`
            : `${this.nextButtonText} <i class="fa-solid fa-arrow-right"></i>`}
        </button>
      </div>`;

    footer.querySelector('.stp-back')?.addEventListener('click', () => this.back());
    footer.querySelector('.stp-next')?.addEventListener('click', () => this.next());
  }

  /* ── Validation ────────────────────────────────────────── */
  _validate() {
    const step = this.steps[this.currentStep - 1];
    for (const f of (step.fields || [])) {
      const el = document.getElementById(f.id);
      if (!el) continue;
      const val = el.value.trim();
      if (f.required && !val) {
        el.classList.add('input-error');
        el.focus();
        el.addEventListener('input', () => el.classList.remove('input-error'), { once: true });
        return false;
      }
      if (f.minlength && val.length < f.minlength) {
        el.classList.add('input-error');
        el.focus();
        el.addEventListener('input', () => el.classList.remove('input-error'), { once: true });
        return false;
      }
    }
    return true;
  }

  /* ── Public API ────────────────────────────────────────── */
  async next() {
    if (this._animating || !this._validate()) return;

    // Save data from current step before it unmounts
    const step = this.steps[this.currentStep - 1];
    for (const f of (step.fields || [])) {
      const el = document.getElementById(f.id);
      if (el) this.formData[f.id] = el.value;
    }

    if (this.currentStep === this.totalSteps) {
      const btn = document.getElementById(this.container.id + '-next-btn');
      if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Please wait...'; }
      const ok = await this.onComplete(this.formData);
      if (!ok && btn) {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Complete`;
      }
      return;
    }

    this._animating = true;
    this.currentStep++;
    this.onStepChange(this.currentStep);
    this._renderStep(1);
    this._updateFooter();
    setTimeout(() => this._animating = false, 400);
  }

  back() {
    if (this._animating || this.currentStep <= 1) return;
    this._animating = true;
    this.currentStep--;
    this.onStepChange(this.currentStep);
    this._renderStep(-1);
    this._updateFooter();
    setTimeout(() => this._animating = false, 400);
  }

  destroy() {
    if (this.container) this.container.innerHTML = '';
  }
}
