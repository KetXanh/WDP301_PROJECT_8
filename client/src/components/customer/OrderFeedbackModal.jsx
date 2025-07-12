import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import OrderFeedbackForm from './OrderFeedbackForm';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { userFeedback } from '../../services/Customer/ApiProduct';

const OrderFeedbackModal = ({ isOpen, onClose, product }) => {
    const { t } = useTranslation(['translation']);

    const handleSubmitFeedback = async ({ rating, comment }) => {
        try {
            const response = await userFeedback({
                ProductBase: product.id,
                stars: rating,
                comment,
                images: [],
            });

            if (response.status === 201) {
                toast.success(t('order_feedback.toast_feedback_success'));
                onClose();
            } else if (response.data.code === 405) {
                toast.error(t('order_feedback.toast_feedback_star'))
            } else if (response.data.code === 400) {
                toast.info(t('order_feedback.toast_exitfeddback'))
                onClose();
            }
        } catch (error) {
            console.log(error);

        }
    };

    if (!product) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t('order_feedback.title')} - {product.name}
                    </DialogTitle>
                </DialogHeader>
                <OrderFeedbackForm
                    orderId={product.id}
                    onSubmit={handleSubmitFeedback}
                    existingFeedback={null}
                />
            </DialogContent>
        </Dialog>
    );
};

export default OrderFeedbackModal;
