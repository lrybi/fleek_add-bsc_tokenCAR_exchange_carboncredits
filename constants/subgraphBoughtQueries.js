import { gql } from '@apollo/client';

const GET_OWNER_BOUGHT_ITEMS = (buyer) => {
    return gql`
        {
            activeItems(where: { 
                or: [
                    { buyer: "${buyer}" },
                    { and: [
                        { buyer: "0x000000000000000000000000000000000000dEaD" },
                        { seller: "${buyer}" }
                    ]}
                    ]
                }) {
                id
                buyer
                seller
                nftAddress
                tokenId
                price
            }
        }
    `;
}
    
export default GET_OWNER_BOUGHT_ITEMS