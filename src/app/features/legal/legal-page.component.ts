/**
 * @file legal-page.component.ts
 * @author Sergio Romera Rupérez
 * @description Legal page component containing terms, privacy policy, and accessibility statements.
 */

import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

interface LegalSection {
  heading: string;
  paragraphs: string[];
}

interface LegalContent {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

const CONTENT: Record<string, LegalContent> = {
  privacidad: {
    title: 'Política de Privacidad',
    lastUpdated: 'Agosto 2026',
    sections: [
      {
        heading: '1. Responsable del sitio',
        paragraphs: [
          'Este sitio web es un proyecto personal de carácter conmemorativo y no comercial, creado por un aficionado al fútbol para celebrar el Mundial FIFA 2026, ganado por la Selección Española. El sitio no está afiliado, patrocinado ni respaldado por FIFA™ ni por ninguna federación nacional de fútbol. Toda la información y datos se utilizan con fines educativos y no comerciales.  Las marcas registradas de la FIFA, los logotipos de los equipos y las imágenes de las banderas siguen siendo propiedad de sus respectivos titulares de derechos.  '
        ]
      },
      {
        heading: '2. Datos que recogemos',
        paragraphs: [
          'Nuestra arquitectura está diseñada bajo el principio de privacidad por defecto, por lo que no recogemos, almacenamos ni procesamos ningún dato personal identificable en nuestros servidores. La página web permite explorar libremente todos los datos de los 104 partidos, clasificaciones y estadísticas sin necesidad de registro ni inicio de sesión. La base de datos de producción alojada en Google Cloud Firestore se utiliza estrictamente como una capa de lectura de documentos desnormalizados y no recopila informaciones externas.',
          'Para ofrecer información interactiva, el sitio integra un asistente conversacional ("Naranjito") impulsado por la API de Google Gemini 1.5 Flash mediante un sistema de Generación Aumentada por Recuperación (RAG). Los mensajes que envíes a Naranjito se transmiten a los servidores de Google para generar la respuesta correspondiente, rigiéndose por su propia política de privacidad. Nosotros no registramos, monitorizamos ni almacenamos el historial de tus conversaciones en ninguna base de datos centralizada. Para proteger la cuota de peticiones a la API y ofrecer respuestas instantáneas a preguntas repetidas, implementamos un sistema de caché en tu navegador que guarda temporalmente cada par de consulta y respuesta durante 24 horas..'
        ]
      },
      {
        heading: '3. Cookies',
        paragraphs: [
          'Utilizamos únicamente cookies técnicas estrictamente necesarias para el funcionamiento del sitio (sesión de navegación, preferencias de idioma). No utilizamos cookies de rastreo, publicidad ni analítica de terceros.'
        ]
      },
      {
        heading: '4. Tus derechos',
        paragraphs: [
          'Dado que no recopilamos ni tratamos datos personales identificables, no resulta aplicable el ejercicio tradicional de derechos de acceso, rectificación, portabilidad o supresión de datos. Si tienes alguna duda técnica o legal, puedes contactarnos a través de los canales indicados en el repositorio de código abierto del sitio.'
        ]
      }
    ]
  },

  accesibilidad: {
    title: 'Declaración de Accesibilidad',
    lastUpdated: 'Agosto 2026',
    sections: [
      {
        heading: 'Compromiso con la accesibilidad',
        paragraphs: [
          'Este sitio web ha sido diseñado con el objetivo de cumplir escrupulosamente con el nivel AA de las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1, elaboradas por el World Wide Web Consortium (W3C).'
        ]
      },
      {
        heading: 'Medidas implementadas',
        paragraphs: [
          '- Área táctil mínima de 44×44 px en todos los elementos interactivos (WCAG 2.5.5).',
          '- Roles ARIA: se utilizan roles y atributos ARIA donde el HTML semántico no es suficiente.',
          '- Navegación por teclado: todos los elementos interactivos son accesibles mediante tabulación lógica.',
          '- Textos alternativos: todas las imágenes con contenido informativo incluyen el atributo alt descriptivo.',
          '- Reducción de movimiento: las animaciones respetan la preferencia @media (prefers-reduced-motion).',
          '- Contraste de color: todos los textos mantienen una relación de contraste mínima de 4.5:1 respecto al fondo.'
        ]
      },

      {
        heading: 'Contacto',
        paragraphs: [
          'Si encuentras alguna barrera de accesibilidad en este sitio, por favor comunícanoslo para que podamos corregirla. Tu feedback nos ayuda a mejorar la experiencia para todo el mundo. Toda sugerencia es bienvenida.'
        ]
      }
    ]
  },

  'aviso-legal': {
    title: 'Aviso Legal',
    lastUpdated: 'Agosto 2026',
    sections: [
      {
        heading: '1. Naturaleza del sitio',
        paragraphs: [
          'Este sitio web es un proyecto personal de carácter exclusivamente conmemorativo y sin ánimo de lucro, creado por un aficionado al fútbol para preservar y celebrar los recuerdos del Mundial FIFA 2026. La presente página web constituye un trabajo académico que forma parte del portfolio de un estudiante de Ingeniería Informática en la Universidad de Zaragoza (EINA). No existe relación, afiliación, patrocinio ni respaldo de ningún tipo con la Federación Internacional de Fútbol Asociación (FIFA™), con las federaciones nacionales participantes ni con ninguna entidad oficial vinculada a la organización o explotación comercial del torneo.'
        ]
      },
      {
        heading: '2. Propiedad intelectual',
        paragraphs: [
          'Los textos, la arquitectura de la interfaz mobile-first, y el código fuente original desarrollados para este sitio son propiedad de sus autores y están plenamente protegidos por la legislación de propiedad intelectual aplicable. Las marcas, logotipos, escudos y nombres de selecciones o clubes deportivos son propiedad exclusiva de sus respectivos titulares de derechos. Su integración en este entorno académico es meramente referencial e informativa, amparada en el derecho de uso legítimo sin ánimo de lucro. Por su parte, los datos estadísticos, eventos y resultados de los partidos representan hechos deportivos objetivos de dominio público'
        ]
      },
      {
        heading: '3. Limitación de responsabilidad',
        paragraphs: [
          'El propietario y desarrollador de este sitio no asume responsabilidad alguna por los posibles errores, discrepancias u omisiones que pudieran existir en el volcado de datos estadísticos o en la información histórica publicada. Toda la plataforma, incluyendo su base de datos, se ofrece "tal cual", sin ninguna garantía expresa o implícita de exactitud absoluta o actualización en tiempo real. Asimismo, las respuestas generadas por el asistente conversacional interactivo están sujetas a la naturaleza estocástica de los modelos de inteligencia artificial y de la capa gratuita usada, por lo que podrían presentar imprecisiones tecnológicas o interpretativas. Los enlaces a sitios web externos se proporcionan con un fin exclusivamente divulgativo; el propietario no ejerce control alguno ni es responsable del contenido, fiabilidad o políticas de dichas páginas de terceros.',
        ]
      },
      {
        heading: '4. Legislación aplicable',
        paragraphs: [
          'El presente aviso legal se rige en todos y cada uno de sus extremos por la legislación española vigente. Para la resolución de cualquier controversia, discrepancia o reclamación legal que pudiera derivarse del acceso, uso, o interpretación de este sitio web y sus contenidos, las partes acuerdan someterse de forma expresa a la jurisdicción de los juzgados y los tribunales de la ciudad de Zaragoza, renunciando a cualquier otro fuero.'
        ]
      }
    ]
  }
};

@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="legal-wrapper">
      <div class="legal-container">

