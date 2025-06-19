import React, { useState, useEffect } from 'react';
import { 
  Target, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Plus,
  Edit
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const KPI = () => {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedKPI, setSelectedKPI] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    currentValue: '',
    notes: ''
  });

  useEffect(() => {
    // TODO: Fetch KPIs from API
    // fetchKPIs();
    
    // Mock data
    setKpis([
      {
        id: 1,
        title: 'Doanh số bán hàng tháng',
        description: 'Đạt doanh số 50 triệu VND trong tháng',
        targetValue: 50000000,
        currentValue: 35000000,
        unit: 'VND',
        status: 'in_progress',
        progressPercentage: 70,
        assignedBy: 'Manager A',
        deadline: '2024-01-31',
        notes: 'Đang thực hiện tốt, cần tăng cường liên hệ khách hàng'
      },
      {
        id: 2,
        title: 'Số lượng đơn hàng mới',
        description: 'Ký được 20 đơn hàng mới trong tháng',
        targetValue: 20,
        currentValue: 15,
        unit: 'đơn hàng',
        status: 'in_progress',
        progressPercentage: 75,
        assignedBy: 'Manager B',
        deadline: '2024-01-31',
        notes: 'Cần tập trung vào khách hàng tiềm năng'
      },
      {
        id: 3,
        title: 'Tỷ lệ chuyển đổi khách hàng',
        description: 'Đạt tỷ lệ chuyển đổi 25%',
        targetValue: 25,
        currentValue: 28,
        unit: '%',
        status: 'achieved',
        progressPercentage: 112,
        assignedBy: 'Manager A',
        deadline: '2024-01-31',
        notes: 'Vượt chỉ tiêu! Làm việc rất hiệu quả'
      },
      {
        id: 4,
        title: 'Số cuộc gọi tư vấn',
        description: 'Thực hiện 100 cuộc gọi tư vấn',
        targetValue: 100,
        currentValue: 45,
        unit: 'cuộc gọi',
        status: 'pending',
        progressPercentage: 45,
        assignedBy: 'Manager C',
        deadline: '2024-01-31',
        notes: 'Cần tăng cường số lượng cuộc gọi'
      }
    ]);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'achieved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'achieved':
        return <CheckCircle className="h-5 w-5" />;
      case 'in_progress':
        return <Clock className="h-5 w-5" />;
      case 'pending':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const handleUpdateKPI = (kpi) => {
    setSelectedKPI(kpi);
    setUpdateForm({
      currentValue: kpi.currentValue.toString(),
      notes: kpi.notes || ''
    });
    setShowUpdateModal(true);
  };

  const handleSubmitUpdate = () => {
    // TODO: Submit update to API
    const updatedKPI = {
      ...selectedKPI,
      currentValue: parseFloat(updateForm.currentValue),
      notes: updateForm.notes,
      progressPercentage: ((parseFloat(updateForm.currentValue) / selectedKPI.targetValue) * 100).toFixed(2),
      status: parseFloat(updateForm.currentValue) >= selectedKPI.targetValue ? 'achieved' : 
              parseFloat(updateForm.currentValue) > 0 ? 'in_progress' : 'pending'
    };

    setKpis(kpis.map(kpi => kpi.id === selectedKPI.id ? updatedKPI : kpi));
    setShowUpdateModal(false);
    setSelectedKPI(null);
    setUpdateForm({ currentValue: '', notes: '' });
  };

  const ProgressBar = ({ percentage, color = 'bg-blue-500' }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`${color} h-2 rounded-full transition-all duration-300 ${
          percentage > 100 ? 'bg-green-500' : percentage > 50 ? 'bg-blue-500' : 'bg-yellow-500'
        }`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      ></div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">KPI của tôi</h1>
              <p className="text-gray-600">Theo dõi và cập nhật tiến độ KPI</p>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">
                {kpis.filter(kpi => kpi.status === 'achieved').length}/{kpis.length} KPI đạt được
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Đạt được</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {kpis.filter(kpi => kpi.status === 'achieved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Đang thực hiện</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {kpis.filter(kpi => kpi.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Chờ bắt đầu</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {kpis.filter(kpi => kpi.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách KPI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {kpis.map((kpi) => (
              <Card key={kpi.id} className="border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">{kpi.title}</h4>
                        <Badge className={getStatusColor(kpi.status)}>
                          {getStatusIcon(kpi.status)}
                          <span className="ml-1">
                            {kpi.status === 'achieved' ? 'Đạt được' : 
                             kpi.status === 'in_progress' ? 'Đang thực hiện' : 'Chờ bắt đầu'}
                          </span>
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">{kpi.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Mục tiêu</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {kpi.targetValue.toLocaleString('vi-VN')} {kpi.unit}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Hiện tại</p>
                          <p className="text-lg font-semibold text-blue-600">
                            {kpi.currentValue.toLocaleString('vi-VN')} {kpi.unit}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Tiến độ</p>
                          <p className="text-lg font-semibold text-purple-600">
                            {kpi.progressPercentage}%
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Tiến độ</span>
                          <span className="text-sm text-gray-500">{kpi.progressPercentage}%</span>
                        </div>
                        <ProgressBar percentage={kpi.progressPercentage} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Được giao bởi:</p>
                          <p className="font-medium">{kpi.assignedBy}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Hạn chót:</p>
                          <p className="font-medium">{new Date(kpi.deadline).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>

                      {kpi.notes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Ghi chú:</span> {kpi.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <Button
                        onClick={() => handleUpdateKPI(kpi)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Cập nhật
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Update Modal */}
      <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật tiến độ KPI</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá trị hiện tại
              </label>
              <Input
                type="number"
                value={updateForm.currentValue}
                onChange={(e) => setUpdateForm({...updateForm, currentValue: e.target.value})}
                placeholder={`Nhập giá trị (${selectedKPI?.unit})`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú
              </label>
              <Textarea
                value={updateForm.notes}
                onChange={(e) => setUpdateForm({...updateForm, notes: e.target.value})}
                placeholder="Thêm ghi chú về tiến độ..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowUpdateModal(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleSubmitUpdate}>
              Cập nhật
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KPI; 