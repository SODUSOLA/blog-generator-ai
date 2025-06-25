import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
        title: 'Blog Generator API',
        version: '1.0.0',
        description: 'API for generating blogs from YouTube audio transcripts',
        },
        servers: [
        {
            url: 'http://localhost:3000', 
        },
        ],
        components: {
        securitySchemes: {
            bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            },
        },
        schemas: {
            RegisterInput: {
            type: 'object',
            required: ['firstName','lastName','email', 'password', 'confirmPassword'],
            properties: {
                firstName: {type: 'string', example: 'John'},
                lastName: {type: 'string', example: 'Doe'},
                email: { type: 'string', example: 'user@example.com' },
                password: { type: 'string', example: 'strongPassword123' },
                confirmPassword: { type: 'string', example: 'strongPassword123' }
            },
            },
            LoginInput: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
                email: { type: 'string', example: 'user@example.com' },
                password: { type: 'string', example: 'strongPassword123' },
            },
            },
            Blog: {
            type: 'object',
            properties: {
                _id: { type: 'string', example: '685c2004392543bfcc912572' },
                user: { type: 'string', example: 'userId123' },
                source: { type: 'string', example: 'https://cloudinary.com/...' },
                transcript: { type: 'string' },
                blog: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
            },
            },
        },
        },
        security: [
        {
            bearerAuth: [],
        },
        ],
    },
    apis: ['./routes/*.js'], // Path to the route files for extracting swagger doc
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
