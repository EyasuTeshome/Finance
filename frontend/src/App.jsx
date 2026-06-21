import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Charts from './pages/Charts';
import Subscriptions from './pages/Subscriptions';
import Goals from './pages/Goals';
import NetWorth from './pages/NetWorth';
import Settings from './pages/Settings';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="budgets" element={<Budgets />} />
          <Route path="charts" element={<Charts />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="goals" element={<Goals />} />
          <Route path="networth" element={<NetWorth />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
