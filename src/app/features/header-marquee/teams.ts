/**
 * @file teams.ts
 * @author Sergio Romera Rupérez
 * @description Header marquee component displaying a continuous scroll of teams or messages.
 */

export interface NationalTeamFlag {
  readonly id: string;
  readonly name: string;
  readonly svgUrl: string;
  readonly altText: string;
}

export const PARTICIPATING_TEAMS: readonly NationalTeamFlag[] = [
];
