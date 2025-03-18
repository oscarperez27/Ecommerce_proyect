import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions={
    swaggerDefinition:{
        openapi: "3.0.0",
        info:{
            version:"1.0.0",
            title:"Docu API",
            description:"API Documentation for use",
            servers:["http://localhost:3000"],
            schemes:
            - "https"
            - "http"
        }
    },
    basePath:"/",
    apis:["src/routes/*.js"]
};


export default swaggerJsdoc(swaggerOptions);