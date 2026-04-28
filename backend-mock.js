// Mock backend API using localStorage
const Backend = {
  // User profile
  getProfile() {
    let p = localStorage.getItem('profile');
    if (!p) {
      p = { name: 'Investor', email: 'investor@gtco.com', phone: '+234 812 345 6789', avatar: '', pin: '1234', darkMode: false, notifications: true };
      localStorage.setItem('profile', JSON.stringify(p));
    }
    return JSON.parse(p);
  },
  updateProfile(profile) { localStorage.setItem('profile', JSON.stringify(profile)); },

  // Balance
  getBalance() {
    let bal = localStorage.getItem('balance');
    if (!bal) bal = '2485700.50';
    return parseFloat(bal);
  },
  setBalance(amount) { localStorage.setItem('balance', amount.toString()); },

  // Transactions (25+)
  getTransactions() {
    let txs = localStorage.getItem('transactions');
    if (!txs) {
      txs = [];
      for (let i = 1; i <= 25; i++) {
        const date = new Date(Date.now() - i * 86400000);
        txs.push({
          id: i,
          date: date.toISOString().split('T')[0],
          time: date.toLocaleTimeString(),
          description: i % 3 === 0 ? 'Airtime purchase' : (i % 2 === 0 ? `Transfer to ${['John Doe', 'Amina Bello', 'Chidi Obi'][i%3]}` : 'Bill payment'),
          amount: (Math.random() * 50000).toFixed(2),
          type: i % 4 === 0 ? 'credit' : 'debit',
          status: 'completed',
          reference: `GT${Date.now()}${i}`
        });
      }
      localStorage.setItem('transactions', JSON.stringify(txs));
    }
    return JSON.parse(txs);
  },
  addTransaction(tx) {
    const txs = this.getTransactions();
    tx.id = Date.now();
    txs.unshift(tx);
    localStorage.setItem('transactions', JSON.stringify(txs));
    this.updateBalance(tx.type === 'debit' ? -tx.amount : +tx.amount);
  },
  updateBalance(delta) {
    let bal = this.getBalance();
    bal += delta;
    this.setBalance(bal);
  },

  // Cards
  getCards() {
    let cards = localStorage.getItem('cards');
    if (!cards) cards = [{ id: 1, last4: '1234', type: 'Visa', expiry: '12/28' }];
    return JSON.parse(cards);
  },
  addCard(card) { let cards = this.getCards(); cards.push(card); localStorage.setItem('cards', JSON.stringify(cards)); },
  deleteCard(id) { let cards = this.getCards(); cards = cards.filter(c => c.id !== id); localStorage.setItem('cards', JSON.stringify(cards)); },

  // Investments
  getInvestments() {
    let inv = localStorage.getItem('investments');
    if (!inv) inv = [];
    return JSON.parse(inv);
  },
  addInvestment(inv) { let invs = this.getInvestments(); invs.push(inv); localStorage.setItem('investments', JSON.stringify(invs)); },

  // Referrals
  getReferrals() {
    let ref = localStorage.getItem('referrals');
    if (!ref) ref = { code: 'INVESTOR123', referrals: [], bonus: 0 };
    return JSON.parse(ref);
  },
  addReferral(friend) { let ref = this.getReferrals(); ref.referrals.push(friend); ref.bonus += 500; localStorage.setItem('referrals', JSON.stringify(ref)); },

  // Bill payments (mock)
  payBill(biller, accountNo, amount) { /* mock success */ return true; },

  // Beneficiaries (for transfer)
  getBeneficiaries() {
    let ben = localStorage.getItem('beneficiaries');
    if (!ben) ben = [
      { name: 'Abiona Oluwatobi Esther', bank: 'Gtbank', account: '0336009769', currency: 'NGN' },
      { name: 'Jimoh, Teslim Oyewale', bank: 'Gtbank', account: '0742630649', currency: 'NGN' }
    ];
    return JSON.parse(ben);
  }
};