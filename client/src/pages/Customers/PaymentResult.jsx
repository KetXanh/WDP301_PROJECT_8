// pages/PaymentResult.tsx
import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getOrderById } from '../../services/Customer/ApiProduct';

export default function PaymentResult() {
    const { status } = useParams();
    const [search] = useSearchParams();
    const orderId = search.get('order');

    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (orderId) getOrderById(orderId).then(r => setOrder(r.data));
    }, [orderId]);

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            {status === 'success' && (
                <>
                    <h2 className="text-3xl font-bold text-emerald-600">Thanh toán thành công!</h2>
                    {/* hiển thị thông tin đơn */}
                </>
            )}
            {status === 'cancel' && (
                <h2 className="text-3xl font-bold text-amber-600">Bạn đã hủy thanh toán.</h2>
            )}
            {status === 'fail' && (
                <h2 className="text-3xl font-bold text-red-600">Thanh toán thất bại!</h2>
            )}
        </div>
    );
}
