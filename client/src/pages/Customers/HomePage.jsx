import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Star, Truck, Shield, Award, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import AddToCartButton from '../../components/customer/AddToCartButton';
import { allProducts } from '../../services/Customer/ApiProduct';
import { useTranslation } from "react-i18next";


const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('translation');
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const benefits = [
    {
      icon: <Truck className="h-8 w-8 text-green-600" />,
      title: t("home.benefit1Title"),
      description: t("home.benefit1Desc"),
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: t("home.benefit2Title"),
      description: t("home.benefit2Desc"),
    },
    {
      icon: <Award className="h-8 w-8 text-green-600" />,
      title: t("home.benefit3Title"),
      description: t("home.benefit3Desc"),
    },
    {
      icon: <Heart className="h-8 w-8 text-green-600" />,
      title: t("home.benefit4Title"),
      description: t("home.benefit4Desc"),
    },
  ];

  const products = async () => {
    try {
      const res = await allProducts();
      if (res.data && res.data.code === 200) {
        setFeaturedProducts(res.data.data);
      }
    } catch (error) {
      console.log("Lấy danh sách product không thành công", error);
    }
  };

  useEffect(() => {
    products();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            {t("home.title")}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t("home.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/products")}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-lg px-8 py-3"
            >
              {t("home.buyNow")}
            </Button>
            <Button
              onClick={() => navigate("/about")}
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3"
            >
              {t("home.learnMore")}
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            {t("home.featured")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-lg transition-shadow duration-300 group"
              >
                <CardHeader
                  onClick={() => navigate(`/products/${product.slug}`)}
                  className="text-center pb-4"
                >
                  <div className="mb-4 group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-32 w-32 object-contain mx-auto"
                    />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">
                        {product.rating || 0}
                      </span>
                    </div>
                  </div>
                  <div className="text-center mb-4">
                    <span className="text-2xl font-bold text-green-600">
                      {product.price.toLocaleString("vi-VN")}đ
                    </span>
                    <span className="text-sm text-gray-500 line-through ml-2">
                      {product.originalPrice}
                    </span>
                  </div>
                  <AddToCartButton product={product} quantity={1} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            {t("home.why")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-white rounded-full shadow-lg">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-amber-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t("home.startJourney")}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t("home.startDesc")}
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              {t("home.registerNow")}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
