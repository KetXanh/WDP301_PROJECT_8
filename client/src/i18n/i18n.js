import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";


// import common_vi from "../locales/vn/common.json";
// import common_en from "../locales/en/common.json";

// import user_vi from "../locales/vn/user.json";
// import user_en from "../locales/en/user.json";

// import admin_vi from "../locales/vn/admin.json";
// import admin_en from "../locales/en/admin.json";

// import sale_vi from "../locales/vn/sale.json";
// import sale_en from "../locales/en/sale.json";

// import message_vi from '../locales/vn/message.json'
// import message_en from '../locales/en/message.json'
import combined from "../locales/combined.json";

function transformTranslations(source, lang) {
  function recurse(node) {
    // 1️⃣ Nếu là mảng → xử lý từng phần tử
    if (Array.isArray(node)) return node.map(recurse);

    // 2️⃣ Nếu là object {en,vi} → trả ra chuỗi theo lang
    if (
      node &&
      typeof node === "object" &&
      "en" in node &&
      "vi" in node &&
      !Array.isArray(node.en)
    ) {
      return node[lang];
    }

    // 3️⃣ Nếu là object lồng thêm → duyệt key con
    if (node && typeof node === "object") {
      const result = {};
      Object.keys(node).forEach((k) => (result[k] = recurse(node[k])));
      return result;
    }

    // 4️⃣ Kiểu primitive → giữ nguyên
    return node;
  }

  return recurse(source);
}



const viTrans = transformTranslations(combined, "vi");
const enTrans = transformTranslations(combined, "en");

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      // vi: {
      //   common: common_vi,
      //   user: user_vi,
      //   admin: admin_vi,
      //   sale: sale_vi,
      //   message: message_vi,
      // },
      // en: {
      //   common: common_en,
      //   user: user_en,
      //   admin: admin_en,
      //   sale: sale_en,
      //   message: message_en,
      // },
      vi: { translation: viTrans },
      en: { translation: enTrans },
    },
    fallbackLng: "vi",
    debug: false,

    ns: ["translation"],
    // ns: ["common", "user", "admin", "sale", 'message'],
    // defaultNS: "common",

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
