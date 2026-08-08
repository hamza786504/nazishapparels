'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaWhatsapp } from 'react-icons/fa';
import { CheckCircle, Loader, ChevronDown, Truck, Landmark, Upload, ArrowLeft, Lock } from 'lucide-react';
import Select from 'react-select';
import Flags from 'country-flag-icons/react/3x2';
import { useCart } from '../../store/cartContext';
import { useAuth } from '../../store/authContext';
import { COUNTRIES, DEFAULT_COUNTRY, DEFAULT_DIAL_CODE } from '../../../lib/countryData';

const DEFAULT_SHIPPING_CONFIG = {
    cod: true,
    bankDeposit: false,
    whatsappNumber: '',
    bankDetails: { accountTitle: '', accountNumber: '', bankName: '', iban: '' },
    bankDepositReceiptMode: 'both_at_least_one',
    standardCharge: 250,
    freeShippingThreshold: 10000,
    shippingMethods: [
        { id: 'standard', name: 'Standard Shipping', description: '3–5 Business Days', charge: 250, isDefault: true },
    ],
};

// react-select option helpers / styles shared by the country + dial-code pickers.
const countryOptions = COUNTRIES.map((c) => ({
    value: c.name,
    label: c.name,
    code: c.code,
    dialCode: c.dialCode,
}));
const dialCodeOptions = COUNTRIES.map((c) => ({
    value: c.dialCode,
    label: `${c.dialCode} ${c.name}`,
    code: c.code,
}));

const flag = (code) => {
    const Flag = Flags[code];
    return Flag ? <Flag style={{ width: 18, height: 13, marginRight: 8, borderRadius: 2 }} /> : null;
};

// The menus are rendered through a portal to document.body (see menuPortalTarget
// on the Selects below), so a single high z-index keeps them above every section
// on the page and lets them escape any overflow clipping.
const selectStyles = (hasError) => ({
    control: (base, state) => ({
        ...base,
        background: 'rgb(var(--surface-container-low, 247 243 242))',
        border: 'none',
        borderBottom: `2px solid ${hasError ? 'rgb(var(--error, 186 26 26))' : state.isFocused ? 'rgb(var(--secondary, 95 118 70))' : 'rgb(var(--outline-variant, 202 196 194))'}`,
        borderRadius: 0,
        boxShadow: 'none',
        minHeight: '56px',
        padding: '0 8px',
        cursor: 'pointer',
        fontSize: '15px',
        '&:hover': { borderBottomColor: state.isFocused ? 'rgb(var(--secondary, 95 118 70))' : 'rgb(var(--outline-variant, 202 196 194))' },
    }),
    valueContainer: (base) => ({ ...base, padding: '0', fontSize: '15px' }),
    input: (base) => ({ ...base, color: 'rgb(var(--on-surface, 29 27 32))', margin: 0, fontSize: '15px' }),
    singleValue: (base) => ({ ...base, color: 'rgb(var(--on-surface, 29 27 32))', display: 'flex', alignItems: 'center' }),
    placeholder: (base) => ({ ...base, color: 'rgb(var(--outline-variant, 202 196 194))', fontSize: '15px' }),
    indicatorsContainer: (base) => ({ ...base, color: 'rgb(var(--on-surface-variant, 73 69 79))' }),
    dropdownIndicator: (base) => ({ ...base, color: 'rgb(var(--on-surface-variant, 73 69 79))', padding: '0 4px' }),
    clearIndicator: (base) => ({ ...base, color: 'rgb(var(--on-surface-variant, 73 69 79))' }),
    indicatorSeparator: () => ({ display: 'none' }),
    menu: (base) => ({
        ...base,
        position: 'absolute',
        zIndex: 9999,
        marginTop: 6,
        borderRadius: 12,
        border: '1px solid rgb(var(--outline-variant, 202 196 194))',
        boxShadow: '0 16px 40px rgba(0,0,0,0.16)',
        overflow: 'hidden',
        background: 'rgb(var(--surface-container-lowest, 255 255 255))',
    }),
    menuList: (base) => ({ ...base, maxHeight: 280, padding: '6px', overflowX: 'hidden' }),
    option: (base, state) => ({
        ...base,
        display: 'flex',
        alignItems: 'center',
        fontSize: '12px',
        padding: '8px 10px',
        cursor: 'pointer',
        borderRadius: 8,
        background: state.isFocused ? 'rgb(var(--surface-container-high, 236 230 229))' : 'transparent',
        color: 'rgb(var(--on-surface, 29 27 32))',
        whiteSpace: 'nowrap',
        ':active': { background: 'rgb(var(--secondary-container, 222 235 210))' },
    }),
    noOptionsMessage: (base) => ({ ...base, fontSize: '12px', padding: '8px', color: 'rgb(var(--on-surface-variant, 73 69 79))' }),
});

const menuPortal = typeof document !== 'undefined' ? document.body : undefined;

// Split a stored phone value into a dial code + local number so saved-address
// numbers keep working when rendered with the searchable country-code picker.
const parseStoredPhone = (raw) => {
    if (!raw) return { dialCode: DEFAULT_DIAL_CODE, phone: '' };
    const s = String(raw).replace(/\s+/g, '');
    const uniqueCodes = [...new Set(COUNTRIES.map((c) => c.dialCode))].sort((a, b) => b.length - a.length);
    const hit = uniqueCodes.find((d) => s.startsWith(d) && s.length > d.length);
    if (hit) return { dialCode: hit, phone: s.slice(hit.length) };
    return { dialCode: DEFAULT_DIAL_CODE, phone: s };
};

