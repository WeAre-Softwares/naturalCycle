import { darDeAltaUsuarioService } from '../services/users-services/dar-de-alta-usuario'
import { registerService } from '../services/registerService';
import * as yup from 'yup'
import { useForm } from 'react-hook-form';
import { CreateUsuarioSchema } from '../schemas';
import { yupResolver } from '@hookform/resolvers/yup';
import '../Styles/Panel/RegisterClientForAdmin.css';
import useAuthStore from '../store/use-auth-store';
import { useState } from 'react';
export const ResgisterUserForAdmin=({onRegistedUser,onSalirForm})=>{
 const [isLoading, setIsLoading]=useState(false);
 const {token}=useAuthStore();    
 const {
    register,
    handleSubmit,
    formState: { errors },
    } = useForm({
    resolver: yupResolver(CreateUsuarioSchema),
    });
 const handleFormSubmit= async (data) =>{
   setIsLoading(true); 
   try{
        const response= await registerService(
        data.nombre,
        data.apellido,
        data.dni,
        data.nombre_comercio,
        data.telefono,
        data.dom_fiscal,
        data.email,
        data.password,
        )
        if (response.usuario_id) {
         const responseAlta = await darDeAltaUsuarioService(response.usuario_id, token)
         onRegistedUser(responseAlta);
         setIsLoading(false);
         onSalirForm();
        }
        

    }catch{

    }
}
 const handleFormCancel =()=>{
    onSalirForm();
 } 

return(
 <form className="form-updateRemito" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
    <h3>Alta de cliente<br />y Datos del Remito</h3>
    <label>
    Nombre del comercio
    <input {...register('nombre_comercio')} />
    <span>{errors.nombre_comercio?.message}</span>
    </label>

    <label>
    Nombre del representante
    <input {...register('nombre')} />
    <span>{errors.nombre?.message}</span>
    </label>

    <label>
    Apellido del representante
    <input {...register('apellido')} />
    <span>{errors.apellido?.message}</span>
    </label>

    <label>
    CUIT/CUIL
    <input {...register('dni')} />
    <span>{errors.dni?.message}</span>
    </label>

    <label>
    Número de teléfono
    <input {...register('telefono')} />
    <span>{errors.telefono?.message}</span>
    </label>

    <label>
    Domicilio fiscal
    <input {...register('dom_fiscal')} />
    <span>{errors.dom_fiscal?.message}</span>
    </label>

    <label>
    Correo electrónico
    <input {...register('email')} />
    <span>{errors.email?.message}</span>
    </label>

    <label>
    Contraseña
    <input {...register('password')} type="password" />
    <span>{errors.password?.message}</span>
    </label>
    <button className="btn-createUser" type="submit" disabled={isLoading}>
    {isLoading ? (
      <div className="loader">
      <div className="justify-content-center jimu-primary-loading"></div>
   </div>
      ) : (
      'Crear Remito'
      )}</button>
    <button className="btn-cancelUser" type="button" disabled={isLoading} onClick={handleFormCancel}>Cancelar</button>
 </form>
);
}