import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, DollarSign, ShoppingCart, Users, ClipboardList, UserCheck, TrendingUp, AlertCircle } from "lucide-react"
import { overview , productStatistics, exportStatisticsExcel } from "@/services/SaleManager/ApiSaleManager"
import { toast } from "sonner"
import OrderStatistics from "./components/OrderForm"
import ProductStatistics from "./components/ProductForm"
export default function Statistics() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [productStats, setProductStats] = useState(null)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      const overviewRes = await overview()
      const productRes = await productStatistics()
      console.log("productStats API response:", productRes.data)
      setStats(overviewRes.data.data || {})
      setProductStats(productRes.data.data || {})
    } catch {
      toast.error("Không thể tải dữ liệu thống kê")
      setStats({})
      setProductStats({})
    } finally {
      setLoading(false)
    }
  }

  const handleExportExcel = async () => {
    try {
      const res = await exportStatisticsExcel();
      const blob = res.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'statistics.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Xuất file Excel thất bại!');
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
  }

  // Lấy dữ liệu từ API response
  const orders = stats?.orders || {}
  const users = stats?.users || {}
  const tasks = stats?.tasks || {}
  const assignments = stats?.assignments || {}

  // Thêm các bảng thống kê sản phẩm nổi bật
  const renderProductTable = (title, products, metricLabel, metricKey, description) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {products && products.length > 0 ? (
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">STT</th>
                  <th className="border px-2 py-1">Tên sản phẩm</th>
                  <th className="border px-2 py-1">{metricLabel}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item, idx) => (
                  <tr key={item._id}>
                    <td className="border px-2 py-1 text-center">{idx + 1}</td>
                    <td className="border px-2 py-1">{item.productInfo?.name || item.variantInfo?.name || 'N/A'}</td>
                    <td className="border px-2 py-1 text-center">{item[metricKey]?.toFixed ? item[metricKey].toFixed(2) : item[metricKey]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
              <AlertCircle className="w-8 h-8 mb-2 text-gray-400" />
              <span>Không có dữ liệu thống kê cho mục này</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Thống kê tổng quan</h2>
          <p className="text-muted-foreground">
            Theo dõi hiệu suất kinh doanh của cửa hàng
          </p>
        </div>
        <Button onClick={handleExportExcel}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Xuất Excel
        </Button>
      </div>

      {/* Thống kê cơ bản */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.totalRevenue?.toLocaleString('vi-VN') || '0'}₫
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng doanh thu từ tất cả đơn hàng
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              Tổng số đơn hàng trong hệ thống
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Tổng số người dùng đã đăng ký
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng công việc</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.totalTasks || 0}</div>
            <p className="text-xs text-muted-foreground">
              Tổng số công việc hiện tại
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Thống kê chi tiết */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Thống kê đơn hàng theo trạng thái</CardTitle>
            <CardDescription>
              Phân bố đơn hàng theo trạng thái hiện tại
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.statusStats?.map((status, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${status._id === 'delivered' ? 'bg-green-500' : status._id === 'pending' ? 'bg-yellow-500' : status._id === 'processing' ? 'bg-blue-500' : status._id === 'cancelled' ? 'bg-red-500' : status._id === 'shipped' ? 'bg-purple-500' : 'bg-gray-500'}`} />
                    <span className="text-sm font-medium capitalize">
                      {status._id === 'delivered' ? 'Đã giao' : status._id === 'pending' ? 'Chờ xử lý' : status._id === 'processing' ? 'Đang xử lý' : status._id === 'cancelled' ? 'Đã hủy' : status._id === 'shipped' ? 'Đang giao' : status._id}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{status.count}</div>
                    <div className="text-xs text-muted-foreground">
                      {status.revenue?.toLocaleString('vi-VN') || '0'}₫
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Phân bố người dùng theo vai trò</CardTitle>
            <CardDescription>
              Số lượng người dùng theo từng vai trò
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.roleStats?.map((role, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {role._id === 0 ? 'Khách hàng' : role._id === 1 ? 'Admin' : role._id === 2 ? 'Sale Manager' : role._id === 3 ? 'Product Manager' : role._id === 4 ? 'Sale Staff' : `Role ${role._id}`}
                    </span>
                  </div>
                  <div className="text-lg font-bold">{role.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Thống kê công việc và phân công */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thống kê công việc</CardTitle>
            <CardDescription>
              Trạng thái các công việc hiện tại
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.statusStats?.map((status, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${status._id === 'pending' ? 'bg-yellow-500' : status._id === 'in-progress' ? 'bg-blue-500' : status._id === 'completed' ? 'bg-green-500' : 'bg-gray-500'}`} />
                    <span className="text-sm font-medium capitalize">
                      {status._id === 'pending' ? 'Chờ thực hiện' : status._id === 'in-progress' ? 'Đang thực hiện' : status._id === 'completed' ? 'Hoàn thành' : status._id}
                    </span>
                  </div>
                  <div className="text-lg font-bold">{status.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê phân công</CardTitle>
            <CardDescription>
              Trạng thái các phân công hiện tại
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignments.statusStats?.map((status, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${status._id === 'pending' ? 'bg-yellow-500' : status._id === 'in-progress' ? 'bg-blue-500' : status._id === 'completed' ? 'bg-green-500' : 'bg-gray-500'}`} />
                    <span className="text-sm font-medium capitalize">
                      {status._id === 'pending' ? 'Chờ thực hiện' : status._id === 'in-progress' ? 'Đang thực hiện' : status._id === 'completed' ? 'Hoàn thành' : status._id}
                    </span>
                  </div>
                  <div className="text-lg font-bold">{status.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Thống kê doanh thu theo tháng */}
      {orders.revenueByMonth && orders.revenueByMonth.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo tháng</CardTitle>
            <CardDescription>
              Thống kê doanh thu và số lượng đơn hàng theo tháng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.revenueByMonth.map((month, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">
                        Tháng {month._id.month}/{month._id.year}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {month.orderCount} đơn hàng
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {month.totalRevenue?.toLocaleString('vi-VN') || '0'}₫
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Thống kê sản phẩm nổi bật */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {renderProductTable(
          "Sản phẩm bán chạy nhất",
          productStats?.mostPurchasedProduct,
          "Số lượng bán",
          "totalQuantity",
          "Top sản phẩm có số lượng bán ra nhiều nhất trong hệ thống."
        )}
        {renderProductTable(
          "Sản phẩm bán ít nhất",
          productStats?.leastPurchasedProduct,
          "Số lượng bán",
          "totalQuantity",
          "Top sản phẩm có số lượng bán ra ít nhất trong hệ thống."
        )}
        {renderProductTable(
          "Sản phẩm được đánh giá cao nhất",
          productStats?.topRatedProducts,
          "Điểm trung bình",
          "avgStars",
          "Top sản phẩm có điểm đánh giá trung bình cao nhất từ người dùng."
        )}
        {renderProductTable(
          "Sản phẩm bị đánh giá tệ nhất",
          productStats?.worstRatedProducts,
          "Điểm trung bình",
          "avgStars",
          "Top sản phẩm có điểm đánh giá trung bình thấp nhất từ người dùng."
        )}
        {renderProductTable(
          "Sản phẩm có nhiều đánh giá tốt nhất",
          productStats?.mostPositiveReviewedProducts,
          "Lượt đánh giá 5★",
          "positiveCount",
          "Top sản phẩm nhận được nhiều đánh giá 5 sao nhất."
        )}
        {renderProductTable(
          "Sản phẩm có nhiều đánh giá tệ nhất",
          productStats?.mostNegativeReviewedProducts,
          "Lượt đánh giá 1★",
          "negativeCount",
          "Top sản phẩm nhận được nhiều đánh giá 1 sao nhất."
        )}
      </div>

      {/* Danh sách đơn hàng có filter theo status */}
      <OrderStatistics />

      {/* Danh sách sản phẩm có filter theo status */}
      <ProductStatistics />
    </div>
  )
}