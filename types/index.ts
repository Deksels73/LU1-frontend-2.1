// Leesbare namen voor de types die uit openapi.yaml zijn gegenereerd (types/api.ts).
// Pas api.ts nooit met de hand aan: draai `npm run generate:api`.
import type { components } from "./api";

type S = components["schemas"];

export type Role = S["Role"];
export type User = S["User"];
export type LoginResponse = S["LoginResponse"];
export type Leesprofiel = S["Leesprofiel"];
export type LeesprofielInput = S["LeesprofielInput"];
export type AdviesItem = S["AdviesItem"];
export type LeeslijstItem = S["LeeslijstItem"];
export type StudentSummary = S["StudentSummary"];
export type Teacher = S["Teacher"];
export type Book = S["Book"];
export type CatalogBook = S["CatalogBook"];
export type ApiError = S["Error"];

// Formulier voor het leesprofiel: niveau en lengte zijn leeg zolang de
// leerling nog niets heeft gekozen. Bij het versturen is het een LeesprofielInput.
export type LeesprofielForm = Omit<LeesprofielInput, "niveau" | "lengte"> & {
  niveau: LeesprofielInput["niveau"] | "";
  lengte: LeesprofielInput["lengte"] | "";
};