import React from "react";
import logo from "../../assets/NutiGo.png";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation("user");

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <img src={logo} alt="logo" />
              </div>
              <span className="text-xl font-bold">NutiGo</span>
            </div>
            <p className="text-gray-400">{t("footer.description")}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("footer.products.title")}
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  {t("footer.products.walnut")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  {t("footer.products.almond")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  {t("footer.products.cashew")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  {t("footer.products.mix")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("footer.support.title")}
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  {t("footer.support.contact")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  {t("footer.support.faq")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  {t("footer.support.policy")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  {t("footer.support.shipping")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("footer.contact.title")}
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>📞 {t("footer.contact.phone")}</li>
              <li>📧 {t("footer.contact.email")}</li>
              <li>📍 {t("footer.contact.address")}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 NutiGo. {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
