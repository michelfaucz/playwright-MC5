// tests/api-booking.spec.js
// Testes de API para o serviço Restful Booker (exemplos de GET e POST)
// Observação: usamos a fixture `request` do Playwright Test para fazer chamadas HTTP.
import { test, expect } from '@playwright/test';

test.describe('Booking API', () => {
    // Lista as reservas existentes e valida formato básico
    test('Deve listar as reservas existentes', async ({ request }) => {
        // GET /booking - espera um array de reservas
        const response = await request.get('https://restful-booker.herokuapp.com/booking');

        // Verifica se o status é 200
        expect(response.status()).toBe(200);

        // Converte resposta para JSON
        const data = await response.json();

        // Verifica se a resposta é um array
        expect(Array.isArray(data)).toBeTruthy();

        // Verifica se pelo menos 1 item tem um bookingid (estrutura mínima esperada)
        expect(data[0]).toHaveProperty('bookingid');
    });

    // Consulta uma reserva específica (id 40) e valida campos esperados
    test('Consultando reserva 40', async ({ request }) => {
        // GET /booking/40
        const response = await request.get('https://restful-booker.herokuapp.com/booking/40');

        // Converter o body para JSON e validar campos
        const jsonBody = await response.json();
        console.log(jsonBody); // útil para debugging local

        // Valida valores esperados (teste baseado em dados estáticos do ambiente público)
        expect(jsonBody.firstname).toBe('John');
        expect(jsonBody.lastname).toBe('Smith');
        expect(jsonBody.totalprice).toBe(111);
        expect(jsonBody.depositpaid).toBe(true);

        // Verifica as datas de check-in e check-out
        expect(jsonBody.bookingdates).toBeDefined();
        expect(jsonBody.bookingdates.checkin).toBe('2018-01-01');
        expect(jsonBody.bookingdates.checkout).toBe('2019-01-01');

        // Verifica necessidade adicional
        expect(jsonBody.additionalneeds).toBe('Breakfast');

        // Checagens finais de status
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

    });

    // Cria uma reserva via POST e então consulta pelo id retornado
    test('Criar uma nova reserva e consultar', async ({ request }) => {
        // POST /booking - criar recurso
        const createRes = await request.post('https://restful-booker.herokuapp.com/booking', {
            data: {
                "firstname": "Michael",
                "lastname": "Douglas",
                "totalprice": 999,
                "depositpaid": true,
                "bookingdates": {
                    "checkin": "2018-06-06",
                    "checkout": "2019-06-06"
                },
                "additionalneeds": "tchungumdown"
            }
        });

        // Verifica status do POST antes de parsear o corpo
        expect(createRes.status()).toBe(200);
        const createBody = await createRes.json();

        // Deve retornar um bookingid
        expect(createBody).toHaveProperty('bookingid');

        // Usa o bookingid retornado pelo POST para consultar a reserva criada no próximo GET
        const bookingId = createBody.bookingid;

        // GET /booking/{id} - valida os dados criados
        const getRes = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingId}`);
        const getBody = await getRes.json();

        // Validações dos campos retornados
        expect(getRes.status()).toBe(200);
        expect(getBody.firstname).toBe('Michael');
        expect(typeof getBody.firstname).toBe('string');
        expect(getBody.lastname).toBe('Douglas');
        expect(getBody.totalprice).toBe(999);
        expect(typeof getBody.totalprice).toBe('number');
        expect(getBody.depositpaid).toBe(true);
        expect(typeof getBody.depositpaid).toBe('boolean');
        expect(getBody.bookingdates.checkin).toBe('2018-06-06');
        expect(getBody.bookingdates.checkout).toBe('2019-06-06');
        expect(getBody.additionalneeds).toBe('tchungumdown');


    });
});