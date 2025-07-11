
import React, { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const OrderFeedbackForm = ({
    orderId,
    onSubmit,
    existingFeedback
}) => {
    const [rating, setRating] = useState(existingFeedback?.rating || 0);
    const [comment, setComment] = useState(existingFeedback?.comment || '');
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return;

        setIsSubmitting(true);
        try {
            await onSubmit({ rating, comment });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            const isFilled = starValue <= (hoveredRating || rating);

            return (
                <button
                    key={index}
                    type="button"
                    className={`p-1 transition-colors ${isFilled ? 'text-yellow-400' : 'text-gray-300'
                        } hover:text-yellow-400`}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(starValue)}
                >
                    <Star className="w-6 h-6 fill-current" />
                </button>
            );
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    {existingFeedback ? 'Đánh giá của bạn' : 'Đánh giá đơn hàng'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label className="text-sm font-medium">Đánh giá tổng thể</Label>
                        <div className="flex items-center gap-1 mt-2">
                            {renderStars()}
                            <span className="ml-2 text-sm text-gray-600">
                                {rating > 0 && `${rating}/5 sao`}
                            </span>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="comment" className="text-sm font-medium">
                            Nhận xét (tùy chọn)
                        </Label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Chia sẻ trải nghiệm của bạn về đơn hàng này..."
                            className="mt-2 min-h-[100px]"
                            maxLength={500}
                        />
                        <div className="text-right text-xs text-gray-500 mt-1">
                            {comment.length}/500 ký tự
                        </div>
                    </div>

                    {!existingFeedback && (
                        <div className="flex justify-end gap-3">
                            <Button
                                type="submit"
                                disabled={rating === 0 || isSubmitting}
                                className="min-w-[100px]"
                            >
                                {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                            </Button>
                        </div>
                    )}

                    {existingFeedback && (
                        <div className="text-sm text-gray-500 italic">
                            Bạn đã đánh giá đơn hàng này vào ngày {new Date().toLocaleDateString('vi-VN')}
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
};

export default OrderFeedbackForm;
