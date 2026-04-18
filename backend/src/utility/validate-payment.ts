import {BadRequestException} from "@nestjs/common";

export function ensurePaymentIsValid(
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