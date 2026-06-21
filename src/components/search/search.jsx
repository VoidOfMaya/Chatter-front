import { useState } from 'react';
import { SearchIcon } from '../iconhelper/iconHelper';
import style from './search.module.css';

const Search=()=>{
    const [results, setResults] = useState(null);
    const [searchFriend, setSearchFriend] = useState(true)

    const searchUsers=()=>{

    }
    const searchGroups =()=>{
        
    }
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
                <form className={style.searchBar}>
                    {searchFriend?(
                        <input placeholder='user Id'></input>
                    ):(
                        <input placeholder='group Id'></input>
                    )}
                    
                    <button>
                        <SearchIcon size={25}/>
                    </button>      
                </form>
                <div className={style.searchResults}>
                    {results?(
                        <>
                        </>
                    ):(
                        'no results found'
                    )}

                </div>
            </div>
        </>
    )
}
export{
    Search
}