import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DiscountForm } from "./DiscountForm"

export default function CreateDiscount() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tạo giảm giá sản phẩm</h2>
        <p className="text-muted-foreground">
          Tạo chương trình giảm giá cho các sản phẩm cụ thể
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin giảm giá</CardTitle>
          <CardDescription>
            Điền thông tin chi tiết cho chương trình giảm giá
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DiscountForm />
        </CardContent>
      </Card>
    </div>
  )
}
