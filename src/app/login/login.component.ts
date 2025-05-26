import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { WebsocketService } from '../websocket.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    template: `<div class="flex flex-col justify-center min-h-screen items-center">
            <div> 
            <h1 class="text-2xl font-bold mb-3.5"> Login </h1>
            <p class="text-sm"> Ingresa tu nombre </p>
            <div class="mt-4">
                <label for=""></label>
                <input [formControl] = "username" type="text"
                class="border w-full border-purple-500 outline-none rounded-md px-2 py-1 text-inherit"
                />
            </div>
            <div class="mt-4"> <button class="bg-pink-500 w-full px-4 py-2 text-white rounded-md cursor-pointer active:bg-purple-500/80" (click)="goToChat()"> Ir al chat </button> </div>
            </div>
            </div>`,
    imports: [ReactiveFormsModule],
})
export default class LoginComponent{

    username = new FormControl(''); // Creamos un FormControl para el nombre de usuario

    private websocketService = inject(WebsocketService); // Inyectamos el servicio WebSocket

    private route = inject(Router); // Inyectamos el servicio Router para navegar entre rutas

    //Definimos el metodo goToChat que se ejecuta al hacer click en el botón "Ir al chat"
    goToChat(){
        const username = this.username.value; // Obtenemos el valor del nombre de usuario

        if(!username) return;// Si el nombre de usuario esta vacio no se puede continuar

        this.websocketService.connect(username); // Conectamos al servicio WebSocket con el nombre de usuario
        this.route.navigate(['/chat']); // Navegamos a la ruta del chat
    }
            
    
}