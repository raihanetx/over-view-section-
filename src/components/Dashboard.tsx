import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  AreaChart, Area, 
  BarChart, Bar, 
  PieChart, Pie, Cell,
  ResponsiveContainer, 
  XAxis, YAxis, 
  Tooltip,
  Legend,
  ComposedChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  Activity,
  UserPlus,
  Target,
  Eye,
  Download,
  Calendar,
  Trophy,
  Zap,
  Smartphone,
  Monitor,
  Chrome,
  Apple,
  Globe
} from 'lucide-react';
import { VisualCard } from './VisualCard';
import { 
  MOCK_DAILY_STATS, 
  MOCK_PRODUCTS, 
  MOCK_CUSTOMER_SEGMENTS,
  MOCK_TOP_CUSTOMERS
} from '../types';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-3 rounded-lg backdrop-blur-md">
        <p className="text-[10px] uppercase tracking-tighter text-slate-400 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm font-mono" style={{ color: p.color || p.fill }}>
            {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

type TimeFrame = 'today' | '7d' | '15d' | '30d' | '45d' | '3m' | '6m' | '1y';

export const Dashboard: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('30d');

  const filteredStats = useMemo(() => {
    let days = 30;
    if (timeFrame === 'today') days = 1;
    else if (timeFrame === '7d') days = 7;
    else if (timeFrame === '15d') days = 15;
    else if (timeFrame === '30d') days = 30;
    else if (timeFrame === '45d') days = 45;
    else if (timeFrame === '3m') days = 90;
    else if (timeFrame === '6m') days = 180;
    else if (timeFrame === '1y') days = 365;
    
    return MOCK_DAILY_STATS.slice(-days);
  }, [timeFrame]);

  const totalRevenue = filteredStats.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalSales = filteredStats.reduce((acc, curr) => acc + curr.sales, 0);
  const totalVisitors = filteredStats.reduce((acc, curr) => acc + curr.visitors, 0);
  const totalOrders = filteredStats.reduce((acc, curr) => acc + curr.orders, 0);
  
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const revPerVisitor = totalVisitors > 0 ? totalRevenue / totalVisitors : 0;
  const conversionRate = totalVisitors > 0 ? (totalOrders / totalVisitors) * 100 : 0;

  const totalCustomers = MOCK_CUSTOMER_SEGMENTS.find(s => s.name === 'Unique')?.value || 0;
  const newCustomers = MOCK_CUSTOMER_SEGMENTS.find(s => s.name === 'New')?.value || 0;
  const repeatCustomers = MOCK_CUSTOMER_SEGMENTS.find(s => s.name === 'Repeat')?.value || 0;

  const topSellingProducts = useMemo(() => 
    [...MOCK_PRODUCTS].sort((a, b) => b.sales - a.sales).slice(0, 5)
  , []);

  const topVisitedProducts = useMemo(() => 
    [...MOCK_PRODUCTS].sort((a, b) => b.visits - a.visits).slice(0, 5)
  , []);

  const deviceStats = useMemo(() => ({
    mobile: Math.floor(totalVisitors * 0.65),
    desktop: Math.floor(totalVisitors * 0.35),
    ios: Math.floor(totalVisitors * 0.42),
    android: Math.floor(totalVisitors * 0.23),
    chrome: Math.floor(totalVisitors * 0.55),
    safari: Math.floor(totalVisitors * 0.30),
  }), [totalVisitors]);

  const showCharts = timeFrame !== 'today';

  const handleDownload = () => {
    const headers = ['Date', 'Sales', 'Revenue', 'Orders', 'Visitors'];
    const csvContent = [
      headers.join(','),
      ...filteredStats.map(row => [row.date, row.sales, row.revenue, row.orders, row.visitors].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `freshmart_report_${timeFrame}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8 font-sans">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-600">
            <Activity size={16} />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">System Live</span>
          </div>
          <h1 className="text-5xl font-light tracking-tighter text-slate-900">
            FreshMart <span className="text-slate-300 italic font-serif">Analytics</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-white p-1 rounded-xl border border-slate-200">
            {(['today', '7d', '15d', '30d', '45d', '3m', '6m', '1y'] as TimeFrame[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFrame(tf)}
                className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest transition-all ${
                  timeFrame === tf 
                    ? 'bg-slate-900 text-white font-bold' 
                    : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all group"
          >
            <Download size={16} className="text-emerald-600 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] uppercase tracking-widest font-mono text-slate-600">Export CSV</span>
          </button>
        </div>
      </header>

      {/* Metadata Overview Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
        {[
          { label: 'Avg Order Value', value: `$${avgOrderValue.toFixed(2)}`, icon: DollarSign, color: 'text-blue-600' },
          { label: 'Rev per Visitor', value: `$${revPerVisitor.toFixed(2)}`, icon: TrendingUp, color: 'text-emerald-600' },
          { label: 'Total Visitors', value: totalVisitors.toLocaleString(), icon: Users, color: 'text-purple-600' },
          { label: 'Total Orders', value: totalOrders.toLocaleString(), icon: ShoppingBag, color: 'text-orange-600' },
          { label: 'Conv. Rate', value: `${conversionRate.toFixed(1)}%`, icon: Target, color: 'text-rose-600' },
          { label: 'Data Integrity', value: '99.9%', icon: Activity, color: 'text-cyan-600' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3"
          >
            <div className={`p-2 rounded-lg bg-slate-50 ${item.color}`}>
              <item.icon size={16} />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest text-slate-400">{item.label}</p>
              <p className="text-sm font-mono font-bold text-slate-800">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Device & Platform Overview Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: 'Mobile Users', value: `${((deviceStats.mobile/totalVisitors)*100).toFixed(0)}%`, icon: Smartphone, color: 'text-slate-600' },
          { label: 'Desktop Users', value: `${((deviceStats.desktop/totalVisitors)*100).toFixed(0)}%`, icon: Monitor, color: 'text-slate-600' },
          { label: 'iOS / iPhone', value: `${((deviceStats.ios/totalVisitors)*100).toFixed(0)}%`, icon: Apple, color: 'text-slate-600' },
          { label: 'Android', value: `${((deviceStats.android/totalVisitors)*100).toFixed(0)}%`, icon: Smartphone, color: 'text-slate-600' },
          { label: 'Chrome Browser', value: `${((deviceStats.chrome/totalVisitors)*100).toFixed(0)}%`, icon: Chrome, color: 'text-slate-600' },
          { label: 'Other Browsers', value: `${((1 - deviceStats.chrome/totalVisitors)*100).toFixed(0)}%`, icon: Globe, color: 'text-slate-600' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (i + 6) * 0.05 }}
            className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3"
          >
            <div className={`p-1.5 rounded-lg bg-slate-50 ${item.color}`}>
              <item.icon size={14} />
            </div>
            <div>
              <p className="text-[8px] uppercase tracking-widest text-slate-400">{item.label}</p>
              <p className="text-xs font-mono font-bold text-slate-700">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Top 5 Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <VisualCard title="Top 5 Best Selling Products" delay={0.1}>
          <div className="space-y-3">
            {topSellingProducts.map((product, i) => (
              <div key={product.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-mono text-[10px] font-bold">
                    {i+1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{product.name}</p>
                    <p className="text-[10px] uppercase text-slate-400">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono text-emerald-600 font-bold">{product.sales.toLocaleString()}</p>
                  <p className="text-[9px] uppercase text-slate-400">Units Sold</p>
                </div>
              </div>
            ))}
          </div>
        </VisualCard>

        <VisualCard title="Top 5 Most Visited Products" delay={0.2}>
          <div className="space-y-3">
            {topVisitedProducts.map((product, i) => (
              <div key={product.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-mono text-[10px] font-bold">
                    {i+1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{product.name}</p>
                    <p className="text-[10px] uppercase text-slate-400">Conv. Rate: {((product.sales / product.visits) * 100).toFixed(1)}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono text-blue-600 font-bold">{product.visits.toLocaleString()}</p>
                  <p className="text-[9px] uppercase text-slate-400">Total Views</p>
                </div>
              </div>
            ))}
          </div>
        </VisualCard>
      </div>

      {/* Top Row: Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <VisualCard title="Total Revenue" subtitle={`$${totalRevenue.toLocaleString()}`} delay={0.3}>
          {showCharts ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredStats}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col justify-center h-full">
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <TrendingUp size={20} />
                <span className="text-sm font-mono font-bold">Daily Target: 85%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  className="bg-emerald-500 h-full"
                />
              </div>
            </div>
          )}
        </VisualCard>

        <VisualCard title="Total Sales Volume" subtitle={totalSales.toLocaleString()} delay={0.4}>
          {showCharts ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredStats}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center gap-4 h-full">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-sm font-mono font-bold text-slate-800">+{Math.floor(totalSales * 0.12)}</p>
                <p className="text-[10px] uppercase text-slate-400">vs Yesterday</p>
              </div>
            </div>
          )}
        </VisualCard>

        <VisualCard title="Total Customers" subtitle={totalCustomers.toLocaleString()} delay={0.5}>
          <div className="flex items-center gap-4 h-full">
            <div className="flex-1">
              <p className="text-[10px] uppercase text-slate-400 mb-1">New Acquired</p>
              <p className="text-xl font-mono text-emerald-600">+{newCustomers}</p>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="flex-1">
              <p className="text-[10px] uppercase text-slate-400 mb-1">Repeat Rate</p>
              <p className="text-xl font-mono text-blue-600">{((repeatCustomers/totalCustomers)*100).toFixed(1)}%</p>
            </div>
          </div>
        </VisualCard>

        <VisualCard title="Conversion Efficiency" subtitle="1 Sale / 10.2 Visits" delay={0.6}>
          <div className="flex flex-col justify-center h-full gap-2">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '9.8%' }}
                transition={{ duration: 2, delay: 1 }}
                className="bg-emerald-500 h-full"
              />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">Avg. Shop-to-Visit Ratio</p>
          </div>
        </VisualCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Product Performance: Sales vs Visits */}
        <VisualCard 
          title="Product Engagement: Sales vs Visits" 
          className="lg:col-span-2"
          delay={0.7}
        >
          {showCharts ? (
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={MOCK_PRODUCTS}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(0,0,0,0.3)', fontSize: 10 }} 
                />
                <YAxis yAxisId="left" hide />
                <YAxis yAxisId="right" orientation="right" hide />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: 20, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }} />
                <Bar yAxisId="left" dataKey="sales" name="Total Sales" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                <Line yAxisId="right" type="monotone" dataKey="visits" name="Total Visits" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-center">
              {[
                { label: 'Avg. Daily Visits', value: '2.4k', icon: Users, color: 'text-purple-600' },
                { label: 'Avg. Daily Sales', value: '184', icon: ShoppingBag, color: 'text-emerald-600' },
                { label: 'Avg. Daily Revenue', value: '$12.8k', icon: DollarSign, color: 'text-blue-600' },
              ].map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-xl border border-slate-100 flex flex-col items-center text-center gap-2"
                >
                  <div className={`p-3 rounded-full bg-slate-50 ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <p className="text-2xl font-light tracking-tighter text-slate-900">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          )}
        </VisualCard>

        {/* Customer Segmentation */}
        <VisualCard title="Customer Base Breakdown" delay={0.8}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={MOCK_CUSTOMER_SEGMENTS}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
              >
                {MOCK_CUSTOMER_SEGMENTS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 justify-center mt-2">
            {MOCK_CUSTOMER_SEGMENTS.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-[10px] uppercase text-slate-400">{s.name}</span>
                <span className="text-xs font-mono text-slate-600">{s.value}</span>
              </div>
            ))}
          </div>
        </VisualCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Buying Customers */}
        <VisualCard title="Top Buying Customers" delay={0.9}>
          <div className="space-y-4">
            {MOCK_TOP_CUSTOMERS.map((customer, i) => (
              <div key={customer.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-mono text-xs">
                    0{i+1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{customer.name}</p>
                    <p className="text-[10px] uppercase text-slate-400">{customer.orders} Orders Placed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono text-emerald-600 font-bold">${customer.spent.toLocaleString()}</p>
                  <p className="text-[10px] uppercase text-slate-400">Total Spent</p>
                </div>
              </div>
            ))}
          </div>
        </VisualCard>

        {/* Conversion Insights */}
        <VisualCard title="Sales Efficiency Insights" delay={1.0}>
          <div className="grid grid-cols-2 gap-4 h-full">
            {[
              { label: 'Avg. Conversion', value: '8.4%', icon: Target, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
              { label: 'Visits per Sale', value: '12.4', icon: Eye, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
              { label: 'New Cust. Growth', value: '30%', icon: UserPlus, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
              { label: 'Daily Orders Avg', value: '142', icon: ShoppingBag, color: 'bg-orange-50 text-orange-600', border: 'border-orange-100' },
            ].map((insight, i) => (
              <motion.div 
                key={insight.label}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`flex flex-col justify-center p-6 rounded-xl border ${insight.border} ${insight.color.split(' ')[0]}`}
              >
                <insight.icon className={insight.color.split(' ')[1] + " mb-2"} size={20} />
                <p className="text-2xl font-light tracking-tighter text-slate-900">{insight.value}</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-400">{insight.label}</p>
              </motion.div>
            ))}
          </div>
        </VisualCard>
      </div>

      <footer className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap gap-8 justify-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-slate-400" />
          <span className="text-[10px] uppercase tracking-widest font-mono text-slate-500">Growth Engine v4.2</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={14} className="text-slate-400" />
          <span className="text-[10px] uppercase tracking-widest font-mono text-slate-500">Real-time Sync</span>
        </div>
        <div className="flex items-center gap-2">
          <ShoppingBag size={14} className="text-slate-400" />
          <span className="text-[10px] uppercase tracking-widest font-mono text-slate-500">Inventory AI</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign size={14} className="text-slate-400" />
          <span className="text-[10px] uppercase tracking-widest font-mono text-slate-500">Secure Ledger</span>
        </div>
      </footer>
    </div>
  );
};
