// Training data cho chatbot
const TRAINING_DATA = {
    // Các mẫu câu chào hỏi và cách trả lời
    greetings: {
        patterns: [
            "Xin chào", "Chào bạn", "Hi", "Hello", "Chào", 
            "Chào buổi sáng", "Chào buổi tối", "Chào buổi chiều"
        ],
        responses: [
            "Xin chào! Tôi có thể giúp gì cho bạn về các sản phẩm thực phẩm sạch không?",
            "Chào bạn! Bạn cần tư vấn về sản phẩm nào của chúng tôi?",
            "Xin chào! Rất vui được gặp bạn. Bạn đang tìm kiếm sản phẩm gì vậy?"
        ]
    },

    // Các mẫu câu tạm biệt và cách trả lời
    farewells: {
        patterns: [
            "Tạm biệt", "Goodbye", "Bye", "Hẹn gặp lại", 
            "Chào tạm biệt", "Tạm biệt nhé"
        ],
        responses: [
            "Cảm ơn bạn đã ghé thăm! Hẹn gặp lại bạn sớm!",
            "Tạm biệt bạn! Mong sớm được phục vụ bạn lần nữa!",
            "Chúc bạn một ngày tốt lành! Hẹn gặp lại!"
        ]
    },

    // Các mẫu câu cảm ơn và cách trả lời
    thanks: {
        patterns: [
            "Cảm ơn", "Thank you", "Thanks", "Cảm ơn bạn", 
            "Cảm ơn nhiều", "Cảm ơn rất nhiều"
        ],
        responses: [
            "Rất vui được giúp đỡ bạn! Bạn cần thêm thông tin gì không?",
            "Cảm ơn bạn đã tin tưởng chúng tôi! Chúc bạn một ngày tốt lành!",
            "Rất hân hạnh được phục vụ bạn! Bạn cần gì thêm không?"
        ]
    },

    // Các câu hỏi về sản phẩm và cách trả lời
    products: {
        patterns: [
            "Sản phẩm này có gì đặc biệt",
            "Sản phẩm này có nguồn gốc từ đâu",
            "Sản phẩm này có đảm bảo chất lượng không",
            "Sản phẩm này có giá bao nhiêu",
            "Sản phẩm này có còn hàng không"
        ],
        responses: [
            "Sản phẩm của chúng tôi được chọn lọc kỹ lưỡng, đảm bảo chất lượng và an toàn cho sức khỏe.",
            "Tất cả sản phẩm đều có nguồn gốc rõ ràng và được kiểm định chất lượng nghiêm ngặt.",
            "Chúng tôi cam kết cung cấp sản phẩm chất lượng cao với giá cả hợp lý.",
            "Bạn có thể xem thông tin chi tiết về sản phẩm trên trang web của chúng tôi."
        ]
    },

    // Các câu hỏi về dịch vụ và cách trả lời
    services: {
        patterns: [
            "Có giao hàng không",
            "Phí vận chuyển bao nhiêu",
            "Thời gian giao hàng là bao lâu",
            "Có đổi trả không",
            "Chính sách bảo hành như thế nào"
        ],
        responses: [
            "Chúng tôi cung cấp dịch vụ giao hàng toàn quốc với phí vận chuyển hợp lý.",
            "Thời gian giao hàng thường từ 1-3 ngày tùy khu vực.",
            "Chúng tôi có chính sách đổi trả trong vòng 7 ngày nếu sản phẩm không đảm bảo chất lượng.",
            "Mọi sản phẩm đều được bảo hành theo chính sách của nhà sản xuất."
        ]
    },

    // Các câu hỏi về thanh toán và cách trả lời
    payment: {
        patterns: [
            "Thanh toán bằng cách nào",
            "Có chấp nhận thẻ không",
            "Có thanh toán khi nhận hàng không",
            "Có chuyển khoản không"
        ],
        responses: [
            "Chúng tôi chấp nhận nhiều hình thức thanh toán: tiền mặt, chuyển khoản, thẻ tín dụng.",
            "Bạn có thể thanh toán khi nhận hàng (COD) hoặc chuyển khoản trước.",
            "Chúng tôi hỗ trợ thanh toán qua các cổng thanh toán điện tử phổ biến."
        ]
    }
};

// System prompt định nghĩa vai trò và cách trả lời của chatbot
const SYSTEM_PROMPT = `Bạn là một trợ lý thông minh của cửa hàng thực phẩm sạch. 
Hãy trả lời các câu hỏi về sản phẩm, giá cả, và dịch vụ một cách thân thiện và chuyên nghiệp.
Nếu không biết câu trả lời, hãy thành thật nói rằng bạn không biết và đề nghị liên hệ với nhân viên hỗ trợ.

Một số nguyên tắc khi trả lời:
1. Luôn thân thiện và chuyên nghiệp
2. Trả lời ngắn gọn, rõ ràng và đầy đủ thông tin
3. Nếu không chắc chắn, hãy đề nghị liên hệ với nhân viên hỗ trợ
4. Không đưa ra thông tin sai lệch hoặc không chính xác
5. Luôn giữ thái độ tích cực và hữu ích`;

module.exports = {
    TRAINING_DATA,
    SYSTEM_PROMPT
}; 