export type PromoCodeMode = 'optional' | 'required'
export type Environment = 'production' | 'test'

export interface MintingProps {
    collectionId: string,
    promoCodeMode?: PromoCodeMode,
    maxAssetsPerOrder?: number,
    environment: Environment,
}