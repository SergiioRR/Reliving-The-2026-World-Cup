/**
 * @file knockout-timeline.component.ts
 * @author Sergio Romera Rupérez
 * @description Timeline component displaying the knockout stage matches and progression.
 */

import { Component, inject, OnInit, Signal, Input, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, DatePipe } from '@angular/common';
import { IonCard, IonCardContent, IonCardHeader, IonBadge, IonIcon } from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';
import { BehaviorSubject, switchMap, catchError, of } from 'rxjs';
import { FirestoreService, DenormalizedMatch } from '../../core/services/firestore.service';
import { ScrollAnimateDirective } from '../../core/directives/scroll-animate.directive';
import { KnockoutNavigationComponent } from './knockout-navigation/knockout-navigation.component';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-knockout-timeline',
  standalone: true,
  imports: [CommonModule, RouterModule, IonCard, IonCardContent, IonCardHeader, IonBadge, IonIcon, ScrollAnimateDirective, KnockoutNavigationComponent],
  templateUrl: './knockout-timeline.component.html',
  styleUrls: ['./knockout-timeline.component.scss']
})
export class KnockoutTimelineComponent implements OnInit {
  private firestoreService = inject(FirestoreService);
  private router = inject(Router);
  private analytics = inject(AnalyticsService);

  private phaseSubject = new BehaviorSubject<string>('dieciseisavos');

  @Input()
  set phase(val: string) {
    if (val) {
      this.phaseSubject.next(val.toLowerCase());
      this.analytics.trackMatchPhaseVisited(val.toLowerCase());
    }
  }
  get phase(): string {
    return this.phaseSubject.value;
  }

  get phaseTitle(): string {
    const val = this.phaseSubject.value;
    if (val === 'tercer-puesto') {
      return 'Tercer Puesto';
    }
    return val;
  }

  // Use Angular Signals to bind the matches stream to the template, updating on phase change
  matches: Signal<DenormalizedMatch[] | undefined> = toSignal(
    this.phaseSubject.pipe(
      switchMap(p =>
        this.firestoreService.getKnockoutMatches(p).pipe(
          catchError(err => {
            console.error('Error loading matches:', err);
            return of([]);
          })
        )
      )
    )
  );

  phaseSignal = toSignal(this.phaseSubject, { initialValue: 'dieciseisavos' });

