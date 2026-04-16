export type RoomReservation = {
	id: number; start_date_reserv : string; end_date_reserv : string; id_room : number; id_resident : number;
};

export type AvailableRoom = {
	id: number; room_number : number; floor_number : number; num_of_beds : number; id_category : number;
	monthly_rent : number;
	if_kitchen : boolean | null;
	category_name : string | null;
	active_reservations_count : number;
	free_beds : number;
};