const Router = require("express").Router();

const MaincategoryRouter = require("./MaincategoryRoutes");
const SubcategoryRouter = require("./SubcategoryRoutes");
const BrandRouter = require("./BrandRoutes");
const ProductRouter = require("./ProductRoutes");
const FeatureRouter = require("./FeatureRoutes");
const FaqRouter = require("./FaqRoutes");
const SettingRouter = require("./SettingRoutes");
const UserRouter = require("./UserRoutes");
const CartRouter = require("./CartRoutes");
const WishlistRouter = require("./WishlistRoutes");
const CheckoutRouter = require("./CheckoutRoutes");
const NewsletterRouter = require("./NewsletterRoutes");
const ContactusRouter = require("./ContactusRoutes");
const TestimonialRouter = require("./TestimonialRoutes");

Router.use("/maincategory", MaincategoryRouter);
Router.use("/subcategory", SubcategoryRouter);
Router.use("/brand", BrandRouter);
Router.use("/product", ProductRouter);
Router.use("/feature", FeatureRouter);
Router.use("/faq", FaqRouter);
Router.use("/setting", SettingRouter);
Router.use("/user", UserRouter);
Router.use("/cart", CartRouter);
Router.use("/wishlist", WishlistRouter);
Router.use("/checkout", CheckoutRouter);
Router.use("/newsletter", NewsletterRouter);
Router.use("/contactus", ContactusRouter);
Router.use("/testimonial", TestimonialRouter);

module.exports = Router;
