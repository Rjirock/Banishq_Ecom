import { products } from "../../data/product-details/products";
import Product_carrousel from "../../../components/single_products_compo/product_carrousel";
import Product_description from "../../../components/single_products_compo/product_description_tab";
import Related_Products from "../../../components/related_products/page";
import ProductActions from "../../../components/single_products_compo/product_action";

export default async function Page({ params }) {
    const { slug } = await params;

    const product = products.find((item) => item.slug === slug);

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <p className="text-gray-500 text-lg">Product not found.</p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-[#f5f0e8] py-14">
                <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-14">

                    {/* LEFT — Gallery */}
                    <Product_carrousel images={product.images} />

                    {/* RIGHT — Details */}
                    <div>

                        {/* Breadcrumb-style category */}
                        <p className="text-xs uppercase tracking-widest text-[#a08060] font-medium mb-2">
                            {product.category}
                        </p>
                        {/* Product Name */}
                        <h1 className="text-2xl font-semibold text-gray-900 mb-3 leading-snug">
                            {product.name}
                        </h1>
                        {/* Price Row */}
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-gray-400 line-through text-sm">
                                ₹ {product.oldPrice}
                            </span>
                            <span className="text-[35px] font-semibold tracking-wide text-[#c9a96a] font-serif">
                                ₹ {product.price}
                            </span>
                            <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                                {product.discount}
                            </span>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-5 text-sm text-gray-500">
                            <span className="text-yellow-400 tracking-tight">⭐⭐⭐⭐⭐</span>
                            <span>
                                {products.rating}{" "}
                                <span className="text-gray-400">
                                    ({product.totalReviews} Reviews)
                                </span>
                            </span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm leading-7 mb-5">
                            {product.description}
                        </p>

                        {/* Divider */}
                        <div className="border-t border-gray-200 my-4" />

                        {/* Key Features */}
                        <div>
                            <h3 className="text-[15px] font-semibold text-gray-800 mb-3">
                                Key Features
                            </h3>

                            <ul className="space-y-2">
                                {product.features.map((feature, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-2 text-[13.5px] text-gray-600 leading-6"
                                    >
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#d4a373] shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Specifications */}
                        <div className="mt-5">
                            <h3 className="text-[15px] font-semibold text-gray-800 mb-3">
                                Specifications
                            </h3>

                            <ul className="space-y-2">
                                {product.specifications.map((spec, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-2 text-[13.5px] text-gray-600 leading-6"
                                    >
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                                        {spec}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ── Interactive Actions (Client Component) ── */}
                        <ProductActions product={products} />

                    </div>
                </div>

                {/* Product Tabs */}
                <Product_description
                    description={product.description}
                    additionalInfo={product.additionalInfo}
                    reviews={product.reviews}
                />
            </div>

            <Related_Products />
        </>
    );
}