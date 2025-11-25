// Helper to get translated category name
export const getCategoryName = (categoryKey: string, language: "en" | "ar"): string => {
  const categoryMap: Record<string, Record<"en" | "ar", string>> = {
    Nuts: { en: "Nuts", ar: "المكسرات" },
    Grains: { en: "Grains", ar: "الحبوب" },
    Spices: { en: "Spices", ar: "التوابل" },
    "Dried Fruits": { en: "Dried Fruits", ar: "الفواكه المجففة" },
    "Organic Products": { en: "Organic Products", ar: "المنتجات العضوية" },
    Cosmetics: { en: "Cosmetics", ar: "مستحضرات العناية" },
  };
  return categoryMap[categoryKey]?.[language] || categoryKey;
};

// Helper to get translated tag name
export const getTagName = (tag: string, language: "en" | "ar"): string => {
  const tagMap: Record<string, Record<"en" | "ar", string>> = {
    Natural: { en: "Natural", ar: "طبيعي" },
    Organic: { en: "Organic", ar: "عضوي" },
    Raw: { en: "Raw", ar: "خام" },
    Vegan: { en: "Vegan", ar: "نباتي" },
    "Gluten Free": { en: "Gluten Free", ar: "خالي من الغلوتين" },
    "Non-GMO": { en: "Non-GMO", ar: "خالي من الكائنات المعدلة وراثياً" },
    Premium: { en: "Premium", ar: "مميز" },
    "Fair Trade": { en: "Fair Trade", ar: "تجارة عادلة" },
    Cruelty: { en: "Cruelty Free", ar: "خالي من الاختبار على الحيوانات" },
  };
  return tagMap[tag]?.[language] || tag;
};

