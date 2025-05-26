import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface ChatMessage {
    type: 'message' | 'join' | 'leave';
    user: string;
    content: string;
    timestamp: number; //Fecha del mensaje
}

@Injectable({
    providedIn: 'root'
})

export class WebsocketService {

    //Crea servicio para conectar y recibir y enviar mensajes
    private socket: WebSocket | null = null;

    username = signal<string>(''); // Nombre de usuario
    messages = signal<ChatMessage[]>([]); // Mensajes del chat

    private router = inject(Router); // Inyectar el servicio Router para navegar entre rutas

    constructor(){
        //Cargamos la sesion
        this.loadSession();
    }

    private loadSession(){
        const savedUsername = localStorage.getItem('username'); // Obtener el nombre de usuario guardado en el almacenamiento local
        if(savedUsername){
            this.connect(savedUsername); // Conectar al servidor WebSocket

            //obtener los mensajes guardados en el almacenamiento local
            this.loadChatMessages();
        }else{
            this.router.navigate(['/']); // Si no existe, navegar a la ruta de inicio
        }
    }

    loadChatMessages(){
        const savedMessages = localStorage.getItem('messages'); // Obtener los mensajes guardados en el almacenamiento local
        if(savedMessages){
            const parsedMessages = JSON.parse(savedMessages) as ChatMessage[]; // Parsear los mensajes guardados
            this.messages.set(parsedMessages); // Establecer los mensajes en el servicio
        }
    }

    connect(username: string){
        localStorage.setItem('username', username); // Guardar el nombre de usuario en el almacenamiento local
        this.username.set(username);
        this.socket = new WebSocket('ws://localhost:3000'); // Conectar al servidor WebSocket

        this.socket.onopen = () => {
            //manda mensaje de Bienvenida
            this.joinChat();
        };

        this.socket.onmessage = (event) =>{
            const message = JSON.parse(event.data) as ChatMessage; // Parsear el mensaje recibido

            this.messages.update((oldMessages) => {
                const messages = [...oldMessages, message]; // Agregar el mensaje a la lista de mensajes

                localStorage.setItem('messages', JSON.stringify(messages)); // Guardar los mensajes en el almacenamiento local
                return messages; // Agregar el mensaje a la lista de mensajes
            }); // Agregar el mensaje a la lista de mensajes
        };

        this.socket.onclose = () => {
            this.socket = null; // Cerrar la conexión
            console.log('Conexión cerrada'); // Mensaje de cierre de conexión
        };

    }

    sendChatMessage(content: string){
        const message: ChatMessage = {
            type: 'message',
            user: this.username(),
            content,
            timestamp: Date.now(), // Fecha del mensaje
        };
        this.sendMessage(message); // Enviar mensaje al servidor, permite la comunicación con el scoket
    }

    private joinChat(){
        const joinMessage: ChatMessage = {
            type: 'join',
            user: this.username(),
            timestamp: Date.now(),
            content: `Bienvenido ${this.username()} se ha unido al chat`,
        };
        this.sendMessage(joinMessage); // Enviar mensaje de bienvenida al servidor
    }

    private sendMessage(message: ChatMessage){
        if(this.socket && this.socket.readyState === WebSocket.OPEN){
            this.socket.send(JSON.stringify(message)); // Enviar mensaje al servidor
        }
    }

    logOut(){
        if(this.socket){
            this.socket.close(); // Cerrar la conexión
            this.username.set(''); // Limpiar el nombre de usuario
            this.router.navigate(['/']); // Navegar a la ruta de inicio
            this.messages.set([]); // Limpiar los mensajes
            localStorage.removeItem('messages'); // Limpiar los mensajes del almacenamiento local
            localStorage.removeItem('username'); // Limpiar el nombre de usuario del almacenamiento local
        }
    }
}