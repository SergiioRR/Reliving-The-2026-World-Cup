/**
 * @file chat.service.ts
 * @author Sergio Romera Rupérez
 * @description Core service handling data fetching, state management, or external API interactions.
 */

import { Injectable } from '@angular/core';
import { GoogleGenerativeAI, GenerativeModel, SchemaType } from '@google/generative-ai';
import { environment } from '../../../environments/environment.development';
import { FirestoreService } from './firestore.service';

export interface ChatMessage {
  id: string;
  role: 'user' | 'system' | 'assistant';
  content: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  private readonly MATCHES_INDEX = "2026_M1: México vs Sudáfrica, 2026_M10: Países Bajos vs Japón, 2026_M100: Argentina vs Suiza, 2026_M101: Francia vs España, 2026_M102: Inglaterra vs Argentina, 2026_M103: Francia vs Inglaterra, 2026_M104: España vs Argentina, 2026_M11: Costa de Marfil vs Ecuador, 2026_M12: Suecia vs Túnez, 2026_M13: España vs Cabo Verde, 2026_M14: Bélgica vs Egipto, 2026_M15: Arabia Saudí vs Uruguay, 2026_M16: Irán vs Nueva Zelanda, 2026_M17: Francia vs Senegal, 2026_M18: Irak vs Noruega, 2026_M19: Argentina vs Argelia, 2026_M2: Corea del Sur vs República Checa, 2026_M20: Austria vs Jordania, 2026_M21: Portugal vs República Democrática del Congo, 2026_M22: Inglaterra vs Croacia, 2026_M23: Ghana vs Panamá, 2026_M24: Uzbekistán vs Colombia, 2026_M25: República Checa vs Sudáfrica, 2026_M26: Suiza vs Bosnia y Herzegovina, 2026_M27: Canadá vs Catar, 2026_M28: México vs Corea del Sur, 2026_M29: Estados Unidos vs Australia, 2026_M3: Canadá vs Bosnia y Herzegovina, 2026_M30: Escocia vs Marruecos, 2026_M31: Brasil vs Haití, 2026_M32: Turquía vs Paraguay, 2026_M33: Países Bajos vs Suecia, 2026_M34: Alemania vs Costa de Marfil, 2026_M35: Ecuador vs Curazao, 2026_M36: Túnez vs Japón, 2026_M37: España vs Arabia Saudí, 2026_M38: Bélgica vs Irán, 2026_M39: Uruguay vs Cabo Verde, 2026_M4: Estados Unidos vs Paraguay, 2026_M40: Nueva Zelanda vs Egipto, 2026_M41: Argentina vs Austria, 2026_M42: Francia vs Irak, 2026_M43: Noruega vs Senegal, 2026_M44: Jordania vs Argelia, 2026_M45: Portugal vs Uzbekistán, 2026_M46: Inglaterra vs Ghana, 2026_M47: Panamá vs Croacia, 2026_M48: Colombia vs República Democrática del Congo, 2026_M49: Bosnia y Herzegovina vs Catar, 2026_M5: Catar vs Suiza, 2026_M50: Suiza vs Canadá, 2026_M51: Marruecos vs Haití, 2026_M52: Escocia vs Brasil, 2026_M53: República Checa vs México, 2026_M54: Sudáfrica vs Corea del Sur, 2026_M55: Curazao vs Costa de Marfil, 2026_M56: Ecuador vs Alemania, 2026_M57: Japón vs Suecia, 2026_M58: Túnez vs Países Bajos, 2026_M59: Paraguay vs Australia, 2026_M6: Brasil vs Marruecos, 2026_M60: Turquía vs Estados Unidos, 2026_M61: Noruega vs Francia, 2026_M62: Senegal vs Irak, 2026_M63: Cabo Verde vs Arabia Saudí, 2026_M64: Uruguay vs España, 2026_M65: Egipto vs Irán, 2026_M66: Nueva Zelanda vs Bélgica, 2026_M67: Croacia vs Ghana, 2026_M68: Panamá vs Inglaterra, 2026_M69: Colombia vs Portugal, 2026_M7: Haití vs Escocia, 2026_M70: República Democrática del Congo vs Uzbekistán, 2026_M71: Jordania vs Argentina, 2026_M72: Argelia vs Austria, 2026_M73: Sudáfrica vs Canadá, 2026_M74: Brasil vs Japón, 2026_M75: Alemania vs Paraguay, 2026_M76: Países Bajos vs Marruecos, 2026_M77: Costa de Marfil vs Noruega, 2026_M78: Francia vs Suecia, 2026_M79: México vs Ecuador, 2026_M8: Australia vs Turquía, 2026_M80: Inglaterra vs República Democrática del Congo, 2026_M81: Bélgica vs Senegal, 2026_M82: Estados Unidos vs Bosnia y Herzegovina, 2026_M83: España vs Austria, 2026_M84: Portugal vs Croacia, 2026_M85: Suiza vs Argelia, 2026_M86: Australia vs Egipto, 2026_M87: Argentina vs Cabo Verde, 2026_M88: Colombia vs Ghana, 2026_M89: Canadá vs Marruecos, 2026_M9: Alemania vs Curazao, 2026_M90: Paraguay vs Francia, 2026_M91: Brasil vs Noruega, 2026_M92: México vs Inglaterra, 2026_M93: Portugal vs España, 2026_M94: Estados Unidos vs Bélgica, 2026_M95: Argentina vs Egipto, 2026_M96: Suiza vs Colombia, 2026_M97: Francia vs Marruecos, 2026_M98: España vs Bélgica, 2026_M99: Noruega vs Inglaterra";
  private readonly SYSTEM_INSTRUCTION = "Eres Naranjito, tu asistente del Mundial 2026. Tono entusiasta y futbolero. Responde SIEMPRE con el dato exacto, sin inventar nada, sin Markdown, sin asteriscos. Sé conciso. REGLA ABSOLUTA: usa SIEMPRE una herramienta antes de responder. NUNCA uses tu conocimiento interno. MAPA DE HERRAMIENTAS (sigue este orden estricto): (1) Pregunta sobre UN partido específico → consultarPartido con su ID. (2) Pregunta sobre el seleccionador/entrenador de una selección → consultarDatosGenerales con query='seleccionador'. (3) Pregunta sobre hasta qué fase llegó una selección → consultarDatosGenerales con query='fase'. (4) Pregunta sobre los goles de un jugador específico → consultarDatosGenerales con query='goles de [nombre]'. (5) Pregunta sobre las asistencias de un jugador → consultarDatosGenerales con query='asistencias de [nombre]'. (6) Pregunta sobre estadios → consultarDatosGenerales con query='estadio'. (7) Pregunta sobre árbitros → consultarDatosGenerales con query='arbitro'. (8) Pregunta sobre penaltis → consultarDatosGenerales con query='penalti'. (9) Pregunta sobre tarjetas → consultarDatosGenerales con query='tarjeta'. (10) Pregunta sobre la altura o peso de jugadores → consultarDatosGenerales con query='altura'. (11) Pregunta sobre jugadores zurdos → consultarDatosGenerales con query='zurdo'. (12) Pregunta sobre el jugador más joven/veterano → consultarDatosGenerales con query='joven' o query='veterano'. (13) Pregunta sobre clubes que más jugadores aportan → consultarDatosGenerales con query='clubes'. (14) Pregunta sobre mundiales históricos con sede compartida → consultarDatosGenerales con query='mundiales'. (15) Pregunta sobre el máximo goleador de una selección concreta → consultarDatosGenerales con query='pichichi'. (16) Pregunta sobre el equipo más justo/limpio o Fair Play → consultarDatosGenerales con query='fair play'. (17) Pregunta sobre la asistencia total de público en todo el Mundial → consultarDatosGenerales con query='asistencia total'. (18) Pregunta sobre equipos invictos que no perdieron ningún partido → consultarDatosGenerales con query='invencibles'. (19) Pregunta sobre el mejor diferencial de goles (GF-GC) por selección → consultarDatosGenerales con query='diferencial'. (20) Pregunta sobre la media de goles por fase (grupos vs eliminatorias) → consultarDatosGenerales con query='media de goles'. (21) Pregunta sobre qué selección eliminó a más rivales / la bestia negra → consultarDatosGenerales con query='bestia negra'. (22) Pregunta sobre el total de tarjetas rojas / expulsiones en el torneo → consultarDatosGenerales con query='record tarjetas'. (23) Pregunta sobre la edad de los seleccionadores / entrenadores → consultarDatosGenerales con query='perfil generacional'. (24) Pregunta sobre la mayor goleada / paliza del torneo (mayor diferencia de goles) → consultarDatosGenerales con query='mayores goleadas'. (25) Pregunta sobre los partidos con más goles en total (lluvia de goles) → consultarDatosGenerales con query='lluvia de goles'. (26) Top goleadores del torneo / bota de oro → consultarRankingsIndividuales. (27) Estadísticas agregadas de equipos (posesión media, córners, faltas por partido) → consultarEstadisticasSelecciones. (28) Pregunta sobre la edad exacta o fecha de nacimiento de un jugador, técnico o árbitro → consultarDatosGenerales con query='edad: [nombre de la persona, ej: edad: lamine yamal]'. Si recibes un resultado vacío de consultarDatosGenerales, prueba con una keyword más corta o sinónimo. Si la herramienta falla definitivamente, responde: 'No dispongo de esa información en mi base de datos del Mundial 2026.' DATOS CLAVE (responde directamente sin herramienta): Final='2026_M104' (España vs Argentina), 3er puesto='2026_M103' (Francia vs Inglaterra). PREMIOS INDIVIDUALES DEL TORNEO: Mejor Jugador del Torneo (Balón de Oro)=Rodrigo Hernández \"Rodri\" (España); Mejor Jugador Joven=Pau Cubarsí (España); Mejor Portero (Guante de Oro)=Unai Simón (España). Índice de partidos: " + this.MATCHES_INDEX;

