import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element }) => {
    const accessToken = useSelector((state) => state.customer.accessToken);
    // const role = useSelector((state) => state.customer.role); // ví dụ bạn có lưu vai trò user ở đây

    if (!accessToken) return <Navigate to="/login" />;
    // Nếu muốn kiểm tra quyền nâng cao hơn
    // if (role !== 'customer') return <Navigate to="/forbidden" />;

    return element;
};

export default ProtectedRoute;
