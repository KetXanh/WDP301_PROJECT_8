import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import OrderFeedbackForm from './OrderFeedbackForm';
import { useTranslation } from 'react-i18next';

const OrderFeedbackModal = ({ isOpen, onClose, orderId, selectedOrder }) => {
    const [orderFeedbacks, setOrderFeedbacks] = useState({});
    const { t } = useTranslation(['translation'])

    const handleFeedbackSubmit = async (orderId, feedback) => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        setOrderFeedbacks(prev => ({
            ...prev,
            [orderId]: feedback
        }));

        console.log('Feedback submitted for order:', orderId, feedback);
    };


    const existingFeedback = selectedOrder ? orderFeedbacks[selectedOrder.id] : '';

    // const [feedback, setFeedback] = useState(existingFeedback);

    if (!selectedOrder) return null;
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('order_feedback.title')} #{orderId}</DialogTitle>
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
