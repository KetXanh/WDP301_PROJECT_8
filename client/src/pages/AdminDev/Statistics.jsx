import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, DollarSign, ShoppingCart, Users, Package } from "lucide-react"
import { getUserStats } from "../../services/Admin/AdminAPI"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
ChartJS.register(ArcElement, Tooltip, Legend)

export default function StatisticsAdminDev() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await getUserStats()
        setStats(response.data.statistics)
      } catch (error) {
        setStats(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUserStats()
  }, [])

  const handleExportExcel = () => {
    console.log("Xuất báo cáo Excel")
  }

  //Chuẩn bị data cho Pie Chart
  const pieData = stats ? {
    labels: stats.userByRole.map(r => r.role),
    datasets: [
      {
        label: "Số lượng người dùng",
        data: stats.userByRole.map(r => r.count),
        backgroundColor: [
              "#6366f1", "#10b981", "#f59e42", "#ef4444", "#a21caf"
        ],
        borderWidth: 1,
      },
    ],
  }
  : null
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
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats ? stats.totalUsers : "..."}</div>
            <p className="text-xs text-muted-foreground">
              {stats ? `${stats.activeUsers} active / ${stats.inactiveUsers} inactive` : ""}
            </p>
          </CardContent>
        </Card>
        {/* ...Các Card khác giữ nguyên hoặc thêm tùy ý... */}
      </div>

      {/* Biểu đồ users by role */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Phân bố người dùng theo vai trò</CardTitle>
            <CardDescription>
              Thống kê số lượng người dùng theo từng vai trò
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Đang tải biểu đồ...</div>
            ) : stats && pieData ? (
              <Pie data={pieData} />
            ) : (
              <div>Không có dữ liệu</div>
            )}
          </CardContent>
        </Card>
        {/* ...Bạn có thể thêm các biểu đồ khác ở đây... */}
      </div>
    </div>
  )
}