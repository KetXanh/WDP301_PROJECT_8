import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, DollarSign, ShoppingCart, Users, Package } from "lucide-react"
import { NavigationItem } from "./NavigationItem"
import { SidebarHeader } from "./components/SidebarHeader"
import { SidebarFooterContent } from "./components/SidebarFooter"

export default function Statistics() {
  const handleExportExcel = () => {
    console.log("Xuất báo cáo Excel")
    // Logic xuất Excel sẽ được implement sau
  }

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
            <div className="text-2xl font-bold">2,350,000₫</div>
            <p className="text-xs text-muted-foreground">+20.1% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">+15% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-muted-foreground">+12% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">Hiện có trong kho</p>
          </CardContent>
        </Card>
      </div>

      {/* Biểu đồ và thống kê chi tiết */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Doanh thu theo ngày</CardTitle>
            <CardDescription>
              Biểu đồ doanh thu 30 ngày gần nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 flex items-center justify-center bg-muted rounded-lg">
              <p className="text-muted-foreground">Biểu đồ doanh thu sẽ được hiển thị ở đây</p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Sản phẩm bán chạy</CardTitle>
            <CardDescription>
              Top sản phẩm bán nhiều nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 flex items-center justify-center bg-muted rounded-lg">
              <p className="text-muted-foreground">Danh sách sản phẩm bán chạy sẽ được hiển thị ở đây</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}