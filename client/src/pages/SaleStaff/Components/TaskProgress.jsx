import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ProgressBar = ({ percentage, color = 'bg-blue-500' }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div className={`${color} h-2 rounded-full transition-all duration-300`} style={{ width: `${percentage}%` }}></div>
  </div>
);

const TaskProgress = ({ chartData }) => (
  <Card>
    <CardHeader>
      <CardTitle>Tiến độ Task</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Task hoàn thành</span>
            <span className="text-sm text-gray-500">{chartData?.tasks?.completed || 0}</span>
          </div>
          <ProgressBar percentage={chartData?.tasks?.total > 0 ? (chartData.tasks.completed / chartData.tasks.total) * 100 : 0} color="bg-green-500" />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Task đang thực hiện</span>
            <span className="text-sm text-gray-500">{chartData?.tasks?.pending || 0}</span>
          </div>
          <ProgressBar percentage={chartData?.tasks?.total > 0 ? (chartData.tasks.pending / chartData.tasks.total) * 100 : 0} color="bg-blue-500" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default TaskProgress; 