export const translations = {
  en: {
    // Navigation
    home: "Home",
    shopAll: "Shop All",
    categories: "Categories",
    nuts: "Nuts",
    grains: "Grains",
    spices: "Spices",
    driedFruits: "Dried Fruits",
    organicProducts: "Organic Products",
    cosmetics: "Cosmetics",
    search: "Search products...",

    // Cart
    cart: "Cart",
    shoppingCart: "Shopping Cart",
    addToCart: "Add to cart",
    continueShopping: "Continue Shopping",
    yourCartEmpty: "Your cart is empty",
    addSomeProducts: "Add some products to get started!",
    subtotal: "Subtotal",
    shipping: "Shipping",
    tax: "Tax",
    total: "Total",
    items: "items",
    free: "FREE",
    remove: "Remove",

    // Product Listing
    priceRange: "Price Range",
    sortBy: "Sort By",
    featured: "Featured",
    priceLowToHigh: "Price: Low to High",
    priceHighToLow: "Price: High to Low",
    rating: "Rating",
    noProducts: "No products found",
    filters: "Filters",
    clearSearch: "Clear search",
    viewDetails: "View Details",

    // Product Detail
    products: "Products",
    relatedProducts: "Related Products",
    quantity: "Quantity",
    discount: "discount",
    outOfStock: "Out of Stock",
    inStock: "In Stock",
    productDetails: "Product Details",
    shippingInfo: "Shipping Information",
    returns: "Returns & Exchanges",

    // Checkout
    checkout: "Checkout",
    checkoutTitle: "Checkout",
    shippingInformation: "Shipping Information",
    paymentInformation: "Payment Information",
    orderSummary: "Order Summary",
    placeOrder: "Place Order",
    orderPlaced: "Order Placed Successfully!",
    orderPlacedMsg: "Thank you for your purchase. We'll send you a confirmation email shortly.",
    backToHome: "Back to Home",
    shopNow: "Shop Now",
    email: "Email",
    name: "Full Name",
    address: "Address",
    city: "City",
    postalCode: "Postal Code",
    country: "Country",

    // Footer
    allProducts: "All Products",
    newArrivals: "New Arrivals",
    bestSellers: "Best Sellers",
    sale: "Sale",
    shop: "Shop",
    support: "Support",
    company: "Company",
    contactUs: "Contact Us",
    shippingInfo: "Shipping Info",
    faq: "FAQ",
    aboutUs: "About Us",
    careers: "Careers",
    sustainability: "Sustainability",
    press: "Press",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    allRightsReserved: "© 2024 LUXE. All rights reserved.",
    premiumProducts: "Premium products with modern design and timeless quality. Elevate your everyday.",

    // Home Page
    premiumSelection: "Premium Selection",
    discoverOurCurated: "Discover our curated collection of the finest organic products and cosmetics from around the world",
    browseByCategory: "Browse by Category",
    featuredBundles: "Featured Bundles",
    handpickedCombinations: "Handpicked product combinations at incredible savings",
    bestSellersBundle: "Best Sellers Bundle",
    ourMostPopular: "Our most popular product combinations",
    youSave: "You save",
    buyBundle: "Buy Bundle",
    allProducts: "All Products",
    searchResultsFor: "Search results for",
    product: "product",
    products: "products",
    found: "found",
    searchByProductName: "Search by product name or description...",
    clearAllFilters: "Clear All Filters",

    // Feature Cards
    premiumQuality: "Premium Quality",
    handSelectedProducts: "Hand-selected products from trusted sources around the world",
    fastDelivery: "Fast Delivery",
    shippedDoorstep: "Shipped to your doorstep within 2-3 business days",
    satisfaction100: "100% Satisfaction",
    satisfactionGuarantee: "Guaranteed satisfaction or your money back",

    // Newsletter
    stayInLoop: "Stay in the Loop",
    subscribeOffer: "Subscribe to get special offers, free giveaways, and exclusive deals.",
    enterEmail: "Enter your email",
    subscribe: "Subscribe",

    // Common
    price: "Price",
    contact: "Contact",
  },
  ar: {
    // Navigation
    home: "الرئيسية",
    shopAll: "تصفح الكل",
    categories: "الفئات",
    nuts: "المكسرات",
    grains: "الحبوب",
    spices: "التوابل",
    driedFruits: "الفواكه المجففة",
    organicProducts: "المنتجات العضوية",
    cosmetics: "مستحضرات العناية",
    search: "ابحث عن منتجات...",

    // Cart
    cart: "السلة",
    shoppingCart: "سلة التسوق",
    addToCart: "أضف إلى السلة",
    continueShopping: "متابعة التسوق",
    yourCartEmpty: "السلة فارغة",
    addSomeProducts: "أضف بعض المنتجات للبدء!",
    subtotal: "المجموع الجزئي",
    shipping: "الشحن",
    tax: "الضريبة",
    total: "الإجمالي",
    items: "منتجات",
    free: "مجاني",
    remove: "إزالة",

    // Product Listing
    priceRange: "نطاق السعر",
    sortBy: "ترتيب حسب",
    featured: "مميز",
    priceLowToHigh: "السعر: من الأقل إلى الأعلى",
    priceHighToLow: "السعر: من الأعلى إلى الأقل",
    rating: "التقييم",
    noProducts: "لم يتم العثور على منتجات",
    filters: "تصفية",
    clearSearch: "مسح البحث",
    viewDetails: "عرض التفاصيل",

    // Product Detail
    products: "المنتجات",
    relatedProducts: "منتجات ذات صلة",
    quantity: "الكمية",
    discount: "خصم",
    outOfStock: "غير متوفر",
    inStock: "متوفر",
    productDetails: "تفاصيل المنتج",
    shippingInfo: "معلومات الشحن",
    returns: "الإرجاع والاستبدال",

    // Checkout
    checkout: "الدفع",
    checkoutTitle: "الدفع",
    shippingInformation: "معلومات الشحن",
    paymentInformation: "معلومات الدفع",
    orderSummary: "ملخص الطلب",
    placeOrder: "تأكيد الطلب",
    orderPlaced: "تم تأكيد الطلب بنجاح!",
    orderPlacedMsg: "شكراً لك على الشراء. سنرسل لك بريد تأكيد قريباً.",
    backToHome: "العودة للرئيسية",
    shopNow: "التسوق الآن",
    email: "البريد الإلكتروني",
    name: "الاسم الكامل",
    address: "العنوان",
    city: "المدينة",
    postalCode: "الرمز البريدي",
    country: "الدولة",

    // Footer
    allProducts: "جميع المنتجات",
    newArrivals: "الوصول الحديث",
    bestSellers: "الأكثر مبيعاً",
    sale: "عرض خاص",
    shop: "تسوق",
    support: "الدعم",
    company: "الشركة",
    contactUs: "اتصل بنا",
    shippingInfo: "معلومات الشحن",
    faq: "الأسئلة الشائعة",
    aboutUs: "من نحن",
    careers: "الوظائف",
    sustainability: "الاستدامة",
    press: "الصحافة",
    privacyPolicy: "سياسة الخصوصية",
    termsOfService: "شروط الخدمة",
    allRightsReserved: "© 2024 LUXE. جميع الحقوق محفوظة.",
    premiumProducts: "منتجات متميزة بتصميم حديث وجودة أبدية. ارفع مستوى حياتك اليومية.",

    // Home Page
    premiumSelection: "اختيار متميز",
    discoverOurCurated: "اكتشف مجموعتنا المنتقاة بعناية من أفضل المنتجات العضوية ومستحضرات العناية من حول العالم",
    browseByCategory: "تصفح حسب الفئة",
    featuredBundles: "الحزم المميزة",
    handpickedCombinations: "مزيج من المنتجات المنتقاة بعناية بأسعار لا تصدق",
    bestSellersBundle: "حزمة الأكثر مبيعاً",
    ourMostPopular: "أكثر مزيج منتجاتنا شهرة",
    youSave: "توفير",
    buyBundle: "شراء الحزمة",
    allProducts: "جميع المنتجات",
    searchResultsFor: "نتائج البحث عن",
    product: "منتج",
    products: "منتجات",
    found: "موجود",
    searchByProductName: "ابحث حسب اسم المنتج أو الوصف...",
    clearAllFilters: "مسح جميع المرشحات",

    // Feature Cards
    premiumQuality: "جودة متميزة",
    handSelectedProducts: "منتجات منتقاة بعناية من مصادر موثوقة حول العالم",
    fastDelivery: "توصيل سريع",
    shippedDoorstep: "يتم التسليم إلى عتبة داركم خلال 2-3 أيام عمل",
    satisfaction100: "رضا 100%",
    satisfactionGuarantee: "رضا مضمون أو استرجاع أموالك",

    // Newsletter
    stayInLoop: "ابقى على اطلاع",
    subscribeOffer: "اشترك للحصول على عروض خاصة وهدايا مجانية وصفقات حصرية.",
    enterEmail: "أدخل بريدك الإلكتروني",
    subscribe: "اشترك",

    // Common
    price: "السعر",
    contact: "اتصل",
  },
};

export type Language = "en" | "ar";
