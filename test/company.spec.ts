import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';

describe('Company API - Invalid CNPJ', () => {
    const p = pactum;
    const rep = SimpleReporter;
    const baseUrl = 'https://api-desafio-qa.onrender.com/company';

    p.request.setDefaultTimeout(30000);

    beforeAll(() => p.reporter.add(rep));
    afterAll(() => p.reporter.end());

    describe('POST /company', () => {
        it('Invalid CNPJ - Should return 400 error for invalid CNPJ', async () => {
            const requestBody = {
                name: "Test Company",
                cnpj: "12345678",
                state: "SP",
                city: "São Paulo",
                address: "Avenida Paulista, 1234",
                sector: "Tecnologia"
            };

            await p
                .spec()
                .post(baseUrl)
                .withJson(requestBody)
                .expectStatus(StatusCodes.BAD_REQUEST)
                .expectBodyContains('CNPJ deve ter 14 dígitos')
        });
    });

    it('Valid CNPJ -  Should return 201 created', async () => {
        const requestBody = {
            name: faker.internet.userName(),
            cnpj: "41272608000152",
            state: "SP",
            city: "São Paulo",
            address: "Avenida Paulista, 1234",
            sector: "Tecnologia"
        };

        await p
            .spec()
            .post(baseUrl)
            .withJson(requestBody)
            .expectStatus(StatusCodes.CREATED)
            .expectBodyContains(requestBody.name)
            .expectJsonSchema({
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    id: {
                        type: 'integer'
                    },
                    name: {
                        type: 'string'
                    },
                    cnpj: {
                        type: 'string'
                    },
                    state: {
                        type: 'string'
                    },
                    city: {
                        type: 'string'
                    },
                    address: {
                        type: 'string'
                    },
                    sector: {
                        type: 'string'
                    },
                    products:
                    {
                        type: 'array',
                    },
                    employees:
                    {
                        type: 'array',
                    },
                    services:
                    {
                        type: 'array',
                    }
                }
            });
    });

    describe('GET /company/{companyId}', () => {
        it('Invalid companyId - Should return 404 with "Empresa não encontrada" message', async () => {
            await p
                .spec()
                .get(`${baseUrl}/1`)
                .expectStatus(StatusCodes.NOT_FOUND)
                .expectJson({
                    message: "Empresa não encontrada"
                });
        });
    });

    describe('DELETE /company/{companyId}', () => {
        it('Invalid companyId format - Should return error for invalid company ID', async () => {
            const invalidId = "abc";
            
            await p
                .spec()
                .delete(`${baseUrl}/${invalidId}`)
                .expectStatus(StatusCodes.BAD_REQUEST)
                .expectJsonLike({
                    errors: [
                        {
                            type: "field",
                            value: invalidId,
                            msg: "ID deve ser um número inteiro",
                            path: "id",
                            location: "params"
                        }
                    ]
                });
        });

        it('Valid companyId - Should delete successfully', async () => {
            const invalidId = 1;

            await p
                .spec()
                .delete(`${baseUrl}/${invalidId}`)
                .expectStatus(StatusCodes.OK)
                .expectJson({
                    message: "Empresa deletada com sucesso"
                });
        });
    });

    describe('GET /company/{companyId}/products', () => {
        it('Invalid companyId - Should return 404 with "Empresa não encontrada" message', async () => {
            await p
                .spec()
                .get(`${baseUrl}/1/products`)
                .expectStatus(StatusCodes.NOT_FOUND)
                .expectJson({
                    message: "Empresa não encontrada"
                });
        });
    });

    describe('POST /company/{companyId}/products', () => {
        it('Invalid companyId - Should return 404 with "Empresa não encontrada" message when adding a product', async () => {
            const requestBody = {
                productName: "Test Product",
                productDescription: "Test Description",
                price: 0
            };

            await p
                .spec()
                .post(`${baseUrl}/1/products`)
                .withJson(requestBody)
                .expectStatus(StatusCodes.NOT_FOUND) 
                .expectJson({
                    message: "Empresa não encontrada"
                });
        });
    });

    describe('GET /company/{companyId}/products/{productId}', () => {
        it('Invalid companyId - Should return 404 with "Empresa não encontrada" message', async () => {
            await p
                .spec()
                .get(`${baseUrl}/1/products/1`)
                .expectStatus(StatusCodes.NOT_FOUND)
                .expectJson({
                    message: "Empresa não encontrada"
                });
        });
    });

    describe('DELETE /company/{companyId}/products/{productId}', () => {
        it('Invalid companyId format - Should return error for invalid company ID', async () => {
            const invalidId = "abc";

            await p
                .spec()
                .delete(`${baseUrl}/${invalidId}/products/1`)
                .expectStatus(StatusCodes.BAD_REQUEST)
                .expectJsonLike({
                    errors: [
                        {
                            type: "field",
                            value: invalidId,
                            msg: "ID da empresa deve ser um número inteiro",
                            path: "companyId",
                            location: "params"
                        }
                    ]
                });
        });
    });

    describe('GET /company/{companyId}/employees', () => {
        it('Invalid companyId - Should return 404 with "Empresa não encontrada" message', async () => {
            await p
                .spec()
                .get(`${baseUrl}/1/employees`)
                .expectStatus(StatusCodes.NOT_FOUND)
                .expectJson({
                    message: "Empresa não encontrada"
                });
        });
    });

    describe('GET company/{companyId}/employees/{employeeId}', () => { 
        it('Invalid companyId - Should return 404 with "Empresa não encontrada" message', async () => {
            await p
                .spec()
                .get(`${baseUrl}/1/employees/1`)
                .expectStatus(StatusCodes.NOT_FOUND)
                .expectJson({
                    message: "Empresa não encontrada"
                });
        });
    });

    describe('DELETE company/{companyId}/employees/{employeeId}', () => {
        it('Invalid companyId format - Should return error for invalid company ID', async () => {
            const invalidId = "abc";

            await p
                .spec()
                .delete(`${baseUrl}/${invalidId}/employees/1`)
                .expectStatus(StatusCodes.BAD_REQUEST)
                .expectJsonLike({
                    errors: [
                        {
                            type: "field",
                            value: invalidId,
                            msg: "ID da empresa deve ser um número inteiro",
                            path: "companyId",
                            location: "params"
                        }
                    ]
                });
        });
    });

    describe('DELETE /company/{companyId}/products/{employeeId}', () => {
        it('Invalid companyId format - Should return error for invalid company ID', async () => {
            const invalidId = "abc";

            await p
                .spec()
                .delete(`${baseUrl}/${invalidId}`)
                .expectStatus(StatusCodes.BAD_REQUEST)
                .expectJsonLike({
                    errors: [
                        {
                            type: "field",
                            value: invalidId,
                            msg: "ID deve ser um número inteiro",
                            path: "id",
                            location: "params"
                        }
                    ]
                });
        });
    });

    describe('GET company/{companyId}/employees/services', () => { 
        it('Invalid companyId - Should return 404 with "Empresa não encontrada" message', async () => {
            await p
                .spec()
                .get(`${baseUrl}/1/services`)
                .expectStatus(StatusCodes.NOT_FOUND)
                .expectJson({
                    message: "Empresa não encontrada"
                });
        });
    });

    describe('GET company/{companyId}/employees/{serviceId}', () => { 
        it('Invalid companyId - Should return 404 with "Empresa não encontrada" message', async () => {
            await p
                .spec()
                .get(`${baseUrl}/1/services`)
                .expectStatus(StatusCodes.NOT_FOUND)
                .expectJson({
                    message: "Empresa não encontrada"
                });
        });
    });
});
