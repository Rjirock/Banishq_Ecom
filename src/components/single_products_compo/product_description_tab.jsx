"use client";

import { useState } from "react";
import Product_reviews from "../single_products_compo/product_review"
export default function ProductTabs({ description, additionalInfo, reviews }) {
    const [activeTab, setActiveTab] = useState("description");

    const tabs = [
        { id: "description", label: "Description" },
        { id: "additional", label: "Additional Information" },
        { id: "reviews", label: "Reviews" },
    ];

    return (
        <div className="bg-[#ECE7E1] py-16">

            <div className="max-w-[1100px] mx-auto px-6">

                {/* TAB HEADER */}
                <div className="relative border-b border-gray-300 flex justify-center gap-16">

                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                relative
                pb-4
                text-[20px]
                font-semibold
                transition-all duration-300
                ${activeTab === tab.id
                                    ? "text-black"
                                    : "text-gray-600 hover:text-black"
                                }
              `}
                        >
                            {tab.label}

                            {/* Animated Underline */}
                            <span
                                className={`
                  absolute left-0 bottom-[-1px] h-[3px] bg-[#C6A75E]
                  transition-all duration-300
                  ${activeTab === tab.id
                                        ? "w-full"
                                        : "w-0"
                                    }
                `}
                            />
                        </button>
                    ))}

                </div>

                {/* TAB CONTENT */}
                <div className="mt-8 text-[17px] px-20 py-2 text-gray-600 leading-7 transition-opacity duration-300">

                    {activeTab === "description" && (
                        <p className="animate-fadeIn">
                            {description}
                        </p>
                    )}

                    {activeTab === "additional" && (
                        <div className="space-y-3 animate-fadeIn">
                            {additionalInfo.map((item, index) => (
                                <div key={index} className="flex gap-3 text-[15px]">
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

                    {activeTab === "reviews" && (
                      <Product_reviews reviews={reviews} />
                    )}
                </div>
            </div>
        </div>
    );
}