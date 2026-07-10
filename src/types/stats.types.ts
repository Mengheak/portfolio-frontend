export interface DashboardStats {
  totalVisitors: number;
  todayVisitors: number;
  projects: number;
  experience: number;
  adminUsers: number;
  chart: { date: string; visitors: number }[];
}
