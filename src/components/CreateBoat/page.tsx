"use client";
import { useState } from "react";

const CreateBoatForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "",
    precio_dia: "",
    capacidad: "",
    thumbnail: "",
    descripcion: "",
    longitud: "",
    localizacion: "",
    disponible: "1",
    reserva_id: "",
    categoria_id: "",
    fotos: [""],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      if (name.startsWith("foto_")) {
        const index = parseInt(name.split("_")[1]);
        const updatedFotos = [...prevFormData.fotos];
        updatedFotos[index] = value;
        return { ...prevFormData, fotos: updatedFotos };
      }
      return { ...prevFormData, [name]: value };
    });
  };

  const addPhotoField = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      fotos: [...prevFormData.fotos, ""],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del barco:", formData);
    // Lógica de envío a API
    setFormData({
      nombre: "",
      tipo: "",
      precio_dia: "",
      capacidad: "",
      thumbnail: "",
      descripcion: "",
      longitud: "",
      localizacion: "",
      disponible: "1",
      reserva_id: "",
      categoria_id: "",
      fotos: [""],
    });
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 py-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <h2 className="mb-4 text-base font-semibold text-black dark:text-white">
        Crear Barco
      </h2>
      <div
        className="max-h-96 overflow-y-auto"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#ccc transparent" }}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            { label: "Nombre", name: "nombre", type: "text" },
            { label: "Tipo", name: "tipo", type: "text" },
            { label: "Precio Día (€)", name: "precio_dia", type: "number" },
            { label: "Capacidad", name: "capacidad", type: "number" },
            { label: "Thumbnail", name: "thumbnail", type: "text" },
            { label: "Descripción", name: "descripcion", type: "text" },
            { label: "Longitud (m)", name: "longitud", type: "number" },
            { label: "Localización", name: "localizacion", type: "text" },
            { label: "Reserva ID", name: "reserva_id", type: "text" },
            { label: "Categoría ID", name: "categoria_id", type: "text" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-medium text-black dark:text-white">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-primary focus:ring-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
                required={field.name !== "reserva_id"}
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-black dark:text-white">
              ¿Disponible?
            </label>
            <select
              name="disponible"
              value={formData.disponible}
              onChange={handleChange}
              className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-primary focus:ring-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
            >
              <option value="1">Sí</option>
              <option value="0">No</option>
            </select>
          </div>
          {formData.fotos.map((foto, index) => (
            <div key={index}>
              <label className="block text-xs font-medium text-black dark:text-white">
                Foto {index + 1} (URL)
              </label>
              <input
                type="text"
                name={`foto_${index}`}
                value={foto}
                onChange={handleChange}
                className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-primary focus:ring-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addPhotoField}
            className="hover:bg-secondary-dark mt-2 w-full rounded bg-secondary px-2 py-1 text-xs font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
          >
            Añadir Foto
          </button>
          <button
            type="submit"
            className="hover:bg-primary-dark w-full rounded bg-primary px-3 py-1 text-xs font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Crear Barco
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBoatForm;
