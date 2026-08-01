'use client';

import React, { useState, useEffect } from 'react';
import Button from '../../../_components/Admin/Button';
import { Tag, Edit2, Trash2, Plus, X, Loader2 } from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    isActive: true,
    usageLimit: '',
  });

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons || []);
      }
    } catch (err) {
      console.error('Error fetching coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const openModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        isActive: coupon.isActive,
        usageLimit: coupon.usageLimit || '',
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        isActive: true,
        usageLimit: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discountValue) {
      alert('Please provide code and discount value.');
      return;
    }

    setSaving(true);
    try {
      const url = editingCoupon 
        ? `/api/admin/coupons/${editingCoupon._id}` 
        : '/api/admin/coupons';
      const method = editingCoupon ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        closeModal();
        loadCoupons();
      } else {
        alert(data.error || 'Failed to save coupon.');
      }
    } catch (err) {
      alert('Network error while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        loadCoupons();
      } else {
        alert(data.error || 'Failed to delete coupon.');
      }
    } catch (err) {
      alert('Network error while deleting.');
    }
  };

  return (
    <main className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-on-surface">Coupons</h2>
          <p className="text-body-md text-on-surface-variant mt-1">Manage discount codes for your store.</p>
        </div>
        <Button onClick={() => openModal()} icon={<Plus className="w-4 h-4" />}>
          Create Coupon
        </Button>
      </div>

      <div className="bg-white border border-[#E1E3E5] rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-on-surface-variant">
            <Tag className="w-12 h-12 mb-4 text-[#C9CCCF]" />
            <h3 className="text-lg font-headline-md text-on-surface mb-2">No coupons found</h3>
            <p className="text-body-md mb-6">Create a discount code to offer promotions to your customers.</p>
            <Button onClick={() => openModal()} icon={<Plus className="w-4 h-4" />}>Create your first coupon</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F7F7] border-b border-[#E1E3E5]">
                  <th className="px-6 py-4 font-headline-sm text-sm text-on-surface">Code</th>
                  <th className="px-6 py-4 font-headline-sm text-sm text-on-surface">Discount</th>
                  <th className="px-6 py-4 font-headline-sm text-sm text-on-surface">Status</th>
                  <th className="px-6 py-4 font-headline-sm text-sm text-on-surface">Usage</th>
                  <th className="px-6 py-4 font-headline-sm text-sm text-on-surface text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="border-b border-[#E1E3E5] hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono bg-surface-container px-2 py-1 rounded text-on-surface font-semibold">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant font-medium">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}% off` : `Rs. ${coupon.discountValue} off`}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : 'used'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openModal(coupon)} className="p-2 text-[#8A8D91] hover:text-primary transition-colors rounded-lg hover:bg-primary/5">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(coupon._id)} className="p-2 text-[#8A8D91] hover:text-red-600 transition-colors rounded-lg hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-[#E1E3E5] flex justify-between items-center">
              <h3 className="font-headline-md text-xl">{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h3>
              <button onClick={closeModal} className="p-2 text-[#8A8D91] hover:bg-[#F3F4F6] rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="couponForm" onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Coupon Code</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.code} 
                    onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 border border-[#C9CCCF] rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono uppercase"
                    placeholder="e.g. SUMMER10"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-on-surface mb-1">Discount Type</label>
                    <select 
                      value={formData.discountType}
                      onChange={e => setFormData({...formData, discountType: e.target.value})}
                      className="w-full px-3 py-2 border border-[#C9CCCF] rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed_amount">Fixed Amount (Rs.)</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-on-surface mb-1">Value</label>
                    <input 
                      type="number" 
                      required 
                      min="1"
                      value={formData.discountValue} 
                      onChange={e => setFormData({...formData, discountValue: e.target.value})}
                      className="w-full px-3 py-2 border border-[#C9CCCF] rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      placeholder="e.g. 10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Usage Limit (Optional)</label>
                  <input 
                    type="number" 
                    min="1"
                    value={formData.usageLimit} 
                    onChange={e => setFormData({...formData, usageLimit: e.target.value})}
                    className="w-full px-3 py-2 border border-[#C9CCCF] rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="Leave blank for unlimited"
                  />
                </div>

                <div className="flex items-center mt-4">
                  <input 
                    type="checkbox" 
                    id="isActive"
                    checked={formData.isActive}
                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-on-surface">
                    Coupon is active
                  </label>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-[#E1E3E5] bg-[#F7F7F7] flex justify-end gap-3">
              <Button variant="secondary" onClick={closeModal} disabled={saving}>Cancel</Button>
              <Button type="submit" form="couponForm" disabled={saving}>
                {saving ? 'Saving...' : 'Save Coupon'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
