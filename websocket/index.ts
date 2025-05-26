import type { ServerWebSocket } from "bun";

interface ChatMessage {
    type: 'message' | 'join' | 'leave';
    user: string;
    content: string;
    timestamp: number; //Fecha del mensaje
}

const clients = new Map<ServerWebSocket<unknown>,{username: string}>(); // Almacena los clientes conectados y su nombre de usuario

const sendMessageToClients = (message: ChatMessage) =>{
    clients.forEach((_, client) => {
        client.send(JSON.stringify(message)); // Envia el mensaje a todos los clientes conectados
    });
}

Bun.serve({
    //Fetch recibe cualquier petición HTTP que se envie y envia el request al servidor 
    fetch(req, server) {
      // upgrade the request to a WebSocket
        if (server.upgrade(req)) {
        return; // do not return a Response
        }
        return new Response("Upgrade failed", { status: 500 });
    },
    websocket: {
        open(){
            console.log('Websoacket server started');
        },
        message(ws, message){
            const data = JSON.parse(message as string) as ChatMessage;
            if(data.type === 'join'){
                clients.set(ws,{username: data.user});

                //Mandar mensaje de bienvenida al nuevo usuario
                sendMessageToClients({
                    type: 'join',
                    user: data.user,
                    content: `Bienvenido ${data.user} se ha unido al chat`,
                    timestamp: Date.now()
                });
                return;
            }

            if(data.type === 'message'){
                const client = clients.get(ws);
                if(!client) return; // Si el cliente no existe, no se hace nada
                //Enviar mensaje a todos los clientes conectados
                sendMessageToClients({
                    type: 'message',
                    user: client.username,
                    content: data.content,
                    timestamp: Date.now(),
                });
            }
        },
        close(ws){
            const client = clients.get(ws);
            if(!client) return; // Si el cliente no existe, no se hace nada

            sendMessageToClients({
                type: 'leave',
                user: client.username,
                content: `Adios ${client.username} se ha desconectado`,
                timestamp: Date.now(),
            })

            clients.delete(ws); // Eliminar el cliente de la lista de clientes conectados
        }
    }, // handlers
});