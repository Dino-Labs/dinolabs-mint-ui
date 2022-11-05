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