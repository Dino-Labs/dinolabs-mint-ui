import { Environment } from "../components/Minting.types";

const apiUrl = 'https://prod-api-weu-dino.azurewebsites.net'
const testApiUrl = 'https://testsr-api-weu-dino.azurewebsites.net'

const getApiUrl = (env: Environment) => env === 'production' ? apiUrl : testApiUrl

export type PlaceOrderResponse = {
    orderId: string,
    location: string,
}

export const placeOrder = (env: Environment, collectionId: string, couponCode: string, quantity: number): Promise<PlaceOrderResponse> => {
    return fetch(`${apiUrl}/api/reservations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ collectionId, couponCode, quantity })
    }).then(response => response.json().then(orderId => {
        return {
            orderId,
            location: response.headers.get('location')!,
        }
    }));
}

type OrderState = {
    orderId: string,
    state: 'Approved' | 'Refused' | 'Expired',
}

export const getApprovalState = (orderUrl: string): Promise<OrderState | undefined> => {
    return fetch(orderUrl, {
        method: 'GET',
    }).then<OrderState | undefined>(response => {
        if (response.status === 404) {
            return undefined;
        } else {
            return response.json();
        }
    });
}

type PaymentState = {
    orderId: string,
    orderTotal: string,
    state: 'AwaitingPayment' | 'Expired' | 'Confirmed' | 'PriceAccpeted' | 'Quoted',
    address: string | undefined
}

export const acceptPrice = (env: Environment, orderId: string): Promise<any> => {
    return fetch(`${apiUrl}/api/payments/${orderId}`, {
        method: 'POST'
    }).then(response => response.json())
}

export const getPaymentState = (env: Environment, orderId: string): Promise<PaymentState | undefined> => {
    return fetch(`${apiUrl}/api/payments/${orderId}`, {
        method: 'GET',
    }).then<PaymentState | undefined>(response => {
        if (response.status === 404) {
            return undefined;
        } else {
            return response.json();
        }
    });
}