import React from 'react';
import { Category } from '@/lib/wordpress';
import { ProductCard } from './ProductCard';

interface RestaurantMenuProps {
    categories: Category[];
    primaryColor?: string;
}

export function RestaurantMenu({ categories, primaryColor }: RestaurantMenuProps) {
    if (!categories || categories.length === 0) {
        return <div className="text-center py-10 text-gray-500">No hay productos disponibles.</div>;
    }

    return (
        <div className="space-y-12">
            {categories.map((category, index) => (
                <section key={index} id={`category-${index}`} className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2" style={{ borderColor: primaryColor }}>
                        {category.category_name}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {category.products?.map((product, pIndex) => (
                            <ProductCard key={pIndex} product={product} primaryColor={primaryColor} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}