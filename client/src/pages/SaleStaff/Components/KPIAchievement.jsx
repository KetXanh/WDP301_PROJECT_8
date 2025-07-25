import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ProgressBar = ({ percentage, color = 'bg-blue-500' }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div className={`${color} h-2 rounded-full transition-all duration-300`} style={{ width: `${percentage}%` }}></div>
  </div>
);

const KPIAchievement = ({ stats }) => (
  <Card>
    <CardHeader>
      <CardTitle>KPI Achievement</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">KPI đạt được</span>
          <span className="text-sm text-gray-500">{stats?.kpiCount || 0}</span>
        </div>
        <ProgressBar percentage={stats?.kpiCount > 0 ? 100 : 0} color="bg-purple-500" />
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{stats?.kpiCount || 0}</p>
          <p className="text-sm text-gray-500">Tổng số KPI</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default KPIAchievement; 