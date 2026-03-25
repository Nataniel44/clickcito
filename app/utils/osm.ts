
/**
 * Utility to fetch nearby Points of Interest from OpenStreetMap (Overpass API)
 * Completely free, no API key required.
 */

export interface OSMBusiness {
    id: number;
    name: string;
    type: string;
    lat: number;
    lon: number;
    address?: string;
    category: string;
}

const OVERPASS_INSTANCES = [
    "https://z.overpass-api.de/api/interpreter",
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter"
];

export async function getNearbyBusinesses(lat: number, lng: number, radius: number = 1500): Promise<OSMBusiness[]> {
    const query = `
        [out:json][timeout:20];
        (
          node["amenity"~"restaurant|cafe|fast_food|bar|ice_cream|pub"](around:${radius},${lat},${lng});
          node["shop"~"supermarket|bakery|clothes|convenience|hairdresser|beauty|pet|florist|electronics|furniture|hardware"](around:${radius},${lat},${lng});
        );
        out body;
        >;
        out skel qt;
    `;

    for (const instance of OVERPASS_INSTANCES) {
        let timeoutId: any;
        try {
            const controller = new AbortController();
            timeoutId = setTimeout(() => controller.abort(), 15000); // 15s local timeout

            const response = await fetch(`${instance}?data=${encodeURIComponent(query)}`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                // If 429 or 504, it's a server load issue, just try next mirror
                continue;
            }

            const data = await response.json();
            if (!data.elements) continue;

            return data.elements
                .filter((el: any) => el.tags && el.tags.name)
                .map((el: any) => {
                    const amenity = el.tags.amenity;
                    const shop = el.tags.shop;

                    let category = "comercio";
                    if (amenity && ["restaurant", "cafe", "fast_food", "bar", "ice_cream", "pub"].includes(amenity)) {
                        category = "gastronomia";
                    } else if (shop && ["clothes", "supermarket", "convenience", "electronics", "furniture"].includes(shop)) {
                        category = "retail";
                    } else if (shop && ["hairdresser", "beauty", "pet", "florist"].includes(shop) || (amenity && ["bank", "pharmacy"].includes(amenity))) {
                        category = "servicios";
                    } else if (shop && ["hardware"].includes(shop)) {
                        category = "construccion";
                    }

                    return {
                        id: el.id,
                        name: el.tags.name,
                        type: el.tags.amenity || el.tags.shop || "Negocio",
                        lat: el.lat,
                        lon: el.lon,
                        address: el.tags["addr:street"] ? `${el.tags["addr:street"]} ${el.tags["addr:housenumber"] || ""}` : undefined,
                        category: category
                    };
                })
                .slice(0, 16);

        } catch (error: any) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                console.warn(`OSM Instance ${instance} timed out, trying mirror...`);
            } else {
                console.error(`Error with OSM instance ${instance}:`, error.message || error);
            }
        }
    }
    return [];
}

export async function searchLocation(query: string): Promise<{ lat: number; lng: number; display_name: string } | null> {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
            headers: {
                'User-Agent': 'Clickcito-Gastronomia-App/1.0'
            }
        });
        if (!response.ok) return null;
        const data = await response.json();
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                display_name: data[0].display_name
            };
        }
        return null;
    } catch (err) {
        console.error("Geocoding error:", err);
        return null;
    }
}

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
            headers: {
                'User-Agent': 'Clickcito-Gastronomia-App/1.0'
            }
        });
        if (!response.ok) return null;
        const data = await response.json();
        if (data && data.address) {
            const addr = data.address;
            return addr.city || addr.town || addr.village || addr.suburb || data.display_name.split(',')[0];
        }
        return null;
    } catch (err) {
        console.error("Reverse geocoding error:", err);
        return null;
    }
}
