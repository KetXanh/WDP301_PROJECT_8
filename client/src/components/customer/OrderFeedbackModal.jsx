import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import OrderFeedbackForm from './OrderFeedbackForm';

const OrderFeedbackModal = ({ isOpen, onClose, orderId, selectedOrder }) => {
    const [orderFeedbacks, setOrderFeedbacks] = useState({});


    const handleFeedbackSubmit = async (orderId, feedback) => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        setOrderFeedbacks(prev => ({
            ...prev,
            [orderId]: feedback
        }));

        console.log('Feedback submitted for order:', orderId, feedback);
    };


    const existingFeedback = selectedOrder ? orderFeedbacks[selectedOrder.id] : '';

    const [feedback, setFeedback] = useState(existingFeedback);

    if (!selectedOrder) return null;
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Gửi đánh giá cho đơn hàng #{orderId}</DialogTitle>
                </DialogHeader>
                <OrderFeedbackForm
                    orderId={selectedOrder.id}
                    onSubmit={(feedback) => handleFeedbackSubmit(selectedOrder.id, feedback)}
                    existingFeedback={existingFeedback}
                />
            </DialogContent>
        </Dialog>
    );
};

export default OrderFeedbackModal;