        <a routerLink="/" class="back-link" aria-label="Volver al Inicio">← Volver al Inicio</a>

        @if (content(); as page) {
          <header class="legal-header">
            <h1 class="legal-title">{{ page.title }}</h1>
            <p class="legal-updated">Última actualización: {{ page.lastUpdated }}</p>
          </header>

          <article class="legal-body">
            @for (section of page.sections; track section.heading) {
              <section class="legal-section">
                <h2 class="section-heading">{{ section.heading }}</h2>
                @for (p of section.paragraphs; track $index) {
                  <p class="section-para">{{ p }}</p>
                }
              </section>
            }
          </article>

          <nav class="legal-nav" aria-label="Otras páginas legales">
            <a routerLink="/privacidad"    class="legal-nav-link">Política de Privacidad</a>
            <span class="nav-sep" aria-hidden="true">·</span>
            <a routerLink="/accesibilidad" class="legal-nav-link">Declaración de Accesibilidad</a>
            <span class="nav-sep" aria-hidden="true">·</span>
            <a routerLink="/aviso-legal"   class="legal-nav-link">Aviso Legal</a>
          </nav>

        } @else {
          <p class="not-found">Página no encontrada.</p>
        }

      </div>
    </div>
  `,
  styles: [`
    /* ── Reset global para anular defaults de Ionic/browser ── */
    :host {
      display: block;
      background: #000000;
      min-height: 100vh;
      color: #fff;
      /* Sobrescribe el fondo de ion-content en esta ruta */
      --ion-background-color: #000000;
      --background: #000000;
    }
    * { box-sizing: border-box; }
    h1, h2, h3, p { margin: 0; padding: 0; }

