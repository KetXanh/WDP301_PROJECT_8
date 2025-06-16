import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getProductCountByCategory } from "../../../services/Admin/AdminAPI";

const ProductByCategoryChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getProductCountByCategory()
      .then((res) => {
        console.log("Product by category data:", res.data); 
        setData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching product count:", err);
      });
  }, []);

  return (
    <div className="w-full h-full">
      <h2 className="font-semibold text-lg mb-2">Sản phẩm theo danh mục</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductByCategoryChart;
