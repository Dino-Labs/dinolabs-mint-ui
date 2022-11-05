import React from 'react';
import { useOrder } from '../../api/OrderContext';
import { PromoCodeMode } from '../Minting.types';
import Spinner from './Spinner.svg'

export const PlaceOrder = ({ promoCodeMode, maxAssetsPerOrder }: { promoCodeMode?: PromoCodeMode, maxAssetsPerOrder?: number }) => {
    const { placeOrder } = useOrder();
    const [touched, setTouched] = React.useState(false);
    const [disabled, setDisabled] = React.useState(false);
    const [promoCode, setPromoCode] = React.useState('');
    const [quantity, setQuantity] = React.useState(1);
    const [promoCodeRequired, setPromoCodeRequired] = React.useState(false)
    const onBuyClick = React.useCallback(() => {
        if (promoCodeMode === 'required' && promoCode.trim() === '') {
            setPromoCodeRequired(true)
            return
        }
        setDisabled(true)
        placeOrder(promoCode, quantity);
    }, [promoCodeMode, placeOrder, setDisabled, promoCode, quantity]);

    React.useEffect(() => {
        if (promoCodeMode === 'required' && touched) {
            setPromoCodeRequired(promoCode.trim() === '')
        }
    }, [promoCodeMode, promoCode])

    const onPromoCodeChange = React.useCallback((value: string) => {
        setTouched(true)
        setPromoCode(value)
    }, []);

    const onQuantityChange = React.useCallback((value: string) => {
        const inputValue = /^(\d+)$/.exec(value)?.[1]
        if (inputValue) {
            const quantityValue = parseInt(inputValue)
            if (quantityValue >= 1 && quantityValue <= 5) {
                setQuantity(quantityValue)
            }
        }
    }, [])

    return (
        <React.Fragment>
            <h1>Welcome Crypto enthusiasts!</h1>
            <p>You're almost a step away from getting one of the amazing DinoSavior NFT collectables.</p>
            {(maxAssetsPerOrder && maxAssetsPerOrder > 1) ? (
                <div style={{ textAlign: 'center' }}>
                    <p>Quantity</p>
                    <input type="number" max={maxAssetsPerOrder} min="1" value={quantity} onChange={(event) => onQuantityChange(event.target.value)} className="field-input" style={{ textAlign: 'right' }} />
                </div>
            ) : null}
            {promoCodeMode && (
                <div style={{ textAlign: 'center' }}>
                    <p style={{ marginTop: 20 }}>If you have a voucher please enter it here</p>
                    <input value={promoCode} onChange={(event) => onPromoCodeChange(event.target.value)} placeholder="voucher" className={promoCodeRequired ? 'error' : ''} />
                    {promoCodeRequired && <p className="error">Promo code is required</p>}
                </div>)
            }
            <div style={{ textAlign: 'center', marginTop: 50, marginBottom: 20 }}>
                <button className="primary" onClick={onBuyClick} disabled={disabled}>
                    {disabled ? (<><Spinner className="spinner" /><>Please wait...</></>) : 'Place order'}
                </button> 
            </div>
            <div className="warning">
                <p>
                    By placing an order you are accepting our <a href="/terms-of-service" target="_blank">terms of service</a>.
                </p>
            </div>
        </React.Fragment>
    )
}