export default function CheckoutPage() {
    const { cartItems, clearCart, appliedCoupon, applyCoupon, removeCoupon } = useCart();
    const { customer, isAuthenticated, refresh } = useAuth();
    const router = useRouter();
    const [shippingConfig, setShippingConfig] = useState(DEFAULT_SHIPPING_CONFIG);
    const [accountType, setAccountType] = useState('new'); // 'new' or 'existing'
    const [formData, setFormData] = useState({
        email: '',
        newsletter: false,
        firstName: '',
        lastName: '',
        address: '',
        apartment: '',
        city: '',
        country: DEFAULT_COUNTRY,
        postalCode: '',
        phone: '',
        phoneDialCode: DEFAULT_DIAL_CODE,
        discountCode: '',
        shippingMethod: 'standard',
        paymentMethod: 'cod',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [receiptFile, setReceiptFile] = useState(null);
    const [receiptUrl, setReceiptUrl] = useState('');
    const [receiptUploading, setReceiptUploading] = useState(false);
    const [whatsappShared, setWhatsappShared] = useState(false);

    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');

    // Derived receipt-submission flags. A single source of truth
    // (`shippingConfig.bankDepositReceiptMode`) drives everything:
    //   upload_only             → receipt image upload required
    //   whatsapp_only           → WhatsApp share required
    //   both_at_least_one       → upload OR WhatsApp (either satisfies)
    const receiptUploadEnabled =
        shippingConfig.bankDepositReceiptMode === 'upload_only' ||
        shippingConfig.bankDepositReceiptMode === 'both_at_least_one';
    const whatsappReceiptEnabled =
        shippingConfig.bankDepositReceiptMode === 'whatsapp_only' ||
        shippingConfig.bankDepositReceiptMode === 'both_at_least_one';

    // Reset receipt state whenever the (async-loaded) config changes.
    useEffect(() => {
        setReceiptUploading(false);
        setWhatsappShared(false);
        setReceiptUrl('');
    }, [shippingConfig]);

    // ── Saved addresses for logged-in customers ───────────────────────────────
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressKey, setSelectedAddressKey] = useState(null);
    const [addressesLoaded, setAddressesLoaded] = useState(false);

    const isLoggedIn = isAuthenticated && !!customer;

    // Map a saved address country value to one of the checkout country options.
    const toCheckoutCountry = (c) => {
        if (!c) return DEFAULT_COUNTRY;
        const lower = String(c).toLowerCase();
        if (lower === 'united states' || lower === 'usa') return 'United States';
        if (lower === 'united arab emirates') return 'United Arab Emirates';
        if (lower === 'united kingdom' || lower === 'uk') return 'United Kingdom';
        return c;
    };

    // When the customer is logged in, load any saved addresses from their
    // address book and pre-fill the form so checkout is one-click.
    useEffect(() => {
        if (!isLoggedIn) return;
        let active = true;
        fetch('/api/account/addresses')
            .then((r) => r.json())
            .then((data) => {
                if (!active || !data.success) return;
                const addrs = Array.isArray(data.addresses) ? data.addresses : [];
                setSavedAddresses(addrs);
                // Auto-select the default (or first) address and fill the form.
                const preferred = addrs.find((a) => a.isDefault) || addrs[0];
                const storedPhone = parseStoredPhone(preferred?.phone);
                setSelectedAddressKey(preferred?._key || null);
                setFormData((prev) => ({
                    ...prev,
                    email: customer.email || prev.email,
                    firstName: preferred?.firstName || prev.firstName,
                    lastName: preferred?.lastName || prev.lastName,
                    address: preferred?.street || prev.address,
                    apartment: preferred?.apartment || prev.apartment,
                    city: preferred?.city || prev.city,
                    country: toCheckoutCountry(preferred?.country),
                    postalCode: preferred?.postalCode || prev.postalCode,
                    phone: storedPhone.phone || prev.phone,
                    phoneDialCode: storedPhone.dialCode || prev.phoneDialCode,
                }));
            })
            .catch(() => {})
            .finally(() => {
                if (active) setAddressesLoaded(true);
            });
        return () => {
            active = false;
        };
    }, [isLoggedIn, customer]);

    // Fill the shipping form from a saved address when the user picks one.
    const selectSavedAddress = (addr) => {
        const storedPhone = parseStoredPhone(addr.phone);
        setSelectedAddressKey(addr._key);
        setFormData((prev) => ({
            ...prev,
            firstName: addr.firstName || prev.firstName,
            lastName: addr.lastName || prev.lastName,
            address: addr.street || prev.address,
            apartment: addr.apartment || prev.apartment,
            city: addr.city || prev.city,
            country: toCheckoutCountry(addr.country),
            postalCode: addr.postalCode || prev.postalCode,
            phone: storedPhone.phone,
            phoneDialCode: storedPhone.dialCode,
        }));
        setErrors((prev) => ({
            ...prev,
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            country: '',
            phone: '',
        }));
    };

    const headerRef = useRef(null);
    const lastScrollRef = useRef(0);

    // ── Load shipping config from admin settings ─────────────────────────
    useEffect(() => {
        fetch('/api/settings/general')
            .then(r => r.json())
            .then(data => {
                if (data.success && data.settings?.shipping) {
                    const cfg = { ...DEFAULT_SHIPPING_CONFIG, ...data.settings.shipping };
                    if (!cfg.shippingMethods || cfg.shippingMethods.length === 0) {
                        cfg.shippingMethods = DEFAULT_SHIPPING_CONFIG.shippingMethods;
                    }
                    setShippingConfig(cfg);
                    const defaultMethod = cfg.shippingMethods.find(m => m.isDefault) || cfg.shippingMethods[0];
                    setFormData(prev => ({
                        ...prev,
                        shippingMethod: defaultMethod?.id || 'standard',
                        paymentMethod: cfg.cod ? 'cod' : cfg.bankDeposit ? 'bank' : 'cod',
                    }));
                }
            })
            .catch(err => console.error('Failed to load shipping config:', err));
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const formatPrice = (price) => {
        return `Rs. ${Number(price).toLocaleString()}`;
    };

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const methods = shippingConfig.shippingMethods || DEFAULT_SHIPPING_CONFIG.shippingMethods;
    const selectedMethod = methods.find(m => m.id === formData.shippingMethod) || methods[0];
    // Free shipping when threshold is set and subtotal meets/exceeds it
    const isFreeShipping = shippingConfig.freeShippingThreshold > 0 && subtotal >= shippingConfig.freeShippingThreshold;
    const baseShippingCost = selectedMethod?.charge || shippingConfig.standardCharge;
    const shippingCost = isFreeShipping ? 0 : baseShippingCost;

    let discountAmount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.discountType === 'percentage') {
            discountAmount = (subtotal * appliedCoupon.discountValue) / 100;
        } else if (appliedCoupon.discountType === 'fixed_amount') {
            discountAmount = appliedCoupon.discountValue;
        }
        if (discountAmount > subtotal) discountAmount = subtotal;
    }

    const total = subtotal - discountAmount + shippingCost;

    const handleApplyCoupon = async () => {
        if (!formData.discountCode.trim()) return;
        setIsApplyingCoupon(true);
        setCouponError('');
        setCouponSuccess('');
        try {
            const res = await fetch('/api/cart/apply-coupon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: formData.discountCode.trim() })
            });
            const data = await res.json();
            if (data.success && data.coupon) {
                applyCoupon(data.coupon);
                setCouponSuccess('Coupon applied!');
                setFormData(prev => ({ ...prev, discountCode: '' }));
            } else {
                setCouponError(data.error || 'Invalid coupon code.');
            }
        } catch (err) {
            setCouponError('Network error while applying coupon.');
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        removeCoupon();
        setCouponSuccess('');
        setCouponError('');
    };

    // ── WhatsApp payment: build a wa.me deep link with the order summary ──
    // The store's WhatsApp number is configured by the admin in Shipping Settings.
    const whatsappNumber = (shippingConfig.whatsappNumber || '').replace(/[\s()\-]/g, '');
    const buildWhatsappMessage = () => {
        const lines = ['*New Order — Payment via WhatsApp*'];
        if (formData.firstName || formData.lastName) {
            lines.push(`Name: ${`${formData.firstName} ${formData.lastName}`.trim()}`);
        }
        if (formData.phone) lines.push(`Phone: ${formData.phoneDialCode || ''}${formData.phone}`);
        if (formData.email) lines.push(`Email: ${formData.email}`);
        lines.push('');
        lines.push('*Order Items:*');
        cartItems.forEach((item) => {
            const colorPart = item.color && item.color !== 'Default' ? ` / ${item.color}` : '';
            lines.push(
                `- ${item.title} (Size: ${item.size}${colorPart}) x${item.quantity} = Rs. ${(item.price * item.quantity).toLocaleString()}`
            );
        });
        lines.push('');
        lines.push(`*Order Total:* Rs. ${total.toLocaleString()}`);
        lines.push(`Shipping Method: ${selectedMethod?.name || 'Standard Shipping'}`);
        return lines.join('\n');
    };
    const whatsappLink = whatsappNumber
        ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildWhatsappMessage())}`
        : null;

    const handleReceiptUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setReceiptFile(file);
        setReceiptUploading(true);
        setErrors((prev) => ({ ...prev, receipt: '' }));
        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.message || 'Upload failed');
            setReceiptUrl(data.url);
        } catch (err) {
            setErrors((prev) => ({ ...prev, receipt: err.message }));
            setReceiptFile(null);
        } finally {
            setReceiptUploading(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.pageYOffset;
            const header = headerRef.current;
            if (header) {
                if (currentScroll > lastScrollRef.current && currentScroll > 100) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
                header.style.transition = 'transform 0.3s ease-out';
            }
            lastScrollRef.current = currentScroll;
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!formData.email.trim()) newErrors.email = 'Email is required.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = 'Please enter a valid email address.';
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
        if (!formData.address.trim()) newErrors.address = 'Address is required.';
        if (!formData.city.trim()) newErrors.city = 'City is required.';
        if (!formData.country || formData.country === 'Country/Region') newErrors.country = 'Please select a country.';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
        else {
            const fullPhone = `${formData.phoneDialCode || ''}${formData.phone}`.replace(/[^+\d]/g, '');
            if (!/^\+?\d{7,15}$/.test(fullPhone))
                newErrors.phone = 'Please enter a valid phone number.';
        }
        if (cartItems.length === 0) newErrors.cart = 'Your cart is empty.';

        // Validate password fields only for new (guest) accounts
        if (!isLoggedIn && accountType === 'new') {
            if (!formData.password) newErrors.password = 'Password is required.';
            else if (formData.password.length < 6)
                newErrors.password = 'Password must be at least 6 characters.';
            if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password.';
            else if (formData.password !== formData.confirmPassword)
                newErrors.confirmPassword = 'Passwords do not match.';
        }

        // Existing accounts must enter their password; it's verified against
        // the account before the order is allowed through.
        if (!isLoggedIn && accountType === 'existing') {
            if (!formData.password) newErrors.password = 'Password is required.';
        }
        // Bank Deposit receipt proof — required only when Bank Deposit is the
        // selected method. How it's proven is set by the admin's
        // `bankDepositReceiptMode`: upload_only, whatsapp_only, or
        // both_at_least_one (either one satisfies).
        if (formData.paymentMethod === 'bank') {
            const mode = shippingConfig.bankDepositReceiptMode;
            if (mode === 'whatsapp_only') {
                if (!whatsappShared)
                    newErrors.receipt = 'Please share your payment receipt on WhatsApp before placing your order.';
            } else if (mode === 'upload_only') {
                if (!receiptUrl)
                    newErrors.receipt = 'Please upload a payment receipt screenshot.';
            } else if (!receiptUrl && !whatsappShared) {
                newErrors.receipt = 'Please upload a receipt or share it on WhatsApp to confirm your payment.';
            }
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Scroll to first error
            const firstErrorKey = Object.keys(validationErrors)[0];
            const el = document.getElementById(firstErrorKey);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setIsSubmitting(true);
        try {
            // Existing account: verify email + password BEFORE the order can be
            // placed. On success this sets the session cookie, so the orders API
            // will treat the checkout as a logged-in customer.
            if (!isLoggedIn && accountType === 'existing') {
                const loginRes = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email, password: formData.password }),
                });
                const loginData = await loginRes.json();
                if (!loginRes.ok || !loginData.success) {
                    const message =
                        loginRes.status === 401
                            ? 'Invalid email or password. Please check your credentials.'
                            : loginData.error || 'Invalid email or password.';
                    setErrors({ submit: message });
                    return;
                }
            }

            const orderPayload = {
                customer: {
                    name: `${formData.firstName} ${formData.lastName}`.trim(),
                    email: formData.email,
                    avatar: `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase(),
                },
                email: formData.email,
                phone: `${formData.phoneDialCode || ''}${formData.phone}`.replace(/[^+\d]/g, ''),
                address: formData.address,
                apartment: formData.apartment,
                city: formData.city,
                country: formData.country,
                postalCode: formData.postalCode,
                shippingMethod: formData.shippingMethod,
                shippingMethodName: selectedMethod?.name || 'Standard Shipping',
                shipping: shippingCost,
                paymentMethod: formData.paymentMethod,
                total,
                items: cartItems.map((item) => ({
                    productId: item.productId,
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color,
                })),
                paymentStatus: 'Pending',
                fulfillmentStatus: 'Unfulfilled',
                channel: 'Online Store',
                appliedCouponCode: appliedCoupon ? appliedCoupon.code : null,
                // Include password only for new (guest) account creation
                ...(!isLoggedIn && accountType === 'new' && { password: formData.password }),
                ...(receiptUrl && { receiptUrl }),
            };

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload),
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to place order.');
            }

            // Clear cart, refresh auth (the orders API sets the session cookie for
            // newly created accounts) and go to the thank-you page.
            clearCart();
            await refresh();
            sessionStorage.setItem(
                'lastOrder',
                JSON.stringify({
                    orderId: data.order.orderId,
                    orderRef: data.order._id,
                    total,
                    name: `${formData.firstName} ${formData.lastName}`.trim(),
                    email: formData.email,
                    address: [formData.address, formData.apartment, formData.city, formData.country]
                        .filter(Boolean)
                        .join(', '),
                    shippingMethod: selectedMethod?.name || 'Standard Shipping',
                })
            );
            router.replace('/order-confirmation');
        } catch (err) {
            setErrors({ submit: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Checkout Form ────────────────────────────────────────────────────────────
    return (
        <div className="bg-white text-on-surface font-body-md selection:bg-secondary-fixed selection:text-on-secondary-fixed flex-1 min-w-0 overflow-x-hidden overflow-y-auto">
            <style jsx global>{`
                body {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
                .order-summary::-webkit-scrollbar { width: 4px; }
                .order-summary::-webkit-scrollbar-track { background: #fcf9f8; }
                .order-summary::-webkit-scrollbar-thumb { background: #e5e2e1; }
                .field-error { border-color: rgb(var(--error, 186 26 26)) !important; }
            `}</style>

            <main className="max-w-container-max mx-auto px-2 md:px-margin-desktop py-stack-md md:py-stack-lg">
                <form onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                        {/* Left Panel */}
                        <div className="lg:col-span-7 space-y-12 order-2 lg:order-1 mt-8 lg:mt-0 min-w-0">

                            {/* Cart error */}
                            {errors.cart && (
                                <p className="text-error text-label-sm bg-error-container/20 px-4 py-3 border border-error/30">{errors.cart}</p>
                            )}
                            {errors.submit && (
                                <p className="text-error text-label-sm bg-error-container/20 px-4 py-3 border border-error/30">{errors.submit}</p>
                            )}

                            {/* Contact Information */}
                            <section>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 gap-4">
                                    <h2 className="text-base md:text-lg text-black font-bold">Contact Information</h2>
                                    {isLoggedIn ? (
                                        <span className="flex items-center gap-2 text-label-sm font-label-sm text-secondary">
                                            <CheckCircle className="w-[18px] h-[18px]" />
                                            Logged in as {customer.email}
                                        </span>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    className="w-4 h-4 text-secondary focus:ring-secondary/20"
                                                    id="accountTypeNew"
                                                    name="accountType"
                                                    type="radio"
                                                    value="new"
                                                    checked={accountType === 'new'}
                                                    onChange={(e) => setAccountType(e.target.value)}
                                                />
                                                <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="accountTypeNew">
                                                    New Account
                                                </label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    className="w-4 h-4 text-secondary focus:ring-secondary/20"
                                                    id="accountTypeExisting"
                                                    name="accountType"
                                                    type="radio"
                                                    value="existing"
                                                    checked={accountType === 'existing'}
                                                    onChange={(e) => setAccountType(e.target.value)}
                                                />
                                                <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="accountTypeExisting">
                                                    Already have an account
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <input
                                            className={`w-full bg-surface-container-low border-none border-b-2 focus:ring-0 py-4 px-4 transition-all duration-300 placeholder:text-outline-variant text-body-md focus:scale-[1.01] ${errors.email ? 'border-b-2 border-error' : 'border-outline-variant focus:border-secondary'}`}
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Email address"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            readOnly={isLoggedIn}
                                        />
                                        {errors.email && <p className="text-error text-[11px] mt-1 px-1">{errors.email}</p>}
                                    </div>

                                    {/* Password fields for new account */}
                                    {!isLoggedIn && accountType === 'new' && (
                                        <>
                                            <div className="relative group">
                                                <input
                                                    className={`w-full bg-surface-container-low border-none border-b-2 focus:ring-0 py-4 px-4 transition-all duration-300 placeholder:text-outline-variant text-body-md focus:scale-[1.01] ${errors.password ? 'border-b-2 border-error' : 'border-outline-variant focus:border-secondary'}`}
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    placeholder="Password (min 6 characters)"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                />
                                                {errors.password && <p className="text-error text-[11px] mt-1 px-1">{errors.password}</p>}
                                            </div>
                                            <div className="relative group">
                                                <input
                                                    className={`w-full bg-surface-container-low border-none border-b-2 focus:ring-0 py-4 px-4 transition-all duration-300 placeholder:text-outline-variant text-body-md focus:scale-[1.01] ${errors.confirmPassword ? 'border-b-2 border-error' : 'border-outline-variant focus:border-secondary'}`}
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    type="password"
                                                    placeholder="Confirm Password"
                                                    value={formData.confirmPassword}
                                                    onChange={handleInputChange}
                                                />
                                                {errors.confirmPassword && <p className="text-error text-[11px] mt-1 px-1">{errors.confirmPassword}</p>}
                                            </div>
                                        </>
                                    )}

                                    {/* Password field for existing account */}
                                    {!isLoggedIn && accountType === 'existing' && (
                                        <div className="relative group">
                                            <input
                                                className={`w-full bg-surface-container-low border-none border-b-2 focus:ring-0 py-4 px-4 transition-all duration-300 placeholder:text-outline-variant text-body-md focus:scale-[1.01] ${errors.password ? 'border-b-2 border-error' : 'border-outline-variant focus:border-secondary'}`}
                                                id="password"
                                                name="password"
                                                type="password"
                                                placeholder="Enter your password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                            />
                                            {errors.password && <p className="text-error text-[11px] mt-1 px-1">{errors.password}</p>}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 py-2">
                                        <input
                                            className="w-4 h-4 rounded-none border-secondary text-secondary focus:ring-secondary/20"
                                            id="news"
                                            name="newsletter"
                                            type="checkbox"
                                            checked={formData.newsletter}
                                            onChange={handleInputChange}
                                        />
                                        <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="news">
                                            Email me with news and offers
                                        </label>
                                    </div>
                                </div>
                            </section>

                            {/* Shipping Address */}
                            <section className="pt-4 space-y-6">
                                <h2 className="text-base md:text-lg text-black font-bold">Shipping Address</h2>

                                {/* Saved addresses from the customer's address book */}
                                {isLoggedIn && (
                                    <div className="space-y-3">
                                        {!addressesLoaded ? (
                                            <p className="text-label-sm text-on-surface-variant flex items-center gap-2">
                                                <Loader className="w-[18px] h-[18px] animate-spin" />
                                                Loading saved addresses…
                                            </p>
                                        ) : savedAddresses.length > 0 ? (
                                            <>
                                                <p className="text-label-sm text-on-surface-variant">
                                                    Choose a saved address or fill in the form below.
                                                </p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {savedAddresses.map((addr) => {
                                                        const selected = addr._key === selectedAddressKey;
                                                        return (
                                                            <label
                                                                key={addr._key}
                                                                className={`flex items-start gap-3 text-left p-4 border cursor-pointer transition-all duration-200 ${
                                                                    selected
                                                                        ? 'border-secondary bg-white'
                                                                        : 'border-black hover:border-black'
                                                                }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="savedAddress"
                                                                    value={addr._key}
                                                                    checked={selected}
                                                                    onChange={() => selectSavedAddress(addr)}
                                                                    className="mt-1 w-4 h-4 text-secondary focus:ring-secondary/20 border-secondary"
                                                                />
                                                                <span className="flex-1 min-w-0">
                                                                    <span className="flex items-center justify-between mb-1">
                                                                        <span className="text-sm text-black capitalize tracking-wider truncate">
                                                                            {`${addr.firstName || ''} ${addr.lastName || ''}`.trim() || 'Address'}
                                                                        </span>
                                                                        {addr.isDefault && (
                                                                            <span className="text-[10px] uppercase tracking-wider text-secondary flex-shrink-0 ml-2">
                                                                                Default
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                    <span className="block text-label-sm text-on-surface-variant leading-snug">
                                                                        {[addr.street, addr.apartment, addr.city, addr.country]
                                                                            .filter(Boolean)
                                                                            .join(', ')}
                                                                    </span>
                                                                    {addr.phone && (
                                                                        <span className="block text-label-sm text-on-surface-variant mt-1">{addr.phone}</span>
                                                                    )}
                                                                </span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-label-sm text-on-surface-variant">
                                                No saved addresses yet — add one from your{' '}
                                                <Link href="/address" className="text-secondary underline">
                                                    Address Book
                                                </Link>{' '}
                                                or fill in the form below.
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            className={`w-full bg-surface-container-low border-none border-b-2 focus:ring-0 py-4 px-4 transition-all duration-300 focus:scale-[1.01] ${errors.firstName ? 'border-b-2 border-error' : 'border-outline-variant focus:border-secondary'}`}
                                            id="firstName"
                                            placeholder="First name"
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                        />
                                        {errors.firstName && <p className="text-error text-[11px] mt-1 px-1">{errors.firstName}</p>}
                                    </div>
                                    <div>
                                        <input
                                            className={`w-full bg-surface-container-low border-none border-b-2 focus:ring-0 py-4 px-4 transition-all duration-300 focus:scale-[1.01] ${errors.lastName ? 'border-b-2 border-error' : 'border-outline-variant focus:border-secondary'}`}
                                            id="lastName"
                                            placeholder="Last name"
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                        />
                                        {errors.lastName && <p className="text-error text-[11px] mt-1 px-1">{errors.lastName}</p>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <input
                                            className={`w-full bg-surface-container-low border-none border-b-2 focus:ring-0 py-4 px-4 transition-all duration-300 focus:scale-[1.01] ${errors.address ? 'border-b-2 border-error' : 'border-outline-variant focus:border-secondary'}`}
                                            id="address"
                                            placeholder="Address"
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                        />
                                        {errors.address && <p className="text-error text-[11px] mt-1 px-1">{errors.address}</p>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <input
                                            className="w-full bg-surface-container-low border-none border-b-2 border-outline-variant focus:border-secondary focus:ring-0 py-4 px-4 transition-all duration-300 focus:scale-[1.01]"
                                            placeholder="Apartment, suite, etc. (optional)"
                                            type="text"
                                            name="apartment"
                                            value={formData.apartment}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            className={`w-full bg-surface-container-low border-none border-b-2 focus:ring-0 py-4 px-4 transition-all duration-300 focus:scale-[1.01] ${errors.city ? 'border-b-2 border-error' : 'border-outline-variant focus:border-secondary'}`}
                                            id="city"
                                            placeholder="City"
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                        />
                                        {errors.city && <p className="text-error text-[11px] mt-1 px-1">{errors.city}</p>}
                                    </div>
                                    <div className="relative">
                                        <Select
                                            id="country"
                                            name="country"
                                            inputId="country"
                                            options={countryOptions}
                                            value={countryOptions.find((o) => o.value === formData.country) || null}
                                            onChange={(opt) => {
                                                setFormData((prev) => ({ ...prev, country: opt?.value || '' }));
                                                setErrors((prev) => ({ ...prev, country: '' }));
                                            }}
                                            placeholder="Select country"
                                            isClearable={false}
                                            isSearchable
                                            getOptionLabel={(o) => o.label}
                                            formatOptionLabel={(o, { context }) => (
                                                <span className="flex items-center">
                                                    {flag(o.code)}
                                                    <span className="truncate">{o.label}</span>
                                                </span>
                                            )}
                                            components={{ DropdownIndicator: () => <ChevronDown className="pointer-events-none text-on-surface-variant" /> }}
                                            styles={selectStyles(!!errors.country)}
                                            menuPosition="absolute"
                                            menuPortalTarget={menuPortal}
                                            aria-label="Country"
                                        />
                                        {errors.country && <p className="text-error text-[11px] mt-1 px-1">{errors.country}</p>}
                                    </div>
                                    <div>
                                        <input
                                            className="w-full bg-surface-container-low border-none border-b-2 border-outline-variant focus:border-secondary focus:ring-0 py-4 px-4 transition-all duration-300 focus:scale-[1.01]"
                                            placeholder="Postal code (optional)"
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <div className={`flex items-stretch bg-surface-container-low border-b-2 transition-all duration-300 focus-within:scale-[1.01] ${errors.phone ? 'border-error' : 'border-outline-variant focus-within:border-secondary'}`}>
                                            <Select
                                                id="phoneDialCode"
                                                name="phoneDialCode"
                                                inputId="phoneDialCode"
                                                options={dialCodeOptions}
                                                value={dialCodeOptions.find((o) => o.value === formData.phoneDialCode) || null}
                                                onChange={(opt) => setFormData((prev) => ({ ...prev, phoneDialCode: opt?.value || DEFAULT_DIAL_CODE }))}
                                                isClearable={false}
                                                isSearchable
                                                getOptionLabel={(o) => o.label}
                                                formatOptionLabel={(o, { context }) => (
                                                    <span className="flex items-center">
                                                        {flag(o.code)}
                                                        <span className="truncate">{context === 'menu' ? o.label : o.value}</span>
                                                    </span>
                                                )}
                                                components={{ DropdownIndicator: () => <ChevronDown className="pointer-events-none text-on-surface-variant" /> }}
                                                styles={{
                                                    ...selectStyles(!!errors.phone),
                                                    control: (base, state) => ({
                                                        ...selectStyles(!!errors.phone).control(base, state),
                                                        minWidth: 96,
                                                        minHeight: '56px',
                                                        borderBottom: 'none',
                                                        padding: '0 4px 0 8px',
                                                    }),
                                                    valueContainer: (base) => ({ ...base, padding: '0', fontSize: '15px' }),
                                                    // Give the menu its own comfortable width instead of inheriting
                                                    // the narrow control, which caused a horizontal scrollbar.
                                                    menu: (base) => ({
                                                        ...selectStyles(!!errors.phone).menu(base),
                                                        minWidth: 230,
                                                        width: 'max-content',
                                                    }),
                                                }}
                                                menuPosition="absolute"
                                                menuPortalTarget={menuPortal}
                                                aria-label="Phone country code"
                                            />
                                            <input
                                                className={`w-full min-w-0 bg-transparent focus:ring-0 py-4 px-2 transition-all duration-300 text-body-md ${errors.phone ? '' : ''}`}
                                                id="phone"
                                                placeholder="Phone number"
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        {errors.phone && <p className="text-error text-[11px] mt-1 px-1">{errors.phone}</p>}
                                    </div>
                                </div>
                            </section>

                            {/* Shipping Method — selectable options */}
                            <section className="pt-4 space-y-6">
                                <h2 className="text-base md:text-lg text-black font-bold">Shipping Method</h2>
                                <div className="border border-secondary/10 bg-surface-container-low overflow-hidden divide-y divide-secondary/10">
                                    {methods.map((method) => (
                                        <label
                                            key={method.id}
                                            className={`flex items-center gap-4 p-4 md:p-5 cursor-pointer hover:bg-surface-container-high transition-colors ${formData.shippingMethod === method.id ? 'bg-secondary/5' : ''}`}
                                        >
                                            <input
                                                className="w-4 h-4 text-secondary focus:ring-secondary/20 border-secondary flex-shrink-0"
                                                name="shippingMethod"
                                                type="radio"
                                                value={method.id}
                                                checked={formData.shippingMethod === method.id}
                                                onChange={handleInputChange}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <span className="text-body-md font-label-md text-black block truncate">{method.name}</span>
                                                {method.description && (
                                                    <span className="text-body-sm text-on-surface-variant truncate block">{method.description}</span>
                                                )}
                                            </div>
                                            <span className="text-label-md font-label-md text-black whitespace-nowrap flex-shrink-0">
                                                {isFreeShipping ? (
                                                    <>
                                                        <span className="line-through text-on-surface-variant mr-1">{formatPrice(method.charge)}</span>
                                                        <span className="text-black font-bold">FREE</span>
                                                    </>
                                                ) : (
                                                    formatPrice(method.charge)
                                                )}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {isFreeShipping && (
                                    <p className="text-body-sm text-black flex items-center gap-1.5">
                                        <Truck className="w-4 h-4 flex-shrink-0" />
                                        Free shipping applied — your order exceeds Rs. {shippingConfig.freeShippingThreshold.toLocaleString()}!
                                    </p>
                                )}
                            </section>

                            {/* Payment Information */}
                            <section className="pt-4 space-y-6">
                                <div className="flex flex-col">
                                    <h2 className="text-base md:text-lg text-black font-bold">Payment Method</h2>
                                    <p className="text-label-sm font-label-sm text-on-surface-variant">All transactions are secure and encrypted.</p>
                                </div>
                                <div className="border border-secondary/10 bg-surface-container-low overflow-hidden divide-y divide-secondary/10">
                                    {/* Cash on Delivery */}
                                    {shippingConfig.cod && (
                                        <label className="flex items-center gap-4 p-4 md:p-5 cursor-pointer hover:bg-surface-container-high transition-colors">
                                            <input
                                                className="w-4 h-4 text-secondary focus:ring-secondary/20 border-secondary flex-shrink-0"
                                                name="paymentMethod"
                                                type="radio"
                                                value="cod"
                                                checked={formData.paymentMethod === 'cod'}
                                                onChange={handleInputChange}
                                            />
                                            <div className="min-w-0">
                                                <span className="text-body-md font-label-md text-black block">Cash on Delivery (COD)</span>
                                                <span className="text-body-sm text-on-surface-variant block truncate">Pay in cash when your order arrives</span>
                                            </div>
                                        </label>
                                    )}

                                    {/* Bank Deposit */}
                                    {shippingConfig.bankDeposit && (
                                        <label className="flex items-center gap-4 p-4 md:p-5 cursor-pointer hover:bg-surface-container-high transition-colors">
                                            <input
                                                className="w-4 h-4 text-secondary focus:ring-secondary/20 border-secondary flex-shrink-0"
                                                name="paymentMethod"
                                                type="radio"
                                                value="bank"
                                                checked={formData.paymentMethod === 'bank'}
                                                onChange={handleInputChange}
                                            />
                                            <div className="min-w-0">
                                                <span className="text-body-md font-label-md text-black block">Bank Deposit</span>
                                                <span className="text-body-sm text-on-surface-variant block truncate">Transfer to our bank account before delivery</span>
                                            </div>
                                        </label>
                                    )}

                                    {/* WhatsApp is NOT a separate payment method — it's a
                                        receipt-submission option shown inside the Bank Deposit
                                        info box below, gated by shippingConfig.bankDepositReceiptMode. */}
                                </div>

                                {/* Bank Deposit info box — shown when Bank Deposit is selected.
                                    WhatsApp is NOT a separate payment method; it is a receipt-
                                    submission option gated by shippingConfig.bankDepositReceiptMode. */}
                                {formData.paymentMethod === 'bank' && shippingConfig.bankDeposit && (
                                    <div className="border border-secondary/20 bg-surface-container-low p-4 md:p-5 space-y-3">
                                        <p className="text-label-md font-bold text-black flex items-center gap-2">
                                            <Landmark className="w-4 h-4" />
                                            Bank Transfer Details
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-body-md">
                                            {shippingConfig.bankDetails.accountTitle && (
                                                <div className="min-w-0">
                                                    <span className="text-on-surface-variant text-xs uppercase tracking-wide block mb-0.5">Account Title</span>
                                                    <span className="font-medium text-on-surface truncate block">{shippingConfig.bankDetails.accountTitle}</span>
                                                </div>
                                            )}
                                            {shippingConfig.bankDetails.bankName && (
                                                <div className="min-w-0">
                                                    <span className="text-on-surface-variant text-xs uppercase tracking-wide block mb-0.5">Bank</span>
                                                    <span className="font-medium text-on-surface truncate block">{shippingConfig.bankDetails.bankName}</span>
                                                </div>
                                            )}
                                            {shippingConfig.bankDetails.accountNumber && (
                                                <div className="min-w-0">
                                                    <span className="text-on-surface-variant text-xs uppercase tracking-wide block mb-0.5">Account Number</span>
                                                    <span className="font-medium text-on-surface font-mono truncate block">{shippingConfig.bankDetails.accountNumber}</span>
                                                </div>
                                            )}
                                            {shippingConfig.bankDetails.iban && (
                                                <div className="min-w-0">
                                                    <span className="text-on-surface-variant text-xs uppercase tracking-wide block mb-0.5">IBAN</span>
                                                    <span className="font-medium text-on-surface font-mono text-xs sm:text-sm truncate block">{shippingConfig.bankDetails.iban}</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-body-sm text-on-surface-variant border-t border-secondary/10 pt-3">
                                            ⚠️ Please transfer the exact order total and send a payment screenshot to confirm. Your order will be processed after payment is verified.
                                        </p>

                                        {/* Upload receipt option — shown for upload_only / both_at_least_one */}
                                        {receiptUploadEnabled && (
                                            <div className="border-t border-secondary/10 pt-4">
                                                <p className="text-label-md font-bold text-black mb-3">Upload Payment Receipt</p>
                                                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-secondary/30 rounded cursor-pointer hover:border-secondary transition-colors bg-surface-container-lowest text-center px-4">
                                                    {receiptUrl ? (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
                                                            <span className="text-label-sm text-secondary">Receipt uploaded</span>
                                                            <span className="text-label-sm text-on-surface-variant">Tap to replace</span>
                                                        </div>
                                                    ) : receiptUploading ? (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Loader className="w-6 h-6 md:w-8 md:h-8 animate-spin text-secondary" />
                                                            <span className="text-label-sm text-on-surface-variant">Uploading…</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Upload className="w-6 h-6 md:w-8 md:h-8 text-on-surface-variant" />
                                                            <span className="text-label-sm text-on-surface-variant">Click to upload receipt screenshot</span>
                                                            <span className="text-[10px] sm:text-label-sm text-on-surface-variant/60">PNG, JPG up to 5MB</span>
                                                        </div>
                                                    )}
                                                    <input type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={handleReceiptUpload} disabled={receiptUploading} />
                                                </label>
                                            </div>
                                        )}

                                        {/* WhatsApp share option — shown for whatsapp_only / both_at_least_one */}
                                        {whatsappReceiptEnabled && (
                                            <div className="border-t border-secondary/10 pt-4 space-y-4">
                                                <p className="text-label-md font-bold text-black flex items-center gap-2">
                                                    <FaWhatsapp className="text-[#25D366] text-lg" />
                                                    Share Receipt on WhatsApp
                                                </p>
                                                <p className="text-body-sm text-on-surface-variant">
                                                    Share a screenshot of your payment (bank transfer / easypaisa / jazzcash) with us on WhatsApp. We&apos;ll verify it and process your order.
                                                </p>

                                                {whatsappLink ? (
                                                    <a
                                                        href={whatsappLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={() => setWhatsappShared(true)}
                                                        className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5b] text-white py-3 md:py-4 font-label-md text-[11px] sm:text-label-md uppercase tracking-widest transition-all active:scale-[0.98]"
                                                    >
                                                        <FaWhatsapp className="text-base sm:text-lg" />
                                                        Share Receipt on WhatsApp
                                                    </a>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-2 w-full bg-surface-container-highest text-on-surface-variant py-4 font-label-md text-label-md cursor-not-allowed">
                                                        <FaWhatsapp className="text-lg" />
                                                        WhatsApp number not set
                                                    </div>
                                                )}

                                                {whatsappLink && whatsappShared && (
                                                    <p className="text-body-sm text-secondary flex items-center gap-1.5">
                                                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                                        WhatsApp opened — send your screenshot, then come back and place your order.
                                                    </p>
                                                )}
                                                {!whatsappLink && (
                                                    <p className="text-body-sm text-error">
                                                        The store hasn&apos;t configured a WhatsApp number yet. Please contact support or choose another payment method.
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Hint shown when either proof satisfies */}
                                        {shippingConfig.bankDepositReceiptMode === 'both_at_least_one' && (
                                            <p className="text-body-sm text-on-surface-variant border-t border-secondary/10 pt-3">
                                                You can either upload a receipt above or share it on WhatsApp — only one is required to place your order.
                                            </p>
                                        )}

                                        {errors.receipt && <p className="text-error text-[11px] mt-2">{errors.receipt}</p>}
                                    </div>
                                )}
                            </section>

                            {/* Navigation */}
                            <div className="flex flex-col-reverse md:flex-row justify-between items-center pt-8 gap-6">
                                <Link
                                    href="/cart"
                                    className="flex items-center gap-2 text-label-md font-label-md text-on-surface-variant hover:text-black transition-colors group py-2"
                                >
                                    <span className="group-hover:-translate-x-1 transition-transform"><ArrowLeft className="w-3.5 h-3.5" /></span>
                                    Return to cart
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full md:w-auto bg-black text-on-primary px-8 lg:px-16 py-4 md:py-5 font-label-md text-label-md uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all border border-secondary/20 shadow-lg shadow-primary/5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader className="w-[18px] h-[18px] animate-spin" />
                                            Placing Order...
                                        </>
                                    ) : (
                                        'Complete Purchase'
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Right Panel: Order Summary */}
                        <aside className="lg:col-span-5 bg-surface-container-low p-5 sm:p-8 lg:sticky top-0 border border-secondary/5 order-1 lg:order-2 min-w-0">
                            <h3 className="text-base md:text-lg text-black font-bold mb-6 md:mb-8">Order Summary</h3>

                            {/* Product List */}
                            <div className="order-summary space-y-4 md:space-y-6 max-h-[300px] md:max-h-[400px] overflow-y-auto pt-3 -mt-3 pr-0 md:pr-4 mb-6 md:mb-8">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-3 group">
                                        <div className="relative w-16 h-20 flex-shrink-0">
                                            <Image className="object-cover" alt={item.title || ''} src={item.image} fill sizes="(max-width: 768px) 44px, 60px" />
                                            <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 bg-black text-on-secondary text-[10px] flex items-center justify-center rounded-full font-bold">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex flex-col justify-center flex-grow min-w-0">
                                            <h4 className="text-body-sm md:text-body-md font-bold text-black group-hover:text-secondary transition-colors truncate">{item.title}</h4>
                                            <p className="text-[10px] md:text-label-sm font-label-sm text-on-surface-variant truncate">
                                                Size: {item.size} {item.color && item.color !== 'Default' ? `/ Color: ${item.color}` : ''}
                                            </p>
                                        </div>
                                        <div className="flex flex-col justify-center items-end flex-shrink-0">
                                            <p className="text-body-sm md:text-body-md font-headline-md text-black">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                                {cartItems.length === 0 && (
                                    <p className="text-on-surface-variant italic text-sm">No items in your cart.</p>
                                )}
                            </div>

                            {/* Discount Code */}
                            {!appliedCoupon && (
                                <div className="mb-8">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <input
                                            className="flex-grow bg-surface border-none border-b-2 border-outline-variant focus:border-secondary focus:ring-0 py-3 px-4 transition-all duration-300 text-sm"
                                            placeholder="Discount code"
                                            type="text"
                                            name="discountCode"
                                            value={formData.discountCode}
                                            onChange={handleInputChange}
                                        />
                                        <button 
                                            type="button" 
                                            onClick={handleApplyCoupon}
                                            disabled={isApplyingCoupon}
                                            className="bg-black text-white px-6 py-3 text-label-sm font-label-md uppercase tracking-wider cursor-pointer transition-colors disabled:opacity-50"
                                        >
                                            {isApplyingCoupon ? 'Applying...' : 'Apply'}
                                        </button>
                                    </div>
                                    {couponError && <p className="text-error text-sm mt-2">{couponError}</p>}
                                </div>
                            )}

                            {appliedCoupon && (
                                <div className="mb-8 p-4 bg-green-50 border border-green-200 flex justify-between items-center">
                                    <div>
                                        <p className="text-green-800 font-bold text-sm">Code {appliedCoupon.code} applied!</p>
                                        <p className="text-green-700 text-xs">Discount: -{formatPrice(discountAmount)}</p>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={handleRemoveCoupon}
                                        className="text-xs text-secondary underline hover:text-black transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}

                            {/* Totals */}
                            <div className="space-y-3 border-t border-secondary/10 pt-8">
                                <div className="flex justify-between">
                                    <span className="text-body-md text-on-surface-variant">Subtotal</span>
                                    <span className="text-body-md font-medium text-black">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-body-md text-on-surface-variant">Shipping</span>
                                    {isFreeShipping ? (
                                        <span className="text-body-md font-medium text-black">
                                            <span className="line-through text-on-surface-variant/50 mr-1">{formatPrice(baseShippingCost)}</span>
                                            FREE
                                        </span>
                                    ) : (
                                        <span className="text-body-md font-medium text-black">{formatPrice(shippingCost)}</span>
                                    )}
                                </div>
                                
                                {appliedCoupon && (
                                    <div className="flex justify-between items-center text-green-700 mt-2">
                                        <span className="font-body-md text-sm">Discount ({appliedCoupon.code})</span>
                                        <span className="font-headline-sm text-sm">-{formatPrice(discountAmount)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center border-t border-secondary/10 pt-4 mt-4">
                                    <span className="text-base md:text-lg text-black font-bold">Total</span>
                                    <div className="text-right">
                                        <span className="text-label-sm font-label-sm text-on-surface-variant block">PKR</span>
                                        <span className="text-headline-md font-headline-md text-black">{formatPrice(total)}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-8 text-label-sm font-label-sm text-on-surface-variant flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Secure checkout. All data is encrypted.
                            </p>
                        </aside>
                    </div>
                </form>
            </main>
        </div>
    );
}