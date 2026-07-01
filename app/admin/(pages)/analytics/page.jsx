// app/analytics/page.jsx
'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';
import { TrendingUp, TrendingDown, Download, MoreVertical } from 'lucide-react';
import Link from 'next/link';

const AnalyticsPage = () => {
  const [activeTimeView, setActiveTimeView] = useState('Day');
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [hoveredCard, setHoveredCard] = useState(null);

  const timeViews = ['Day', 'Week', 'Month'];

  // Sample data for charts
  const salesData = [
    { date: 'Oct 28', sales: 2800, orders: 45 },
    { date: 'Oct 29', sales: 3200, orders: 52 },
    { date: 'Oct 30', sales: 2900, orders: 48 },
    { date: 'Oct 31', sales: 3500, orders: 58 },
    { date: 'Nov 01', sales: 3100, orders: 51 },
    { date: 'Nov 02', sales: 3800, orders: 62 },
    { date: 'Nov 03', sales: 3600, orders: 59 },
    { date: 'Nov 04', sales: 4200, orders: 68 },
    { date: 'Nov 05', sales: 3900, orders: 64 },
    { date: 'Nov 06', sales: 4400, orders: 72 },
    { date: 'Nov 07', sales: 4100, orders: 67 },
    { date: 'Nov 08', sales: 4600, orders: 75 },
    { date: 'Nov 09', sales: 4300, orders: 70 },
    { date: 'Nov 10', sales: 4800, orders: 78 },
    { date: 'Nov 11', sales: 4500, orders: 73 },
    { date: 'Nov 12', sales: 5200, orders: 85 },
    { date: 'Nov 13', sales: 4900, orders: 80 },
    { date: 'Nov 14', sales: 5400, orders: 88 },
    { date: 'Nov 15', sales: 5100, orders: 83 },
    { date: 'Nov 16', sales: 5600, orders: 91 },
    { date: 'Nov 17', sales: 5300, orders: 86 },
    { date: 'Nov 18', sales: 5800, orders: 95 },
    { date: 'Nov 19', sales: 5500, orders: 90 },
    { date: 'Nov 20', sales: 6100, orders: 99 },
    { date: 'Nov 21', sales: 5800, orders: 94 },
    { date: 'Nov 22', sales: 6400, orders: 104 },
    { date: 'Nov 23', sales: 6100, orders: 99 },
    { date: 'Nov 24', sales: 6700, orders: 109 },
    { date: 'Nov 25', sales: 6400, orders: 104 }
  ];

  const trafficData = [
    { name: 'Direct Search', value: 45, color: '#006c50' },
    { name: 'Social Media', value: 30, color: '#5d5e60' },
    { name: 'Referral', value: 15, color: '#bdc9c2' },
    { name: 'Other', value: 10, color: '#e1e3e5' }
  ];

  const productPerformance = [
    { name: 'Runners', revenue: 12400, units: 1240, margin: 42 },
    { name: 'Watch', revenue: 8920, units: 892, margin: 58 },
    { name: 'Shades', revenue: 4837, units: 645, margin: 35 },
    { name: 'Backpack', revenue: 6200, units: 520, margin: 45 },
    { name: 'Headphones', revenue: 7800, units: 340, margin: 52 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-xl rounded-lg p-4 border border-gray-100">
          <p className="text-sm font-bold text-gray-900 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const metrics = [
    {
      title: 'Total Sales',
      value: 'Rs 42,850',
      change: '+12.4%',
      positive: true,
      comparison: 'Compared to last month',
      progress: 72,
      color: 'primary'
    },
    {
      title: 'Total Orders',
      value: '842',
      change: '+5.2%',
      positive: true,
      comparison: 'Active fulfillment track',
      progress: 45,
      color: 'secondary'
    },
    {
      title: 'Avg. Order Value',
      value: 'Rs 50.89',
      change: '-2.1%',
      positive: false,
      comparison: 'Per unique transaction',
      progress: 60,
      color: 'accent'
    },
    {
      title: 'Conversion Rate',
      value: '3.42%',
      change: '+0.8%',
      positive: true,
      comparison: 'Visits to checkouts',
      progress: 85,
      color: 'success'
    },
    {
      title: 'Total Visitors',
      value: '24.5k',
      change: '+18.3%',
      positive: true,
      comparison: 'Unique session IDs',
      progress: 92,
      color: 'warning'
    }
  ];

  return (
    <main className="px-lg pb-12 min-h-screen">
      {/* Welcome Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Analytics Overview
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Real-time performance and shop health data.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container hover:bg-surface-container-high px-6 py-2.5 rounded-lg font-label-md text-label-md text-on-surface transition-all flex items-center gap-2">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="card-surface p-6 flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 cursor-pointer relative overflow-hidden"
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  {metric.title}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                    metric.positive
                      ? 'text-primary bg-primary-container/10'
                      : 'text-error bg-error-container'
                  }`}
                >
                  {metric.positive ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}
                  {metric.change}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="font-display-lg text-display-lg">{metric.value}</h3>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  {metric.comparison}
                </p>
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-surface-container rounded-full overflow-hidden relative z-10">
              <div
                className={`h-full transition-all duration-500 ${
                  hoveredCard === index ? 'w-full' : `w-[${metric.progress}%]`
                }`}
                style={{
                  width: `${metric.progress}%`,
                  backgroundColor: metric.positive ? '#006c50' : '#ba1a1a',
                  transition: 'width 1s ease-in-out'
                }}
              ></div>
            </div>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <div className="w-full h-full rounded-full bg-current"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Layout (Bento Style) */}
      <div className="grid grid-cols-12 gap-6">
        {/* Large Area Chart */}
        <div className="card-surface p-6 col-span-12 lg:col-span-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="font-headline-md text-headline-md">Sales Over Time</h4>
              <p className="text-sm text-on-surface-variant mt-1">
                Revenue trend for the selected period
              </p>
            </div>
            <div className="flex gap-2 bg-surface-container rounded-lg p-1">
              {timeViews.map((view) => (
                <button
                  key={view}
                  className={`text-[11px] font-bold px-4 py-2 rounded-md transition-all ${
                    activeTimeView === view
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                  onClick={() => setActiveTimeView(view)}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-grow min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006c50" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#006c50" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  interval={2}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#006c50"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                  dot={{ r: 4, fill: '#006c50', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, fill: '#006c50', strokeWidth: 3, stroke: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources Donut */}
        <div className="card-surface p-6 col-span-12 lg:col-span-4 flex flex-col">
          <h4 className="font-headline-md text-headline-md mb-6">Traffic Sources</h4>
          <div className="relative flex-grow flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase">
                Total Traffic
              </span>
              <span className="text-headline-lg font-headline-lg">24.5k</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {trafficData.map((source, index) => (
              <div key={index} className="flex items-center justify-between group hover:bg-surface-container p-2 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: source.color }}
                  ></span>
                  <span className="font-body-sm text-body-sm">{source.name}</span>
                </div>
                <span className="font-label-md text-label-md font-bold">{source.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Performance Bar Chart */}
        <div className="card-surface p-6 col-span-12 lg:col-span-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-headline-md text-headline-md">Product Revenue</h4>
            <button className="text-primary font-label-md text-label-md hover:underline">
              View All
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `$${value}`} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#006c50" radius={[8, 8, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Margin Analysis Line Chart */}
        <div className="card-surface p-6 col-span-12 lg:col-span-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-headline-md text-headline-md">Profit Margin %</h4>
            <button className="text-primary font-label-md text-label-md hover:underline">
              Details
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `${value}%`} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="margin"
                stroke="#5d5e60"
                strokeWidth={3}
                dot={{ r: 6, fill: '#5d5e60' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products Table */}
        <div className="card-surface col-span-12 overflow-hidden">
          <div className="px-6 py-4 flex justify-between items-center border-b border-outline-variant">
            <div>
              <h4 className="font-headline-md text-headline-md">Top Selling Products</h4>
              <p className="text-sm text-on-surface-variant mt-1">
                Best performing products by revenue
              </p>
            </div>
            <Link className="text-primary font-label-md text-label-md hover:underline flex items-center gap-1" href="#">
              View all inventory
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">
                    Units Sold
                  </th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">
                    Inventory
                  </th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">
                    Revenue
                  </th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {/* Product Row 1 - Trending */}
                <tr className="hover:bg-surface-container-low transition-colors duration-150">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-surface-container-highest overflow-hidden shadow-sm">
                        <img
                          className="w-full h-full object-cover"
                          alt="Nimbus Velocity Runners"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaLhXgRX0wYds7wP7BJBmSkdGEhXlWHnmaRU9qyMnspr_Ppva9YCU3aZoAfjjHhTYfrCTLeJZ63VoGXaI_FPER7XWZ2GHvLvxSzHcxTOFyTwmIC5JZEc7bgGDOy0IPxTXvQXe8ARQkI9-6Pgl4zVS-ZlYV4msNG0F_PPvM3eajGWAB-kCSFSW_WhmB5fSnneqDxBAam3H1Te5mEI9NpLUDTsYk4ZpHQkcy6_kDPaz3N_ExfI1uIN2MSHwlGtp3gDMxAZTQskKcWHaG"
                        />
                      </div>
                      <div>
                        <p className="font-body-md text-body-md font-bold">Nimbus Velocity Runners</p>
                        <p className="text-[11px] text-on-surface-variant">Footwear / Athletics</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">
                    <span className="bg-surface-container px-2 py-1 rounded text-xs">RUN-NV-2024</span>
                  </td>
                  <td className="px-6 py-4 font-body-sm text-body-sm text-right font-bold">1,240</td>
                  <td className="px-6 py-4 font-body-sm text-body-sm text-right">
                    <span className="text-success">452 in stock</span>
                  </td>
                  <td className="px-6 py-4 font-body-md text-body-md text-right font-bold">Rs 12,400</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/10 text-primary font-label-md text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> 
                      Trending
                    </span>
                  </td>
                </tr>

                {/* Product Row 2 - Low Stock */}
                <tr className="hover:bg-surface-container-low transition-colors duration-150">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-surface-container-highest overflow-hidden shadow-sm">
                        <img
                          className="w-full h-full object-cover"
                          alt="Zenith Minimalist Watch"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCAb10Ylcqwqqseo1krCUzureZgY1kzWm_TtI8O9xyPJ5MeiKRcIE4j4TT5o1HD7DO8oFPutck0shth9hVb0RqHY7dt0pJUUcRVDBubihtN4ccaoLl1Wrx10Hs6Cvam5bgEoCFxXMHW_oJYXiL0DqQD6iclnOMB3FnIw5ZYO6_b2jBHwlS0uTKQWoKAnmV2RI06UwlDbDy2gxEboOWP0tO1elg1UXQrDW8T5fYyF256iTuauIEYUFqxoQMngrEkUpzyivqIGrMws2t"
                        />
                      </div>
                      <div>
                        <p className="font-body-md text-body-md font-bold">Zenith Minimalist Watch</p>
                        <p className="text-[11px] text-on-surface-variant">Accessories / Timepieces</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">
                    <span className="bg-surface-container px-2 py-1 rounded text-xs">WTC-ZN-LITE</span>
                  </td>
                  <td className="px-6 py-4 font-body-sm text-body-sm text-right font-bold">892</td>
                  <td className="px-6 py-4 font-body-sm text-body-sm text-right">
                    <span className="text-error font-bold">12 left</span>
                  </td>
                  <td className="px-6 py-4 font-body-md text-body-md text-right font-bold">Rs 8,920</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-error font-label-md text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span> 
                      Low Stock
                    </span>
                  </td>
                </tr>

                {/* Product Row 3 - Stable */}
                <tr className="hover:bg-surface-container-low transition-colors duration-150">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-surface-container-highest overflow-hidden shadow-sm">
                        <img
                          className="w-full h-full object-cover"
                          alt="Urban Horizon Shades"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCByc6yEC94StLWTzG6XIC2ECvSG_jVLl7KImHSx214IXDV2gb5DtTiU0m86i10PCFDJ8eddxX_KQeVvpfHptxgI3ssf5IQAx1aQVrBVw4SfVWvkCpf8rxE5GRaVT8Yuu0EqZrWzjBO-5EtEO5vYLE0Z3YdZFj-bRyN50FXAldLqFHdYfDjMrRuXPEImKI4r5UtimoVbn7cn833IXX3QEbMyemV95iuckMmKv7HC2NBo11Em01VjNCMbYApuZGdghALZnEve5jsUVCU"
                        />
                      </div>
                      <div>
                        <p className="font-body-md text-body-md font-bold">Urban Horizon Shades</p>
                        <p className="text-[11px] text-on-surface-variant">Accessories / Eyewear</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">
                    <span className="bg-surface-container px-2 py-1 rounded text-xs">EYE-URB-SHD</span>
                  </td>
                  <td className="px-6 py-4 font-body-sm text-body-sm text-right font-bold">645</td>
                  <td className="px-6 py-4 font-body-sm text-body-sm text-right">230 in stock</td>
                  <td className="px-6 py-4 font-body-md text-body-md text-right font-bold">Rs 4,837</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-variant text-on-surface-variant font-label-md text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-outline"></span> 
                      Stable
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AnalyticsPage;