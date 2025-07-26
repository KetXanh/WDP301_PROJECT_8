import { Shield, Heart, Leaf, Users, Award, Target, MessageCircle, Bot } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import Chatbox from '@/components/Chatbox/Chatbox';
import ChatAI from '@/components/Chatbox/ChatAI';

const About = () => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatAIOpen, setIsChatAIOpen] = useState(false);

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Sức Khỏe Là Ưu Tiên",
      description: "Chúng tôi cam kết mang đến những sản phẩm dinh dưỡng chất lượng cao, an toàn cho sức khỏe của bạn và gia đình."
    },
    {
      icon: <Leaf className="h-8 w-8 text-green-500" />,
      title: "Thiên Nhiên Thuần Khiết",
      description: "Tất cả sản phẩm đều được chiết xuất từ thiên nhiên, không chất bảo quản, đảm bảo độ tinh khiết tối đa."
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: "Chất Lượng Đảm Bảo",
      description: "Quy trình sản xuất nghiêm ngặt theo tiêu chuẩn quốc tế, đảm bảo chất lượng từng sản phẩm đến tay người tiêu dùng."
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: "Phục Vụ Tận Tâm",
      description: "Đội ngũ chuyên gia dinh dưỡng sẵn sàng tư vấn và hỗ trợ bạn chọn lựa sản phẩm phù hợp nhất."
    }
  ];

  const achievements = [
    { number: "10+", label: "Năm Kinh Nghiệm" },
    { number: "50K+", label: "Khách Hàng Tin Tưởng" },
    { number: "100+", label: "Sản Phẩm Chất Lượng" },
    { number: "5★", label: "Đánh Giá Trung Bình" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Nút chat nổi - Chat với Admin/Sale Staff */}
      <div className="fixed z-50 bottom-6 right-6 flex flex-col items-end gap-3">
        <Button
          className="w-14 h-14 rounded-full shadow-lg bg-gradient-to-br from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600 flex flex-col items-center justify-center"
          onClick={() => setIsChatOpen(true)}
          style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.12)' }}
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </Button>
        <Button
          className="w-14 h-14 rounded-full shadow-lg bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 flex flex-col items-center justify-center"
          onClick={() => setIsChatAIOpen(true)}
          style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.12)' }}
        >
          <Bot className="w-7 h-7 text-white" />
        </Button>
      </div>
      <Chatbox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <ChatAI isOpen={isChatAIOpen} onClose={() => setIsChatAIOpen(false)} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Về <span className="text-green-600">Chúng</span> <span className="text-orange-500">Tôi</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              NutiGo là thương hiệu hàng đầu trong lĩnh vực dinh dưỡng và sức khỏe tại Việt Nam. 
              Chúng tôi cam kết mang đến những sản phẩm chất lượng cao, giúp nâng cao chất lượng cuộc sống của mọi người.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Câu Chuyện Của <span className="text-green-600">NutiGo</span>
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Được thành lập vào năm 2014, NutiGo ra đời từ mong muốn mang đến cho người Việt Nam 
                  những sản phẩm dinh dưỡng chất lượng cao, an toàn và hiệu quả.
                </p>
                <p>
                  Khởi đầu từ một cửa hàng nhỏ, chúng tôi đã không ngừng phát triển và trở thành 
                  một trong những thương hiệu uy tín hàng đầu trong ngành dinh dưỡng tại Việt Nam.
                </p>
                <p>
                  Với đội ngũ chuyên gia dinh dưỡng giàu kinh nghiệm và quy trình sản xuất nghiêm ngặt, 
                  NutiGo tự hào là người bạn đồng hành tin cậy trên hành trình chăm sóc sức khỏe của bạn.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-100 to-orange-100 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Award className="h-24 w-24 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Cam Kết Chất Lượng</h3>
                  <p className="text-gray-600">Sản phẩm đạt chuẩn quốc tế</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Giá Trị Cốt Lõi
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những giá trị định hướng mọi hoạt động của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Target className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Sứ Mệnh</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Mang đến cho mọi người những sản phẩm dinh dưỡng chất lượng cao, 
                  an toàn và hiệu quả, góp phần nâng cao sức khỏe và chất lượng cuộc sống 
                  của cộng đồng Việt Nam.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Award className="h-8 w-8 text-orange-500 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Tầm Nhìn</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Trở thành thương hiệu dinh dưỡng hàng đầu Đông Nam Á, 
                  được khách hàng tin tưởng và lựa chọn với những sản phẩm 
                  chất lượng quốc tế và dịch vụ hoàn hảo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Thành Tựu Đạt Được
            </h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Những con số minh chứng cho sự tin tưởng của khách hàng
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {achievement.number}
                </div>
                <div className="text-green-100 font-medium">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Sẵn Sàng Bắt Đầu Hành Trình Sức Khỏe?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Hãy để NutiGo đồng hành cùng bạn trên con đường chăm sóc sức khỏe. 
            Khám phá ngay những sản phẩm chất lượng của chúng tôi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            onClick={() => navigate("/products")}>
              Xem Sản Phẩm
            </button>
            <button className="border-2 border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600 px-8 py-3 rounded-lg font-semibold transition-all duration-300"
            onClick={() => navigate("/contact")}>
              Liên Hệ Tư Vấn
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;