import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/customer/authSlice"; // ví dụ action

const ProtectedRoute = ({ element }) => {
    const dispatch = useDispatch();
    const accessToken = useSelector(s => s.customer.accessToken);

    if (!accessToken) return <Navigate to="/login" replace />;

    try {
        const { exp } = jwtDecode(accessToken);          // exp = giây kể từ epoch
        if (Date.now() >= exp * 1000) {                  // đã hết hạn
            dispatch(logout());                            // xoá token Redux + localStorage
            return <Navigate to="/login" replace />;
        }
        // eslint-disable-next-line no-unused-vars
    } catch (_) {
        // Token hỏng / decode lỗi
        dispatch(logout());
        return <Navigate to="/login" replace />;
    }

    return element;   // hợp lệ
};

export default ProtectedRoute;
