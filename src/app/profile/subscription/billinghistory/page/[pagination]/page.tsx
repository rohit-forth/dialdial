"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, SlidersHorizontal } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
// import debounce from 'lodash/debounce';

const BillingHistory = () => {
  const router = useRouter();
  interface BillingData {
    id: string;
    plan: string;
    date: string;
    amount: string;
    paymentMode: string;
    status: string;
    receipt: string;
  }

  const [billingData, setBillingData] = useState<BillingData[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Initial static data
  const initData = () => {
    const data = [
      {
        id: '234234234',
        plan: 'Pro',
        date: '12 February, 2024',
        amount: '$250',
        paymentMode: 'Credit card',
        status: 'Successful',
        receipt: 'Download'
      },
      {
        id: '234234234',
        plan: 'Pro',
        date: '12 January, 2024',
        amount: '$250',
        paymentMode: 'Credit card',
        status: 'Successful',
        receipt: 'Download'
      },
      {
        id: '234234234',
        plan: 'Pro',
        date: '12 December, 2023',
        amount: '$250',
        paymentMode: 'Credit card',
        status: 'Successful',
        receipt: 'Download'
      },
      {
        id: '234234234',
        plan: 'Pro',
        date: '12 November, 2023',
        amount: '$250',
        paymentMode: 'Credit card',
        status: 'Successful',
        receipt: 'Download'
      },
      {
        id: '234234234',
        plan: 'Basic',
        date: '12 October, 2023',
        amount: '$100',
        paymentMode: 'Credit card',
        status: 'Successful',
        receipt: 'Download'
      },
      {
        id: '234234234',
        plan: 'Basic',
        date: '12 September, 2023',
        amount: '$100',
        paymentMode: 'Credit card',
        status: 'Successful',
        receipt: 'Download'
      },
      {
        id: '234234234',
        plan: 'Basic',
        date: '12 September, 2023',
        amount: '$100',
        paymentMode: 'Credit card',
        status: 'Failed',
        receipt: 'Download'
      },
      {
        id: '234234234',
        plan: 'Basic',
        date: '12 August, 2023',
        amount: '$100',
        paymentMode: 'Credit card',
        status: 'Successful',
        receipt: 'Download'
      },
      {
        id: '234234234',
        plan: 'Basic',
        date: '12 July, 2023',
        amount: '$100',
        paymentMode: 'Credit card',
        status: 'Successful',
        receipt: 'Download'
      },
      {
        id: '234234234',
        plan: 'Basic',
        date: '12 July, 2023',
        amount: '$100',
        paymentMode: 'Credit card',
        status: 'Failed',
        receipt: 'Download'
      },
    ];
    setBillingData(data);
  };

  useEffect(() => {
    initData();
  }, []);

  // Search functionality with debounce
  const handleSearch = (searchTerm: any) => {
    setSearchQuery(searchTerm);
    const queryParams = new URLSearchParams({ search: searchTerm }).toString();
    router.push(`?${queryParams}`);
    // In a real application, you would call initData here with search params
  };

  // Checkbox selection logic
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(billingData.map((_, index) => index));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (index: number) => {
    setSelectedItems((prev: number[]) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      }
      return [...prev, index];
    });
  };

  const isAllSelected = billingData.length > 0 && selectedItems.length === billingData.length;

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-semibold mb-6">Billing history</h1>
      
      {/* Search and Actions Bar */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search and filter"
            className="pl-10"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            disabled={selectedItems.length === 0}
          >
            Select
          </Button>
          <Button
            variant="ghost"
            disabled={selectedItems.length === 0}
          >
            Export
          </Button>
          <Button variant="ghost">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="p-4 text-sm font-medium text-primary">TXN ID</th>
              <th className="p-4 text-sm font-medium text-primary">Plan</th>
              <th className="p-4 text-sm font-medium text-primary">Date</th>
              <th className="p-4 text-sm font-medium text-primary">Amount</th>
              <th className="p-4 text-sm font-medium text-primary">Payment mode</th>
              <th className="p-4 text-sm font-medium text-primary">Status</th>
              <th className="p-4 text-sm font-medium text-primary">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {billingData.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="p-4">
                  <Checkbox
                    checked={selectedItems.includes(index)}
                    onCheckedChange={() => handleSelectItem(index)}
                  />
                </td>
                <td className="p-4 text-sm">{item.id}</td>
                <td className="p-4 text-sm">{item.plan}</td>
                <td className="p-4 text-sm">{item.date}</td>
                <td className="p-4 text-sm">{item.amount}</td>
                <td className="p-4 text-sm">{item.paymentMode}</td>
                <td className="p-4 text-sm">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    item.status === 'Successful' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-sm">
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
                    {item.receipt}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t text-sm text-gray-500">
          Showing 1-10 of 132 results
        </div>
      </div>
    </div>
  );
};



export default function DashboardPage() {
  return (
    <DashboardLayout>
      <BillingHistory />
    </DashboardLayout>
  );
}