    .legal-wrapper {
      max-width: 720px;
      margin: 0 auto;
      padding: 32px 20px 80px;
    }

    .back-link {
      display: inline-block;
      color: #FFD700;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 32px;
      transition: opacity 0.2s;
    }
    .back-link:hover { opacity: 0.7; }

    .legal-header {
      border-bottom: 1px solid rgba(255, 215, 0, 0.2);
      padding-bottom: 20px;
      margin-bottom: 36px;
      width: 100%;          /* misma anchura que el resto del contenido */
    }

    .legal-title {
      font-size: clamp(20px, 5vw, 34px);
      font-weight: 900;
      color: #FFD700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0 0 8px 0;    /* margen izquierdo siempre 0 */
      padding: 0;
    }

    .legal-updated {
      font-size: 12px;
      color: #555;
      margin: 0;
      padding: 0;
    }

    /* ── Artículo: anchura total, sin márgenes laterales extra ── */
    .legal-body {
      width: 100%;
      display: block;
    }

    .legal-section {
      width: 100%;
      margin: 0 0 32px 0;   /* solo margen inferior */
      padding: 0;
    }

    .section-heading {
      font-size: 14px;
      font-weight: 800;
      color: #FFD700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin: 0 0 12px 0;   /* alineado: margen izquierdo = 0 */
      padding: 0;
      display: block;
    }

    .section-para {
      font-size: 14px;
      line-height: 1.75;
      color: #aaa;
      margin: 0 0 10px 0;
      padding: 0;
      display: block;
      text-align: justify;          /* líneas alineadas en ambos márgenes */
      hyphens: auto;                /* partición silábica para evitar espacios excesivos */
      -webkit-hyphens: auto;
    }
    .section-para:last-child { margin-bottom: 0; }

    .legal-nav {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 8px 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.07);
      padding-top: 24px;
      margin-top: 48px;
      width: 100%;
      text-align: center;
    }

    .legal-nav-link {
      color: #888;
      font-size: 12px;
      text-decoration: none;
      transition: color 0.2s;
      white-space: nowrap;
    }
    .legal-nav-link:hover { color: #FFD700; }

    .nav-sep { color: #444; font-size: 12px; }

    .not-found {
      color: #666;
      text-align: center;
      margin-top: 80px;
      font-size: 16px;
    }
  `]

})
export class LegalPageComponent {
  private route = inject(ActivatedRoute);

  private pageKey = toSignal(
    this.route.data.pipe(map((d: Record<string, unknown>) => d['page'] as string))
  );

  content = computed(() => {
    const key = this.pageKey();
    return key ? (CONTENT[key] ?? null) : null;
  });
}
