/**
 * @file next-worldcup-countdown.component.ts
 * @author Sergio Romera Rupérez
 * @description Countdown timer component for the next World Cup.
 */

import {
  Component,
  OnDestroy,
  OnInit,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonCard, IonCardContent, IonButton } from '@ionic/angular/standalone';

interface CountdownUnit {
  readonly value: number;
  readonly label: string;
}

/** Target: FIFA World Cup 2030 (Starts June 8, 2030 at 00:00 hora española - CEST) */
const NEXT_WC_DATE = new Date('2030-06-08T00:00:00+02:00');

@Component({
  selector: 'app-next-worldcup-countdown',
  standalone: true,
  imports: [CommonModule, RouterModule, IonCard, IonCardContent, IonButton],
  templateUrl: './next-worldcup-countdown.component.html',
  styleUrls: ['./next-worldcup-countdown.component.scss']
})
export class NextWorldCupCountdownComponent implements OnInit, OnDestroy {

  private intervalId: ReturnType<typeof setInterval> | null = null;

  /** Reactive countdown state */
  private readonly _remaining = signal<number>(this.calculateRemaining());

  readonly units = computed<readonly CountdownUnit[]>(() => {
    const totalSecs = this._remaining();
    const days    = Math.floor(totalSecs / 86400);
    const hours   = Math.floor((totalSecs % 86400) / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    return [
      { value: days,    label: 'DÍAS'    },
      { value: hours,   label: 'HORAS'   },
      { value: minutes, label: 'MINUTOS' },
      { value: seconds, label: 'SEGUNDOS'},
    ] as const;
  });

  readonly isFinished = computed<boolean>(() => this._remaining() <= 0);

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this._remaining.set(this.calculateRemaining());
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private calculateRemaining(): number {
    const diff = Math.floor((NEXT_WC_DATE.getTime() - Date.now()) / 1000);
    return Math.max(0, diff);
  }

  /** Pad single-digit numbers with leading zero */
  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
