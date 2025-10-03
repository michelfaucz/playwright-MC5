// tests/api-booking.spec.js
import { test, expect } from '@playwright/test';

test.describe('Booking API', () => {
    test('Deve listar as reservas existentes', async ({ request }) => {
        const response = await request.get('https://restful-booker.herokuapp.com/booking');

        // Verifica se o status é 200
        expect(response.status()).toBe(200);

        // Converte resposta para JSON
        const data = await response.json();

        // Verifica se a resposta é um array
        expect(Array.isArray(data)).toBeTruthy();

        // Verifica se pelo menos 1 item tem um bookingid
        expect(data[0]).toHaveProperty('bookingid');
    });
    test('Consultando reserva 40', async ({ request }) => {
        const response = await request.get('https://restful-booker.herokuapp.com/booking/40');

        const jsonBody = await response.json();
        console.log(jsonBody);

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

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(201);

  });
});
