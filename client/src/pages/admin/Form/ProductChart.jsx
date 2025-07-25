// Form/ProductChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const ProductChart = ({
  categoryCount,
  subcategoryCount,
  totalOrders,
  totalStock,
}) => {
  const data = [
    { name: "Category", value: categoryCount || 0 },
    { name: "Subcategory", value: subcategoryCount || 0 },
    { name: "Orders", value: Math.abs(totalOrders) || 0 },
    { name: "Products", value: totalStock || 0 },
  ];

  return (
    <BarChart width={900} height={400} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill="#8884d8">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Bar>
    </BarChart>
  );
};
