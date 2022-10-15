import * as React from 'react'
import { Story, Meta } from '@storybook/react'

import { Minting } from './Minting'
import { MintingProps } from './Minting.types'

export default {
	title: 'DinoLabs/Minting',
	component: Minting,
}

const Template: Story<MintingProps> = (args) => <Minting {...args} />

export const Primary = Template.bind({ collectionId: '' })