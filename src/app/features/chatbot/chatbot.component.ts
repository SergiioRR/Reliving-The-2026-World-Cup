/**
 * @file chatbot.component.ts
 * @author Sergio Romera Rupérez
 * @description AI chatbot component providing interactive World Cup insights.
 */

import { Component, signal, inject, WritableSignal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonFooter,
  IonInput, IonButton, IonIcon, IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { send, mic, attach, personCircleOutline, checkmarkDone, hardwareChip } from 'ionicons/icons';
import { ChatService, ChatMessage } from '../../core/services/chat.service';
import { AdBannerComponent } from '../../shared/components/ad-banner/ad-banner.component';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonFooter,
    IonInput, IonButton, IonIcon, IonButtons,
    AdBannerComponent
  ],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {
  private chatService = inject(ChatService);
  private router = inject(Router);
  private analytics = inject(AnalyticsService);

  ngOnInit() {
    this.analytics.trackChatOpened();
  }

  public closeChat(): void {
    this.router.navigate(['/']);
  }

  public messages: WritableSignal<ChatMessage[]> = signal([
    {
      id: crypto.randomUUID(),
      role: 'system',
      content: '¡Hola, aficionado! Soy Naranjito, tu asistente de Inteligencia Artificial. Llevo desde 1982 calentando en la banda para un torneo de estas grandiosas dimensiones. Pregúntame sobre alineaciones, estadísticas, goleadores o cualquier detalle y curiosidad del Mundial 2026. ¡¡Ponte la camiseta y que empiece a rodar el balón!!\n\n PD: Ten en cuenta que al funcionar bajo una capa gratuita de LLM, mi capacidad de procesamiento simultáneo es limitada. No podré responder consultas masivas que requieran analizar todos los partidos a la vez, pero soy todo un experto mostrando datos de partidos concretos y estadísticas muy generales del Mundial.',
      timestamp: new Date()
    }
  ]);

  public newMessage = signal<string>('');
  public isTyping = signal<boolean>(false);

  constructor() {
    addIcons({ send, mic, attach, personCircleOutline, checkmarkDone, hardwareChip });
  }

  public async sendMessage(): Promise<void> {
    const text = this.newMessage().trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    // Update state synchronously and clear input
    this.messages.update((msgs) => [...msgs, userMsg]);
    this.newMessage.set('');
    this.isTyping.set(true);

    // Sliding window logic: Retain only the last 5 messages for API limits
    const historyToKeep = 5;
    const slicedHistory = this.messages().slice(-historyToKeep);

    try {
      const response = await this.chatService.sendMessage(slicedHistory);

      this.messages.update((msgs) => [...msgs, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Failed to communicate with Naranjito AI:', error);
    } finally {
      this.isTyping.set(false);
    }
  }
}
