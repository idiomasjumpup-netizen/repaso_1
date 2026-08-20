export type EventType = ("creado" | "a_bordo" | "despegado" | "retrasado" | "cancelado")
export type Source = ("web"|"mobile"|"sistema")
export type FlightEvent = {
    id:string;
    flight_id: number;
    airline_id: string;
    event_type: EventType;
    source: Source;
    note: string;
    created_at: string;
}