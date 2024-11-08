import React from 'react';
import Swal from 'sweetalert2';
import useAuthStore from '../../store/use-auth-store';

export const UsuarioCard = ({
  usuario,
  mostrarDetallesUsuario,
  darDeAltaUsuario,
  darDeBajaUsuario,
  darRangoEmpleadoUsuario,
}) => {
  const { isAuthenticated, getRoles } = useAuthStore();

  const isUserLoggedIn = isAuthenticated();
  const userRoles = getRoles();
  const isAdmin = userRoles.includes('admin');

  const handleDarDeAlta = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres dar de alta a este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        darDeAltaUsuario(usuario.usuario_id);
        Swal.fire({
          title: 'Usuario dado de alta',
          text: 'El usuario ha sido activado exitosamente.',
          icon: 'success',
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelado',
          text: 'El usuario no ha sido dado de alta.',
          icon: 'error',
        });
      }
    });
  };

  const handleDarDeBaja = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres dar de baja a este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        darDeBajaUsuario(usuario.usuario_id);
        Swal.fire({
          title: 'Usuario dado de baja',
          text: 'El usuario ha sido desactivado exitosamente.',
          icon: 'success',
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelado',
          text: 'El usuario no ha sido dado de baja.',
          icon: 'error',
        });
      }
    });
  };

  const handleAsignarRolEmpleado = () => {
    Swal.fire({
      title: '¿Asignar rol de empleado?',
      text: 'Confirma si deseas asignar el rol de empleado a este usuario.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, asignar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true,
      customClass: {
        confirmButton: 'custom-confirm-button',
        cancelButton: 'custom-cancel-button',
        popup: 'custom-alert-container',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        darRangoEmpleadoUsuario(usuario.usuario_id);
        Swal.fire({
          title: 'Rol Asignado',
          text: 'El rol de empleado ha sido asignado con éxito.',
          icon: 'success',
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Operación cancelada',
          text: 'El rol no ha sido asignado.',
          icon: 'error',
        });
      }
    });
  };

  return (
    <div key={usuario.usuario_id} className="area-usuarios-item">
      <p
        className="area-usuarios-name"
        onClick={() => mostrarDetallesUsuario(usuario)} // Mostrar detalles al hacer clic
      >
        {usuario.nombre} {usuario.apellido}{' '}
        <i class="fa-solid fa-circle-info"></i>
      </p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'end',
          gap: '1rem',
        }}
      >
        {usuario.esta_activo === true ? (
          <button
            onClick={handleDarDeBaja}
            className="area-usuarios-approve-button"
          >
            Dar de Baja
          </button>
        ) : (
          <button
            onClick={handleDarDeAlta}
            className="area-usuarios-return-button"
          >
            Dar de Alta
          </button>
        )}
        {/* Condicional para mostrar boton asignar rol empleado */}
        {isUserLoggedIn && isAdmin && (
          <button
            onClick={handleAsignarRolEmpleado}
            className="area-usuarios-approve-button"
          >
            Asignar Rol Empleado
          </button>
        )}
      </div>
    </div>
  );
};
