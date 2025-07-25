import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, Package, ShoppingCart, Tag } from "lucide-react";
import { getTotalStock, getCategoryStats, getTotalOrders } from "../../services/Admin/AdminAPI";
import { ProductChart } from "./Form/ProductChart";
import { useTranslation } from "react-i18next";

const DashboardAdmin = () => {
  const { t } = useTranslation("admin");
  const [totalStock, setTotalStock] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [subcategoryCount, setSubcategoryCount] = useState(0);


  useEffect(() => {
    getTotalStock()
      .then((res) => {
        setTotalStock(res.data.totalStock);
      })
      .catch((err) => {
        console.error("Error fetching stock:", err);
      });

    getCategoryStats()
      .then((res) => {
        setCategoryCount(res.data.categoryCount);
        setSubcategoryCount(res.data.subcategoryCount);
      })
      .catch((err) => {
        console.error("Error fetching category stats:", err);
      });
    getTotalOrders()
      .then((res) => {
        setTotalOrders(res.data.totalOrders);
      })
      .catch((err) => {
        console.error("Error fetching total orders:", err);
      });
  }, []);


  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Category
            </CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryCount}</div>
            <p className="text-xs text-muted-foreground">Tổng danh mục</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">Tổng số đơn hàng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Subcategory
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subcategoryCount}</div>
            <p className="text-xs text-muted-foreground">Tổng danh mục con</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock}</div>
            <p className="text-xs text-muted-foreground">Tổng số sản phẩm</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardTitle>Thống kê tổng quan</CardTitle>
        <CardContent className="h-[300px]">
          <ProductChart
            categoryCount={categoryCount}
            subcategoryCount={subcategoryCount}
            totalOrders={totalOrders}
            totalStock={totalStock}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardAdmin;
