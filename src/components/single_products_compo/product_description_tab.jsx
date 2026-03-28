"use client";

import { useState } from "react";
import Product_reviews from "../single_products_compo/product_review";

export default function ProductTabs({ description, additionalInfo, reviews }) {
    const [activeTab, setActiveTab] = useState("description");

    const tabs = [
        { id: "description", label: "Description" },
        { id: "additional", label: "Additional Information" },
        { id: "reviews", label: "Reviews" },
    ];

    return (
        <div className="bg-[#ECE7E1] py-10 sm:py-14 md:py-16">

            <div className="max-w-[1100px] mx-auto px-4 sm:px-6">

                {/* TAB HEADER */}
                <div className="relative border-b border-gray-300">

                    <div className="flex gap-6 sm:gap-10 md:gap-16 justify-start sm:justify-center overflow-x-auto no-scrollbar">

                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    relative pb-3 sm:pb-4 whitespace-nowrap
                                    text-[14px] sm:text-[16px] md:text-[18px]
                                    font-semibold transition-all duration-300
                                    ${activeTab === tab.id
                                        ? "text-black"
                                        : "text-gray-600 hover:text-black"
                                    }
                                `}
                            >
                                {tab.label}

                                {/* UNDERLINE */}
                                <span
                                    className={`
                                        absolute left-0 bottom-[-1px] h-[2px] sm:h-[3px] bg-[#C6A75E]
                                        transition-all duration-300
                                        ${activeTab === tab.id ? "w-full" : "w-0"}
                                    `}
                                />
                            </button>
                        ))}

                    </div>
                </div>

                {/* TAB CONTENT */}
                <div className="mt-6 sm:mt-8
                                text-[14px] sm:text-[15px] md:text-[17px]
                                px-0 sm:px-4 md:px-10 lg:px-20
                                py-2 text-gray-600 leading-6 sm:leading-7">

                    {/* DESCRIPTION */}
                    {activeTab === "description" && (
                        <p className="animate-fadeIn">
                            {description}
                        </p>
                    )}

                    {/* ADDITIONAL INFO */}
                    {activeTab === "additional" && (
                        <div className="space-y-3 animate-fadeIn">
                            {additionalInfo.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col sm:flex-row sm:gap-4 text-[13px] sm:text-[14px] md:text-[15px]"
                                >
                                    <span className="font-medium text-black min-w-[120px]">
                                        {item.label}:
                                    </span>
                                    <span className="text-gray-600">
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* REVIEWS */}
                    {activeTab === "reviews" && (
                        <div className="animate-fadeIn">
                            <Product_reviews reviews={reviews} />
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}