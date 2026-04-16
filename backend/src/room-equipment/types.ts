export type RoomEquipment = {
	id_room: number; id_equipment : number;
};

export type RoomEquipmentDetails = {
	id_room: number; room_number : number; id_equipment : number; equipment_name : string; description : string | null;
};

export type RoomEquipmentAssignmentResult = {
	id_room: number; id_equipment : number; assigned_count : number;
};