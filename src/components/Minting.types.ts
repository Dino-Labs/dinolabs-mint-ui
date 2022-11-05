export type PromoCodeMode = 'optional' | 'required'
export type Environment = 'production' | 'test'

export interface MintingProps {
    collectionId: string,
    tokenName: string,
    environment?: Environment,
    promoCodeMode?: PromoCodeMode,
    maxAssetsPerOrder?: number,
    onPayClick?: (address: string, amount: string) => Promise<void>
}