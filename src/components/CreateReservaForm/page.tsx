const CreateReservaForm = () => {
    const [formData, setFormData] = useState({
      nombre_cliente: '',
      apellidos_cliente: '',
      email_cliente: '',
      fecha_inicio: '',
      fecha_fin: '',
    });
    const [error, setError] = useState<string | null>(null); // Para capturar errores
    const [loading, setLoading] = useState(false);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);  // Limpiar errores previos
      setLoading(true); // Iniciar cargando
  
      try {
        // Enviar la solicitud POST a la API
        const response = await axios.post(`${process.env.API_URL}/reservas`, formData, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
  
        if (response.status === 201) {
          console.log('Reserva creada exitosamente:', response.data);
          // Aquí podrías agregar lógica para redirigir o cerrar el modal
        } else {
          setError('Hubo un problema al crear la reserva');
        }
      } catch (error: any) {
        console.error("Error al crear la reserva:", error);
        setError('Error al crear la reserva. Intenta nuevamente.');
      } finally {
        setLoading(false); // Detener cargando
      }
    };
  
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 py-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <h2 className="mb-4 text-base font-semibold text-black dark:text-white">
          Crear Nueva Reserva
        </h2>
  
        {/* Mostrar el mensaje de error si hay */}
        {error && (
          <div className="mb-4 text-red-600">{error}</div>
        )}
  
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
          
          {/* Botón de envío */}
          <button
            type="submit"
            disabled={loading}
            className={`hover:bg-primary-dark w-full rounded bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? 'Creando...' : 'Crear Reserva'}
          </button>
        </form>
      </div>
    );
  };
  