  motrData = computed(() => {
    const p = this.phaseSignal();

    // Semifinales have match-specific summaries
    if (p === 'semifinales') {
      return null;
    }

    if (p === 'dieciseisavos') {
      return {
        image: 'assets/images/roundOf32.jpeg',
        title: 'LA MACHADA PARAGUAYA',
        badge: 'LA SORPRESA DE DIECISEISAVOS',
        badgePosition: 'right',
        summary: `El fútbol, en su esencia más pura, vive de lo impredecible. Paraguay no solo escribió una de las páginas más doradas de esta Copa del Mundo, sino que firmó un tratado de resistencia épica ante una Alemania que llegaba con la vitola de indiscutible favorita. Lejos de arrugarse bajo el peso de la historia, la Albirroja miró a los ojos al gigante europeo y golpeó primero. En el ocaso de la primera mitad (42'), Julio Enciso desató la locura con un latigazo que prendió la mecha de la rebelión albirroja.

Herida en su orgullo, Die Mannschaft despertó tras el paso por vestuarios. La maquinaria germana asedió la trinchera sudamericana hasta que Kai Havertz, en el 54', logró devolver las tablas al marcador. Lo que siguió a partir de ese instante fue un ejercicio de supervivencia extrema: Paraguay se atrincheró, achicando agua ante el vendaval alemán, y sobrevivió incluso a un gol anulado a Jonathan Tah a instancias del VAR que cortó la respiración del estadio en la ciudad de Boston.

Tras una prórroga agónica, la lotería de los once metros dictó sentencia. En la tensión límite de los penaltis, surgió la figura colosal de Orlando Gill, transformado en héroe nacional al detener dos lanzamientos críticos. A la tetracampeona del mundo le tembló el pulso, fallando tres penas máximas en total. Fue José Canale quien, con un temple de hielo, ejecutó el disparo definitivo. Alemania caía de forma prematura por tercera vez consecutiva desde su gloria en Brasil 2014, mientras Paraguay volaba hacia los octavos de final, demostrando que en esta Copa del Mundo 2026, la garra no entiende de lógicas ni de jerarquías.`
      };
    }

    if (p === 'tercer-puesto') {
      return {
        image: 'assets/images/bronce.jpeg',
        title: 'JUEGO, SET Y BRONCE INGLÉS',
        badge: 'LOCURA DE GOLES EN MIAMI',
        badgePosition: 'left',
        summary: `El partido por el tercer puesto suele ser un trámite, pero Inglaterra y Francia lo transformaron en el enfrentamiento más esquizofrénico de este Mundial. Una auténtica montaña rusa de diez goles donde los Three Lions transitaron del éxtasis absoluto al pánico total en tan solo 45'.\n\nInglaterra saltó al verde dispuesta a devorar el césped como un vendaval indomable. Declan Rice reventó la red desde fuera del área en el 3’ y Ezri Konsa amplió la herida en el 18’. Sin embargo, la auténtica pesadilla gala tenía nombre propio: Bukayo Saka. Con un doblete antológico antes del descanso, el extremo dejó a Francia contra las cuerdas, firmando un 0-4 que parecía una sentencia de muerte para los franceses.\n\nPero el fútbol castiga los excesos de confianza. Tras el paso por vestuarios, Francia despertó con la furia de un titán herido. Kylian Mbappé desenfundó por partida doble y Bradley Barcola sumó otro tanto, fabricando un 3-4 irreal en un abrir y cerrar de ojos. El metal, que antes brillaba seguro en el cuello inglés, comenzaba a oxidarse bajo la gran presión de una remontada histórica que hacía temblar a toda Inglaterra.\n\nCon el agua al cuello, Saka volvió a erigirse como salvador. Un penalti transformado con nervios de acero en el 87’ completó su hat-trick y devolvió el respiro con el 3-5. Ousmane Dembélé recortó distancias en un descuento agónico, pero Jude Bellingham, en el suspiro final del minuto 98, asestó el golpe de gracia para clausurar esta bendita locura.\n\n4-6. Inglaterra se cuelga el bronce. Un intercambio de golpes a tumba abierta que dejó a Francia a las puertas de la épica y coronó la supervivencia inglesa en una oda al fútbol no apta para personas cardíacas.`
      };
    }

    if (p === 'final') {
      return {
        image: 'assets/images/golFerran.jpeg',
        title: 'EL GOL DE TODO UN PAÍS',
        badge: 'REYES DEL MUNDO',
        badgePosition: 'left',
        summary: `Hay goles que ganan partidos. Y hay goles que pasan a formar parte de la memoria de todo un país. España y Argentina se citaron en Nueva Jersey con la gloria eterna en juego y 16 años de recuerdos pesando sobre los hombros. Porque desde aquella mágica noche de verano en Johannesburgo, toda una nación había contenido el aliento esperando volver a sentir exactamente lo mismo. Y la oportunidad había llegado.\n\nLa final fue una auténtica batalla de nervios. Argentina resistía con uñas y dientes mientras España dominaba, insistía y movía el balón a su antojo en busca del resquicio en la armadura albiceleste. El balón se negaba a entrar y los minutos caían como una losa de plomo. 90 minutos. Nada. Sí, el nuevo campeón del mundo se iba a decidir en la prórroga.\n\nEntonces, el reloj empezó a correr hacia una página que parecía escrita mucho tiempo atrás. Del minuto 116 al 106. De Andrés Iniesta a Ferran Torres. De Johannesburgo a Nueva Jersey. En Sudáfrica fue Iniesta. Ahora, 16 años después, el héroe vestía de nuevo de rojo. Pedro Porro colgó el balón al área, Nico Williams lo prolongó de cabeza y, en el lugar exacto donde el destino lo había citado, apareció Ferran Torres. Disparó fuerte. Sin pensárselo. Sin perdón. Minuto 106. Gol. Era el 1-0.\n\nEl estadio estalló en un clamor ensordecedor. Los jugadores se fundieron en un abrazo infinito mientras millones de españoles saltaban al unísono. Habían pasado 16 años, pero durante unos segundos el tiempo pareció detenerse, como si Johannesburgo estuviera otra vez allí, como si Iniesta acabara de marcar de nuevo. Pero no. Fue Ferran.\n\nEl pitido final confirmó lo que ya era imposible de contener: España volvía a ser campeona del mundo. Segunda estrella. Segunda Copa. Y un gol que ya no pertenece solo a Ferran Torres. Es el gol de todo un país.`
      };
    }

    if (p === 'octavos') {
      return {
        image: 'assets/images/roundOf16.jpeg',
        title: 'REMONTADA Y DELIRIO ARGENTINO',
        badge: 'EL PARTIDO DE LA LOCURA',
        badgePosition: 'right',
        summary: `Cuando el abismo miraba fijamente a los ojos de la vigente campeona del mundo, Argentina respondió con fuego. Los octavos de final amenazaban con convertirse en una tragedia histórica tras un arranque de pesadilla: Yasser Ibrahim adelantó a Egipto a los 15 minutos de partido y, para desespero de la Albiceleste, su estrella e ídolo, Leo Messi erró desde los once metros, firmando su segundo penalti fallado en lo que iba de Copa del Mundo, tras el fallo ante Austria en la Fase de Grupos.

La estocada parecía ser definitiva en la segunda mitad. Tras un gol anulado a Egipto envuelto en una tremenda polémica que paralizó los corazones argentinos, Mostafa Ziko no perdonó poco después y clavó el 2-0 en el 67'. Los Faraones acariciaban la mayor gesta del torneo ante una campeona del mundo que parecía estar grogui sobre la lona.

Pero el corazón del campeón no entiende de rendiciones. Al borde del KO, Argentina despertó con una furia incontenible. Cristian Romero encendió la chispa de la esperanza recortando distancias en el 79', y apenas cuatro minutos más tarde, Messi redimió sus demonios desde el punto fatídico para clavar el 2-2 y hacer estallar los cimientos de Atlanta. Con Egipto asediado y el reloj agonizando en el tiempo añadido, un testarazo imperial de Enzo Fernández selló el 3-2 definitivo. De la agonía al delirio en un suspiro; una remontada de época que demuestra que la Argentina de Scaloni siempre guarda una bala en la recámara y que nunca se le puede dar por muerta. El último partido de la leyenda Lionel Messi en los Mundiales todavía no se iba a ser escrito.`
      };
    } else if (p === 'cuartos') {
      return {
        image: 'assets/images/roundOf8.jpg',
        title: 'LA ZONA MERINO',
        badge: 'A SEMIS 16 AÑOS DESPUÉS',
        badgePosition: 'left',
        summary: `Hay futbolistas que simplemente juegan partidos, y luego hay otros que acuden puntuales a sus citas con el destino y la eternidad. Uno de ellos es Mikel Merino Zazón. En unos vibrantes Cuartos de Final, España demostró su absoluta autoridad sobre el césped del prestigioso e imponente estadio de Los Ángeles. La Roja desenfundó primero: Fabián Ruiz, con puro instinto de cazador, aprovechó un rechace de Thibaut Courtois para clavar el 1-0 en el 30'. Parecía el preludio de un monólogo español, pero los Diablos Rojos, en una de sus escasas aproximaciones, lograron que De Ketelaere devolviera las tablas en el marcador justo antes del descanso, obligando a La Roja a volver a marcar un gol.

El segundo acto fue un asedio incontestable. España acorraló a su rival proponiendo fútbol, mientras Bélgica resistía atrincherada como un muro de hormigón armado, esperando forzar una prórroga que sobrevolaba peligrosamente la tarde californiana. El cerrojo belga parecía resistir el vendaval de juego español, que dominaba totalmente el balón.

Hasta que el reloj marcó el minuto 88. Y entonces, emergió él. Un balón suelto en el área fue el imán perfecto para Mikel Merino. Como quien tiene la épica tatuada en el ADN, se adelantó a la muralla rival para empujar a la red el rechace de un tiro de Pau Cubarsí para hacer el 2-1 definitivo. Otra aparición estelar, otro zarpazo cuando el reloj asfixia. Primero fue para silenciar a toda Alemania en la Eurocopa 2024, después para eliminar a Portugal en los Octavos de este Mundial, y ahora era para acabar con Bélgica. El mediocentro pamplonica ha patentado un territorio inexpugnable donde los relojes se detienen y la victoria lleva su firma. ¡¡Bienvenidos, una vez más, a la temida "Zona Mikel Merino"!!`
      };
    }

    // Default (dieciseisavos)
    return {
      image: 'https://images.unsplash.com/photo-1518605368461-8b776263004e?q=80&w=2070&auto=format&fit=crop',
      title: 'España vs Austria',
      summary: 'Un dominio absoluto de la selección española (\'DOMINIO ESPAÑOL\') en una exhibición magistral frente a Austria. El tiki-taka moderno desbordó a la defensa austríaca, marcando el camino firme hacia el ansiado título de 2026.'
    };
  });

