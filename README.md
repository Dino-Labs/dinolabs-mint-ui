
# DinoLabs Mint UI

DinoLabs minting platform is high performance solution to minting NFT collections on Cardano blockchain. 
Thanks to this component you can add minting form to your React website just in 5 minutes.

# Getting started

First of all you have to install this package. To do this use run this command:

```
npm install dinolabs-mint-ui
```

After that what you have to do is to just use compnent on your site:

```
import React from 'react'
import { Minting } from 'dinolabs-mint-ui'

const collectionId = '' // This is ID of collection in our minting platform.

const MintingPage = () => (
	<Minting
		collectionId={collectionId}
		promoCodeMode="optional"
		maxAssetPerOrder={5}
		tokenName="BestTokenNFT"
	/>
)
```

And that's it. Your page is ready to let users mint tokens from your collection.

## Options

**`collection: string`**

Identifier of collection in DinoLabs minting platform.

**`tokenName: string`**

Name of your token displayed in UI.

**`maxAssetPerOrder: number`**

Sets maximum number of assets that you allow to be bought within one order.

**`promoCodeMode?: 'optional' | 'required'`**

Specify if you require or allow promo code. 
`required` - you can use this option if you want to allow minting only to specific group of people that recieved vouchers.
`optional` - this option is useful if you want to allow minting with discounted price for specific group of people with a promo code.

**`environment?: 'production' | 'test'`**

Environment that you want to use. By default `production`. Switch to `test` if you want to test design of your page.

**`onPayClick?: (address: string, amount: string) => Promise<void>`**

This callback is called when user click Pay button during `AwaitingPayment` phase. You can use it to making payment with wallet connetected to your page.
If this callback is not defined the Pay button will not appear.