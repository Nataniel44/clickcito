import { getRestaurantBySlug, getAllRestaurants } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import { RestaurantMenu } from '@/components/RestaurantMenu';
import Image from 'next/image';
import { Phone, MapPin } from 'lucide-react';
import { CartProvider } from '@/context/CartContext';
import { CartSidebar } from '@/components/CartSidebar';
import { FloatingCartButton } from '@/components/FloatingCartButton';
import { Toaster } from 'react-hot-toast';

export async function generateStaticParams() {
    try {
        const restaurants = await getAllRestaurants();
        return restaurants.map((r) => ({
            slug: r.slug,
        }));
    } catch (error) {
        console.error("Error generating static params for restaurants:", error);
        return [{ slug: 'elysrestobar' }];
    }
}

export default async function RestaurantPage(props: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { slug } = await props.params;
    const restaurant = await getRestaurantBySlug(slug);

    if (!restaurant) {
        notFound();
    }

    const { title, acf, featured_media_url } = restaurant;
    const primaryColor = acf.primary_color || '#000000';

    return (
        <CartProvider>
            <div className="min-h-screen bg-gray-50 pb-32">
                <Toaster position="top-center" />
                <CartSidebar
                    restaurantName={title.rendered}
                    whatsappNumber={acf.whatsapp}
                    primaryColor={primaryColor}
                />

                {/* Header / Hero */}
                <div className="relative bg-white shadow-sm">
                    <div className="h-64 w-full bg-gray-900 relative overflow-hidden">
                        {featured_media_url && (
                            <Image
                                src={featured_media_url}
                                alt="Cover"
                                fill
                                className="object-cover opacity-50 blur-sm scale-110"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>

                    <div className="container mx-auto px-4 -mt-24 relative z-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-40 h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white relative mb-6 group">
                                {featured_media_url ? (
                                    <Image
                                        src={featured_media_url}
                                        alt={title.rendered}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-4xl font-bold text-gray-400">
                                        {title.rendered.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 tracking-tight">{title.rendered}</h1>

                            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mb-8 bg-white/80 backdrop-blur-sm py-2 px-6 rounded-full shadow-sm border border-gray-100">
                                {acf.address && (
                                    <div className="flex items-center gap-2">
                                        <MapPin size={18} className="text-gray-400" />
                                        <span className="font-medium">{acf.address}</span>
                                    </div>
                                )}
                                {acf.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone size={18} className="text-gray-400" />
                                        <span className="font-medium">
                                            {acf.phone}

                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Category Navigation (Sticky) */}
                            {restaurant.menu_categories && restaurant.menu_categories.length > 0 && (
                                <div className="w-full sticky top-0 z-30 pt-4 pb-4 -mx-4 px-4 backdrop-blur-md bg-white/90 border-b border-gray-100/50">
                                    <div className="flex justify-center gap-3 overflow-x-auto custom-scrollbar py-1 max-w-4xl mx-auto">
                                        {restaurant.menu_categories.map((cat, idx) => (
                                            <a
                                                key={idx}
                                                href={`#category-${idx}`}
                                                className="px-6 py-2.5 rounded-full bg-white border border-gray-200 shadow-sm text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all whitespace-nowrap active:scale-95"
                                                style={{
                                                    // We can use inline styles for dynamic colors, but cleaner to use classes if possible.
                                                    // For now, let's keep it simple.
                                                }}
                                            >
                                                {cat.category_name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Menu Content */}
                <main className="container mx-auto px-4 py-12 max-w-6xl">
                    {restaurant.menu_categories && restaurant.menu_categories.length > 0 ? (
                        <RestaurantMenu categories={restaurant.menu_categories} primaryColor={primaryColor} />
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-xl text-gray-500 font-medium">Menú no disponible en este momento.</p>
                        </div>
                    )}
                </main>

                <FloatingCartButton primaryColor={primaryColor} />

                {/* Floating WhatsApp Button (Only if not using cart, or as secondary) */}
                {/* We keep it but maybe smaller or different position if cart is main CTA */}
            </div>
        </CartProvider>
    );
}
