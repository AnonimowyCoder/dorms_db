export type ParkingReservation = {
	id: number; start_date_reserv : string | null; end_date_reserv : string | null; id_parking_lot : number;
	id_resident : number | null;
};

// FIXME: not null.