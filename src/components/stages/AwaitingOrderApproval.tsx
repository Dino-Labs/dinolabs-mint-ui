import React from 'react'

export const AwaitingOrderApproval = ({ tokenName }: { tokenName: string }) => {
    return (
        <React.Fragment>
            <h1>Placing order...</h1>
            <p>
                Please wait a moment. We are looking for some unique {tokenName} for you.
            </p>
        </React.Fragment>
    )
}