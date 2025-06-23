import React, {createContext,useContext,useEffect,useState} from 'react'
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';

export const UserContext = createContext();

const UserProvider = ({ children }) => {

  return(
    <UserContext.Provider value={{user, loading, updateUser,clearUser}}>
      {children}
    </UserContext.Provider>
  )

}

export default UserProvider;

