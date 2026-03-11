export interface DailyStat {
  date: string;
  sales: number;
  revenue: number;
  orders: number;
  visitors: number;
}

export interface ProductStat {
  name: string;
  sales: number;
  visits: number;
  category: string;
}

export interface CustomerStat {
  name: string;
  spent: number;
  orders: number;
}

export interface Segment {
  name: string;
  value: number;
  color: string;
}

// Helper to generate 365 days of data
const generateDailyStats = (days: number): DailyStat[] => {
  return Array.from({ length: days }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return {
      date: date.toISOString().split('T')[0],
      sales: Math.floor(Math.random() * 500) + 400,
      revenue: Math.floor(Math.random() * 15000) + 10000,
      orders: Math.floor(Math.random() * 120) + 70,
      visitors: Math.floor(Math.random() * 3000) + 1500,
    };
  });
};

export const MOCK_DAILY_STATS: DailyStat[] = generateDailyStats(365);

export const MOCK_PRODUCTS: ProductStat[] = [
  { name: 'Organic Bananas', sales: 1250, visits: 8500, category: 'Produce' },
  { name: 'Whole Milk', sales: 980, visits: 6200, category: 'Dairy' },
  { name: 'Avocados', sales: 850, visits: 9200, category: 'Produce' },
  { name: 'Sourdough Bread', sales: 720, visits: 4100, category: 'Bakery' },
  { name: 'Chicken Breast', sales: 650, visits: 3800, category: 'Meat' },
  { name: 'Greek Yogurt', sales: 540, visits: 2900, category: 'Dairy' },
  { name: 'Organic Spinach', sales: 490, visits: 3100, category: 'Produce' },
  { name: 'Almond Milk', sales: 420, visits: 2500, category: 'Dairy' },
  { name: 'Blueberries', sales: 380, visits: 4500, category: 'Produce' },
  { name: 'Free Range Eggs', sales: 310, visits: 2100, category: 'Dairy' },
  { name: 'Atlantic Salmon', sales: 290, visits: 1800, category: 'Meat' },
  { name: 'Honey Crisp Apples', sales: 270, visits: 5200, category: 'Produce' },
];

export const MOCK_CUSTOMER_SEGMENTS: Segment[] = [
  { name: 'New', value: 1200, color: '#10b981' },
  { name: 'Repeat', value: 2800, color: '#3b82f6' },
  { name: 'Unique', value: 4000, color: '#8b5cf6' },
];

export const MOCK_TOP_CUSTOMERS: CustomerStat[] = [
  { name: 'Sarah Johnson', spent: 4250, orders: 24 },
  { name: 'Michael Chen', spent: 3890, orders: 18 },
  { name: 'Emma Wilson', spent: 3120, orders: 21 },
  { name: 'David Miller', spent: 2950, orders: 15 },
  { name: 'Lisa Anderson', spent: 2780, orders: 19 },
];
