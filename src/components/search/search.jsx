import { useEffect, useState } from 'react';
import { SearchIcon } from '../iconhelper/iconHelper';
import { notify } from '../norifications/notifications';
import style from './search.module.css';
import { useOutletContext } from 'react-router-dom';
import { Card } from './searchCard/card';
const Search=()=>{
    const{ auth, reAuth, handleCurrentChannel,chnls}= useOutletContext();
    const [searchValue, setSearchValue]= useState('');
    const [results, setResults] = useState(null);
    const [searchFriend, setSearchFriend] = useState(true);
    const [loadingData,setLoadingData]= useState(false);

    const populateResults=(data, searchType)=>{
        if(!data) return
        return(
            <Card key={data.id} data={data} searchType={searchType} />
        )
    }
    const searchUsers= async()=>{   
        try{
            if(searchValue === '') return;
            const response = await fetch(`http://localhost:3000/user/${searchValue}`,{
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${auth.accessToken}`,
                },
            })
            reAuth(response);
            if(!response.ok){
                throw new Error(`${response.status}`)
            }
            const result = await response.json()
            return result
        }catch(err){
            console.log(err.message)
            notify.warn(err.message)
        }
    }
    const searchGroups= async()=>{
        try{
            if(searchValue === '') return;
            const response = await fetch(`http://localhost:3000/channel/${searchValue}/info`,{
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${auth.accessToken}`,
                },
            })
            reAuth(response);
            const result = await response.json()
            if(!response.ok){
             return result.status
            }
            console.log(result)
            return result
        }catch(err){
            console.log(err.message)
            notify.warn(err.message)
        }
    }
    useEffect(()=>{
        const fetchData =async()=>{
            setLoadingData(true)
             
            if(searchFriend){
                const result = await searchUsers(searchValue);
                setResults(result) 
                setLoadingData(false)  
            }else{
                const result = await searchGroups(searchValue);
                setResults(result) 
                setLoadingData(false)  
            }                      
        }
        fetchData()

    },[searchValue])
    // sets current channel to null on init
    useEffect(()=>{
        handleCurrentChannel(null)
    },[])
    return(
        <>
            <div className={style.mainContainer}>
                <div className={style.searchType}>
                    <button type='button' 
                        className={`${style.leftbtn} ${searchFriend? style.on: style.off}`}
                        onClick={()=>{
                            setSearchFriend(true)
                        }}
                    >search users</button>
                    <button type='button'
                        className={`${style.rightbtn} ${searchFriend? style.off: style.on}`}
                        onClick={()=>{
                            setSearchFriend(false)
                        }}
                    >search goup</button>
                </div>
                <div className={style.searchBar}>
                    {searchFriend?(
                        <input placeholder='user Id'
                            value={searchValue}
                            onChange={(e)=>{
                                setSearchValue(e.target.value)
                            }}
                        ></input>
                    ):(
                        <input placeholder='group Id'
                            value={searchValue}
                            onChange={(e)=>{
                                setSearchValue(e.target.value)
                            }}></input>
                    )}
                    
                    <div
                    >
                        {loadingData?(
                            <div>Loading...</div>
                        ):(
                            <SearchIcon size={25}/>
                        )}
                        
                    </div>     
                </div>
                <div className={style.searchResults}>
                    {results?(
                        <>
                            {populateResults(results, searchFriend)}
                        </>
                    ):(
                        <h2>no results found</h2>
                    )}

                </div>
            </div>
        </>
    )
}
export{
    Search
}