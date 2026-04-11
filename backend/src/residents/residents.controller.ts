import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
} from "@nestjs/common";

import {CreateResidentDto} from "./dto/create-resident.dto";
import {UpdateResidentDto} from "./dto/update-resident.dto";
import {ResidentsService} from "./residents.service";

@Controller( "residents" ) export class ResidentsController
{
	public constructor( private readonly residentsService: ResidentsService ) {}

	@Get() public findAll()
	{
		return this.residentsService.findAll();
	}

	@Get( ":id" ) public findOne( @Param( "id", ParseIntPipe ) id: number )
	{
		return this.residentsService.findOne( id );
	}

	@Post() public create( @Body() dto: CreateResidentDto )
	{
		return this.residentsService.create( dto );
	}

	@Patch( ":id" )
	public update(
	    @Param( "id", ParseIntPipe ) id: number,
	    @Body() dto: UpdateResidentDto,
	)
	{
		return this.residentsService.update( id, dto );
	}

	@Delete( ":id" ) public remove( @Param( "id", ParseIntPipe ) id: number )
	{
		return this.residentsService.remove( id );
	}
}