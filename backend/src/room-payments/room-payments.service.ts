import {DatabaseService} from "@/database/database.service";
import {RoomReservationsService} from "@/room-reservations/room-reservations.service";
import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";

import {CreateRoomPaymentDto} from "./dto/create-room-payment.dto";
import {UpdateRoomPaymentDto} from "./dto/update-room-payment.dto";
import {RoomPayment} from "./types";

@Injectable() export class RoomPaymentsService
{
	public constructor(
	    private readonly databaseService: DatabaseService,
	    private readonly roomReservationsService: RoomReservationsService,
	)
	{}

	public async findAll(): Promise< RoomPayment[] >
	{
		return this.databaseService.queryMany< RoomPayment >(
		    `SELECT id, id_reservation, amount, payment_due_date, amount_payed
			 FROM room_payments
			 ORDER BY id ASC`,
		);
	}

	public async findOne( id: number ): Promise< RoomPayment >
	{
		const payment = await this.databaseService.queryOne< RoomPayment >(
		    `SELECT id, id_reservation, amount, payment_due_date, amount_payed
			 FROM room_payments
			 WHERE id = $1`,
		    [ id ],
		);

		if ( !payment )
		{
			throw new NotFoundException( `Room payment with id ${id} not found` );
		}

		return payment;
	}

	public async ensureExists( id: number ): Promise< void >
	{
		await this.findOne( id );
	}

	public async create( dto: CreateRoomPaymentDto ): Promise< RoomPayment >
	{
		this.ensurePaymentIsValid( dto.amount, dto.amount_payed );
		await this.roomReservationsService.ensureExists( dto.id_reservation );

		const createdPayment = await this.databaseService.queryOne< RoomPayment >(
		    `INSERT INTO room_payments (
			     id_reservation,
			     amount,
			     payment_due_date,
			     amount_payed
			 )
			 VALUES ( $1, $2, $3, $4 )
			 RETURNING id, id_reservation, amount, payment_due_date, amount_payed`,
		    [
			    dto.id_reservation,
			    dto.amount,
			    dto.payment_due_date,
			    dto.amount_payed,
		    ],
		);

		if ( !createdPayment )
		{
			throw new Error( "Failed to create room payment" );
		}

		return createdPayment;
	}

	public async update(
	    id: number,
	    dto: UpdateRoomPaymentDto,
	    ): Promise< RoomPayment >
	{
		const existingPayment = await this.findOne( id );

		const nextAmount      = dto.amount ?? Number( existingPayment.amount );
		const nextDueDate     = dto.payment_due_date ?? existingPayment.payment_due_date;
		const nextAmountPayed = dto.amount_payed ?? Number( existingPayment.amount_payed );

		this.ensurePaymentIsValid( nextAmount, nextAmountPayed );

		const updatedPayment = await this.databaseService.queryOne< RoomPayment >(
		    `UPDATE room_payments
			 SET amount = $2,
			     payment_due_date = $3,
			     amount_payed = $4
			 WHERE id = $1
			 RETURNING id, id_reservation, amount, payment_due_date, amount_payed`,
		    [
			    id,
			    nextAmount,
			    nextDueDate,
			    nextAmountPayed,
		    ],
		);

		if ( !updatedPayment )
		{
			throw new Error( "Failed to update room payment" );
		}

		return updatedPayment;
	}

	public async remove( id: number ): Promise< void >
	{
		const result = await this.databaseService.query(
		    `DELETE FROM room_payments
			 WHERE id = $1`,
		    [ id ],
		);

		if ( ( result.rowCount ?? 0 ) === 0 )
		{
			throw new NotFoundException( `Room payment with id ${id} not found` );
		}
	}

	private ensurePaymentIsValid(
	    amount: number,
	    amountPayed: number,
	    ): void
	{
		if ( amount < 0 )
		{
			throw new BadRequestException( "amount cannot be negative" );
		}

		if ( amountPayed < 0 )
		{
			throw new BadRequestException( "amount_payed cannot be negative" );
		}

		if ( amountPayed > amount )
		{
			throw new BadRequestException(
			    "amount_payed cannot be greater than amount",
			);
		}
	}
}