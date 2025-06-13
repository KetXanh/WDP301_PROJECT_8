import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { DollarSign, ShoppingCart, Users, Package, ClipboardList } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Chào mừng trở lại!</h2>
        <p className="text-muted-foreground">
          Đây là trang quản lý cửa hàng của bạn
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu hôm nay</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350,000₫</div>
            <p className="text-xs text-muted-foreground">+20.1% so với hôm qua</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn hàng mới</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 đơn so với hôm qua</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task cần xử lý</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">3 task khẩn cấp</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sản phẩm sắp hết</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Cần nhập hàng gấp</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div>
                  <p className="text-sm font-medium">Đơn hàng mới #1234</p>
                  <p className="text-xs text-muted-foreground">2 phút trước</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <div>
                  <p className="text-sm font-medium">Task mới được giao</p>
                  <p className="text-xs text-muted-foreground">15 phút trước</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Sản phẩm sắp hết hàng</p>
                  <p className="text-xs text-muted-foreground">1 giờ trước</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Thông báo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm font-medium">Nhập hàng khẩn cấp</p>
                <p className="text-xs text-muted-foreground">Sản phẩm A đã hết hàng</p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm font-medium">Task deadline</p>
                <p className="text-xs text-muted-foreground">Còn 2 task chưa hoàn thành</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 