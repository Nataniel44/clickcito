import React from "react";
import "./local.css";

// Reusable Input Field Component
const InputField = ({ id, label, type = "text", required, ...rest }) => (
    <div>
        <label htmlFor={id} className="block text-left">
            {label}
        </label>
        <input
            id={id}
            name={id}
            type={type}
            required={required}
            className="w-full text-black p-2 border border-gray-300 rounded"
            {...rest}
        />
    </div>
);

// Reusable Select Field Component
const SelectField = ({ id, label, options, required }) => (
    <div>
        <label htmlFor={id} className="block text-left">
            {label}
        </label>
        <select
            id={id}
            name={id}
            required={required}
            className="w-full text-black p-2 border border-gray-300 rounded"
        >
            {options.map((option, idx) => (
                <option key={idx} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

// Reusable Radio Button Group Component
const RadioField = ({ id, label, options, required }) => (
    <div>
        <label htmlFor={id} className="block text-left">
            {label}
        </label>
        <div className="flex justify-start space-x-4">
            {options.map((option, idx) => (
                <label key={idx}>
                    <input
                        type="radio"
                        id={`${id}-${option.value}`}
                        name={id}
                        value={option.value}
                        required={required}
                        className="mr-2"
                    />
                    {option.label}
                </label>
            ))}
        </div>
    </div>
);

// Reusable Checkbox Group Component
const CheckboxField = ({ id, label, options }) => (
    <div>
        <label htmlFor={id} className="block text-left">
            {label}
        </label>
        <div className="flex flex-col items-start gap-3">
            {options.map((option, idx) => (
                <label className="flex items-center justify-start text-start gap-3" key={idx}>
                    <input
                        type="checkbox"
                        name={id}
                        value={option.value}
                        className=" "
                    />
                    {option.label}
                </label>
            ))}
        </div>
    </div>
);

function Question() {
    return (
        <main className="dark:text-white grid grid-cols-1 max-w-screen-md mx-auto justify-center items-center text-center p-5">
            <h1 className="text-4xl uppercase font-bold mt-5">
                Gastro<span className="text-yellow-400">link</span>
            </h1>
            <h2 className="text-xl uppercase mt-2 mb-5">Encuesta para Restaurantes de Oberá</h2>

            <p className="mb-6">
                Ayúdanos a entender mejor las necesidades tecnológicas de los restaurantes de nuestra ciudad. Esta
                encuesta tomará solo unos minutos y nos ayudará a mejorar nuestros servicios para ti.
            </p>

            <form action="/submit-survey" method="POST" className="space-y-6">
                {/* Pregunta 1 */}
                <InputField id="restaurant-name" label="¿Cuál es el nombre de tu negocio?" required />

                {/* Pregunta 2 */}
                <SelectField
                    id="food-type"
                    label="¿Qué tipo de comida ofrece tu restaurante?"
                    required
                    options={[
                        { value: "Comida rápida", label: "Comida rápida" },
                        { value: "Comida tradicional", label: "Comida tradicional" },
                        { value: "Pizzería", label: "Pizzería" },
                        { value: "Restaurante gourmet", label: "Restaurante gourmet" },
                        { value: "Otro", label: "Otro" },
                    ]}
                />

                {/* Pregunta 3 */}
                <SelectField
                    id="employees"
                    label="¿Cuántos empleados trabajan en tu restaurante?"
                    required
                    options={[
                        { value: "1-5", label: "1-5" },
                        { value: "6-10", label: "6-10" },
                        { value: "11-20", label: "11-20" },
                        { value: "Más de 20", label: "Más de 20" },
                    ]}
                />

                {/* Pregunta 4 */}
                <RadioField
                    id="has-website"
                    label="¿Tienes un sitio web para tu restaurante?"
                    required
                    options={[
                        { value: "Sí", label: "Sí" },
                        { value: "No", label: "No" },
                        { value: "Estamos considerando hacerlo", label: "Estamos considerando hacerlo" },
                    ]}
                />

                {/* Pregunta 5 */}
                <RadioField
                    id="offers-online-orders"
                    label="¿Tu restaurante ofrece pedidos online a través de una página web?"
                    required
                    options={[
                        { value: "Sí", label: "Sí" },
                        { value: "No", label: "No" },
                        { value: "Usamos aplicaciones de terceros", label: "Usamos aplicaciones de terceros" },
                    ]}
                />

                {/* Pregunta 6 */}
                <CheckboxField
                    id="social-media"
                    label="¿Utilizas alguna red social para promocionar tu restaurante?"
                    options={[
                        { value: "Facebook", label: "Facebook" },
                        { value: "Instagram", label: "Instagram" },
                        { value: "TikTok", label: "TikTok" },
                        { value: "No uso redes sociales", label: "No uso redes sociales" },
                    ]}
                />

                {/* Pregunta 7 */}
                <CheckboxField
                    id="order-methods"
                    label="¿Qué medios utilizas actualmente para tomar pedidos?"
                    options={[
                        { value: "Teléfono", label: "Teléfono" },
                        { value: "WhatsApp", label: "WhatsApp" },
                        { value: "Aplicaciones de delivery", label: "Aplicaciones de delivery (PedidosYa, Rappi, etc.)" },
                        { value: "Página web", label: "Página web propia" },
                        { value: "En persona", label: "En persona (al cliente en el local)" },
                    ]}
                />

                {/* Pregunta 8 */}
                <RadioField
                    id="want-website"
                    label="¿Te gustaría que tu restaurante tuviera una página web personalizada para tomar pedidos online?"
                    required
                    options={[
                        { value: "Sí", label: "Sí" },
                        { value: "No", label: "No" },
                        { value: "Tal vez", label: "Tal vez, depende de la implementación" },
                    ]}
                />

                {/* Pregunta 9 */}
                <CheckboxField
                    id="website-features"
                    label="¿Qué funciones te gustaría que tuviera una página web para tu restaurante?"
                    options={[
                        { value: "Catálogo de productos", label: "Catálogo de productos" },
                        { value: "Sistema de pedidos en línea", label: "Sistema de pedidos en línea" },
                        { value: "Opción de pago en línea", label: "Opción de pago en línea" },
                        { value: "Información sobre horarios y ubicación", label: "Información sobre horarios y ubicación" },
                        { value: "Promociones o menús especiales", label: "Promociones o menús especiales" },
                    ]}
                />

                {/* Pregunta 10 */}
                <SelectField
                    id="website-familiarity"
                    label="¿Qué tan familiarizado estás con el concepto de tener una página web para tu negocio?"
                    required
                    options={[
                        { value: "Muy familiarizado", label: "Muy familiarizado" },
                        { value: "Algo familiarizado", label: "Algo familiarizado" },
                        { value: "Poco familiarizado", label: "Poco familiarizado" },
                        { value: "No estoy familiarizado", label: "No estoy familiarizado" },
                    ]}
                />

                {/* Pregunta 11 */}
                <CheckboxField
                    id="website-obstacles"
                    label="¿Qué obstáculos ves para implementar una página web para tu restaurante?"
                    options={[
                        { value: "Falta de presupuesto", label: "Falta de presupuesto" },
                        { value: "Falta de tiempo", label: "Falta de tiempo" },
                        { value: "Falta de conocimiento", label: "Falta de conocimiento sobre cómo funciona" },
                        { value: "No veo necesidad", label: "No veo necesidad" },
                    ]}
                />

                {/* Pregunta 12 */}
                <RadioField
                    id="pay-for-website"
                    label="¿Estarías dispuesto a pagar por una página web sencilla para tu restaurante?"
                    required
                    options={[
                        { value: "Sí", label: "Sí, dependiendo del precio" },
                        { value: "Tal vez", label: "Tal vez, dependiendo de las características" },
                        { value: "No", label: "No" },
                    ]}
                />

                <div>
                    <button
                        type="submit"
                        className="mt-5 p-3 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    >
                        Enviar Encuesta
                    </button>
                </div>
            </form>
        </main>
    );
}

export default Question;
