import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MarcaProvider } from './context/marcas/marcaContext.jsx'
import App from './App.jsx';
import './index.css';
import { CategoriasProvider } from './context/categorias/categoriasContext.jsx';
import { PanelFiltradoProvider } from './context/panelFiltrado/panelFiltradoContext.jsx';
import { ListenNotificationProvider } from './context/websockets/listenNotificationsContext.jsx';
import { PedidoProvider } from './context/panelAdmin/pedidoContext.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ListenNotificationProvider>
            <MarcaProvider>
                <CategoriasProvider>
                    <PanelFiltradoProvider>
                        <PedidoProvider>
                            <App />
                        </PedidoProvider>
                    </PanelFiltradoProvider>
                </CategoriasProvider>
            </MarcaProvider>
        </ListenNotificationProvider>
    </StrictMode>
);
