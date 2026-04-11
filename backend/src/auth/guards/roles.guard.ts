import {ROLES_KEY} from "@/auth/decorators/roles.decorator";
import {JwtUser} from "@/auth/types";
import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import {Reflector} from "@nestjs/core";

@Injectable() export class RolesGuard implements CanActivate
{
	public constructor( private readonly reflector: Reflector ) {}

	public canActivate( context: ExecutionContext ): boolean
	{
		const requiredRoles = this.reflector.getAllAndOverride< string[] >(
		    ROLES_KEY,
		    [
			    context.getHandler(),
			    context.getClass(),
		    ],
		);

		if ( !requiredRoles || requiredRoles.length === 0 )
		{
			return true;
		}

		const request = context.switchToHttp().getRequest< { user?: JwtUser } >();
		const user    = request.user;

		if ( !user )
		{
			throw new ForbiddenException( "User not found in request" );
		}

		if ( !requiredRoles.includes( user.role ) )
		{
			throw new ForbiddenException( "Insufficient permissions" );
		}

		return true;
	}
}