"use client";
import { useEffect, useState } from "react";
import Modal from "../Modal/page.tsx"; // Importar el componente Modal
import axios from 'axios';
import '@/envConfig.ts'

interface Reserva {
  id: number;
  barco_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  precio_total: number;
  nombre_cliente: string;
  apellidos_cliente: string;
  email_cliente: string;
  estado: string;
  metodo_pago: string;
  fecha_pago: string;
  fecha_cancelacion: string | null;
  motivo_cancelacion: string | null;
  comentarios: string | null;
  codigo_reserva: string;
  dni_cliente: string;
  telefono_cliente: string;
  created_at: string;
  updated_at: string;
  barco: {
    id: number;
    nombre: string;
  };
}

const ReservaCards = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal
  const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null); // Reserva seleccionada

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await fetch(`${process.env.API_URL}/reservas`);
        const data = await response.json();
        setReservas(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reservas:", error);
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  const openEditModal = (reserva: Reserva) => {
    setSelectedReserva(reserva);
    setIsModalOpen(true);
  };

  const handleEditSubmit = (updatedReserva: Reserva) => {
    setReservas((prevReservas) =>
      prevReservas.map((reserva) =>
        reserva.id === updatedReserva.id ? updatedReserva : reserva,
      ),
    );
    setIsModalOpen(false);
    setSelectedReserva(null);
  };

  const handleDelete = async (id: number) => {
    try {
      // Eliminar la reserva de la base de datos a través de la API
      await axios.delete(`${process.env.API_URL}/reservas/${id}`);
      
      // Eliminar la reserva de la lista localmente (sin necesidad de recargar la lista completa)
      setReservas((prevReservas) => prevReservas.filter((reserva) => reserva.id !== id));
    } catch (error) {
      console.error("Error deleting reserva:", error);
    }
  };

  if (loading) {
    return <div>Cargando reservas...</div>;
  }

  return (
    <div>
      {/* Layout cambiado a filas con botones de editar y eliminar */}
      <div className="space-y-6">
        {reservas.map((reserva) => (
          <div
            key={reserva.id}
            className="flex items-center justify-between rounded-lg border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark p-4"
          >
            <div className="flex flex-1 justify-between pl-4">
              <div className="flex flex-col">
                {/* Mostrar el código de la reserva como título */}
                <h3
                  className="cursor-pointer text-lg font-semibold text-black dark:text-white"
                  onClick={() => openEditModal(reserva)}
                >
                  {reserva.codigo_reserva} {/* Título con el código de la reserva */}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <strong>Nombre Cliente:</strong> {reserva.nombre_cliente} {reserva.apellidos_cliente}
                </p>
                {/* Correo debajo del nombre del cliente */}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <strong>Correo Cliente:</strong> {reserva.email_cliente}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <strong>Fecha Inicio:</strong> {new Date(reserva.fecha_inicio).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <strong>Fecha Fin:</strong> {new Date(reserva.fecha_fin).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <strong>Estado:</strong> {reserva.estado}
                </p>
              </div>
            </div>

            {/* Columna de acciones con botones de editar y eliminar */}
            <div className="flex justify-end space-x-4">
              {/* Botón de Editar */}
              <button
                onClick={() => openEditModal(reserva)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Editar
              </button>

              {/* Botón de Eliminar */}
              <button
                onClick={() => handleDelete(reserva.id)} // Elimina la reserva al hacer clic
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para crear o editar reserva */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="mb-4 text-xl font-bold">
          {selectedReserva ? "Editar Reserva" : "Crear Nueva Reserva"}
        </h2>
        {selectedReserva ? (
          <EditReservaForm reserva={selectedReserva} onSubmit={handleEditSubmit} />
        ) : (
          <CreateReservaForm />
        )}
      </Modal>
    </div>
  );
};

const EditReservaForm = ({
  reserva,
  onSubmit,
}: {
  reserva: Reserva;
  onSubmit: (updatedReserva: Reserva) => void;
}) => {
  const [formData, setFormData] = useState({ ...reserva });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
  
    try {
      const response = await axios.put(`${process.env.API_URL}/reservas/${reserva.id}`, formData);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error updating reserva:", error);
    }
  
    onSubmit(formData as Reserva);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 py-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <h2 className="mb-4 text-base font-semibold text-black dark:text-white">
        Editar Reserva
      </h2>
      <div
        className="max-h-96 overflow-y-auto"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#ccc transparent" }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Nombre Cliente", name: "nombre_cliente", type: "text" },
            { label: "Apellidos Cliente", name: "apellidos_cliente", type: "text" },
            { label: "Correo Cliente", name: "email_cliente", type: "email" },
            { label: "Fecha Inicio", name: "fecha_inicio", type: "datetime-local" },
            { label: "Fecha Fin", name: "fecha_fin", type: "datetime-local" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-black dark:text-black">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
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
        </form>
      </div>
    </div>
  );
};

const CreateReservaForm = () => {
  const [formData, setFormData] = useState({
    nombre_cliente: "",
    apellidos_cliente: "",
    email_cliente: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.API_URL}/reservas`, formData);
      console.log("Reserva creada:", response.data);
    } catch (error) {
      console.error("Error creando reserva:", error);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 py-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <h2 className="mb-4 text-base font-semibold text-black dark:text-white">
        Crear Nueva Reserva
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Nombre Cliente", name: "nombre_cliente", type: "text" },
          { label: "Apellidos Cliente", name: "apellidos_cliente", type: "text" },
          { label: "Correo Cliente", name: "email_cliente", type: "email" },
          { label: "Fecha Inicio", name: "fecha_inicio", type: "datetime-local" },
          { label: "Fecha Fin", name: "fecha_fin", type: "datetime-local" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-black dark:text-black">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
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
          Crear Reserva
        </button>
      </form>
    </div>
  );
};

export default ReservaCards;
