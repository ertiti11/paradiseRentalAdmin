import { useState } from "react";
import axios from 'axios';

interface Barco {
  id: number;
  nombre: string;
  tipo: string;
  precio_dia: number;
  capacidad: number;
  longitud: number;
  localizacion: string;
  disponible: boolean;
  thumbnail: string;
  descripcion: string;
  reserva_id: number | null;
  categoria_id: number;
}

const CreateBoatForm = ({ onSubmit, setIsModalOpen }: { onSubmit: (newBoat: Barco) => void; setIsModalOpen: (isOpen: boolean) => void; }) => {
  const [formData, setFormData] = useState<Partial<Barco>>({
    nombre: "",
    tipo: "",
    precio_dia: 0,
    capacidad: 0,
    longitud: 0,
    localizacion: "",
    disponible: true,
    thumbnail: "",
    descripcion: "",
    reserva_id: null,
    categoria_id: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);

    // Validar que longitud sea un entero
    if (!Number.isInteger(Number(formData.longitud))) {
      alert("La longitud debe ser un número entero.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.API_URL}/barcos`, formData);
      console.log("Response:", response.data);
      onSubmit(response.data);
      setIsModalOpen(false); // Cerrar el modal
    } catch (error) {
      console.error("Error creating boat:", error);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 py-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <h2 className="mb-4 text-base font-semibold text-black dark:text-white">
        Crear Nuevo Barco
      </h2>
      <div
        className="max-h-96 overflow-y-auto"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#ccc transparent" }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Nombre", name: "nombre", type: "text" },
            { label: "Tipo", name: "tipo", type: "text" },
            { label: "Precio/día", name: "precio_dia", type: "number" },
            { label: "Capacidad", name: "capacidad", type: "number" },
            { label: "Longitud", name: "longitud", type: "number" },
            { label: "Localización", name: "localizacion", type: "text" },
            { label: "Thumbnail", name: "thumbnail", type: "text" },
            { label: "Descripción", name: "descripcion", type: "text" },
            { label: "Categoría ID", name: "categoria_id", type: "number" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-black dark:text-black">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name as keyof Barco] as string | number}
                onChange={handleChange}
                className="mt-1 block w-full rounded border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-primary focus:ring-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
                required
              />
            </div>
          ))}
          <button
            type="submit"
            className="hover:bg-primary-dark w-full rounded bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Crear Barco
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBoatForm;