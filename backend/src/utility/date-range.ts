import {BadRequestException} from '@nestjs/common';

export const ensureDateRangeIsValid = ( startDate: string, endDate: string ): void => {
	const start = new Date( startDate );
	const end   = new Date( endDate );

	if ( isNaN( start.getTime() ) || isNaN( end.getTime() ) )
	{
		throw new BadRequestException( "One or both dates are invalid." );
	}

	const today = new Date();
	if ( start < today || end < today )
	{
		throw new BadRequestException( "Reservations cannot be made in the past." );
	}

	if ( start > end )
	{
		throw new BadRequestException(
		    "The start date must be before or equal to the end date.",
		);
	}
};