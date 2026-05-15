/* ============================================
   STATE
   ============================================ */
let currentView = 'landing';
let userEmail = '';

/* ============================================
   VIEW NAVIGATION (fluid transitions)
   ============================================ */
function navigateTo(viewName) {
  if (viewName === currentView) return;

  const currentEl = document.getElementById(`view-${currentView}`);
  const nextEl = document.getElementById(`view-${viewName}`);
  if (!currentEl || !nextEl) return;

  currentEl.classList.add('exit-left');
  currentEl.classList.remove('active');

  requestAnimationFrame(() => {
    nextEl.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
  });

  setTimeout(() => {
    currentEl.classList.remove('exit-left');
  }, 500);

  currentView = viewName;

  if (viewName === 'login') {
    setTimeout(() => {
      const emailInput = document.getElementById('email-input');
      if (emailInput) emailInput.focus();
    }, 500);
  }

  if (viewName === 'verify') {
    setTimeout(() => {
      const firstDigit = document.querySelector('.code-digit[data-index="0"]');
      if (firstDigit) firstDigit.focus();
    }, 500);
  }
}

/* ============================================
   SEND VERIFICATION CODE
   ============================================ */
async function handleSendCode(e) {
  e.preventDefault();

  const emailInput = document.getElementById('email-input');
  const sendBtn = document.getElementById('send-btn');
  const messageEl = document.getElementById('login-message');

  userEmail = emailInput.value.trim();
  if (!userEmail) return;

  setLoading(sendBtn, true);
  hideMessage(messageEl);

  try {
    const res = await fetch('/api/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail })
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage(messageEl, data.error || 'Error al enviar', 'error');
      shakeElement(sendBtn);
      return;
    }

    document.getElementById('verify-email-display').textContent = userEmail;
    clearCodeInputs();
    navigateTo('verify');
  } catch (err) {
    showMessage(messageEl, 'Error de conexión', 'error');
    shakeElement(sendBtn);
  } finally {
    setLoading(sendBtn, false);
  }
}

/* ============================================
   VERIFY CODE
   ============================================ */
async function handleVerifyCode(e) {
  e.preventDefault();

  const code = getCodeFromInputs();
  const verifyBtn = document.getElementById('verify-btn');
  const messageEl = document.getElementById('verify-message');

  if (code.length !== 6) {
    showMessage(messageEl, 'Ingresá los 6 dígitos', 'error');
    shakeElement(document.querySelector('.code-inputs'));
    return;
  }

  setLoading(verifyBtn, true);
  hideMessage(messageEl);

  try {
    const res = await fetch('/api/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, code })
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage(messageEl, data.error || 'Código incorrecto', 'error');
      shakeElement(document.querySelector('.code-inputs'));
      clearCodeInputs();
      return;
    }

    document.getElementById('dashboard-email').textContent = userEmail;
    navigateTo('dashboard');
  } catch (err) {
    showMessage(messageEl, 'Error de conexión', 'error');
  } finally {
    setLoading(verifyBtn, false);
  }
}

/* ============================================
   RESEND CODE
   ============================================ */
async function handleResendCode() {
  const messageEl = document.getElementById('verify-message');
  const resendBtn = document.getElementById('resend-btn');

  resendBtn.disabled = true;
  resendBtn.style.opacity = '0.5';

  try {
    const res = await fetch('/api/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail })
    });

    if (res.ok) {
      showMessage(messageEl, 'Código reenviado', 'success');
      clearCodeInputs();
    } else {
      const data = await res.json();
      showMessage(messageEl, data.error || 'Error al reenviar', 'error');
    }
  } catch (err) {
    showMessage(messageEl, 'Error de conexión', 'error');
  } finally {
    setTimeout(() => {
      resendBtn.disabled = false;
      resendBtn.style.opacity = '1';
    }, 5000);
  }
}

/* ============================================
   LOGOUT
   ============================================ */
function handleLogout() {
  userEmail = '';
  document.getElementById('email-input').value = '';
  clearCodeInputs();
  hideMessage(document.getElementById('login-message'));
  hideMessage(document.getElementById('verify-message'));
  navigateTo('landing');
}

/* ============================================
   CODE INPUT HANDLING (fluid digit-by-digit)
   ============================================ */
function setupCodeInputs() {
  const digits = document.querySelectorAll('.code-digit');

  digits.forEach((input, i) => {
    input.addEventListener('input', (e) => {
      const val = e.target.value.replace(/\D/g, '');
      e.target.value = val;

      if (val) {
        e.target.classList.add('filled');
        if (i < digits.length - 1) {
          digits[i + 1].focus();
        }
      } else {
        e.target.classList.remove('filled');
      }

      if (getCodeFromInputs().length === 6) {
        document.getElementById('verify-form').requestSubmit();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && i > 0) {
        digits[i - 1].focus();
        digits[i - 1].value = '';
        digits[i - 1].classList.remove('filled');
      }
    });

    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
      pasted.split('').forEach((char, j) => {
        if (digits[j]) {
          digits[j].value = char;
          digits[j].classList.add('filled');
        }
      });
      if (pasted.length === 6) {
        digits[5].focus();
        document.getElementById('verify-form').requestSubmit();
      } else if (pasted.length > 0) {
        digits[Math.min(pasted.length, 5)].focus();
      }
    });

    input.addEventListener('focus', () => {
      input.select();
    });
  });
}

function getCodeFromInputs() {
  return Array.from(document.querySelectorAll('.code-digit'))
    .map(i => i.value)
    .join('');
}

function clearCodeInputs() {
  document.querySelectorAll('.code-digit').forEach(input => {
    input.value = '';
    input.classList.remove('filled');
  });
}

/* ============================================
   UI HELPERS
   ============================================ */
function setLoading(btn, loading) {
  const text = btn.querySelector('.btn-text');
  const loader = btn.querySelector('.btn-loader');
  if (loading) {
    text.style.display = 'none';
    loader.style.display = 'inline-flex';
    btn.disabled = true;
  } else {
    text.style.display = 'inline';
    loader.style.display = 'none';
    btn.disabled = false;
  }
}

function showMessage(el, text, type) {
  el.textContent = text;
  el.className = `message show ${type}`;
}

function hideMessage(el) {
  el.className = 'message';
}

function shakeElement(el) {
  el.classList.add('shake');
  setTimeout(() => el.classList.remove('shake'), 500);
}

/* Button ripple effect coordinates */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (btn) {
    const rect = btn.getBoundingClientRect();
    btn.style.setProperty('--x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    btn.style.setProperty('--y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }
});

/* ============================================
   INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  setupCodeInputs();
});
