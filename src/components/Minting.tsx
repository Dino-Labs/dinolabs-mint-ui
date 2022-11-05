import { MintingProps, PromoCodeMode } from "./Minting.types";
import React, { FC } from 'react'
import { OrderStage, useOrder, OrderProvider } from "../api/OrderContext";
import { AwaitingOrderApproval } from './stages/AwaitingOrderApproval'
import { OrderApproved } from './stages/OrderApproved'
import { OrderRejected } from './stages/OrderRejected'
import { PlaceOrder, PlaceOrderProps } from './stages/PlaceOrder'
import DinoLabsLogo from './Logo.svg'

const MintingOrder = ({ promoCodeMode, maxAssetsPerOrder, tokenName, onPayClick }: PlaceOrderProps & { onPayClick?: (address: string, amount: string) => Promise<void> }) => {
    const { orderStage } = useOrder()
    switch (orderStage) {
        case OrderStage.New: return <PlaceOrder promoCodeMode={promoCodeMode} maxAssetsPerOrder={maxAssetsPerOrder} tokenName={tokenName} />
        case OrderStage.Placed: return <AwaitingOrderApproval tokenName={tokenName} />
        case OrderStage.Approved: return <OrderApproved tokenName={tokenName} onPayClick={onPayClick} />
        case OrderStage.Rejected: return <OrderRejected />
        default: throw Error('Unknown state')
    }
}

export const Minting: FC<MintingProps> = ({ collectionId, environment = 'production', ...props }) => {
    return (
        <div>
            <OrderProvider collectionId={collectionId} environment={environment}>
                <MintingOrder {...props} />
            </OrderProvider>
            <div>
                Minting powered by <a href="https://www.cryptodino.io/dinolabs"><DinoLabsLogo height="30" width="60" viewBox="0 0 800 400" /></a>
            </div>
        </div>
    )
}