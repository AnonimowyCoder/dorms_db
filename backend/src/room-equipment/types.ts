export type RoomEquipment = {
	id_room: number; id_equipment : number; count : number;
};

export type RoomEquipmentDetails = {
	id_room: number; room_number : number; id_equipment : number; equipment_name : string; description : string | null;
	count : number;
};