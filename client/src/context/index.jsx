import React, { useContext, createContext } from 'react'
import { useContract, useContractWrite, useMetamask,useAddress } from "@thirdweb-dev/react";
import {ethers} from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract('0xF5DAb93dfe115024c520Ed3E4Dc7a0CC0aA2D8d7');
    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
    const address = useAddress();
    const connect = useMetamask();

    const call = async (form) => {
        try {
            const data = await createCampaign({args:
            [
                address,
                form.title,
                form.description,
                form.target,
                new Date(form.deadline).getTime(),
                form.image,
            ]})

            console.log(data);
        } catch (error) {
            console.log(error);
        }

    }
    const getCampaigns = async () => {
      const campaigns = await contract.call('getCampaigns');
  
      const parsedCampaings = campaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
        image: campaign.image,
        pId: i
      }));
  
      return parsedCampaings;
    }
  
    const getUserCampaigns = async () => {
      const allCampaigns = await getCampaigns();
  
      const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);
  
      return filteredCampaigns;
    }

    const donate = async (pId, amount) => {
      const data = await contract.call('donateToCampaign', pId, { value: ethers.utils.parseEther(amount)});
  
      return data;
    }
  
    const getDonations = async (pId) => {
      const donations = await contract.call('getDonators', pId);
      const numberOfDonations = donations[0].length;
  
      const parsedDonations = [];
  
      for(let i = 0; i < numberOfDonations; i++) {
        parsedDonations.push({
          donator: donations[0][i],
          donation: ethers.utils.formatEther(donations[1][i].toString())
        })
      }
  
      return parsedDonations;
    }

    return (
        <StateContext.Provider value={{
            address,
            contract,
            connect,
            createCampaign: call,
            getCampaigns,
            getUserCampaigns,
            donate,
            getDonations
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext); 