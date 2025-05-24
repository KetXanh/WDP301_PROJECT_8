import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const stats = [
    { title: "Tổng đơn hàng", value: "1,235" },
    { title: "Doanh thu tháng", value: "₫25,000,000" },
    { title: "Khách hàng", value: "320" },
    { title: "Sản phẩm", value: "82" },
  ];

  return (
    <div className="ml-64 p-6 space-y-6">
      <h2 className="text-2xl font-bold">Thống kê nhanh</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item) => (
          <Card key={item.title}>
            <CardContent className="p-4">
              <CardTitle>{item.title}</CardTitle>
              <p className="text-2xl font-bold mt-2">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
