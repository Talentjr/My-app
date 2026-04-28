(function() {
  const loanAmountInput = document.getElementById('loanAmount');
  const amountSlider = document.getElementById('amountSlider');
  const monthlySpan = document.getElementById('monthlyRepayment');
  const totalSpan = document.getElementById('totalRepayment');
  const termsCheckbox = document.getElementById('termsCheckbox');
  const proceedBtn = document.getElementById('proceedBtn');

  const MONTHLY_INTEREST_RATE = 0.0295;
  const INSURANCE_RATE = 0.01;
  const MONTHS = 12;

  function formatCurrency(value) {
    return '₦' + value.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function calculateAndUpdate() {
    let amount = parseFloat(loanAmountInput.value);
    if (isNaN(amount)) amount = 1000000;
    amount = Math.min(5000000, Math.max(5000, amount));
    loanAmountInput.value = amount;
    amountSlider.value = amount;

    const r = MONTHLY_INTEREST_RATE;
    const n = MONTHS;
    let emi;
    if (r === 0) emi = amount / n;
    else emi = amount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalInterest = emi * n - amount;
    const insuranceFee = amount * INSURANCE_RATE;
    const totalRepayment = amount + totalInterest + insuranceFee;
    const monthlyTotal = emi + (insuranceFee / MONTHS);
    monthlySpan.innerText = formatCurrency(monthlyTotal);
    totalSpan.innerText = formatCurrency(totalRepayment);
  }

  function syncAmounts() {
    let val = parseFloat(loanAmountInput.value);
    if (isNaN(val)) val = 1000000;
    val = Math.min(5000000, Math.max(5000, val));
    loanAmountInput.value = val;
    amountSlider.value = val;
    calculateAndUpdate();
  }

  loanAmountInput.addEventListener('input', syncAmounts);
  amountSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    loanAmountInput.value = val;
    calculateAndUpdate();
  });

  function showMessage(msg, isError = false) {
    let existing = document.querySelector('.toast-message');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerText = msg;
    if (isError) {
      toast.style.backgroundColor = '#c0392b';
      toast.style.color = 'white';
    } else {
      toast.style.backgroundColor = '#1d372b';
    }
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  proceedBtn.addEventListener('click', () => {
    if (!termsCheckbox.checked) {
      showMessage('⚠️ Please agree to the Terms and Conditions to proceed.', true);
      return;
    }

    proceedBtn.disabled = true;
    const originalText = proceedBtn.innerText;
    proceedBtn.innerText = 'Processing...';

    setTimeout(() => {
      showMessage('✅ You have been credited successfully!', false);
      proceedBtn.disabled = false;
      proceedBtn.innerText = originalText;
    }, 5000);
  });

  document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = 'products.html';
  });

  document.getElementById('termsLink').addEventListener('click', (e) => {
    e.preventDefault();
    showMessage('📄 Terms & Conditions (demo preview)', false);
  });

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
      const nav = this.getAttribute('data-nav');
      if (nav === 'home') window.location.href = 'index.html';
      else if (nav === 'products') window.location.href = 'products.html';
      else if (nav === 'transfers') window.location.href = 'transfer.html';
      else showMessage(`${this.querySelector('span')?.innerText} (demo)`, false);
    });
  });

  syncAmounts();
  proceedBtn.disabled = false;
})();