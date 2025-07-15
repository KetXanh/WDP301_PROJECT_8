import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import OrderFeedbackForm from "./OrderFeedbackForm";
import { useTranslation } from "react-i18next";
import { addRatingUser } from "../../services/Customer/ApiProduct"; 

const OrderFeedbackModal = ({ isOpen, onClose, orderId, selectedOrder }) => {
  const [orderFeedbacks, setOrderFeedbacks] = useState({});
  const { t } = useTranslation(["translation"]);

  const handleFeedbackSubmit = async (orderId, feedback) => {
    try {
      const res = await addRatingUser({
        ProductBase: selectedOrder.productBaseId, 
        stars: feedback.rating,
        comment: feedback.comment,
        images: [], 
      });

      console.log(res);
      
      setOrderFeedbacks((prev) => ({
        ...prev,
        [orderId]: feedback,
      }));

      console.log("Feedback submitted for order:", orderId, feedback);
    } catch (error) {
      console.error("Gửi đánh giá thất bại:", error);
    }
  };

  const existingFeedback = selectedOrder
    ? orderFeedbacks[selectedOrder.id]
    : null;

  if (!selectedOrder) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("order_feedback.title")} #{orderId}
          </DialogTitle>
        </DialogHeader>
        <OrderFeedbackForm
          orderId={selectedOrder.id}
          onSubmit={(feedback) =>
            handleFeedbackSubmit(selectedOrder.id, feedback)
          }
          existingFeedback={existingFeedback}
        />
      </DialogContent>
    </Dialog>
  );
};

export default OrderFeedbackModal;
