import React from 'react';
import { PaymentState, useOrder } from '../../api/OrderContext';
import { OrderExpired } from './OrderExpired';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import CopyIcon from './copy.svg';
import Spinner from './Spinner.svg'

export const OrderApproved = ({ tokenName, onPayClick }: { tokenName: string, onPayClick?: (address: string, amount: string) => Promise<void> }) => {
    const { paymentState } = useOrder()
    switch (paymentState) {
        case PaymentState.AwaitingPayment: return <AwaitingPayment />;
        case PaymentState.Quoted: return <PaymentQuoted />;
        case PaymentState.PriceAccepted: return <AwaitingPayment onPayClick={onPayClick} />;
        case PaymentState.Confirmed: return <PaymentConfirmed tokenName={tokenName} />;
        case PaymentState.Expired: return <OrderExpired />;
    }
}

export const PaymentQuoted = () => {
    const { amount, acceptPrice } = useOrder()
    const [accepted, setAccepted] = React.useState(false)
    const accept = React.useCallback(() => {
        setAccepted(true)
        acceptPrice()
    }, [setAccepted, acceptPrice]);
    return (
        <React.Fragment>
            <h1>Order summary</h1>
            <p>
                Please confirm your order.
            </p>
            <div className="payment-info">
                <div className="field">
                    <p>Amount</p>
                    <div className="static-field">
                        <span>{amount} ADA</span>
                        <span className="copy">
                            <CopyToClipboard text={amount || ''}>
                                <button>
                                    <CopyIcon />
                                </button>
                            </CopyToClipboard>
                        </span>
                    </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: 50, marginBottom: 20 }}>
                    <button onClick={accept} disabled={accepted}>
                        {accepted ? (<><Spinner className="spinner" /><>Please wait...</></>) : 'Accept'}
                    </button>
                </div>
            </div>
        </React.Fragment>
    )
}

export const AwaitingPayment = ({ onPayClick }: { onPayClick?: (address: string, amount: string) => Promise<void> }) => {
    const { address, amount } = useOrder()
    return (
        <React.Fragment>
            <h1>Awaiting payment confirmation</h1>
            <p>
                Your order has been approved.
                {!address && <>In a moment you will see payment details.</>}
                {address && <>Please make a transfer with the information below</>}
            </p>
            {amount && address && (
                <React.Fragment>
                        <div className="qr">
                            <img src={`https://chart.googleapis.com/chart?chs=300x300&cht=qr&choe=UTF-8&chl=${address}`} alt={address} />
                        </div>
                        <div className="full-width">
                            <p>Address</p>
                            <div className="static-field">
                                <span>{address}</span>
                                <span className="copy">
                                    <CopyToClipboard text={address}>
                                        <button>
                                            <CopyIcon />
                                        </button>
                                    </CopyToClipboard>
                                </span>
                            </div>
                        </div>
                        <div className="full-width">
                            <p>Amount</p>
                            <div className="static-field">
                                <span>{amount} ADA</span>
                                <span className="copy">
                                    <CopyToClipboard text={amount || ''}>
                                        <button>
                                            <CopyIcon />
                                        </button>
                                    </CopyToClipboard>
                                </span>
                            </div>
                        </div>
                    {onPayClick && (
                        <div>
                            <button onClick={() => onPayClick(address, amount)}>Pay</button>
                        </div>
                    )}
                    <div className="warning">
                        <h4>Important</h4>
                        <p>
                            You must use a Cardano Shelley-Era wallet such as <a href="https://daedaluswallet.io/" target="_blank" rel="noreferrer">Daedalus</a>
                            , <a href="https://namiwallet.io/" target="_blank" rel="noreferrer">Nami</a>
                            , <a href="https://yoroi-wallet.com/" target="_blank" rel="noreferrer">Yoroi</a> or <a href="https://adalite.io/" target="_blank" rel="noreferrer">AdaLite</a>.
                        </p>
                    </div>
                </React.Fragment>
            )}
        </React.Fragment>
    );
}

export const PaymentConfirmed = ({ tokenName }: { tokenName: string }) => {
    const { newOrder } = useOrder()
    return (
        <React.Fragment>
            <h1>We received your payment.</h1>
            <p>
                In a few minutes you should be able to see your new {tokenName} in your wallet.
                Feel free to share it on our <a href="https://discord.gg/Mgvphj5JpW" target="_blank" aria-label="discord">Discord channel</a> and <a href="https://twitter.com/cryptodino_io" target="_blank" aria-label="twitter">Twitter</a>.
            </p>
            <div style={{ textAlign: 'center', marginTop: 50 }}>
                <button className="primary" onClick={newOrder}>Buy another</button>
            </div>
        </React.Fragment>
    )
}