  constructor(private firestoreService: FirestoreService) {
    this.genAI = new GoogleGenerativeAI(environment.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite',
      systemInstruction: this.SYSTEM_INSTRUCTION,
      tools: [{
        functionDeclarations: [
          {
            name: 'consultarPartido',
            description: 'Obtiene los detalles de un partido específico.',
            parameters: {
              type: SchemaType.OBJECT,
              properties: { id: { type: SchemaType.STRING, description: 'ID del partido' } },
              required: ['id']
            }
          },
          {
            name: 'consultarJugador',
            description: 'Obtiene datos básicos de un jugador desde Firestore (perfil, dorsal, club). NO contiene goles ni asistencias en el torneo. Para goles/asistencias de un jugador concreto, usa consultarDatosGenerales.',
            parameters: {
              type: SchemaType.OBJECT,
              properties: { id: { type: SchemaType.STRING, description: 'ID o nombre del jugador' } },
              required: ['id']
            }
          },
          {
            name: 'consultarSeleccion',
            description: 'Obtiene datos básicos de una selección desde Firestore (grupo, resultados, puntos). NO contiene el nombre del seleccionador/entrenador ni la fase máxima alcanzada. Para seleccionadores usa consultarDatosGenerales con query="seleccionador". Para fase máxima usa consultarDatosGenerales con query="fase".',
            parameters: {
              type: SchemaType.OBJECT,
              properties: { id: { type: SchemaType.STRING, description: 'ID o nombre de la selección' } },
              required: ['id']
            }
          },
          {
            name: 'consultarRankingsIndividuales',
            description: 'Obtiene los rankings estadísticos individuales de los jugadores del torneo (más minutos, goleadores más rápidos, etc).',
            parameters: { type: SchemaType.OBJECT, properties: {} }
          },
          {
            name: 'consultarEstadisticasSelecciones',
            description: 'Obtiene las estadísticas acumuladas de todas las selecciones del torneo (posesión, tiros, tarjetas, etc).',
            parameters: { type: SchemaType.OBJECT, properties: {} }
          },
          {
            name: 'consultarDatosGenerales',
            description: 'Busca en el JSON de datos pre-calculados desde la base de datos PostgreSQL del Mundial 2026. La búsqueda es por coincidencia de texto en los títulos de sección. Ejemplos de queries válidas y lo que devuelven: "seleccionador" → entrenador principal de cada selección; "fase" → fase máxima alcanzada por cada selección; "goles de mbappe" → goles de Mbappé en el torneo; "asistencias de messi" → asistencias de Messi; "estadio" → estadios, capacidad, ocupación; "arbitro" → árbitros y sus participaciones; "penalti" → datos de penaltis; "tarjeta" → expulsiones y amonestaciones; "altura" → altura y peso de jugadores; "zurdo" → jugadores zurdos; "joven" → jugadores más jóvenes; "veterano" → jugadores más veteranos; "clubes" → clubes con más jugadores en el torneo; "mundiales" → torneos históricos con sede compartida; "posesion" → posesión por partido; "corner" → córners; "sustitucion" → sustituciones; "capitan" → capitanes. Usa siempre la keyword en español sin tildes si tienes dudas.',
            parameters: {
              type: SchemaType.OBJECT,
              properties: { query: { type: SchemaType.STRING, description: 'Palabra clave en español para buscar en el JSON de datos. Ejemplos: "seleccionador", "fase", "estadio", "arbitro", "penalti", "altura", "zurdo", "goles de [nombre]", "asistencias de [nombre]"' } },
              required: ['query']
            }
          }
        ]
      }]
    });
  }

  public async sendMessage(history: ChatMessage[]): Promise<string> {
    try {
      const contents: any[] = history
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));

      if (contents.length === 0) return "";

      let result = await this.model.generateContent({ contents });

      let call = result.response.functionCalls()?.[0];
      let iterations = 0;
      const MAX_ITERATIONS = 6;

      while (call && iterations < MAX_ITERATIONS) {
        iterations++;
        const aiMessage = result.response.candidates?.[0]?.content;
        if (aiMessage) contents.push(aiMessage);

        let responseData: string = "";
        const args = call.args as any || {};

        try {
          if (call.name === "consultarPartido") {
            responseData = await this.firestoreService.consultarPartido(args["id"]);
          } else if (call.name === "consultarJugador") {
            responseData = await this.firestoreService.consultarJugador(args["id"]);
          } else if (call.name === "consultarSeleccion") {
            responseData = await this.firestoreService.consultarSeleccion(args["id"]);
          } else if (call.name === "consultarRankingsIndividuales") {
            responseData = await this.firestoreService.consultarRankingsIndividuales();
          } else if (call.name === "consultarEstadisticasSelecciones") {
            responseData = await this.firestoreService.consultarEstadisticasSelecciones();
          } else if (call.name === "consultarDatosGenerales") {
            responseData = await this.firestoreService.consultarDatosGenerales(args["query"]);
          }
        } catch (e) {
          responseData = '{"error": "Datos no encontrados"}';
        }

        contents.push({
          role: "user",
          parts: [{
            functionResponse: {
              name: call.name,
              response: { result: responseData }
            }
          }]
        });

        result = await this.model.generateContent({ contents });
        call = result.response.functionCalls()?.[0];
      }

      if (iterations >= MAX_ITERATIONS) {
        return "Lo siento, he tenido que buscar en demasiados sitios y me he quedado sin tiempo. Por favor, sé un poco más específico.";
      }

      return result.response.text();
    } catch (error) {
      console.error("Error communicating with Gemini API:", error);
      return "Ups, ha habido un problema conectando con el terreno de juego. ¡Inténtalo de nuevo!";
    }
  }
}
