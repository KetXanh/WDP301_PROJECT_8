import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileSpreadsheet,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  FileText,
  MessageSquare,
  Eye,
  TrendingUp,
} from "lucide-react";
import { getUserStats, getBlogStats, exportStatisticsToExcel } from "../../services/Admin/AdminAPI";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { toast } from "react-toastify";
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function StatisticsAdminDev() {
  const [userStats, setUserStats] = useState(null);
  const [blogStats, setBlogStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userResponse, blogResponse] = await Promise.all([
          getUserStats(),
          getBlogStats()
        ]);
        setUserStats(userResponse.data.statistics);
        setBlogStats(blogResponse.statistics);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setUserStats(null);
        setBlogStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExportExcel = async () => {
    if ((!userStats && !blogStats) || (userStats?.totalUsers === 0 && blogStats?.totalBlogs === 0)) {
      toast.warning("Không có dữ liệu để xuất Excel!");
      return;
    }

    setExportLoading(true);
    try {
      const response = await exportStatisticsToExcel();
      
      // Tạo blob từ response data
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      // Tạo URL cho blob
      const url = window.URL.createObjectURL(blob);
      
      // Tạo link để download
      const link = document.createElement('a');
      link.href = url;
      link.download = `thong-ke-tong-quan-${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Xuất Excel thành công!");
    } catch (error) {
      console.error("Lỗi khi xuất Excel:", error);
      toast.error("Lỗi khi xuất file Excel!");
    } finally {
      setExportLoading(false);
    }
  };

  //Chuẩn bị data cho Pie Chart - User Roles
  const userPieData = userStats
    ? {
        labels: userStats.usersByRole.map((r) => r.role),
        datasets: [
          {
            label: "Số lượng người dùng",
            data: userStats.usersByRole.map((r) => r.count),
            backgroundColor: [
              "#6366f1",
              "#10b981",
              "#f59e42",
              "#ef4444",
              "#a21caf",
            ],
            borderWidth: 1,
          },
        ],
      }
    : null;

  //Chuẩn bị data cho Bar Chart - Blog by Month
  const blogBarData = blogStats?.blogsByMonth
    ? {
        labels: blogStats.blogsByMonth.map((item) => {
          const monthNames = [
            "T1", "T2", "T3", "T4", "T5", "T6",
            "T7", "T8", "T9", "T10", "T11", "T12"
          ];
          return `${monthNames[item._id.month - 1]}/${item._id.year}`;
        }),
        datasets: [
          {
            label: "Số blog",
            data: blogStats.blogsByMonth.map((item) => item.count),
            backgroundColor: "#3b82f6",
            borderColor: "#2563eb",
            borderWidth: 1,
          },
        ],
      }
    : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Thống kê tổng quan
          </h2>
          <p className="text-muted-foreground">
            Theo dõi hiệu suất kinh doanh của cửa hàng
          </p>
        </div>
        <Button 
          onClick={handleExportExcel} 
          disabled={exportLoading || (!userStats && !blogStats)}
          className="flex items-center gap-2"
        >
          {exportLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Đang xuất...</span>
            </>
          ) : (
            <>
              <FileSpreadsheet className="h-4 w-4" />
              <span>Xuất Excel</span>
            </>
          )}
        </Button>
      </div>

      {/* Thống kê cơ bản - Users */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng người dùng
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats ? userStats.totalUsers : "..."}
            </div>
            <div className="flex flex-col gap-1 mt-0.5">
              <span className="text-xs text-green-600 font-semibold">
                {userStats ? `${userStats.activeUsers} đang hoạt động` : ""}
              </span>
              <span className="text-xs text-red-600 font-semibold">
                {userStats ? `${userStats.inactiveUsers} bị khóa` : ""}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Blog Statistics Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng blog
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {blogStats ? blogStats.totalBlogs : "..."}
            </div>
            <div className="flex flex-col gap-1 mt-0.5">
              <span className="text-xs text-blue-600 font-semibold">
                {blogStats ? `${blogStats.totalViews} lượt xem` : ""}
              </span>
              <span className="text-xs text-purple-600 font-semibold">
                {blogStats ? `${blogStats.totalComments} bình luận` : ""}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lượt xem trung bình
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {blogStats && blogStats.totalBlogs > 0 
                ? Math.round(blogStats.totalViews / blogStats.totalBlogs) 
                : "..."}
            </div>
            <p className="text-xs text-muted-foreground">
              lượt xem/blog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bình luận trung bình
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {blogStats && blogStats.totalBlogs > 0 
                ? Math.round(blogStats.totalComments / blogStats.totalBlogs) 
                : "..."}
            </div>
            <p className="text-xs text-muted-foreground">
              bình luận/blog
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Biểu đồ và bảng thống kê */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* User Role Distribution */}
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
            ) : userStats && userPieData ? (
              <Pie data={userPieData} />
            ) : (
              <div>Không có dữ liệu</div>
            )}
          </CardContent>
        </Card>

        {/* Blog by Month Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Blog theo tháng (6 tháng gần nhất)</CardTitle>
            <CardDescription>
              Số lượng blog được tạo theo từng tháng
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Đang tải biểu đồ...</div>
            ) : blogStats && blogBarData ? (
              <Bar data={blogBarData} />
            ) : (
              <div>Không có dữ liệu</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Authors and Top Blogs */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Authors */}
        <Card>
          <CardHeader>
            <CardTitle>Top tác giả</CardTitle>
            <CardDescription>
              Những tác giả viết nhiều blog nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            {blogStats && blogStats.topAuthors && blogStats.topAuthors.length > 0 ? (
              <div className="space-y-3">
                {blogStats.topAuthors.map((author, index) => (
                  <div key={author._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{author.authorName}</p>
                        <p className="text-sm text-gray-500">{author.blogCount} blog</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{author.totalViews}</p>
                      <p className="text-xs text-gray-500">lượt xem</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>Không có dữ liệu</div>
            )}
          </CardContent>
        </Card>

        {/* Top Viewed Blogs */}
        <Card>
          <CardHeader>
            <CardTitle>Blog có nhiều lượt xem nhất</CardTitle>
            <CardDescription>
              Những blog được xem nhiều nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            {blogStats && blogStats.topViewedBlogs && blogStats.topViewedBlogs.length > 0 ? (
              <div className="space-y-3">
                {blogStats.topViewedBlogs.map((blog, index) => (
                  <div key={blog._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                        {index + 1}
                      </div>
                      <div className="max-w-xs">
                        <p className="font-medium text-sm truncate">{blog.title}</p>
                        <p className="text-xs text-gray-500">Tác giả: {blog.author?.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{blog.views}</p>
                      <p className="text-xs text-gray-500">lượt xem</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>Không có dữ liệu</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bảng số liệu vai trò */}
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết số lượng theo vai trò</CardTitle>
        </CardHeader>
        <CardContent>
          {userStats && userStats.usersByRole && userStats.usersByRole.length > 0 ? (
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-2 py-1 text-left">Vai trò</th>
                  <th className="px-2 py-1 text-right">Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {userStats.usersByRole.map((role) => (
                  <tr key={role.role}>
                    <td className="px-2 py-1">{role.role}</td>
                    <td className="px-2 py-1 text-right">{role.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>Không có dữ liệu</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
