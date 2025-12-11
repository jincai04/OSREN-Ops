import React, { useState } from 'react';
import { MOCK_INVOICES } from '../constants';
import { Invoice } from '../types';
import { Filter, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const AccountsModule: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);

  const handleStatusChange = (id: string, newStatus: Invoice['status']) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));
  };

  const filteredInvoices = filter === 'All' ? invoices : invoices.filter(inv => inv.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-700 border-green-200';
      case 'Overdue': return 'bg-red-100 text-red-700 border-red-200';
      case 'Approved': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Accounts Payable & Receivable</h2>
        
        <div className="flex items-center space-x-2 bg-white p-1 rounded-lg border border-slate-200">
          {['All', 'Paid', 'Pending', 'Overdue'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === f ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Invoice ID</th>
                <th className="p-4 font-semibold">Client / Vendor</th>
                <th className="p-4 font-semibold">Due Date</th>
                <th className="p-4 font-semibold text-right">Amount</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-700">{inv.id}</td>
                  <td className="p-4 text-slate-600">{inv.clientName}</td>
                  <td className="p-4 text-slate-600">{inv.dueDate}</td>
                  <td className="p-4 text-right font-mono font-medium text-slate-800">
                    ${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(inv.status)}`}>
                      {inv.status === 'Overdue' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {inv.status === 'Paid' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {inv.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <select
                      value={inv.status}
                      onChange={(e) => handleStatusChange(inv.id, e.target.value as Invoice['status'])}
                      className="text-xs bg-white border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredInvoices.length === 0 && (
            <div className="p-8 text-center text-slate-400">
                No invoices found with status "{filter}".
            </div>
        )}
      </div>
    </div>
  );
};

export default AccountsModule;
