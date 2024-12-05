"use client";
import { useEffect, useState } from "react";
import Modal from "../Modal/page"; // Importar el componente Modal
import CreateBoatForm from "../CreateBoat/page"; // Importar el formulario de creación
import axios from 'axios';
import Image from 'next/image';

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

const BoatCards = () => {
  const [boats, setBoats] = useState<Barco[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal
  const [selectedBoat, setSelectedBoat] = useState<Barco | null>(null); // Barco seleccionado

  useEffect(() => {
    const fetchBoats = async () => {
      try {
        const response = await fetch(`${process.env.API_URL}/barcos`);
        const data = await response.json();
        setBoats(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching boats:", error);
        setLoading(false);
      }
    };

    fetchBoats();
  }, []);

  const toggleDisponible = async (id: number) => {
    const updatedBoats = boats.map((boat) =>
      boat.id === id
        ? { ...boat, disponible: !boat.disponible }
        : boat,
    );
  
    const updatedBoat = updatedBoats.find((boat) => boat.id === id);
  
    if (updatedBoat) {
      try {
        const response = await axios.put(`${process.env.API_URL}/barcos/${id}`, {
          disponible: updatedBoat.disponible
        });
        console.log(updatedBoat.disponible)
        console.log("Response:", response.data);
        setBoats(updatedBoats);
      } catch (error) {
        console.error("Error updating boat:", error);
      }
    }
  };

  const openEditModal = (boat: Barco) => {
    setSelectedBoat(boat);
    setIsModalOpen(true);
  };

  const handleEditSubmit = (updatedBoat: Barco) => {
    setBoats((prevBoats) =>
      prevBoats.map((boat) =>
        boat.id === updatedBoat.id ? updatedBoat : boat,
      ),
    );
    setIsModalOpen(false);
    setSelectedBoat(null);
  };

  const handleDeleteBoat = (id: number) => {
    setBoats((prevBoats) => prevBoats.filter((boat) => boat.id !== id));
  };

  const handleCreateSubmit = (newBoat: Barco) => {
    setBoats((prevBoats) => [...prevBoats, newBoat]);
    setIsModalOpen(false);
  };

  if (loading) {
    return <div>Cargando barcos...</div>;
  }

  return (
    <div className="">
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => {
            setSelectedBoat(null);
            setIsModalOpen(true);
          }}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Crear Nuevo Barco
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {boats.map((boat) => (
          <div
            key={boat.id}
            className="rounded-lg hover:scale-110 transition-all border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark"
          >
            <div className="relative">
              <Image
                src={boat.thumbnail}
                alt={boat.nombre}
                width={500} // Ajusta el ancho según sea necesario
                height={300} // Ajusta la altura según sea necesario
                className="h-40 w-full rounded-t-lg object-cover"
              />
              <button
                onClick={() => toggleDisponible(boat.id)}
                className={`absolute right-2 top-2 rounded-full px-3 py-1 text-sm font-medium text-white ${boat.disponible ? "bg-green-500" : "bg-red-500"
                  }`}
              >
                {boat.disponible ? "Disponible" : "No disponible"}
              </button>
            </div>
            <div className="p-4">
              <h3
                className="cursor-pointer text-lg font-semibold text-black dark:text-white"
                onClick={() => openEditModal(boat)}
              >
                {boat.nombre}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <strong>Precio/día:</strong> €{boat.precio_dia}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <strong>Capacidad:</strong> {boat.capacidad} personas
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <strong>Longitud:</strong> {boat.longitud} m
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <strong>Localización:</strong> {boat.localizacion}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para crear o editar barco */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="mb-4 text-xl font-bold">
          {selectedBoat ? "Editar Barco" : "Crear Nuevo Barco"}
        </h2>
        {selectedBoat ? (
          <EditBoatForm boat={selectedBoat} onSubmit={handleEditSubmit} onDelete={handleDeleteBoat} setIsModalOpen={setIsModalOpen} />
        ) : (
          <CreateBoatForm onSubmit={handleCreateSubmit} setIsModalOpen={setIsModalOpen} />
        )}
      </Modal>
    </div>
  );
};

const EditBoatForm = ({
  boat,
  onSubmit,
  onDelete,
  setIsModalOpen,
}: {
  boat: Barco;
  onSubmit: (updatedBoat: Barco) => void;
  onDelete: (id: number) => void;
  setIsModalOpen: (isOpen: boolean) => void;
}) => {
  const [formData, setFormData] = useState({ ...boat });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const BorrarBarco = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("boat id:", boat.id);

    try {
      const response = await axios.delete(`${process.env.API_URL}/barcos/${boat.id}`);
      console.log("Response:", response.data);
      onDelete(boat.id);
      setIsModalOpen(false); // Cerrar el modal
    } catch (error) {
      console.error("Error deleting boat:", error);
    }
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
      const response = await axios.put(`${process.env.API_URL}/barcos/${boat.id}`, formData);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error updating boat:", error);
    }

    onSubmit(formData as Barco);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 py-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <h2 className="mb-4 text-base font-semibold text-black dark:text-white">
        Editar Barco
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
            { label: "Descripcion", name: "descripcion", type: "text" },
            { label: "Longitud", name: "longitud", type: "number" },
            { label: "Localización", name: "localizacion", type: "text" },
            { label: "Thumbnail", name: "thumbnail", type: "text" },
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
            Guardar Cambios
          </button>
          <button
            type="button"
            onClick={BorrarBarco}
            className="hover:bg-red-700 w-full rounded bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Borrar barco
          </button>
        </form>
      </div>
    </div>
  );
};

export default BoatCards;