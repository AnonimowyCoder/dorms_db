import {DatabaseService} from "@/database/database.service";
import {ParkingReservationsService} from "@/parking-reservations/parking-reservations.service";
import {ensurePaymentValueIsValid} from "@/utility/validate-payment";
import {ConflictException, Injectable, NotFoundException} from "@nestjs/common";

import {CreateParkingPaymentDto} from "./dto/create-parking-payment.dto";
import {UpdateParkingPaymentDto} from "./dto/update-parking-payment.dto";
import {ParkingPayment} from "./types";

@Injectable() export class ParkingPaymentsService
{
	public constructor(
	    private readonly databaseService: DatabaseService,
	    private readonly parkingReservationsService: ParkingReservationsService,
	)
	{}

	public async findAll(): Promise< ParkingPayment[] >
	{
		return this.databaseService.queryMany< ParkingPayment >(
		    `SELECT id, id_parking_reservation, amount, payment_due_date, amount_payed
			 FROM parking_payments
			 ORDER BY id ASC`,
		);
	}

	public async findOne( id: number ): Promise< ParkingPayment >
	{
		const payment = await this.databaseService.queryOne< ParkingPayment >(
		    `SELECT id, id_parking_reservation, amount, payment_due_date, amount_payed
			 FROM parking_payments
			 WHERE id = $1`,
		    [ id ],
		);

		if ( !payment )
		{
			throw new NotFoundException( `Parking payment with id ${id} not found` );
		}

		return payment;
	}

	public async ensureExists( id: number ): Promise< void >
	{
		await this.findOne( id );
	}

	public async create( dto: CreateParkingPaymentDto ): Promise< ParkingPayment >
	{
		ensurePaymentValueIsValid( dto.amount, dto.amount_payed );
		await this.parkingReservationsService.ensureExists( dto.id_parking_reservation );
		await this.ensureReservationDoesNotAlreadyHavePayment( dto.id_parking_reservation );

		const createdPayment = await this.databaseService.queryOne< ParkingPayment >(
		    `INSERT INTO parking_payments (
			     id_parking_reservation,
			     amount,
			     payment_due_date,
			     amount_payed
			 )
			 VALUES ( $1, $2, $3, $4 )
			 RETURNING id, id_parking_reservation, amount, payment_due_date, amount_payed`,
		    [
			    dto.id_parking_reservation,
			    dto.amount,
			    dto.payment_due_date,
			    dto.amount_payed,
		    ],
		);

		if ( !createdPayment )
		{
			throw new Error( "Failed to create parking payment" );
		}

		return createdPayment;
	}

	public async update(
	    id: number,
	    dto: UpdateParkingPaymentDto,
	    ): Promise< ParkingPayment >
	{
		const existingPayment = await this.findOne( id );

		const nextAmount      = dto.amount ?? Number( existingPayment.amount );
		const nextDueDate     = dto.payment_due_date ?? existingPayment.payment_due_date;
		const nextAmountPayed = dto.amount_payed ?? Number( existingPayment.amount_payed );

		ensurePaymentValueIsValid( nextAmount, nextAmountPayed );

		const updatedPayment = await this.databaseService.queryOne< ParkingPayment >(
		    `UPDATE parking_payments
			 SET amount = $2,
			     payment_due_date = $3,
			     amount_payed = $4
			 WHERE id = $1
			 RETURNING id, id_parking_reservation, amount, payment_due_date, amount_payed`,
		    [
			    id,
			    nextAmount,
			    nextDueDate,
			    nextAmountPayed,
		    ],
		);

		if ( !updatedPayment )
		{
			throw new Error( "Failed to update parking payment" );
		}

		return updatedPayment;
	}

	public async remove( id: number ): Promise< void >
	{
		const result = await this.databaseService.query(
		    `DELETE FROM parking_payments
			 WHERE id = $1`,
		    [ id ],
		);

		if ( ( result.rowCount ?? 0 ) === 0 )
		{
			throw new NotFoundException( `Parking payment with id ${id} not found` );
		}
	}

	private async ensureReservationDoesNotAlreadyHavePayment(
	    idReservation: number,
	    ): Promise< void >
	{
		const existingPayment = await this.databaseService.queryOne< { id : number } >(
		    `SELECT id
		 FROM parking_payments
		 WHERE id_parking_reservation = $1`,
		    [ idReservation ],
		);

		if ( existingPayment )
		{
			throw new ConflictException(
			    `Reservation ${idReservation} already has a payment record`,
			);
		}
	}
}