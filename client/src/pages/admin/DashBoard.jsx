import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, Package, ShoppingCart, Tag } from "lucide-react";
import { getTotalStock ,getCategoryStats} from "../../services/Admin/AdminAPI";
import ProductByCategoryChart from "./Form/ProductChart";

// Move data outside the component to avoid redefinition on each render

const Dashboard = () => {
  // Move state declaration inside the component
  const [totalStock, setTotalStock] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [subcategoryCount, setSubcategoryCount] = useState(0);

  // Move useEffect inside the component
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
}, []);


  return (
    <div className="p-6 space-y-6">
      {/* Cards summary */}
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
            <p className="text-xs text-muted-foreground">Tổng danh mục chính</p>
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
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
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
            <p className="text-xs text-muted-foreground">+8 new products</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        
        <CardContent className="h-[300px]">
          <ProductByCategoryChart/>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
