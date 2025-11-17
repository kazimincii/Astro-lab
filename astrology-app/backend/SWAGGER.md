# Swagger/OpenAPI Documentation Guide

## Overview

Swagger (OpenAPI) documentation is automatically generated and available at:
- **Development**: http://localhost:3000/api
- **Note**: Swagger is disabled in production for security

## Quick Start

1. Start the backend server:
   ```bash
   npm run start:dev
   ```

2. Open your browser to http://localhost:3000/api

3. You'll see the interactive API documentation with:
   - All endpoints organized by tags
   - Request/response schemas
   - Try-it-out functionality
   - Authentication support

## Adding Documentation to Controllers

### Basic Controller Documentation

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')  // Groups endpoints under "users" tag
@Controller('users')
export class UsersController {
  
  @Get()
  @ApiOperation({ 
    summary: 'Get all users',
    description: 'Returns a list of all registered users'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of users retrieved successfully'
  })
  findAll() {
    // implementation
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createUserDto: CreateUserDto) {
    // implementation
  }
}
```

### DTOs with Validation

Use `@ApiProperty()` decorator for DTO properties:

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePass123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  name?: string;
}
```

### Authentication

For protected endpoints that require JWT:

```typescript
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('profiles')
@ApiBearerAuth('JWT-auth')  // Requires JWT authentication
@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  
  @Get()
  @ApiOperation({ summary: 'Get user profiles' })
  getUserProfiles() {
    // Only accessible with valid JWT token
  }
}
```

### Response Types

Define response schemas for better documentation:

```typescript
import { ApiResponse } from '@nestjs/swagger';

class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  createdAt: Date;
}

@Get(':id')
@ApiOperation({ summary: 'Get user by ID' })
@ApiResponse({ 
  status: 200, 
  description: 'User found',
  type: UserResponseDto  // Links to the DTO class
})
@ApiResponse({ status: 404, description: 'User not found' })
getUser(@Param('id') id: string) {
  // implementation
}
```

### Query Parameters

```typescript
import { ApiQuery } from '@nestjs/swagger';

@Get()
@ApiQuery({ 
  name: 'page', 
  type: Number, 
  required: false,
  description: 'Page number',
  example: 1,
})
@ApiQuery({ 
  name: 'limit', 
  type: Number, 
  required: false,
  description: 'Items per page',
  example: 10,
})
findAll(@Query('page') page: number, @Query('limit') limit: number) {
  // implementation
}
```

### Path Parameters

```typescript
import { ApiParam } from '@nestjs/swagger';

@Get(':id')
@ApiParam({ 
  name: 'id', 
  type: String,
  description: 'User unique identifier',
  example: '123',
})
findOne(@Param('id') id: string) {
  // implementation
}
```

### File Upload

```typescript
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Post('upload')
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  },
})
@UseInterceptors(FileInterceptor('file'))
uploadFile(@UploadedFile() file: Express.Multer.File) {
  // implementation
}
```

## Common Decorators

| Decorator | Purpose | Example |
|-----------|---------|---------|
| `@ApiTags()` | Group endpoints | `@ApiTags('users')` |
| `@ApiOperation()` | Describe endpoint | `@ApiOperation({ summary: 'Get users' })` |
| `@ApiResponse()` | Define response | `@ApiResponse({ status: 200, description: 'Success' })` |
| `@ApiProperty()` | Document DTO property | `@ApiProperty({ example: 'value' })` |
| `@ApiPropertyOptional()` | Optional DTO property | `@ApiPropertyOptional()` |
| `@ApiBearerAuth()` | Require JWT auth | `@ApiBearerAuth('JWT-auth')` |
| `@ApiParam()` | Path parameter | `@ApiParam({ name: 'id' })` |
| `@ApiQuery()` | Query parameter | `@ApiQuery({ name: 'search' })` |
| `@ApiBody()` | Request body | `@ApiBody({ type: CreateDto })` |
| `@ApiConsumes()` | Content type | `@ApiConsumes('multipart/form-data')` |

## Best Practices

### 1. Tag Organization
Group related endpoints using consistent tags:
```typescript
@ApiTags('auth')      // Authentication
@ApiTags('profiles')  // User profiles
@ApiTags('charts')    // Birth charts
```

### 2. Clear Descriptions
Provide helpful descriptions:
```typescript
@ApiOperation({
  summary: 'Create birth chart',  // Short summary
  description: 'Calculates complete birth chart based on date, time, and location using Swiss Ephemeris'  // Detailed explanation
})
```

### 3. Example Values
Always include realistic examples:
```typescript
@ApiProperty({
  example: '1990-01-15T08:30:00Z',
  description: 'Birth date and time in ISO format'
})
birthDate: Date;
```

### 4. Error Responses
Document all possible error cases:
```typescript
@ApiResponse({ status: 200, description: 'Success' })
@ApiResponse({ status: 400, description: 'Invalid input' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 404, description: 'Not found' })
@ApiResponse({ status: 500, description: 'Server error' })
```

### 5. DTO Reuse
Create reusable DTOs and response types:
```typescript
// responses/success.response.ts
export class SuccessResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Operation completed' })
  message: string;
}
```

## Configuration

The Swagger configuration is in `src/main.ts`:

```typescript
const config = new DocumentBuilder()
  .setTitle('API Title')
  .setDescription('API Description')
  .setVersion('1.0.0')
  .addTag('tag-name', 'Tag description')
  .addBearerAuth()
  .addServer('http://localhost:3000', 'Development')
  .build();
```

## Testing with Swagger UI

1. Navigate to http://localhost:3000/api
2. Click on an endpoint to expand
3. Click "Try it out"
4. Fill in parameters
5. Click "Execute"
6. View response

### Authentication in Swagger UI

1. Click the "Authorize" button (🔓)
2. Enter your JWT token: `Bearer your-token-here`
3. Click "Authorize"
4. Now all authenticated endpoints will include the token

## Exporting OpenAPI Spec

The OpenAPI JSON spec is available at:
- http://localhost:3000/api-json

You can use this with:
- Postman (import OpenAPI spec)
- API testing tools
- Code generators
- Documentation generators

## Example: Complete Controller

```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { 
  ApiTags, 
  ApiBearerAuth, 
  ApiOperation, 
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('profiles')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  
  @Get()
  @ApiOperation({ 
    summary: 'Get all user profiles',
    description: 'Returns all profiles for the authenticated user'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Profiles retrieved successfully',
    type: [ProfileResponseDto]
  })
  findAll() {
    // implementation
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get profile by ID' })
  @ApiParam({ name: 'id', description: 'Profile ID' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  findOne(@Param('id') id: string) {
    // implementation
  }

  @Post()
  @ApiOperation({ summary: 'Create new profile' })
  @ApiResponse({ status: 201, type: ProfileResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  create(@Body() createDto: CreateProfileDto) {
    // implementation
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update profile' })
  @ApiParam({ name: 'id', description: 'Profile ID' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  update(@Param('id') id: string, @Body() updateDto: UpdateProfileDto) {
    // implementation
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete profile' })
  @ApiParam({ name: 'id', description: 'Profile ID' })
  @ApiResponse({ status: 200, description: 'Profile deleted' })
  remove(@Param('id') id: string) {
    // implementation
  }
}
```

## Next Steps

To fully document the API:

1. Add `@ApiTags()` to all controllers
2. Add `@ApiOperation()` to all endpoints
3. Add `@ApiProperty()` to all DTOs
4. Document all response types with `@ApiResponse()`
5. Add examples to all properties
6. Document authentication requirements

## Resources

- [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
