import React from 'react';
import * as Api from './Api';
import { usePolling } from './usePolling';

const OrderContext = React.createContext<OrderContextProps | undefined>(undefined);

export enum OrderStage {
    New,
    Placed,
    Approved,
    Expired,
    Rejected,
}

export enum PaymentState {
    PriceAccepted,
    AwaitingPayment,
    Confirmed,
    Expired,
    Quoted,
}

export type OrderContextProps = {
    orderId: string | undefined,
    placeOrder: (couponCode: string, quantity: number) => Promise<void>,
    acceptPrice: () => Promise<void>,
    orderStage: OrderStage,
    amount: string | undefined,
    paymentState: PaymentState,
    address: string | undefined,
    newOrder: () => void,
}
export const OrderProvider = ({ collectionId, environment, children }: any) => {
    const [orderId, setOrderId] = React.useState<string | undefined>();
    const [orderUrl, setOrderUrl] = React.useState<string | undefined>();
    const [orderStage, setOrderStage] = React.useState<OrderStage>(OrderStage.New);
    const [paymentState, setPaymentState] = React.useState<PaymentState>(PaymentState.AwaitingPayment);
    const [address, setAddress] = React.useState<string | undefined>();
    const [amount, setAmount] = React.useState<string | undefined>();
    const placeOrder = React.useCallback(async (couponCode: string, quantity: number) => {
        const { orderId: id, location: orderLocation } = await Api.placeOrder(environment, collectionId, couponCode, quantity);
        setOrderId(id);
        setOrderUrl(orderLocation);
        setOrderStage(OrderStage.Placed);
    }, [environment, setOrderId, setOrderStage]);
    const newOrder = React.useCallback(() => {
        setOrderId(undefined);
        setOrderUrl(undefined);
        setOrderStage(OrderStage.New);
        setPaymentState(PaymentState.AwaitingPayment);
        setAddress(undefined);
        setAmount(undefined);
    }, [])
    const acceptPrice = React.useCallback(async () => {
        if (!orderId) {
            throw Error('Cannot accept price of unknown order')
        }
        await Api.acceptPrice(environment, orderId)
    }, [orderId])
    const orderContext = {
        orderId,
        placeOrder,
        orderStage,
        paymentState,
        address,
        amount,
        newOrder,
        acceptPrice,
    }

    // Awaiting order approval
    usePolling(async () => {
        if (orderUrl) {
            const order = await Api.getApprovalState(orderUrl);
            if (order) {
                if (order.state === 'Approved') {
                    setOrderStage(OrderStage.Approved)
                } else if (order.state === 'Expired') {
                    setOrderStage(OrderStage.Expired)
                } else if (order.state === 'Refused') {
                    setOrderStage(OrderStage.Rejected)
                }
            }
        }
    }, 3000, Boolean(orderUrl) && orderStage === OrderStage.Placed)

    // Awaiting payment confirmation
    usePolling(async () => {
        if (orderId) {
            const payment = await Api.getPaymentState(environment, orderId);
            if (payment) {
                if (payment.address) {
                    setAddress(payment.address)
                }
                if (payment.orderTotal) {
                    setAmount(payment.orderTotal)
                }

                if (payment.state === 'PriceAccpeted') {
                    setPaymentState(PaymentState.PriceAccepted)
                }
                if (payment.state === 'Quoted') {
                    setPaymentState(PaymentState.Quoted)
                }
                if (payment.state === 'AwaitingPayment') {
                    setPaymentState(PaymentState.AwaitingPayment)
                }
                if (payment.state === 'Expired') {
                    setPaymentState(PaymentState.Expired)
                } else if (payment.state === 'Confirmed') {
                    setPaymentState(PaymentState.Confirmed)
                }
            }
        }
    }, address ? 30000 : 5000, Boolean(orderId) && orderStage === OrderStage.Approved && (paymentState === PaymentState.AwaitingPayment || paymentState === PaymentState.Quoted || paymentState === PaymentState.PriceAccepted))

    return <OrderContext.Provider value={orderContext}>{children}</OrderContext.Provider>
}

export const useOrder = () => {
    const orderContext = React.useContext<OrderContextProps | undefined>(OrderContext);
    if (!orderContext) {
        throw Error('Cannot call useOrder outside OrderContext');
    }

    return orderContext;
}