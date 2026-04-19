import {BadRequestException} from '@nestjs/common';

export const ensureDateRangeIsValid = ( startDate: string, endDate: string ): void => {
	const start = new Date( startDate );
	const end   = new Date( endDate );

	if ( isNaN( start.getTime() ) || isNaN( end.getTime() ) )
	{
		throw new BadRequestException( "One or both dates are invalid." );
	}

	if ( start > end )
	{
		throw new BadRequestException(
		    "The start date must be before or equal to the end date.",
		);
	}
};