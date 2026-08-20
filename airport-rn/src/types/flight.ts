export type Status = ("agendado" | "a_bordo" | "despegado" | "retrasado" | "cancelado")
export type Flight = {
    id: number;
    flight_number: string;
    destination: string;
    status: Status;
    created_at: string;
}