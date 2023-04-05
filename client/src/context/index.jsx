import React, { useContext, createContext } from 'react'
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react'
import { ethers } from 'ethers'

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract('0xF5DAb93dfe115024c520Ed3E4Dc7a0CC0aA2D8d7');
    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
    const address = useAddress();
    const connect = useMetamask();

    const publishCampaign = async (form) => {
        try {
            const data = await createCampaign([
                address,
                form.title,
                form.description,
                form.target,
                new Date(form.deadline).getTime(),
                form.image,
            ])

            console.log(data);
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <StateContext.Provider value={{
            address,
            contract,
            createCampaign: publishCampaign
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext); 