  ngOnInit() {
    // Initialization logic if necessary
    this.analytics.trackMatchPhaseVisited(this.phase);
  }

  trackInteraction(): void {
    this.analytics.trackTimelineInteraction();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  getStadiumLogo(match: DenormalizedMatch): string {
    if (!match.stadium?.city) return 'assets/icons/trophy.svg';

    const cityMap: Record<string, string> = {
      'zapopan': 'guadalajara',
      'guadalupe': 'monterrey',
      'mexico city': 'mexico-city',
      'arlington': 'dallas',
      'new york': 'new-york',
      'new york/new jersey': 'new-york',
      'new york new jersey': 'new-york',
      'east rutherford': 'new-york',
      'los angeles': 'los-angeles',
      'inglewood': 'los-angeles',
      'san francisco bay area': 'san-francisco',
      'san francisco': 'san-francisco',
      'santa clara': 'san-francisco',
      'seattle': 'seatle',
      'kansas city': 'kansas',
      'miami gardens': 'miami',
      'foxborough': 'boston'
    };

    const rawCity = match.stadium.city.toLowerCase();
    const mappedCity = cityMap[rawCity] || rawCity.replace(/\s+/g, '-');

    return `assets/cities/${mappedCity}.svg`;
  }

  getParagraphs(text: string | undefined): string[] {
    if (!text) return [];
    return text.split('\n\n');
  }

}
