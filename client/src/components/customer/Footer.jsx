import React from 'react';

const Footer = () => {
    return (
        <div>
            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-amber-600 rounded-full flex items-center justify-center">
                                    <span className="text-lg">🌰</span>
                                </div>
                                <span className="text-xl font-bold">NutiGo</span>
                            </div>
                            <p className="text-gray-400">
                                Cửa hàng hạt dinh dưỡng cao cấp, mang đến sức khỏe và hạnh phúc cho mọi gia đình.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Sản Phẩm</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">Hạt Óc Chó</a></li>
                                <li><a href="#" className="hover:text-white">Hạnh Nhân</a></li>
                                <li><a href="#" className="hover:text-white">Hạt Điều</a></li>
                                <li><a href="#" className="hover:text-white">Mix Nuts</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Hỗ Trợ</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">Liên Hệ</a></li>
                                <li><a href="#" className="hover:text-white">FAQ</a></li>
                                <li><a href="#" className="hover:text-white">Chính Sách</a></li>
                                <li><a href="#" className="hover:text-white">Giao Hàng</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Liên Hệ</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>📞 0123 456 789</li>
                                <li>📧 info@nutigo.com</li>
                                <li>📍 123 Đường ABC, TP.HCM</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 NutiGo. Tất cả quyền được bảo lưu.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;