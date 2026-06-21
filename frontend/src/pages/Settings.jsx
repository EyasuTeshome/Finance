import { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import Modal from '../components/Modal';

function fmt(n, currency = 'EUR') {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency }).format(n);
}

export default function Settings() {
  const [accounts, setAccounts] = useState([]);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', currency: 'EUR', balance: '' });

  function load() {
    api.get('/accounts').then(r => setAccounts(r.data)).catch(() => {});
  }
  useEffect(load, []);

  async function addAccount(e) {
    e.preventDefault();
    await api.post('/accounts', { ...form, balance: Number(form.balance) || 0 });
    setAdding(false);
    setForm({ name: '', currency: 'EUR', balance: '' });
    load();
  }

  async function updateBalance(e) {
    e.preventDefault();
    await api.patch(`/accounts/${editing.id}`, { name: editing.name, balance: Number(editing.balance) });
    setEditing(null);
    load();
  }

  async function removeAccount(id) {
    if (!confirm('Delete this account? Its transactions will remain but become unlinked.')) return;
    await api.delete(`/accounts/${id}`);
    load();
  }

  return (
    <div className="space-y-6 animate-slide-up max-w-2xl">
      <h1 className="text-xl font-semibold text-white">Settings</h1>

      <Card>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-medium text-white">Accounts</h2>
          <button onClick={() => setAdding(true)}
            className="text-xs px-3 py-1.5 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-colors">
            + Add account
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          This app uses manual accounts: add your bank/cash accounts here, update balances as needed, and import transactions via CSV or add them by hand on the Transactions page.
        </p>

        {accounts.length > 0 ? (
          <div className="space-y-2">
            {accounts.map(a => (
              <div key={a.id} className="flex items-center justify-between bg-surface-2 rounded-lg px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">{a.name}</p>
                  <p className="text-xs text-gray-500">{a.currency} · Updated: {a.last_synced?.slice(0, 16).replace('T', ' ') || 'Never'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-emerald-400">{fmt(a.balance, a.currency)}</span>
                  <button onClick={() => setEditing({ id: a.id, name: a.name, balance: a.balance })}
                    className="text-xs text-gray-500 hover:text-white">Edit</button>
                  <button onClick={() => removeAccount(a.id)}
                    className="text-xs text-gray-500 hover:text-rose-400">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No accounts yet — add one to get started.</p>
        )}
      </Card>

      <Card>
        <h2 className="font-medium text-white mb-1">Importing transactions</h2>
        <p className="text-sm text-gray-500">
          Head to the Transactions page to import a CSV export from your bank, or add individual transactions manually.
        </p>
      </Card>

      <Card>
        <h2 className="font-medium text-white mb-1">Data & privacy</h2>
        <p className="text-sm text-gray-500">
          All financial data lives in your own PostgreSQL (Neon) database. No bank credentials or data are shared with any third party — everything is entered or imported by you.
        </p>
      </Card>

      {adding && (
        <Modal title="Add account" onClose={() => setAdding(false)}>
          <form onSubmit={addAccount} className="space-y-3">
            <input required placeholder="Account name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/50" />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Currency" value={form.currency}
                onChange={e => setForm({ ...form, currency: e.target.value })}
                className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none" />
              <input type="number" step="0.01" placeholder="Starting balance" value={form.balance}
                onChange={e => setForm({ ...form, balance: e.target.value })}
                className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none" />
            </div>
            <button type="submit"
              className="w-full px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm rounded-lg font-medium transition-colors">
              Add account
            </button>
          </form>
        </Modal>
      )}

      {editing && (
        <Modal title="Edit account" onClose={() => setEditing(null)}>
          <form onSubmit={updateBalance} className="space-y-3">
            <input required value={editing.name}
              onChange={e => setEditing({ ...editing, name: e.target.value })}
              className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
            <input type="number" step="0.01" value={editing.balance}
              onChange={e => setEditing({ ...editing, balance: e.target.value })}
              className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
            <button type="submit"
              className="w-full px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm rounded-lg font-medium transition-colors">
              Save
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
