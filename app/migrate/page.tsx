"use client";
import React, { useState } from "react";
import { createProducto } from "@/app/firebase/db";
import { menuComidas } from "../../public/data/menuComidas";
import { menuBebidas } from "../../public/data/menuBebidas";
import { menuTragos } from "../../public/data/menuTragos";
import { doc, getFirestore, setDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/app/firebase/config";

// We format categories to Title Case string.
function formatCategory(cat: string) {
    const spaced = cat.replace(/([A-Z])/g, ' $1').trim();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export default function MigratePage() {
    const [status, setStatus] = useState("Idle");

    const runMigration = async () => {
        setStatus("Running...");
        const allProducts: any[] = [];
        const categoriasUnicas: Set<string> = new Set();

        // Helper to push items
        const addProduct = (cat: string, item: any, fallbackPrice = 0, subcat = "") => {
            if (!item.name && !item.items) return;

            // Define dynamic category name mapping
            let finalCat = cat;
            if (cat === "Bebidas Sin Alcohol") finalCat = "Bebidas Sin Alcohol";
            else if (cat === "Bebidas Cerveza Artesanal") finalCat = "Cerveza Artesanal";
            else if (cat === "Bebidas Porrones") finalCat = "Porrones";
            else if (cat === "Bebidas Botellas") finalCat = "Cervezas L";
            else if (cat.startsWith("Bebidas Vinos")) finalCat = "Vinos";

            categoriasUnicas.add(finalCat);

            // Recursion for nested collections
            if (item.subcategoria && item.items) {
                item.items.forEach((subItem: any) => addProduct(finalCat, subItem, fallbackPrice, item.subcategoria));
                return;
            }
            if (item.tipo && item.items) {
                item.items.forEach((subItem: any) => addProduct(finalCat, subItem, fallbackPrice, item.tipo));
                return;
            }

            if (item.name) {
                // Find base price correctly: if options exists, use lowest or just 0
                const pBase = item.price || (item.options && item.options.length > 0 ? item.options[0].price : fallbackPrice) || 0;

                const dbItem = {
                    nombre_producto: item.name,
                    precio_base: Number(pBase),
                    categoria_producto: finalCat,
                    imagen_url: item.image || item.imagen || "",
                    activo: true,
                    detalles_especificos: {
                        ...(item.desc && { desc: item.desc }),
                        ...(subcat && { subcategoria: subcat }),
                        ...(item.options && { opciones: item.options }),
                        ...(item.extras && { extras: item.extras }),
                        ...(item.salsas && { salsas: item.salsas }),
                        ...(item.guarniciones && { guarniciones: item.guarniciones })
                    }
                };
                allProducts.push(dbItem);
            }
        };

        // PARSE menuComidas
        for (const [key, element] of Object.entries(menuComidas)) {
            const categoryName = formatCategory(key);
            if (Array.isArray(element)) {
                element.forEach(item => addProduct(categoryName, item));
            } else if (key === "empanadas") {
                const sabores = (element as any).sabores || [];
                sabores.forEach((sabor: string) => {
                    addProduct(categoryName, {
                        name: "Empanada de " + sabor,
                        price: (element as any).precios?.unidad || 2000,
                        desc: "Docena: $" + ((element as any).precios?.docena || 24000)
                    });
                });
            }
        }

        // PARSE menuBebidas
        for (const [key, element] of Object.entries(menuBebidas)) {
            if (Array.isArray(element)) {
                element.forEach(item => addProduct("Bebidas " + formatCategory(key), item));
            }
        }

        // PARSE menuTragos
        for (const [key, element] of Object.entries(menuTragos)) {
            if (Array.isArray(element)) {
                element.forEach(item => addProduct("Tragos " + formatCategory(key), item));
            }
        }

        // Now save to DB
        setStatus(`Found ${allProducts.length} items to insert. Processing...`);
        let count = 0;
        const TARGET_BUSINESS = "elysrestobar";

        for (const prod of allProducts) {
            try {
                await createProducto(TARGET_BUSINESS, prod);
                count++;
                setStatus(`Inserted ${count}/${allProducts.length}...`);
            } catch (err) {
                console.error("Failed to insert", prod, err);
            }
        }

        setStatus(`Finished! Inserted ${count} items. Also adding categories to the business configuration.`);

        // Append these exact categories to the negocio's array so dashboard shows them correctly
        try {
            const catsArray = Array.from(categoriasUnicas);
            const negRef = doc(db, "negocios", TARGET_BUSINESS);
            await setDoc(negRef, {
                categorias: catsArray,
                nombre: "Elys Restobar",
                rubro: "gastronomia",
                activo: true,
                logo_url: "/elys_logo.png" // placeholder
            }, { merge: true });
        } catch (err) {
            console.error("Notice: Could not sync categories array to the business document.", err);
        }

        setStatus(`Done! Migrated ${count} items to ${TARGET_BUSINESS}.`);
    };

    return (
        <div className="min-h-screen p-10 bg-white text-black flex items-center justify-center flex-col dark:bg-zinc-900 border dark:text-gray-100">
            <h1 className="text-3xl font-bold mb-4">Migración de Datos de Elys Restobar</h1>
            <p className="text-gray-500 mb-8 max-w-lg text-center">Este script leerá los archivos de menú en `public/data`, los formateará con el esquema de Clickcito y los asociará al negocio con ID `elysrestobar`.</p>
            <button onClick={runMigration} className="bg-orange-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-all">
                Iniciar Migración
            </button>
            <p className="mt-6 font-mono text-sm">{status}</p>
        </div>
    );
}
