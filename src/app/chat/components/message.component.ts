import { NgClass } from "@angular/common";
import { Component, input } from "@angular/core";
import { ChatMessage } from "../../websocket.service";

@Component({
    selector: 'app-message',
    template: `
        <div class="flex items-center gap-4" [class.flex-row-reverse]="myMessage()">
            <div class="rounded-full font-semibold text-xl w-10 h-10 flex justify-center items-center"[ngClass]="myMessage() ? 'bg-pink-200': 'bg-gray-200'"> {{message().user.charAt(0).toUpperCase()}} </div>
            <div class="min-h-10 rounded-md px-4 py-2"[ngClass]="myMessage() ? 'bg-pink-200': 'bg-gray-200'"> 
                <p>{{message().content }} </p>
            </div>
        </div>
        `,
    imports: [NgClass]
})

export class MessageComponent {
    myMessage = input<boolean>(false);

    message = input.required<ChatMessage>(); // Mensaje del chat
}