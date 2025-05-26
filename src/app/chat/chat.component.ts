import { Component, inject } from '@angular/core';
import { MessageComponent } from './components/message.component';
import { WebsocketService } from '../websocket.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-chat',
    template: `
    <div class="h-screen flex flex-col overflow-hidden">
        <header class="bg-pink-300 p-4 flex items-center justify-end">
            <button class="bg-blue-300 rounded-md text-white px-4 py-2" (click)="logOut()"> Logout </button>
        </header>
        <div class="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
            <!--<app-message/>
            <app-message [myMessage]="true"/>-->

            @for(message of messages(); track message) {
                <app-message [message]="message" [myMessage]="username() === message.user"/>
            }
        </div>
        <div class="flex gap-x-4 mt-4 p-4">
            <input type="text" class="w-full rounded-md border outline-none border-purple-300 p-2" [formControl] ="messageControl" />
            <button class="cursor-pointer bg-blue-400 rounded-md text-white px-4 py-2 active:bg-purple-500/80" (click)="sendMessage()" >Enviar </button>
        </div>
    </div>`,
    imports: [MessageComponent, ReactiveFormsModule]
})
export default class ChatComponent{

    private websocketService = inject(WebsocketService); // Inyectar el servicio WebSocket

    messages = this.websocketService.messages; // Obtener los mensajes del servicio WebSocket

    messageControl = new FormControl(''); // Control del formulario para el mensaje

    username = this.websocketService.username; // Obtener el nombre de usuario del servicio WebSocket

    sendMessage(){
        const value = this.messageControl.value;
        if(!value) return; // Si el mensaje esta vacio no se puede enviar
         this.websocketService.sendChatMessage(value); // Enviar el mensaje al servicio WebSocket
         this.messageControl.setValue(''); // Limpiar el campo de entrada
    }

    logOut(){
        this.websocketService.logOut(); // Cerrar sesión en el servicio WebSocket
    }
}