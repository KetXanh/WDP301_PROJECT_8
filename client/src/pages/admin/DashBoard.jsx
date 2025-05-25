// src/pages/admin/Dashboard.jsx
import { Card } from "@/components/ui/card";
import AdminLayout from "@/layout/AdminLayout";

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted">Tổng sản phẩm</p>
          <h2 className="text-2xl font-semibold">120</h2>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted">Đơn hàng hôm nay</p>
          <h2 className="text-2xl font-semibold">35</h2>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted">Tồn kho</p>
          <h2 className="text-2xl font-semibold">5,600 hạt</h2>
        </Card>
      </div>
    </AdminLayout>
  );
}
